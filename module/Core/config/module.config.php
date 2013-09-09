<?php
return array(
    'errors' => array( //configura o processador de erros
        'post_processor' => 'json-pp',
        'show_exceptions' => array(
            'message' => true,
            'trace'   => true
        )
    ),
    'view_helpers' => array(
        'invokables'=> array(
            'session' => 'Core\View\Helper\Session',
            'cache' => 'Core\View\Helper\Cache',
            'value' => 'Core\View\Helper\Value',
            'dateTimeFormat' => 'Core\View\Helper\DateTimeFormat',
            'steps' => 'Core\View\Helper\Steps',
        )
    ),

);
