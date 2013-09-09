<?php

namespace Core\Test\Fixture;

use Core\Test\Fixture;

/**
 * Agregador de fixtures para testes de serviços
 * @category Core
 * @package Test\Fixture
 * @author Marcos Garcia <garcia@coderockr.com>
 */
class Service extends Fixture
{

    /**
     * Constrói o fixture de acordo com o arquivo
     */
    public function build($data = null)
    {
        $log = $this->getServiceManager()->get('Log');
        $adapter = $this->getServiceManager()->get('DbAdapter');
        $sql = explode("\n", file_get_contents('data/testes.servicos.sql'));
        $error = false;
        foreach ($sql as $s) {
            try {
                if (trim($s) != '') {
                    $statement = $adapter->query($s);
                    $statement->execute();
                }
            } catch (\Zend\Db\Adapter\Exception\InvalidQueryException $e) {
                var_dump($s);
                $error = true;
                $log->err($s . ' ' . $e->getMessage());
            }
        }
        if ($error) {
            throw new \Exception("Erro processando consultas do Fixture\Service");
        }
    }

}
