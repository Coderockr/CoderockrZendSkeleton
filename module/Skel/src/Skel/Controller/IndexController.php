<?php

namespace Skel\Controller;

use Zend\View\Model\ViewModel;
use Core\Controller\ActionController;
use Skel\Model\Post;

/**
 * Controlador que gerencia os posts
 * 
 * @category Skel
 * @package Controller
 * @author  Elton Minetto<eminetto@coderockr.com>
 */
class IndexController extends ActionController
{
    /**
     * Mostra os posts cadastrados
     * @return void
     */
    public function indexAction()
    {
        return new ViewModel();
    }
}
