export default () => ({
  port: parseInt(process.env['CLIENT_SERVICE_PORT'] || '3002'),
  eurocamp: {
    baseUrl: process.env['EUROCAMP_API_URL'] || 'http://localhost:3001',
    timeout: parseInt(process.env['CLIENT_SERVICE_TIMEOUT'] || '5000'),
    retryAttempts: parseInt(process.env['CLIENT_SERVICE_RETRY_ATTEMPTS'] || '3'),
    retryDelay: parseInt(process.env['CLIENT_SERVICE_RETRY_DELAY'] || '1000'),
  },
});