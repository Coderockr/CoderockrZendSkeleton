<?php

// Configuração do módulo
return array(
    'controllers' => array( //adicionar os controladores do módulo
        'invokables' => array(
            'skel-index' => 'Skel\Controller\IndexController',
        ),
    ),

    'router' => array(
        'routes' => array(
            'skel' => array( //mudar o nome da rota para o nome do módulo
                'type' => 'Literal',
                'options' => array(
                    'route'    => '/skel', //mudar o path
                    'defaults' => array(
                        'controller' => 'skel-index',
                        'action'     => 'index',
                        'module'     => 'skel', //mudar o nome do módulo
                        'moduleUri'  => 'skel' //mudar para a url do módulo: /skel
                    ),
                ),
                'child_routes' => array(
                    'default' => array(
                        'type'    => 'Segment',
                        'options' => array(
                            'route'    => '[/:controller[/:action]]',
                            'constraints' => array(
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'page'       => '[0-9]+'
                            ),
                            'defaults' => array(
                                'controller' => 'skel-index',
                                'action'     => 'index',
                                'page'       => 1
                            ),
                        ),
                        'child_routes' => array( //permite mandar dados pela url
                            'wildcard' => array(
                                'type' => 'Wildcard'
                            ),
                        ),
                    ),
                ),
            ),
        ),
    ),

    //se precisar um layout específico para o modulo descomentar as linhas abaixo e criar o diretório/arquivo
    'view_manager' => array(
        // 'template_map' => array(
        //     'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
        // ),
        'template_path_stack' => array(
            'skel' => __DIR__ . '/../view',
        ),
    ),
    //caso o módulo possua configuração diferente da configurada no config/application.config.php
    // 'db' => array(
    //     'driver' => 'Pdo',
    //     'dsn'    => 'pgsql:host=localhost;port=5432;dbname=api;user=postgres;password=coderockr',
    // ),
);
