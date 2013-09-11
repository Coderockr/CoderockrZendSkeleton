<?php
namespace Application\Service;

use Core\Test\ServiceTestCase;
use Application\Model\Client;
use Application\Service\Auth;
use Core\Service\ParameterFactory;

/**
 * Testes relacionados ao serviço Auth
 * 
 * @category Application
 * @package Service
 * @author  Mateus Guerra <mateus@coderockr.com>
 */

/**
 * @group Service
 */
class AuthTest extends ServiceTestCase
{
    
    /**
     * Faz o setup dos testes
     * @return void
     */
    public function setup()
    {
        parent::setup();
        $this->authService = $this->getService('Application\Service\Auth');
        //deve usar o entityManager dos testes
        $this->authService->setEntityManager($this->em);
    }
    
    /**
     * @expectedException Exception
     * @expectedMessage Login ou senha inválidos
     * @return void
     */
    public function testAuthMissingParameters()
    {
        //faz o teste com uma senha inválida

        $user = $this->buildUser();

        $this->em->persist($user);
        $this->em->flush();
        $parameters = ParameterFactory::factory(array());
        $result = $this->authService->authenticate($parameters);
        return $result;
    }

    /**
     * @expectedException Exception
     * @expectedMessage Login ou senha inválidos
     * @return void
     */
    public function testAuthInvalidParameters()
    {
        //faz o teste com uma senha inválida
        $user = $this->buildUser();

        $this->em->persist($user);
        $this->em->flush();
        
        $parameters = ParameterFactory::factory(
            array(
                'login' => $user->login,
                'password' => 'senha invalida'
            )
        );

        $result = $this->authService->authenticate($parameters);
        return $result;
    }

    /**
     * Testa a Autenticacao  
     * @return void
     */
    public function testAuthValid()
    {
        //faz o teste com uma senha inválida
        $user = $this->buildUser();
        $this->em->persist($user);
        $this->em->flush();
        
        $parameters = ParameterFactory::factory(
            array(
                'login' => $user->login,
                'password' => '123'
            )
        );

        // Verifica o response
        $this->assertEquals(true, $this->authService->authenticate($parameters));
    }

    
    private function buildUser()
    {
        $saved = $this->getFixture('Application\Test\Fixture\User')->build();
        return $saved;
    }
}
