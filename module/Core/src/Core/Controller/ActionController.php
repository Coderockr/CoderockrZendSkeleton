<?php
namespace Core\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\ServiceManager\Exception\ServiceNotFoundException;
use Core\Db\TableGateway;

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
     * @var string
     */
    protected $eventIdentifier = __CLASS__;


    /**
     * Retorna uma instância de TableGateway
     *
     * @param  string $table
     * @return TableGateway
     */
    protected function getTable($table)
    {
        $serviceManager = $this->getServiceLocator();
        $dbAdapter = $serviceManager->get('DbAdapter');
        $tableGateway = new TableGateway($dbAdapter, $table, new $table);
        $tableGateway->initialize();
        
        return $tableGateway;
    }

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
