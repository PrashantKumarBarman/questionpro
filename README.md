# Tech Stack Used
- NodeJS
- ExpressJS
- Mysql
- Sequelize ORM

# How to run
- Enter the project directory
- Run npm install
- Copy .env.local to .env
- Set port and other variables as need in .env file
- Run `npm run start`
- Open the application in browser at http://localhost:8080, replace 8080 with the actual port
- Import Questionpro_postman_colletion.json in Postman and use it to test the endpoints
- Use /login endpoint to get a token for to be used with other endpoints
- There are two users provided for testing as mentioned in Users for testing section, use these users for generating a JWT token with user and admin roles

# Users for testing
| Email          | Password       | Role   |
| -------------- | -------------- | ------ |
| admin@test.com | Admin12345678@ | admin |
| user@test.com  | User12345678@  | user |

# Environment Variables
| Name           | Description | Default Value  |
| -------------- | ----------- | -------------- |
| PORT           |             | 8080           |
| JWT_SIGNATURE  | Signature to be used for signing JWT authorization tokens | |
| MYSQL_HOST     | Mysql server host | 127.0.0.1 |
| MYSQL_PORT     | Mysql server port | 3306    |
| MYSQL_USERNAME | Mysql server username |     |
| MYSQL_PASSWORD | Mysql server password |     |
| MYSQL_DATABASE | Mysql database name |       |
