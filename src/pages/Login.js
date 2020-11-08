import React, { Component } from "react";
import { signin } from "../helpers/auth";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: "" });
    try {
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
        <div className="account-pages my-5 pt-sm-5">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 col-xl-5">
                    <div className="text-center mb-4">
                        <a href="/" className="auth-logo mb-5 d-block">
                            <img src="assets/images/logo-dark.png" alt="" height="30" className="logo logo-dark"/>
                            <img src="assets/images/logo-light.png" alt="" height="30" className="logo logo-light"/>
                        </a>

                        <h4>Sign in</h4>
                        <p className="text-muted mb-4">Sign in to continue to Chatvia.</p>
                        
                    </div>

                    <div className="card">
                        <div className="card-body p-4">
                            <div className="p-3">
                                <form autoComplete="off"
                                onSubmit={this.handleSubmit}>

                                    <div className="form-group">
                                        <label>Username</label>
                                        <div className="input-group mb-3 bg-soft-light input-group-lg rounded-lg">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text border-light text-muted">
                                                    <i className="ri-user-2-line"></i>
                                                </span>
                                            </div>
                                            <input
                                            className="form-control bg-soft-light border-light"
                                            placeholder="Enter Username"
                                            name="email"
                                            type="email"
                                            onChange={this.handleChange}
                                            value={this.state.email}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mb-4">
                                        <div className="float-right">
                                            <a href="/forgotpassward" className="text-muted font-size-13">Forgot password?</a>
                                        </div>
                                        <label>Password</label>
                                        <div className="input-group mb-3 bg-soft-light input-group-lg rounded-lg">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text border-light text-muted">
                                                    <i className="ri-lock-2-line"></i>
                                                </span>
                                            </div>
                                            <input
                                            className="form-control bg-soft-light border-light"
                                            placeholder="Enter Password"
                                            name="password"
                                            onChange={this.handleChange}
                                            value={this.state.password}
                                            type="password"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        {this.state.error ? (
                                        <p className="text-danger">{this.state.error}</p>
                                        ) : null}
                                    </div>
                                    <div className="custom-control custom-checkbox mb-4">
                                        <input type="checkbox" className="custom-control-input" id="remember-check"/>
                                        <label className="custom-control-label" for="remember-check">Remember me</label>
                                    </div>

                                    <div>
                                        <button className="btn btn-primary btn-block waves-effect waves-light" type="submit">Sign in</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <p>Don't have an account ? <a href="/signup" className="font-weight-medium text-primary"> Signup now </a> </p>
                        <p>© 2020 Chatvia. Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  }
}