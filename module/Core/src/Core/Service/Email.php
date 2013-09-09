<?php
namespace Core\Service;

use Zend\Mail\Transport\Smtp as SmtpTransport;
use Zend\Mime\Part as MimePart;
use Zend\Mime\Message as MimeMessage;
use Core\Service\ParameterSet;
use Core\Service\Service;
use Zend\Mail\Message;
use Zend\Mime\Mime;

/**
 * Classe que envia e-mails
 * @category   Core
 * @package    Service
 * @author     Mateus Guerra<mateus@coderockr.com>
 */
class Email extends Service
{

    private $options; 

    public function __construct($options)
    {   
        $this->setOptions($options);
    }

    /**
    *   Envio de email
    **/
    public function sendMail($email , $subject = null , $messageSent = null)
    {
        $message = new Message();

        $message->addTo($email)
                ->addFrom($this->options->connectionConfig['username'])
                ->setSubject($subject)
                ->setBody($messageSent);
        
        $transport = new SmtpTransport();
        $transport->setOptions($this->options);
        $transport->send($message);
    }

    /**
    *   Envio de email
    **/
    public function sendActvationMail($email , $subject = null , $messageSent = null)
    {
        $message = new Message();
        $bodyPart = new MimeMessage;

        $body = new MimePart($messageSent);
        $body->type = "text/html";

        $files[] = $body;
        
        $bodyPart->setParts($files);
        
        $message->addTo($email)
                ->addFrom($this->options->connectionConfig['username'])
                ->setSubject($subject)
                ->setBody($bodyPart);
        
        $transport = new SmtpTransport();
        $transport->setOptions($this->options);
        $transport->send($message);
    }

    public function setOptions($options)
    {
        $this->options = $options;

    }

    /*
     $attachments = array( 
                            array(
                                'fileName' : 'arquivo',
                                'fileExtension' : 'doc'
                            ), 
                             array(
                                'fileName' : 'arquivo2', 
                                'fileExtension' : 'doc'
                            ) 
                        );
    */


    /**
    *   Envio de email com Anexo
    **/
    public function sendMailWithAttachment($email, $attachments, $subject = null, $messageSent = null)
    {
        $message = new Message();
        $bodyPart = new MimeMessage;

        foreach ($attachments as $key => $file) {
            $attachment = new MimePart(file_get_contents('/tmp/'.$file['fileName'].'.'.$file['fileExtension']));
            $fileType = $this->getFileType($file['fileExtension']);
            $attachment->type = $fileType ;
            $attachment->disposition = Mime::DISPOSITION_INLINE;
            $attachment->encoding = Mime::ENCODING_BASE64;
            $attachment->filename = $file['fileName'].'.'.$file['fileExtension'];
            $files[$key] = $attachment;
        }

        $body = new MimePart($messageSent);
        $body->type = "text/plain";
        $body->encoding = Mime::ENCODING_BASE64;

        $files[] = $body;
        
        $bodyPart->setParts($files);
        
        $message->addTo($email)
                ->addFrom($this->options->connectionConfig['username'])
                ->setSubject($subject)
                ->setBody($bodyPart);

        $transport = new SmtpTransport();
        $transport->setOptions($this->options);
        $transport->send($message);
    }

    /**
    *   Função para returnar o tipo do arquivo Mime para a extensão proposta
    **/
    private function getFileType($extension)
    {   
        $extension = strtolower($extension);
        switch ($extension) {
            case 'jpg':
                $fileType = 'image/jpeg';
                break;
            case 'pdf':
                $fileType = 'application/pdf';
                break;
            case 'png':
                $fileType = 'image/png';
                break;
            case 'ppt':
                $fileType = 'application/vnd.ms-powerpoint';
                break;
            case 'xls':
                $fileType = 'application/vnd.ms-excel';
                break;
            case 'tar':
                $fileType = 'application/x-tar';
                break;
            case 'txt':
                $fileType = 'text/plain';
                break;
            case 'zip':
                $fileType = 'application/zip';
                break;
            case 'rar':
                $fileType = 'application/x-rar-compressed';
                break;
       }
       return $fileType;
    }
}