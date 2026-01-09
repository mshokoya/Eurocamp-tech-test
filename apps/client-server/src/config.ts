export default () => ({
  port: parseInt(process.env['PORT'] || '3002', 10),
  eurocamp: {
    baseUrl: process.env['EUROCAMP_API_URL'] || 'http://localhost:3001',
    timeout: parseInt(process.env['EUROCAMP_TIMEOUT'] || '5000'),
    retryAttempts: parseInt(process.env['EUROCAMP_RETRY_ATTEMPTS'] || '3'),
    retryDelay: parseInt(process.env['EUROCAMP_RETRY_DELAY'] || '1000'),
  },
});