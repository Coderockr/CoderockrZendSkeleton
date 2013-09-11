<?php

namespace Application\Service;

use Core\Service\ParameterFactory;
use Core\Service\ParameterSet;
use Core\Service\Service;
use Zend\Authentication\Adapter\DbTable as AuthAdapter;
use Exception;
use Zend\Authentication\AuthenticationService;
use Zend\Db\Sql\Select;
use Zend\Permissions\Acl\Acl;
use Zend\Permissions\Acl\Role\GenericRole as Role;
use Zend\Permissions\Acl\Resource\GenericResource as Resource;

/**
 * Serviço responsável pela autenticação da aplicação
 * 
 * @category Application
 * @package Service
 * @author  Mateus Guerra <mateus@coderockr.com>
 */
class Auth extends Service
{

    /**
     * Faz a autenticação dos usuários
     * 
     * @param ParameterSet $params
     * @return boolean
     */
    public function authenticate(ParameterSet $params)
    {
        
        if (! $params->has('login') || ! $params->has('password')) {
            throw new Exception("Parâmetros inválidos");
        }

        $login = $params->get('login')->getValue();
        $password = md5($params->get('password')->getValue());

        $user = $this->getEntityManager()
                     ->getRepository('Application\Model\User')
                    ->findBy(
                        array(
                            'login' => $login,
                            'password' => $password
                        )
                    );

        if (count($user)==0) {
            throw new Exception("Login ou senha inválidos");
        }
        $session = $this->getServiceManager()->get('Session');
        $session->offsetSet('user', $user);

        return true;
    }

   
    /**
     * Faz o logout do sistema
     *
     * @return void
     */
    public function logout()
    {
        $session = $this->getServiceManager()->get('Session');
        $session->offsetUnset('user');
        
        return true;
    }

    // /**
    //  * Faz a verificação se a pessoa tem permissão de acessar o controlador
    //  * @param  ParameterSet params
    //  * @return boolean
    //  */
    // public function authorize(ParameterSet $params)
    // {
    //     $auth = new AuthenticationService();
    //     $hasIdentity = $auth->hasIdentity();
    //     if (!$hasIdentity) {
    //         return false;
    //     }
    //     $moduleName = $params->get('moduleName')->getValue();
    //     $controllerName = $params->get('controllerName')->getValue();
    //     $actionName = $params->get('actionName')->getValue();

    //     $role = 'weg';
    //     $resource = ((trim($moduleName) != '' && $moduleName != 'application') ? $moduleName . '/' : '') .
    //      $controllerName;
    //     $acl = $this->getServiceManager()->get('Core\Acl\Builder')->build();
    //     if (!$acl->hasResource($resource)) {
    //         return false;
    //     }
        
    //     if (! $acl->isAllowed($role, $resource)) {
    //         return false;
    //     }

    //     return true;
    // }
}
