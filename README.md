# Para instalar:

curl -s https://getcomposer.org/installer | php
php composer.phar create-project coderockr/zend-skeleton project_name


# Configuração do servidor

    <VirtualHost *:80>
        ServerName projeto.dev
        DocumentRoot /vagrant/Projeto/Web/public
        SetEnv APPLICATION_ENV "development"
        SetEnv PROJECT_ROOT "/vagrant/Projeto/Web"
        <Directory /vagrant/Projeto/Web/public>
            DirectoryIndex index.php
            AllowOverride All
            Order allow,deny
            Allow from all
        </Directory>
    </VirtualHost>
    
