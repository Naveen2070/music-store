export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  dbHost: process.env.DBHOST,
  dbPort: process.env.DBPORT,
  dbUser: process.env.DBUSER,
  dbPassword: process.env.DBPASSWORD,
  dbName: process.env.NAME,
});
