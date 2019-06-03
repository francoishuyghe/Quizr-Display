import React from 'react';
import App, { Container } from 'next/app';
//Redux
import { Provider } from 'react-redux'
import withReduxStore from '../lib/with-redux-store'

//iFrame resize
import '../lib/iframeResizer.contentWindow.min.js'

//Google Analytics
import ReactGA from 'react-ga';
ReactGA.initialize('UA-74357159-16', {
  gaOptions: {
    referrer: 'savemefrom.myshopify.com'
  }
});


class QuizApp extends App {

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidUpdate() { 
    ReactGA.pageview(window.location.pathname);
  }

  render() {
    const { Component, pageProps, reduxStore} = this.props;

    return (
      <Container>
            <Provider store={reduxStore}>
                <Component {...pageProps}/>
            </Provider>
      </Container>
    );
  }
}

export default withReduxStore(QuizApp);