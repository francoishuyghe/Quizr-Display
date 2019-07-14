import '../style/style.scss'
import Head from 'next/head'
import ResetQuiz from '../components/ResetQuiz'

class QuizContainer extends React.Component {

  render() {

    return (
      <div className={"quizContainer " + this.props.name}>
        <Head>
          <title>Quizr</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.1.1/iframeResizer.contentWindow.min.js" type="text/javascript"></script>
        </Head>

        <ResetQuiz />
        
        <div className="gradient">  
          <div className="wrap">
            { this.props.children }
          </div>
        </div>
      </div>
    )
    };
}

export default QuizContainer;