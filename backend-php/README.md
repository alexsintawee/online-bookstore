# Online Bookstore API (Laravel)

PHP Laravel replica of the Node.js backend. Same endpoints, business logic, and data sources.

## How to run

From the project root (`online-bookstore`):

```bash
cd backend-php
composer install
cp .env.example .env
php artisan key:generate
composer run serve
```

**`composer run serve`** starts the server on port 5555 and hides PHP 8.5 deprecation messages. If you run `php artisan serve --port=5555` directly, you may see deprecation notices; use **`composer run serve`** or:

```bash
php -d error_reporting=24575 artisan serve --port=5555
```

Or in one line from the project root:

```bash
cd backend-php && composer install && cp .env.example .env && php artisan key:generate && composer run serve
```

API: **http://localhost:5555** (e.g. http://localhost:5555/api/products)

## Requirements

- PHP 8.2+
- Composer

## Troubleshooting

**`composer: command not found`**

Composer is not in your PATH. On macOS, install it with [Homebrew](https://brew.sh/):

```bash
brew install composer
```

Then run `composer install` again from `backend-php/`.

If you don’t use Homebrew, install Composer from [getcomposer.org](https://getcomposer.org/download/) or run it via PHP without installing globally:

```bash
cd backend-php
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
php composer.phar install
```

Use `php composer.phar` instead of `composer` for other commands (e.g. `php composer.phar run serve`).

**PHP version / “your php version does not satisfy that requirement”**

Laravel 11 and this project require **PHP 8.2+**. If you see:

```text
Your requirements could not be resolved to an installable set of packages.
Root composer.json requires php ^8.2 but your php version (7.4.33) does not satisfy that requirement.
```

upgrade PHP. On macOS with [Homebrew](https://brew.sh/):

```bash
brew install php
```

Then check:

```bash
php -v
```

If the terminal still uses an older PHP (e.g. 7.4), switch to the Homebrew PHP:

```bash
brew link php --overwrite
```

Or use the full path, e.g. `$(brew --prefix php)/bin/php -v`, and run Composer with that PHP:

```bash
$(brew --prefix php)/bin/php composer.phar install
```

After PHP is 8.2+, run `php composer.phar install` (or `composer install`) again from `backend-php/`.

**“Composer detected issues in your platform” / PHP version when running `composer run serve`**

`composer run serve` uses whatever `php` is first in your PATH. If that’s still 7.4, you’ll get a platform error. Use the same PHP you used for `composer install` (e.g. Homebrew’s PHP):

```bash
$(brew --prefix php)/bin/php artisan serve --port=5555
```

To make this the default in your shell, add to `~/.zshrc`: `export PATH="$(brew --prefix php)/bin:$PATH"`, then run `source ~/.zshrc` or open a new terminal.

**“Address already in use” on port 5555 (macOS)**

The default port is 5555. If it’s in use, use another port:

```bash
php artisan serve --port=5556 --host=0.0.0.0
```

Then open http://127.0.0.1:5556 or http://localhost:5556. (macOS often uses port 5000 for Control Center / AirPlay Receiver; this app uses 5555 by default.)

**“Access to localhost was denied” / HTTP 403 in the browser**

The server may be listening on IPv4 (`127.0.0.1`) while the browser uses “localhost” (which can resolve to IPv6). Try:

- **http://127.0.0.1:5555** instead of http://localhost:5555  
- **http://127.0.0.1:5555/api/products** to test the API

If that works, keep using `127.0.0.1` in the address bar. To accept both, start the server with:

```bash
php artisan serve --port=5555 --host=0.0.0.0
```

Then you can use http://localhost:5555 or http://127.0.0.1:5555 (only do this on a trusted network).

**PHP 8.5 deprecation messages (PDO::MYSQL_ATTR_SSL_CA)**

On PHP 8.5 you may see deprecation notices from Laravel’s vendor code. They’re harmless. To hide them when running the server:

- Use **`composer run serve`** (the script already suppresses deprecations), or  
- Run: **`php -d error_reporting=24575 artisan serve --port=5555`**

## Setup

```bash
cd backend-php
composer install
cp .env.example .env
php artisan key:generate
```

Data is read from the project's `data` folder (parent of `backend-php`): `../data/source/csv`, `../data/source/json`, `../data/source/images`.

**Configuration (no hardcoded values)**  
All configurable values live in `config/core/json/config.json`: app name/url, data path, path segments for products/promotions/images, default products and promotions, API error messages, image URL prefix, serve port, and CORS. Optional overrides via `.env` (e.g. `APP_NAME`, `DATA_PATH`, `APP_URL`). `config/app.php`, `config/bookstore.php`, and `config/cors.php` read from that file for defaults.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/products | List products |
| GET | /api/products/{sku} | Single product by SKU |
| GET | /api/promotions | List promotions |
| POST | /api/cart | Create cart → `{ cartId }` |
| GET | /api/cart/{cartId} | Cart summary (items, discounts, totals) |
| POST | /api/cart/{cartId}/items | Body `{ sku, quantityDelta }` → updated cart summary |
| GET | /api/images/* | Product images (from `data/source/images`) |
| GET | /images/* | Same images |

Behavior matches the Node backend in `backend/`.

**Carts are in-memory only.** Restarting the server clears all carts. If the frontend has an old cart ID in storage, `GET /api/cart/{cartId}` will return 404. Use “Clear cart and start fresh” on the Cart page (or clear the site’s session storage) so the app creates a new cart.
