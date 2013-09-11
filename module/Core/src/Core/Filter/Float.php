<?php
namespace Core\Filter;

use Zend\Filter\AbstractFilter;

/**
 * Faz o filtro de valores convertendo para float
 * @category   Core
 * @package    Filter
 */
class Float extends AbstractFilter
{
    /**
     * Defined by Zend\Filter\FilterInterface
     *
     * Returns (float) $value
     *
     * @param  string $value
     * @return float
     */
    public function filter($value)
    {

        if ($value === (string) (float) $value || is_float($value)) {
            return (float) $value;
        }

        $value = str_replace('.', '', $value);
        $value = str_replace(',', '.', $value);
        return (float) ((string) $value);
    }
}
