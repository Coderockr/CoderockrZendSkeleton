<?php
namespace Core\Service;

/**
 * Classe que retira acentuação e espaços em branco de uma string
 * @category   Core
 * @package    Service
 * @author    Mateus Guerra <mateus@coderockr.com>
 */
class NormalizeString
{

    /**
     * Retira acentuação e espaços em branco
     * @param  string $string String a ser normalizada
     * @return string $string String normalizada
     */
    public function normalize($string)
    {

        $de = array("ç", "æ", "", "á", "é", "í", "ó", "ú", "à", "è",
                 "ì", "ò", "ù", "ä", "ë", "ï", "ö", "ü", "ÿ", "â",
                 "ê", "î", "ô", "û", "å", "e", "i", "ø", "u", "Ç",
                 "Æ", "", "Á", "É", "Í", "Ó", "Ú", "À", "È", "Ì",
                 "Ò", "Ù", "Ä", "Ë", "Ï", "Ö", "Ü", "", "Â", "Ê",
                 "Î", "Ô", "Û", "Å", "Ø", "ĩ", "Î");

        $para =   array("c", "ae", "oe", "a", "e", "i", "o", "u", "a", "e",
                 "i", "o", "u", "a", "e", "i", "o", "u", "y", "a",
                 "e", "i", "o", "u", "a", "e", "i", "o", "u", "C",
                 "AE", "OE", "A", "E", "I", "O", "U", "A", "E", "I",
                 "O", "U", "A", "E", "I", "O", "U", "Y", "A", "E",
                 "I", "O", "U", "A", "O", "i" , "I");
                 
        $string = str_replace($de, $para, $string);
        $string = strtolower($string);
        $string = str_replace(" ", "_", $string);
        return $string;
    }
}
