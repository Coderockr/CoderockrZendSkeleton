<?php

namespace Application\Mvc;

use Core\Service\ParameterFactory;

/**
 * Classe para controlar os eventos do Mvc
 * @category   Application
 * @package    Mvc
 * @author     Elton Minetto<eminetto@coderockr.com>
 */
class MvcEvent
{
    /**
     * Faz a autorização do acesso aos controllers, log e outros testes
     * @param  MvcEvent $event Evento
     * @return boolean|Response
     */
    public function preDispatch($event)
    {
        $dependencyInjector = $event->getTarget()->getServiceLocator();
        $session = $dependencyInjector->get('Session');
        if (! $session->offsetGet('user')) {
            return $event->getTarget()->redirect()->toUrl('/');
        }
        return true;

        //comentado para implementações futuras
        // $routeMatch = $event->getRouteMatch();
        // $moduleName = $routeMatch->getParam('moduleUri');
        // $controllerName = $routeMatch->getParam('controller');
        // $actionName = $routeMatch->getParam('action');
        
        // //autorização
        // $authService = $dependencyInjector->get('Application\Service\Auth');
        
        // $parameters = ParameterFactory::factory(
        //     array('moduleName' => $moduleName, 'controllerName' => $controllerName, 'actionName' => $actionName)
        // );
        
        
        // if (! $authService->authorize($parameters)) {
        //     $redirect = $event->getTarget()->redirect();
        //     $redirect->toUrl('/');
        // }
        
        // return true;
    }
}
