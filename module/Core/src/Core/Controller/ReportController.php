<?php
namespace Core\Controller;

use Zend\ServiceManager\Exception\ServiceNotFoundException;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;


require_once getenv('PROJECT_ROOT') . '/module/Core/src/Core/Report/Java.inc';

/**
 * Classe pai dos relatórios
 * 
 * @category Api
 * @package Controller
 * @author  Elton Minetto<eminetto@coderockr.com>
 */

abstract class ReportController extends ActionController
{
	/**
     * Caminho dos fontes dos relatórios
     * 
     * @var string
     */
    protected $reportsPath;

    /**
     * Caminho dos relatórios gerados
     * 
     * @var string
     */
    protected $reportsOutputPath;

    /**
     * Caminho dos templates
     * 
     * @var string
     */
    protected $templatePath;

    /**
     * Nome do arquivo
     * 
     * @var string
     */
    protected $reportFileName;

    /**
     * Nome do relatorio
     * 
     * @var string
     */
    protected $reportName;

    /**
     * Formato do relatório
     * 
     * @var string
     */
    protected $format;

    /**
     * Xpath usado pelo jasper para ler o XML
     * @var string
     */
    protected $xPath;

    /**
     * Construtor da classe, faz as configurações básicas
     */
    public function __construct()
    {
        $config = include getenv('PROJECT_ROOT') . '/config/application.config.php';
        
        $this->format = $config['reports']['defaultFormat'];
        $this->templatePath  = $config['reports']['templatePath'];
        $this->reportsOutputPath = $config['reports']['outputPath'];
    }

    /**
     * Serializa um array de dados no formato XML
     * @param  array $data Dados a serem serializados 
     * @return string      XML
     */
    protected function toXml($data)
    {
        $serializer = new Serializer(
            array(new GetSetMethodNormalizer()), 
            array('xml' => new XmlEncoder())
        );
        $content = $serializer->serialize($data, 'xml');
        return $content;
    }


    /**
     * Action usada para criar o formulário de parâmetros do relatório
     *
     * @return ViewModel
     */
    public function indexAction() {
        throw new \Exception("Este relatório não tem formulário de parâmetros");
        
    }
    
    /**
     * Método responsável por retornar um array com os dados a serem transformados em XML
     * Neste método consta a lógica do relatório
     * 
     * @param  array $params Parâmetros do processamento
     * @return array         Resultado do processamento
     */
    abstract protected function getData($params);

    /**
     * Executa o relatório
     *
     * @return $this->format
     */
	public function runAction()
    {
        try {
            // Compila o relatório
            $sJcm = new \JavaClass("net.sf.jasperreports.engine.JasperCompileManager");
            $report = $sJcm->compileReport($this->reportsPath . $this->reportFileName . ".jrxml");

            //parâmetros do relatório
            $parametros = new \Java("java.util.HashMap");
            $parametros->put("NAME_RELATORIO", $this->reportName); 
            $parametros->put("MODELOS_DIR", $this->templatePath); 

            $request = $this->getRequest();
            $params = array();
            if ($request->isPost()) {
                $params = $request->getPost();
            }

            $xml = new \Java('java.lang.String',$this->toXml($this->getData($params)));
            $stream = new \Java('java.io.ByteArrayInputStream',$xml->getBytes());
        
            //XML Dados
            $xmlDataSource = new \Java("net.sf.jasperreports.engine.data.JRXmlDataSource", $stream, $this->xPath);

            // Preenche o formulário com os dados do xml recebido do serviço
            $sJfm = new \JavaClass("net.sf.jasperreports.engine.JasperFillManager");
            $print = $sJfm->fillReport($report, $parametros,$xmlDataSource);

            // Exporta o arquivo final
            $outputFile = $this->reportsOutputPath . $this->reportFileName . "." . $this->format;
            $sJem = new \JavaClass("net.sf.jasperreports.engine.JasperExportManager");
            $sJem->exportReportToPdfFile($print, $outputFile);
            if (file_exists($outputFile)) {
                $response = $this->getResponse();
                $response->getHeaders()->addHeaderLine('Content-disposition: attachment; filename="' . $this->reportFileName . '.' . $this->format . '"');
                $response->getHeaders()->addHeaderLine('Content-Type: application/' . $this->format);
                $response->getHeaders()->addHeaderLine('Content-Transfer-Encoding: binary');
                $response->getHeaders()->addHeaderLine('Content-Length: ' . @filesize($outputFile));
                $response->getHeaders()->addHeaderLine('Pragma: no-cache');
                $response->getHeaders()->addHeaderLine('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                $response->setStatusCode(200);
                set_time_limit(0);
                $response->setContent(file_get_contents($outputFile));
                return $response;
            }
        } catch (\JavaException $ex) {
            $trace = new \Java("java.io.ByteArrayOutputStream");
            $ex->printStackTrace(new \Java("java.io.PrintStream", $trace));
            print "java stack trace: $trace\n";
        }    
    }

}