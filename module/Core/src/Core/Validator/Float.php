<?php

namespace Core\Validator;

use Zend\I18n\Validator\Float as I18nFloat;

/**
 * Faz a validação especial do tamanho do valor enviado
 *
 * @category   Core
 * @package    Validator
 * @author     Elton Minetto <eminetto@coderockr.com>
 */
class Float extends I18nFloat
{

    protected $max_int;
                       
    protected $max_precision;


    /**
     * Constructor for the integer validator
     *
     * @param array|Traversable $options
     */
    public function __construct($options = array())
    {
        $this->max_int = null;
        if (isset($options['max_int'])) {
            $this->max_int = $options['max_int'];
        }

        $this->max_precision = null;
        if (isset($options['max_precision'])) {
            $this->max_precision = $options['max_precision'];
        }

        parent::__construct($options);
    }


    public function isValid($value)
    {
        if (!is_float($value)) {
            $this->error('Precisa ser um float' . var_export($value, true));
            return false;
        }

        if ($this->max_int && strlen(intval($value)) > $this->max_int) {
            $this->error('Tamanho maior do que o permitido');
            return false;
        }

        if ($this->max_precision) {
            $maxSize = strlen((string) intval($value)) + 1 + $this->max_precision;
            if (strlen($value) > $maxSize) {
                $this->error('Precisão maior do que o permitido');
                return false;
            }
        }

        return parent::isValid($value);
    }
}
