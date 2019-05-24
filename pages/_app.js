import React from 'react';
import App, { Container } from 'next/app';
//Redux
import { Provider } from 'react-redux'
import withReduxStore from '../lib/with-redux-store'

class QuizApp extends App {

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
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