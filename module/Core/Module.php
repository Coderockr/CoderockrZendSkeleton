<?php

namespace Core;

use Zend\Mvc\MvcEvent;
use Zend\Session\Container;
use Zend\Cache\StorageFactory;

class Module
{
    /**
     * Executada no bootstrap do módulo
     * 
     * @param MvcEvent $event
     */
    public function onBootstrap($event)
    {
        /** @var \Zend\ModuleManager\ModuleManager $moduleManager */
        $moduleManager = $event->getApplication()->getServiceManager()->get('modulemanager');
        /** @var \Zend\EventManager\SharedEventManager $sharedEvents */
        $sharedEvents = $moduleManager->getEventManager()->getSharedManager();

        //evento de erros da aplicação
        $sharedEvents->attach(
            'Zend\Mvc\Application',
            MvcEvent::EVENT_DISPATCH_ERROR,
            array($this, 'errorProcess'),
            999
        );
    }

    /**
     * Retorna a configuração dos caminhos e namespaces a carregar
     * @return array Loaders
     */
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php',
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    /**
     * Retorna o conteúdo do arquivo de configuração do módulo
     * @return array Configurações do  módulo
     */
    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    /**
     * Configurações para o ServiceManager
     * @return array Configurações
     */
    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                'Core\Service\Client' => function ($serviceManager) { //cria um novo Client de acordo com a configuração
                    $config = $serviceManager->get('Configuration');
                    $apiConfig = $config['api'];
                    return new Service\Client($apiConfig['apiKey'], $apiConfig['apiUri'], $apiConfig['rpcUri']);
                },
                'Log' => function ($serviceManager) {
                    $writer = new \Zend\Log\Writer\Stream('/tmp/project.log');
                    $logger = new \Zend\Log\Logger();
                    $logger->addWriter($writer);
                    return $logger;
                }
            ),
        );
    }

    /**
     * Faz o processamento dos erros da aplicação
     * @param MvcEvent $event
     * @return null|\Zend\Http\PhpEnvironment\Response
     */
    public function errorProcess(MvcEvent $event)
    {
        $routeMatch = $event->getRouteMatch();

        $formatter = $routeMatch->getParam('formatter', false);
        if ($formatter == false) {
            return;
        }
        /** @var \Zend\Di\Di $dInjector */
        $dInjector = $event->getApplication()->getServiceManager()->get('di');

        $eventParams = $event->getParams();

        /** @var array $configuration */
        $configuration = $event->getApplication()->getConfig();

        $vars = array();
        if (isset($eventParams['exception'])) {
            /** @var \Exception $exception */
            $exception = $eventParams['exception'];

            if ($configuration['errors']['show_exceptions']['message']) {
                $vars['error-code'] = $exception->getCode();
                $vars['error-message'] = $exception->getMessage();
            }
            
            if ($configuration['errors']['show_exceptions']['trace']) {
                $vars['error-trace'] = $exception->getTrace();
            }
        }

        if (empty($vars)) {
            $vars['error'] = 'Something went wrong';
        }

        /** @var PostProcessor\AbstractPostProcessor $postProcessor */
        $postProcessor = $dInjector->get(
            $configuration['errors']['post_processor'],
            array('vars' => $vars, 'response' => $event->getResponse())
        );
                
        $postProcessor->process();

        if ($eventParams['error'] === \Zend\Mvc\Application::ERROR_CONTROLLER_NOT_FOUND ||
            $eventParams['error'] === \Zend\Mvc\Application::ERROR_ROUTER_NO_MATCH
        ) {
            $event->getResponse()->setStatusCode(\Zend\Http\PhpEnvironment\Response::STATUS_CODE_501);
        } else {
            $event->getResponse()->setStatusCode(\Zend\Http\PhpEnvironment\Response::STATUS_CODE_500);
        }

        $event->stopPropagation();

        return $postProcessor->getResponse();
    }
}
