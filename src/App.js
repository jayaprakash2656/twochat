import React, { Component } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Forgorpassword from "./pages/Forgotpassword";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { auth } from "./services/firebase";
// import "bootstrap/dist/css/bootstrap.css";
import "../src/asset/style/app.css"
// import "../src/asset/style/appdark.css"
import "../src/asset/style/bootstrap.css"
import "../src/asset/style/coursole.css"
// import "../src/asset/style/bootstrapdark.css"
import "../src/asset/style/icon.css"
import { addUser } from "./helpers/db";

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/chat" />
        )
      }
    />
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true,
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if (user) {
        addUser(user);
        this.setState({
          authenticated: true,
          loading: false,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    });
  }

  render() {
    // return (
    return this.state.loading === true ? (
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
      <Router>
        <Switch>
        <PrivateRoute
            path="/chat"
            authenticated={this.state.authenticated}
            component={Chat}
          />
        <PublicRoute
            path="/signup"
            authenticated={this.state.authenticated}
            component={Signup}
          />
        <PublicRoute
            path="/login"
            authenticated={this.state.authenticated}
            component={Login}
          />
          <PublicRoute
            path="/forgotpassward"
            authenticated={this.state.authenticated}
            component={Forgorpassword}
          />
          <PublicRoute
            path="/"
            authenticated={this.state.authenticated}
            component={Login}
          />
          {/* <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login}/>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/forgotpassward" component={Forgorpassword}/>
          <Route exact path="/chat" component={Chat}/> */}
        </Switch>
      </Router>
    );
  }
}

export default App;