/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { fetchQuestion, randomizeAnswers, removeEncoding } from '../quiz-api.js';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

export default class QuizPage extends Component {

    state = {
        currentQuestion: {},
        money: 0,
        questionCount: 0,
        randomizedAnswers: [],
        guess: '',
        bet: 0,
        endGame: true,
        hasPlayed: false,
        lastAnswerCorrect: true,
        lastAnswer: '',
    }

    componentDidMount = async () => {
        if (!this.props.token) {
            this.props.history.push('/')
        }
    }

    onBetChange = async (e) => {
        await this.setState({
            bet: e.target.value,
        })
    }

    onValueChange = async (e) => {
        console.log(this.state);
        console.log(e.target.value);

        await this.setState({
          guess: this.state.randomizedAnswers[e.target.value]
        });

        console.log(this.state);
        console.log(this.state.guess);
      }


    handleQuizStart = async (e) => {
        e.preventDefault();

        try {
            const questionData = await fetchQuestion(this.props.token)
            this.setState({ 
                currentQuestion: questionData.body.results[0], 
                questionCount: 1,
                endGame: false, 
            })

            this.handleRandomizer();

        } catch {
            console.log(e.message)
        }
    }

    handleRandomizer = async (e) => {
        try {
            const unrandomizedAnswers = this.state.currentQuestion.incorrect_answers;
            unrandomizedAnswers.push(this.state.currentQuestion.correct_answer)
            await randomizeAnswers(unrandomizedAnswers);

            this.setState({ randomizedAnswers: unrandomizedAnswers })
        } catch(e) {
            console.log(e.message);
        }  
    }

    handleAnswer = async (e) => {
        e.preventDefault();
        try {
            if (this.state.questionCount === 10) {
                this.setState({
                    endGame: true,
                    questionCount: 0,
                    hasPlayed: true,
                })
            } else {
                if (this.state.guess === this.state.currentQuestion.correct_answer) {
                    await this.setState({
                        money: Number(this.state.money) + Number(this.state.bet),
                        lastAnswerCorrect: true,
                    });
                } else {
                    await this.setState({
                        money: Number(this.state.money) - Number(this.state.bet),
                        lastAnswerCorrect: false,
                        lastAnswer: this.state.currentQuestion.correct_answer,
                    });
                }
    
                const questionData = await fetchQuestion(this.props.token)
                this.setState({ 
                    currentQuestion: questionData.body.results[0], 
                    questionCount: this.state.questionCount + 1,
                    randomizedAnswers: [],
                })

                this.handleRandomizer();

            }
        } catch(e) {
            console.log(e.message);
        }
    }
    
    render() {

        const html = this.state.currentQuestion.question
        
        return (
            <div>

                <div className="money-display">
                    { 
                    this.state.questionCount > 1 &&
                    <p>
                        {
                        this.state.lastAnswerCorrect 
                        ?
                        'Correct!'
                        :
                        `Too bad! The correct answer was ${this.state.lastAnswer}`
                        }
                    </p>
                    }
        
                    <p>You have ${this.state.money}</p>
                </div>

                { this.state.endGame 
                ? 
                <div className="start-quiz">
                    <form onSubmit={this.handleQuizStart}>
                        <label>
                            <button>{ this.state.hasPlayed ? 'Play Again' : 'Start Quiz!' }</button>
                            <button>View Your Favorite Questions</button>
                        </label>
                    </form>
                </div> 
                :
                <div>
                    <form className="question-display" onSubmit={this.handleAnswer}>
                        <p>
                            {ReactHtmlParser(html)}
                        </p>
                            {
                                this.state.randomizedAnswers.map((answer, i) => {    
                                return <label>
                                        {ReactHtmlParser(answer)}
                                    <input onChange={this.onValueChange} type="radio" name="multiple-choice" value={i} key={'answer' + i} />
                                    </label>
                                })
                            }
                        <input min="0" className="bet" onChange={this.onBetChange} type="number"></input> 
                        <button>Submit Answer</button>
                    </form>
                    <button>Favorite Button</button>
                </div>
                }
            </div>
        )
    }
}
