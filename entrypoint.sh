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
timeout=60
counter=0
until php artisan migrate:status > /dev/null 2>&1; do
  sleep 2
  counter=$((counter + 2))
  if [ $counter -ge $timeout ]; then
    echo "WARNING: Database connection timeout, continuing anyway..."
    break
  fi
done

echo "Caching configuration..."
php artisan config:cache || true

# DO NOT cache routes in production with Inertia - it breaks dynamic routing
# php artisan route:cache || true

# Clear and recompile views (important for Inertia)
php artisan view:clear || true

echo "Running migrations..."
php artisan migrate --force || true

# Create the PHP-FPM socket directory
mkdir -p /var/run/php
chown www-data:www-data /var/run/php

echo "Container ready. Starting services..."

# Start supervisor (nginx + php-fpm)
exec "$@"
