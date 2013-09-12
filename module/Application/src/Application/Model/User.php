<?php

namespace Application\Model;

use Core\Model\TimeStampedEntity;
use Core\Model\EntityException;
use Doctrine\ORM\Mapping as ORM;

/**
 * Entidade frequency
 * 
 * @category Application
 * @package Model
 * @author  Elton Minetto<eminetto@coderockr.com>
 * 
 * @ORM\Entity
 * @ORM\Table(name="ApplicationUser")
 */
class User extends TimeStampedEntity
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer");
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $idUser;

    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\Column(type="string")
     */
    protected $login;

    /**
     * @ORM\Column(type="string")
     */
    protected $password;

    /**
     * @ORM\Column(type="string")
     */
    protected $status;


    /**
     * Filters and validators
     * @var array
     */
    protected $filters = array(
        array(
            'name' => 'idUser',
            'required' => true,
            'filters' => array(
                array('name' => 'Int'),
            ),
        ),
        array(
            'name' => 'name',
            'required' => true,
            'filters' => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
            ),
            'validators' => array(
                array(
                    'name' => 'StringLength',
                    'options' => array(
                        'encoding' => 'UTF-8',
                        'min' => 1,
                        'max' => 100,
                    ),
                ),
            ),
        ),
        array(
            'name' => 'login',
            'required' => true,
            'filters' => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
            ),
            'validators' => array(
                array(
                    'name' => 'StringLength',
                    'options' => array(
                        'encoding' => 'UTF-8',
                        'min' => 1,
                        'max' => 45,
                    ),
                ),
            ),
        ),
        array(
            'name' => 'password',
            'required' => true,
            'filters' => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
            ),
            'validators' => array(
                array(
                    'name' => 'StringLength',
                    'options' => array(
                        'encoding' => 'UTF-8',
                        'min' => 1,
                        'max' => 255,
                    ),
                ),
            ),
        ),
        array(
            'name' => 'status',
            'required' => true,
            'filters' => array(
                array('name' => 'StripTags'),
                array('name' => 'StringTrim'),
            ),
        ),
        array(
            'name' => 'created',
            'required' => false,
            'filters' => array(
                array('name' => 'Core\Filter\Date'),
            ),
            'validators' => array(
                array(
                    'name' => 'date',
                    'options' => array(
                        'format' => 'd/m/Y h:i:s'
                    ),
                ),
            ),
        )
    );
}
