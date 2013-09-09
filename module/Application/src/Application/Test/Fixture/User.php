<?php

namespace Application\Test\Fixture;

use Core\Test\Fixture;

/**
 * Fixture para criar a tabela de testes
 *
 * @category   Application
 * @package    Test\Fixture
 * @author     Elton Minetto <eminetto@coderockr.com>
 */
class User extends Fixture
{

    /**
     * Entidade 
     * @var string
     */
    protected $entity = 'Application\Model\User';

    /**
     * Dados da entidade
     * @var array
     */
    protected $data = array(
        'name' => 'Ozzy Osbourne',
        'login' => 'ozzy',
        'password' => '202cb962ac59075b964b07152d234b70',
        'status' => 1
    );
     public function build($data = null)
    {
        return parent::build($data);
    }
}