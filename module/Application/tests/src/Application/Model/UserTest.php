<?php
namespace Application\Model;

use Core\Test\ModelTestCase;
use Core\Model\EntityException;
use Zend\InputFilter\InputFilterInterface;
use Zend\InputFilter\InputFilter;
use Application\Model\User;
/**
 * @group Model
 */
class UserTest extends ModelTestCase
{

    public function testGetInputFilter()
    {
        $user = new User();
        $if = $user->getInputFilter();
 
        $this->assertInstanceOf("Zend\InputFilter\InputFilter", $if);
        return $if;
    }

    /**
     * @depends testGetInputFilter
     */
    public function testInputFilterValid($if)
    {   
        $user = new User();
        $if = $user->getInputFilter();

        //verifica se os filtros estão configurados corretamente
        $this->assertEquals(6, $if->count());
 
        $this->assertTrue($if->has('id'));
        $this->assertTrue($if->has('name'));
        $this->assertTrue($if->has('login'));
        $this->assertTrue($if->has('password'));
        $this->assertTrue($if->has('status'));
        $this->assertTrue($if->has('created'));
    }

    /**
     * @expectedException Core\Model\EntityException
     * @expectedExceptionMessage Not used
     */
    public function testSetInputFilter()
    {   
        $user = new User();
        $if = new InputFilter();
        $user->setInputFilter($if);
    }

    /**
     * Teste de inserção de um user válido
     */
    public function testInsert()
    {   
        $user = $this->getFixture('Application\Test\Fixture\User')->build();

        $em = $this->getService('EntityManager');               
        $saved = $em->getRepository('Application\Model\User')->find($user->id);

        $this->assertEquals($user->id, $saved->id);
    }

    /**
     * @expectedException Core\Model\EntityException
     */
    public function testInputFilterInvalido()
    {
        $user = new User();
        //recurso só pode ter 100 caracteres
        $user->name = 'Lorem Ipsum é simpaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaalesmente uma simulação de texto da indústria tipográfica e de impressos Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos';
    }        

    /**
     * @expectedException Doctrine\DBAL\DBALException
     */
    public function testInsertInvalido()
    {
        $user = new User();
        $user->name = 'teste';

        $this->em->persist($user);
        $this->em->flush();
    }  
}