const withSass = require('@zeit/next-sass')
const webpack = require('webpack');

module.exports = withSass({
  webpack: config => {
    const env = { 
      APP_URL: JSON.stringify(process.env.APP_URL),
      SENDGRID_API_KEY: JSON.stringify(process.env.SENDGRID_API_KEY)
    };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  }
});