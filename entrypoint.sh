#!/bin/sh

set -e

# Create necessary directories
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/framework/cache
mkdir -p bootstrap/cache

# Set permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Ensure APP_KEY exists (fail fast if missing)
if [ -z "$APP_KEY" ]; then
  echo "ERROR: APP_KEY is not set!"
  exit 1
fi

# Clear and cache configuration (production optimized)
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (safe for production)
php artisan migrate --force

# Start the main process (supervisor or nginx/php-fpm)
exec "$@"