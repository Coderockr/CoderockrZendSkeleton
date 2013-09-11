<?php
namespace Application;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Authentication\Adapter\DbTable as AuthAdapter;

/**
 * Configuração do módulo Application
 * 
 * @category Application
 * @author  Elton Minetto<eminetto@coderockr.com>
 */
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
            'Core\Controller\ActionController',
            MvcEvent::EVENT_DISPATCH,
            array('Application\Mvc\MvcEvent','preDispatch'),
            100
        );
    }


    /**
     * Carrega o arquivo de configuração
     * 
     * @return array
     */
    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    /**
     * Configuração do loader
     *  
     * @return array
     */
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    /**
     * Retorna a configuração do service manager do módulo
     * @return array
     */
    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                'Application\Service\Auth' => function () {
                    return new Service\Auth;
                },
            ),
        );
    }
}
