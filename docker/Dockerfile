FROM php:8.4-apache

# Dependencias del sistema para las extensiones PHP
RUN apt-get update && apt-get install -y --no-install-recommends \
        libzip-dev libpng-dev libonig-dev libicu-dev unzip git \
    && rm -rf /var/lib/apt/lists/*

# Extensiones que necesita Laravel 13 + MySQL
RUN docker-php-ext-install -j"$(nproc)" pdo_mysql mbstring bcmath zip gd intl

# Composer (desde la imagen oficial)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Apache: mod_rewrite + docroot en /public (API Laravel)
RUN a2enmod rewrite; \
    sed -ri 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf; \
    printf '<Directory /var/www/html/public>\n    AllowOverride All\n    Require all granted\n</Directory>\n' > /etc/apache2/conf-available/laravel.conf; \
    a2enconf laravel

# Límites PHP razonables para desarrollo
RUN { \
      echo 'upload_max_filesize=64M'; \
      echo 'post_max_size=64M'; \
      echo 'memory_limit=512M'; \
    } > /usr/local/etc/php/conf.d/ipsv2.ini
