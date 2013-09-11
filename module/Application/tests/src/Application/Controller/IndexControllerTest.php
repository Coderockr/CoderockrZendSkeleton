<?php

namespace Application\Controller;

use Core\Test\ControllerTestCase;
use Application\Model\Auditoria;
use Zend\Http\Request;
use Zend\Stdlib\Parameters;
use Zend\View\Renderer\PhpRenderer;
use Mockery as m;

/**
 * Testes do controller IndexController
 * 
 * @category Application
 * @package Controller
 * @author  Elton Minetto<eminetto@coderockr.com>
 */

/**
 * @group Controller
 */
class IndexControllerTest extends ControllerTestCase
{

    /**
     * Namespace completa do Controller
     * @var string
     */
    protected $controllerFQDN = 'Application\Controller\IndexController';

    /**
     * Nome da rota. Geralmente o nome do módulo
     * @var string
     */
    protected $controllerRoute = 'application';
   
    /**
     * Testa ação index
     * @return void
     */
    public function testIndexAction()
    {
        // Invoca a rota index
        $this->routeMatch->setParam('action', 'index');
        
        $result = $this->controller->dispatch($this->request, $this->response);

        // Verifica o response
        $response = $this->controller->getResponse();
        
        $this->assertEquals(200, $response->getStatusCode());

        // Testa se um ViewModel foi retornado
        $this->assertInstanceOf('Zend\View\Model\ViewModel', $result);
    }
}
