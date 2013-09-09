<?php

return array(
    'user' => array(
        'COLUMNS' => array(
            'id' => array(
                'data_type' => 'NUMBER',
                'numeric_precision' => 15,
                'numeric_scale' => 0,
                'is_nullable' => false,
            ),
            'name' => array(
                'data_type' => 'VARCHAR',
                'character_maximum_length' => 100,
                'is_nullable' => false,
            ),
            'created' => array(
                'data_type' => 'DATE',
                'is_nullable' => false,
            ),
            'updated' => array(
                'data_type' => 'DATE',
                'is_nullable' => true,
            ),
        ),
        'PRIMARY_KEY' => array('COLUMNS' => 'id', 'AUTO_INCREMENT' => true),
    ),
    'appUser' => array(
        'COLUMNS' => array(
            'id' => array(
                'data_type' => 'NUMBER',
                'numeric_precision' => 15,
                'numeric_scale' => 0,
                'is_nullable' => false,
            ),
            'status' => array(
                'data_type' => 'NUMBER',
                'numeric_precision' => 1,
                'numeric_scale' => 1,
                'is_nullable' => false,
            ),
            'email' => array(
                'data_type' => 'VARCHAR',
                'character_maximum_length' => 255,
                'is_nullable' => false,
            ),
            'job' => array(
                'data_type' => 'VARCHAR',
                'character_maximum_length' => 255,
                'is_nullable' => false,
            ),
            'unit' => array(
                'data_type' => 'VARCHAR',
                'character_maximum_length' => 255,
                'is_nullable' => false,
            ),
            'created' => array(
                'data_type' => 'DATE',
                'is_nullable' => false,
            ),
            'updated' => array(
                'data_type' => 'DATE',
                'is_nullable' => true,
            ),
        ),
        'PRIMARY_KEY' => array('COLUMNS' => 'id'),
    )
);