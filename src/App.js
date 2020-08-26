import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router, 
  Route, 
  Switch,
  Link
} from 'react-router-dom';
import HomePage from './HomePage/HomePage.js';
import QuizPage from './QuizPage/QuizPage.js';
import FavoritesPage from './FavoritesPage/FavoritesPage.js';
import DetailPage from './DetailPage/DetailPage.js';
import AboutUsPage from './AboutUsPage/AboutUsPage.js';

export default class App extends Component {
  state = {
    token: localStorage.getItem('token'),
  }

  handleToken = (token) => {
    this.setState({ token: token })

    localStorage.setItem('token', token)
  }

  clearToken = () => {
    this.setState({ token: '' })

    localStorage.setItem('token', '')
  }

  render() {
      return (
          <div>
              <Router>
                <main>
                  <div>
                    <Link to='/'><button onClick={this.clearToken}>Log out + home page</button>
                    </Link>
                    <div>
                      <Link to='/quiz'>QUIZ PAGE</Link>
                      <Link to='/favorites'>FAVORITES PAGE</Link>
                      <Link to='/about'>ABOUT US PAGE</Link>
                    </div>
                  </div>
                  <Switch>
                      <Route 
                          path="/" 
                          exact
                          render={(routerProps) => <HomePage handleToken={this.handleToken} token={this.state.token}
                          {...routerProps} />} 
                      />
                      <Route 
                          path="/quiz" 
                          exact
                          render={(routerProps) => <QuizPage handleToken={this.handleToken} token={this.state.token}
                          {...routerProps} />} 
                      />
                      <Route 
                        path="/favorites" 
                        exact
                        render={(routerProps) => <FavoritesPage handleToken={this.handleToken} token={this.state.token}
                        {...routerProps} />} 
                      />
                      <Route 
                          path="/detail/:id" 
                          exact
                          render={(routerProps) => <DetailPage handleToken={this.handleToken} token={this.state.token}
                          {...routerProps} />} 
                      />
                      <Route 
                          path="/about" 
                          exact
                          render={(routerProps) => <AboutUsPage handleToken={this.handleToken} token={this.state.token}
                          {...routerProps} />} 
                      />
                  </Switch>
                </main>
              </Router>
          </div>
      )
  }
}
