export default () => ({
  port: parseInt(process.env.PORT, 10) || 9000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    sync: Boolean(process.env.DATABASE_SYNC) || true,
    
  }
});
