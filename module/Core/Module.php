<?php

namespace Core;

use Zend\Mvc\MvcEvent;
use Zend\Session\Container;
use Zend\Cache\StorageFactory;

class Module
{
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
                'Core\Service\Client' => function ($serviceManager) {
                //cria um novo Client de acordo com a configuração
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
}
