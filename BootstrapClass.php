<?php
namespace CoderockrZendSkeleton;

use Zend\ServiceManager\ServiceManager;
use Zend\Mvc\Service\ServiceManagerConfig;
use Zend\Db\Adapter\Adapter;
use Zend\Loader\AutoloaderFactory;
use Zend\Loader\StandardAutoloader;

/**
 * 
 */
class BootstrapClass
{
    public static function execute()
    {
        include 'init_autoloader.php';

        define('ZF2_PATH', realpath('vendor/zendframework/zendframework/library'));

        $path = array(
            ZF2_PATH,
            get_include_path(),
        );
        set_include_path(implode(PATH_SEPARATOR, $path));

        require_once  'Zend/Loader/AutoloaderFactory.php';
        require_once  'Zend/Loader/StandardAutoloader.php';

        // setup autoloader
        AutoloaderFactory::factory(
            array(
                'Zend\Loader\StandardAutoloader' => array(
                    StandardAutoloader::AUTOREGISTER_ZF => true,
                    StandardAutoloader::ACT_AS_FALLBACK => false,
                    StandardAutoloader::LOAD_NS => array(
                        'Core' => getcwd() . '/module/Core/src/Core'
                    )
                )
            )
        );
    }
}
