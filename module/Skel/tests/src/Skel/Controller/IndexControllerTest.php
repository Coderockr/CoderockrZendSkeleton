<?php
namespace Skel\Controller;

use Core\Test\ControllerTestCase;
use Skel\Controller\IndexController;
use Skel\Model\Post;
use Zend\Http\Request;
use Zend\Stdlib\Parameters;
use Zend\View\Renderer\PhpRenderer;

/**
 * Testes do controller Index
 * 
 * @category Skel
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
    protected $controllerFQDN = 'Skel\Controller\IndexController';

    /**
     * Nome da rota. Geralmente o nome do módulo
     * @var string
     */
    protected $controllerRoute = 'skel';

    /**
     * Testa ação não existente
     * @return void
     */
    public function test404()
    {
        $this->routeMatch->setParam('action', 'action_nao_existente');
        $result = $this->controller->dispatch($this->request);
        $response = $this->controller->getResponse();
        $this->assertEquals(404, $response->getStatusCode());
        unset($result);
    }

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
