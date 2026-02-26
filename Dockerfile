# Use PHP 8.2 FPM
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client \
    supervisor \
    nginx \
    gnupg \
    ca-certificates \
    lsb-release \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Node 18 (stable for Vite)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy app files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install frontend dependencies
RUN npm install

# Build frontend (IMPORTANT for Inertia)
RUN npm run build

# Set correct permissions AFTER build
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Configure nginx
COPY nginx.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default && \
    ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Configure supervisor
RUN mkdir -p /etc/supervisor/conf.d
COPY supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create php socket dir (safe even if unused)
RUN mkdir -p /var/run/php

# Railway uses 8080
EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-n"]