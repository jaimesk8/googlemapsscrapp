# Google Maps Scrapp
A google maps scrap using node.js and mysql

In this project we scrap data from google maps and save them into a mysql database. 

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps, and its important to be familiarize with node.js.

### Prerequisites

First you need to install install these npm packages in our project folder.

* npm puppeteer
  ```sh
  npm install puppeteer
  ```
* npm express
  ```sh
  npm install express
  ```
* npm mysql2
  ```sh
  npm install mysql2
  ```
* npm cors
  ```sh
  npm install cors
  ```

### Starting
1. Start node in your project folder
   ```sh
   npm init
   ```
   
2. Clone the repo
   ```sh
   git clone https://github.com/jaimesk8/googlemapsscrapp.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create a mysql database and connect to the index.js
   ```js
   //connection to database
    function executaSQL(sqlQry, res){
       const connection = mysql.createConnection({
         host: "localhost",
         port: 3306,
         user: "YOURUSER",
         password: "YOURPASS",
         database: "YOURDATABASENAME"
     });

     connection.query(sqlQry, (error, results, fields) => {
        res.json(results);
      });
    }
   ```

![alt text](https://github.com/jaimesk8/googlemapsscrapp/blob/main/exemple.png?raw=true)
