# Fernando  De La Cruz - Legario

# Base de datos
En el archivo ``` db.sql ``` se encuentran las sentencias SQL para crear la base de datos, las tablas y los registros. Favor de correrlo en el servidor de base de datos.

# Backend
En la carpeta *backend* se encuentra el proyecto de Laravel. Es necesario tener *composer* para iniciarlo:

``` cd backend ```

``` composer install ```

Después es necesario copiar el archivo *.env.prod* y renombrarlo a *.env*

``` mv .env.prod .env ```

Cambiar los siguientes valores por los del host actual en el archivo *.env*:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=legario
DB_USERNAME=root
DB_PASSWORD=
```
Iniciar el servidor con:

``` php artisan serve ```

# Frontend
En la carpeta *frontend* se encuentra el proyecto de React. Es necesario tener *npm* para iniciarlo.

` cd frontend `

` npm install `

Después es necesario copiar el archivo *.env.prod* y renombrarlo a *.env*

``` mv .env.prod .env ```

Cambiar los siguientes valores por los del host actual en el archivo *.env*:

``` REACT_APP_URL=http://127.0.0.1:8000/api/ ```

Iniciar la aplicación:

``` npm start ```

# Usuarios
Por default existen 2 usuarios:


Cliente: 

email: ``` cliente@cliente.com  ```

password: ``` 123  ```


Administrador: 

email: ``` admin@admin.com  ```

password: ``` 123  ```

Todos los nuevo usuarios se agregan con perfil de cliente, para modificarlo y hacerlo administrado es necesario modificar un campo de la base de datos:

``` usuarios.type ``` 0: cliente, 1: administrador
