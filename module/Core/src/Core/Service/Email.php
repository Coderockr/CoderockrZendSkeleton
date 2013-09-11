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
    public function sendMail($email, $subject = null, $messageSent = null)
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
    public function sendActvationMail($email, $subject = null, $messageSent = null)
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
        $knownExtensions = array(
            'jpg' => 'image/jpeg',
            'pdf' => 'application/pdf',
            'png' => 'image/png',
            'ppt' => 'application/vnd.ms-powerpoint',
            'xls' => 'application/vnd.ms-excel',
            'tar' => 'application/x-tar',
            'txt' => 'text/plain',
            'zip' => 'application/zip',
            'rar' => 'application/x-rar-compressed',
        );
        
        $extension = strtolower($extension);
        if (! isset($knownExtensions[$extension])) {
            return 'not found';
        }

        return $knownExtensions[$extension];
    }
}
