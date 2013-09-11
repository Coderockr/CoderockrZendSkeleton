<?php
namespace Core\Service;

use Zend\ServiceManager\ServiceManager;
use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\Exception\ServiceNotFoundException;
use Core\Db\TableGateway;

/**
 * Classe pai dos serviços
 * @category   Core
 * @package    Service
 * @author     Elton Minetto<eminetto@coderockr.com>
 */
abstract class Service implements ServiceManagerAwareInterface
{
    /**
     * @var ServiceManager
     */
    protected $serviceManager;

     /**
    * @var Doctrine\ORM\EntityManager
    */
    protected $entityManager;
    protected $entityName;
     
    public function setEntityManager($entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function getEntityManager()
    {
        if (null === $this->entityManager) {
             $this->entityManager = $this->getServiceManager()->get('EntityManager');
        }
        return $this->entityManager;
    }

    /**
     * Cache 
     * @var Cache
     */
    protected $cache;

    /**
     * @param ServiceManager $serviceManager
     */
    public function setServiceManager(ServiceManager $serviceManager)
    {
        $this->serviceManager = $serviceManager;
    }

    /**
     * Retorna uma instância de serviceManager
     *
     * @return ServiceLocatorInterface
     */
    public function getServiceManager()
    {
        return $this->serviceManager;
    }

    /**
     * Retorna uma instância de Service\Client
     * Usado para acessar a api/rpc e acessar outros módulos
     *
     * @return Service\Client
     */
    protected function getClient()
    {
        return $this->getServiceManager()->get('Core\Service\Client');
    }

    /**
     * Recupera a instância do cache
     * @return Zend\Cache\Storage\Adapter Cache
     */
    protected function getCache()
    {
        if (!$this->cache) {
            $this->cache = $this->getServiceManager()->get('Cache');
        }
        return $this->cache;

    }

    /**
     * Retorna uma instância de Service
     * Usado para acessar outro serviço dentro do mesmo módulo
     * 
     * @return Service
     */
    protected function getService($service)
    {
        return $this->getServiceManager()->get($service);
    }
}
