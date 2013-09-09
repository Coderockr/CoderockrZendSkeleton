<?php

namespace Core\Test\Fixture;

use Core\Test\Fixture;

/**
 * Fixture para criar strings aleatórias
 *
 * @category   Core
 * @package    Text\Fixture
 * @author     Elton Minetto <eminetto@coderockr.com>
 */
class String extends Fixture
{

    /**
     * Constrói o fixture de acordo com os parâmetros
     * @param  array $data Parâmetros do fixture
     * @return string
     */
    public function build($data = null)
    {
        $length = $data['strlen'];        
        
        $str = "ABCDEFGHIJLMNOPQRSTUVXZYWKabcdefghijlmnopqrstuvxzywk0123456789";
        $cod = "";
        for($a = 0;$a < $length;$a++){
                $rand = rand(0,62);
                $cod .= substr($str,$rand-1,1);
        }
        return $cod; 
    }
}