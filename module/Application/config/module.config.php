<?php
namespace Application;

/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2012 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
//@todo verificar se não dá para remover algo desse arquivo. Ver o template_maps

return array(
    'router' => array(
        'routes' => array(
            'index' => array(
                'type' => 'Segment',
                'options' => array(
                    'route'    => '/[page/:page]',
                    'defaults' => array(
                        'controller' => 'Application\Controller\Index',
                        'action'     => 'index',
                        'module'     => 'application',
                    ),
                ),
            ),
            'application' => array(
                'type' => 'Literal',
                'options' => array(
                    'route'    => '/',
                    'defaults' => array(
                        'controller' => 'index',
                        'action'     => 'index',
                        'module'     => 'application',
                        '__NAMESPACE__' => 'Application\Controller',
                        'moduleUri'  => 'application',
                    ),
                ),
                'may_terminate' => true,
                'child_routes' => array(
                    'default' => array(
                        'type'    => 'Segment',
                        'options' => array(
                            'route'    => '[:controller[/:action]]',
                            'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'page'       => '[0-9]+'
                            ),
                            'defaults' => array(
                                'controller' => 'index',
                                'action'     => 'index',
                                'page'       => 1
                            ),
                        ),
                        'child_routes' => array(
                            'wildcard' => array(
                                'type' => 'Wildcard'
                            ),
                        ),
                    ),
                ),
                
            ),
            
        ),
    ),
    'service_manager' => array(
        'factories' => array(
            'Session' => function ($sm) {
                return new \Zend\Session\Container('Project');
            },
            'Email' => function ($sm) {
                $config = $sm->get('Configuration');
                $options = $config['mailOptions'];
                return new \Core\Service\Email($options);
            },
            'Cache' => function ($sm) {
                $config = $sm->get('Configuration');
                $cache = \Zend\Cache\StorageFactory::factory(
                    array(
                        'adapter' => $config['cache']['adapter'],
                        'plugins' => array(
                            'exception_handler' => array('throw_exceptions' => false),
                            'Serializer'
                        ),
                    )
                );

                return $cache;
            },
            'EntityManager' => function ($sm) {
                $env = getenv('ENV');
                $config = $sm->get('Configuration');

                if ($env == 'testing') {
                    $config = include getenv('PROJECT_ROOT') . '/config/test.config.php';
                }
                $doctrineConfig = new \Doctrine\ORM\Configuration();
                $cache = new $config['doctrine']['driver']['cache'];
                $doctrineConfig->setQueryCacheImpl($cache);
                $doctrineConfig->setProxyDir('/tmp');
                $doctrineConfig->setProxyNamespace('EntityProxy');
                $doctrineConfig->setAutoGenerateProxyClasses(true);

                \Doctrine\Common\Annotations\AnnotationReader::addGlobalIgnoredName('events');

                \Doctrine\Common\Annotations\AnnotationRegistry::registerFile(
                    getenv('PROJECT_ROOT').
                    '/vendor/doctrine/orm/lib/Doctrine/ORM/Mapping/Driver/DoctrineAnnotations.php'
                );
                \Doctrine\Common\Annotations\AnnotationRegistry::registerFile(
                    getenv('PROJECT_ROOT'). '/vendor/jms/serializer/src/JMS/Serializer/Annotation/Groups.php'
                );
                \Doctrine\Common\Annotations\AnnotationRegistry::registerFile(
                    getenv('PROJECT_ROOT'). '/vendor/jms/serializer/src/JMS/Serializer/Annotation/Type.php'
                );
                \Doctrine\Common\Annotations\AnnotationRegistry::registerFile(
                    getenv('PROJECT_ROOT'). '/vendor/jms/serializer/src/JMS/Serializer/Annotation/Accessor.php'
                );

                $driver = new \Doctrine\ORM\Mapping\Driver\AnnotationDriver(
                    new \Doctrine\Common\Annotations\AnnotationReader(),
                    $config['doctrine']['driver']['paths']
                );
                //ignore ZF2 annotations
                \Doctrine\Common\Annotations\AnnotationReader::addGlobalIgnoredName('triggers');
                \Doctrine\Common\Annotations\AnnotationReader::addGlobalIgnoredName('convenience');
                \Doctrine\Common\Annotations\AnnotationReader::addGlobalIgnoredName('events');

                $doctrineConfig->setMetadataDriverImpl($driver);
                $doctrineConfig->setMetadataCacheImpl($cache);

                $em = \Doctrine\ORM\EntityManager::create(
                    $config['doctrine']['connection'],
                    $doctrineConfig
                );
                
                return $em;
            },
        ),
    ),
    // 'translator' => array(
    //     'locale' => 'pt_BR',
    //     'translation_file_patterns' => array(
    //         array(
    //             'type'     => 'phparray',
    //             'base_dir' => __DIR__ . '/../language',
    //             'pattern'  => '%s.php',
    //         ),
    //     ),
    // ),

    'controllers' => array(
        'invokables' => array(
            'index' => 'Application\Controller\IndexController',
        ),
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'layout/not-logged'           => __DIR__ . '/../view/layout/not-logged.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
            'paginator/control'       => __DIR__ . '/../view/partials/paginator/control.phtml'
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),

    ),
    'view_helpers' => array(
        'invokables'=> array(
        )
    )
);
