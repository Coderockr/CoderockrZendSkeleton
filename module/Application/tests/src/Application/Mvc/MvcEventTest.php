<?php
namespace Api\Service;

use Core\Test\ServiceTestCase;
use Application\Mvc\MvcEvent;
use Core\Service\ParameterFactory;
use Zend\Http\Response;

/**
 * Testes relacionados ao evento MvcEvent
 * 
 * @category Application
 * @package Service
 * @author  Elton Minetto<eminetto@coderockr.com>
 */

/**
 * @group Service
 */
class MvcEventTest extends ServiceTestCase
{
    /**
     * Teste sem login
     * @return void
     */
    public function testPreDispatchWithoutLogin()
    { 
        $mvcEvent = new MvcEvent;
        $controller = $this->serviceManager->get('Application\Controller\IndexController');
        $controller->getEvent()->setResponse(new Response);
        $this->event->setTarget($controller);
        $response = $mvcEvent->preDispatch($this->event);
        $this->assertEquals(302, $response->getStatusCode());
        $headers = $response->getHeaders();
        $this->assertEquals('Location: /', (string)$headers->get('Location'));
    }

    /**
     * Teste sem login
     * @return void
     */
    public function testPreDispatchWithLogin()
    {
        $user = $this->buildUser();
        $this->em->persist($user);
        $this->em->flush();
        
        $parameters = ParameterFactory::factory(
            array(
                'login' => $user->login,
                'password' => '123'
            )
        );
        $authService = $this->getService('Application\Service\Auth');
        $authService->authenticate($parameters);

        $mvcEvent = new MvcEvent;

        $controller = $this->serviceManager->get('Application\Controller\IndexController');
        $controller->getEvent()->setResponse(new Response);
        $this->event->setTarget($controller);
        $response = $mvcEvent->preDispatch($this->event);

        $this->assertTrue($response);
    }

    private function buildUser()
    {
        $saved = $this->getFixture('Application\Test\Fixture\User')->build();        
        return $saved;
    }
}