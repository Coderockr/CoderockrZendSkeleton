<?php
namespace Core\Filter;

use DateTime;
use Zend\Filter\AbstractFilter;

/**
 * Faz o filtro de datas de bancos de dados (Oracle, Postgres, MySQL)
 * @category   Core
 * @package    Filter
 */
class Date extends AbstractFilter
{
    /**
     * Defined by Zend\Filter\FilterInterface
     *
     * Returns (DateTime) $value
     *
     * @param  string $value
     * @return DateTime
     */
    public function filter($value)
    {
        if ($value instanceof \DateTime) {
            return $value;
        }
        
        $dateFormats = array(
            /** MySQL: 2012-11-27 16:01:04 */
            'Y-m-d H:i:s',
            /** Fixtures */
            'd/m/Y H:i:s',
            /** Fixtures */
            'd/m/Y H:i',
            /** POSTGRES: Wed Dec 17 07:37:16 1997 PST */
            'D M d H:i:s Y T',
            /** POSTGRES: 2013-01-29 */
            'Y-m-d',
            /** Oracle: 01-APR-98 */
            'd-M-y',
            /** Oracle Unochapecó CLI: 27/11/12 */
            'd/m/y',
            /** Frontend; Oracle Unochapecó ZF1: 27/11/2012 */
            'd/m/Y',            
        );        

        foreach ($dateFormats as $format) {
            $date = $this->createFromFormat($format, $value);
            if ($date != false) {                
                return $date;
            }
        }
        return $value;
    }

    private function createFromFormat($format, $value)
    {        
        if ( ! $value) {
            return $value;
        }

        if ( ! is_string($value)) {
            $value = $value->format($format);
        }
        $date = DateTime::createFromFormat($format, $value);
        
        // Datas inválidas podem mostrar "warnings" (por exemplo, "2012-09-99")
        // mas, ainda assim, retornar um objeto DateTime
        $errors = DateTime::getLastErrors();
        
        if ($errors['warning_count'] === 0 && $date != false) {            
            return $date;
        }
        
        return false;
    }
    
    
    public function formatDateFromDatabase($platformName, $date)
    {        
        $date = $this->filter($date);
        $formatDate = array('database' => 'YYYY-MM-DD HH24:MI:SS', 'php' => 'Y-m-d H:i:s');
        switch ($platformName) {
            case 'Oracle':
            case 'PostgreSQL':
                $date = new \Zend\Db\Sql\Expression('to_date(\'' . $date->format($formatDate['php']) . '\',\'' . $formatDate['database'] . '\')');
                break;
            case 'SQLite':
            case 'MySQL':
                $date = $date->format($formatDate['php']);
                break;
        }
        return $date;
    }
    
    
}
