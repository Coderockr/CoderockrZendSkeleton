<?php
namespace Core\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\ServiceManager\Exception\ServiceNotFoundException;

/**
 * Classe pai dos controlladores
 * 
 * @category Core
 * @package Controller
 * @author  Elton Minetto<eminetto@coderockr.com>
 */
abstract class ActionController extends AbstractActionController
{
    /**
     * Retorna uma instância de Service\Client
     *
     * @return Service\Client
     */
    protected function getClient()
    {
        return $this->getServiceLocator()->get('Core\Service\Client');
    }

    /**
     * Retorna uma instância de Service
     *
     * @param  string $service
     * @return Service
     */
    protected function getService($service)
    {
        return $this->getServiceLocator()->get($service);
    }
}
