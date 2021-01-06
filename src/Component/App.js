import React, { Component } from 'react';
import './global/css/App.css';

import { Switch, Route, Redirect, BrowserRouter} from "react-router-dom";
import CheckCollection from "./CheckCollection";
import NewCollection from "./NewCollection";
import Login from "./Login";
import NotFound from "./global/NotFound";

const isLogged = () => {
  const user = localStorage.getItem('user')
  if(!user) return false
  return true
}

const AuthRoute = ({component: Component, ...rest}) => {
  return <Route {...rest} render = {props => (
    isLogged() ? (
    <Component {...props}/>
    ) : 
    (
    <Redirect to={{pathname: '/login'}}/>
    )
  )}/>
}

const AuthRoute2 = ({component: Component, ...rest}) => {
  return <Route {...rest} render = {props => (
    isLogged() ?(
      <Redirect to={{pathname: '/'}}/>
      ) : 
    (
      <Component {...props}/>
      ) 
  )}/>
}
class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <AuthRoute2 exact path="/login" component={Login} />
            <AuthRoute exact path="/nueva" component={NewCollection} />
            <AuthRoute exact path="/" component={CheckCollection} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
