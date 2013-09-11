<?php

return array(
    'testing' => array(
        'config' => array(
            'cache_sql' => false,
        ),
        'data' => array(
            'file' => 'test.data.php'
        )
    ),
    'doctrine' => array(
        'connection' => array(
            'driver'   => 'pdo_sqlite',
            'path'     => '/tmp/database.db',
            'memory'   => true
        ),
        'driver' => array(
            'cache' => 'Doctrine\Common\Cache\ArrayCache',
            'paths' => array(
                    __DIR__ . '/../vendor/coderockr/api/src/Api/Model',
                    __DIR__ . '/../module/Application/src/Application/Model'
                )
        ),
    ),

);
