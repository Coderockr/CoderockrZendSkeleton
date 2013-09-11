<?php

$mainUrl = 'http://beta.coderockr.com';
$apiUrl = 'http://beta.coderockr.com';

return array(
    'api' => array(
        'mainUrl' => $mainUrl, //usado pelos JS
        //inserir na tabela token da base da api, caso não exista
        'apiKey' => '1fcbbb76f6c9269e34acfe7804a05b25a7b2b6bc',
        'apiUri' => $apiUrl . '/api/v1/',
        'rpcUri' => $apiUrl . '/rpc/v1/',
    ),
    'doctrine' => array(
        'connection' => array(
            'driver'   => 'pdo_mysql',
            'host'     => 'localhost',
            'port'     => '3306',
            'user'     => 'root',
            'password' => '',
            'dbname'   => 'database'
        ),
        'driver' => array(
            'cache' => 'Doctrine\Common\Cache\ArrayCache',
            'paths' => array(
                __DIR__ . '/../vendor/coderockr/api/src/Api/Model',
                __DIR__ . '/../module/Application/src/Application/Model'
            ),
        )
    ),
    'mailOptions' => new \Zend\Mail\Transport\SmtpOptions(
        array(
            'name'              => 'gmail',
            'host'              => 'smtp.gmail.com',
            'port'              =>  465,
            'connection_class'  => 'plain',
            'connection_config' => array(
                'username' => '',
                'password' => '',
                'ssl'      => 'ssl',
            ),
        )
    ),
    'cache' => array(
        'adapter' => 'memory',
    )
);
