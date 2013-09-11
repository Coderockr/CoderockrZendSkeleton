<?php

namespace Core\View\Helper;

use Zend\View\Helper\AbstractHelper;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

/**
 * Helper que imprime steps
 * 
 * @category Core
 * @package View\Helper
 * @author  Romulo Busatto <romulobusatto@unochapeco.edu.br>
 */
class Steps extends AbstractHelper implements ServiceLocatorAwareInterface
{

    /**
     * Set the service locator.
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return CustomHelper
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->serviceLocator = $serviceLocator;
        return $this;
    }

    /**
     * Get the service locator.
     *
     * @return \Zend\ServiceManager\ServiceLocatorInterface
     */
    public function getServiceLocator()
    {
        return $this->serviceLocator;
    }

    /**
     * Verifica se a chave existe no array ou objeto e retorna seu valor
     * @param  array $data                  Conjunto de dados para montas steps
     * @param  string $key                   Chave a pesquisar
     * @param  string $positionActive        Posição ativa no momento
     */
    public function __invoke($data, $positionActive)
    {
        $this->getView()->headLink()->appendStylesheet('/css/steps.css');
        $xhtml = '<ul class="steps">';

        $count = count($data);
        $width = floor(100 / $count);
        for ($i = 0; $i < $count; $i++) {
            if (isset($data[$i]['link'])) {
                $data[$i]['description'] = '<a href="'.$data[$i]['link'].'" title="'.$data[$i]['description'].'">'
                                           . $data[$i]['description'].'</a>';
            }
            
            $xhtml .='<li style="width:' . $width . '%;" ' .
                    ($i+1 == $positionActive ? 'class="activated"' :
                    ($i+1 < $positionActive ? 'class="disabled"' : '') ).'>';
            $xhtml .='  <div class="step">';
            $xhtml .='      <div class="step-image"></div>';
            $xhtml .='      <div class="step-current">Etapa '.($i+1).'</div>';
            $xhtml .='      <div class="step-description">'.$data[$i]['description'].'</div>';
            $xhtml .='  </div>';
            $xhtml .='</li>';
        }

        $xhtml .= '</ul>';
        return $xhtml;
    }
}
