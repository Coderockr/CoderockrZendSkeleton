<?php
namespace Core\Acl;
 
use Zend\ServiceManager\ServiceManager;
use Zend\ServiceManager\ServiceManagerAwareInterface;
use Zend\ServiceManager\Exception\ServiceNotFoundException;
 
use Zend\Permissions\Acl\Acl;
use Zend\Permissions\Acl\Role\GenericRole as Role;
use Zend\Permissions\Acl\Resource\GenericResource as Resource;
 
class Builder implements ServiceManagerAwareInterface
{

    /**
     * Controladores padrão que todos tem acesso
     * @var array
     */
    protected $defaultResources = array('home', 'acesso', 'widget', 'busca');

    /**
     * Role padrão
     * @var string
     */
    protected $defaultRole = 'unochapeco';

    /**
     * Acl
     * @var Acl
     */
    protected $acl;

    /**
     * @var ServiceManager
     */
    protected $serviceManager;
 
    /**
     * @param ServiceManager $serviceManager
     */
    public function setServiceManager(ServiceManager $serviceManager)
    {
        $this->serviceManager = $serviceManager;
        return $this;
    }
 
    /**
     * Retrieve serviceManager instance
     *
     * @return ServiceLocatorInterface
     */
    public function getServiceManager()
    {
        return $this->serviceManager;
    }
 
    /**
     * Constroi a ACL
     * @return Acl 
     */
    public function build()
    {
        $session = $this->getServiceManager()->get('Session');
        $recursosPessoa = $session->offsetGet('recursosPessoa');
        $this->acl = new Acl();
        $this->acl->addRole(new Role($this->defaultRole), null);

        foreach ($recursosPessoa as $r) {
            if (isset($r['controller'])) {
                $this->addResource($r['controller']);
            }
        }
        foreach($this->defaultResources as $r) {
            $this->addResource($r);
        }

        return $this->acl;
    }

    /**
     * Adiciona um recurso a ACL
     * @param string $resourceName Nome do recurso
     */
    private function addResource($resourceName)
    {
        if (! $this->acl->hasResource($resourceName)) {
            $this->acl->addResource(new Resource($resourceName));
        }
        $this->acl->allow($this->defaultRole, $resourceName);
    }
}