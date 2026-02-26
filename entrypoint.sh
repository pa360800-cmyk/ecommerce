#!/bin/sh

# Stop on undefined variables but DO NOT stop on command errors
set -u

echo "Starting Laravel container..."

# Create required directories
mkdir -p storage/framework/sessions \
         storage/framework/views \
         storage/framework/cache \
         bootstrap/cache

# Set permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Ensure APP_KEY exists
if [ -z "${APP_KEY:-}" ]; then
  echo "ERROR: APP_KEY is not set!"
  exit 1
fi

# Wait for database (prevents crash if DB not ready yet)
echo "Waiting for database connection..."
until php artisan migrate:status > /dev/null 2>&1; do
  sleep 2
done

echo "Caching configuration..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "Running migrations..."
php artisan migrate --force || true

echo "Container ready. Starting services..."

# Start supervisor (nginx + php-fpm)
exec "$@"