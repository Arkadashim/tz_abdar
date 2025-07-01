export default () => ({
  port: parseInt(new String(process.env.PORT).valueOf(), 10) || 3000,
});
