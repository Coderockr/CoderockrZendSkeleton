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
        $inputFilter = $user->getInputFilter();
 
        $this->assertInstanceOf("Zend\InputFilter\InputFilter", $inputFilter);
        return $inputFilter;
    }

    /**
     * @depends testGetInputFilter
     */
    public function testInputFilterValid($inputFilter)
    {
        $user = new User();
        $inputFilter = $user->getInputFilter();

        //verifica se os filtros estão configurados corretamente
        $this->assertEquals(6, $inputFilter->count());
 
        $this->assertTrue($inputFilter->has('id'));
        $this->assertTrue($inputFilter->has('name'));
        $this->assertTrue($inputFilter->has('login'));
        $this->assertTrue($inputFilter->has('password'));
        $this->assertTrue($inputFilter->has('status'));
        $this->assertTrue($inputFilter->has('created'));
    }

    /**
     * @expectedException Core\Model\EntityException
     * @expectedExceptionMessage Not used
     */
    public function testSetInputFilter()
    {
        $user = new User();
        $inputFilter = new InputFilter();
        $user->setInputFilter($inputFilter);
    }

    /**
     * Teste de inserção de um user válido
     */
    public function testInsert()
    {
        $user = $this->getFixture('Application\Test\Fixture\User')->build();

        $entityManager = $this->getService('EntityManager');
        $saved = $entityManager->getRepository('Application\Model\User')->find($user->id);

        $this->assertEquals($user->id, $saved->id);
    }

    /**
     * @expectedException Core\Model\EntityException
     */
    public function testInputFilterInvalido()
    {
        $user = new User();
        //recurso só pode ter 100 caracteres
        $user->name = 'Lorem Ipsum é simpaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaalesmente uma simulação de texto da indústria tipo
            gráfica e de impressos Lorem Ipsum é simplesmente uma simulação de texto da ind
            ústria tipográfica e de impressos Lorem Ipsum é simplesmente uma simulação de tex
            to da indústria tipográfica e de impressos';
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
