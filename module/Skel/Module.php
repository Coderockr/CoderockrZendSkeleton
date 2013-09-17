<?php

namespace Skel;

/**
 * Classe do módulo
 * 
 * @category Skel
 * @package Skel
 * @author  Elton Minetto <eminetto@coderockr.com>
 */
class Module
{
    /**
     * Retorna a configuração dos loaders
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
     * @return array Configurações
     */
    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }
}
