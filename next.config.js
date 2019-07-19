const withSass = require('@zeit/next-sass')
const webpack = require('webpack')

module.exports = withSass({
  webpack: config => {
    const originalEntry = config.entry
    
    config.entry = async () => {
      const entries = await originalEntry()

      if (
        entries['main.js'] &&
        !entries['main.js'].includes('./client/polyfills.js')
      ) {
        entries['main.js'].unshift('./client/polyfills.js')
      }

      return entries
    }

    const env = { 
      APP_URL: JSON.stringify(process.env.APP_URL),
      SENDGRID_API_KEY: JSON.stringify(process.env.SENDGRID_API_KEY)
    };
    config.plugins.push(new webpack.DefinePlugin(env));

    return config;
  }
});