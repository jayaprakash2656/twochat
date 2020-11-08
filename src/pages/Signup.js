import React, { Component } from "react";
import { signup } from "../helpers/auth";

export default class SignUp extends Component {
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
      await signup(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
        <div class="account-pages my-5 pt-sm-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-6 col-xl-5">
                        <div class="text-center mb-4">
                            <a href="/" class="auth-logo mb-5 d-block">
                                <img src="assets/images/logo-dark.png" alt="" height="30" class="logo logo-dark"/>
                                <img src="assets/images/logo-light.png" alt="" height="30" class="logo logo-light"/>
                            </a>

                            <h4>Sign up</h4>
                            <p class="text-muted mb-4">Get your Chatvia account now.</p>
                            
                        </div>

                        <div class="card">
                            <div class="card-body p-4">
                                <div class="p-3">
                                    <form onSubmit={this.handleSubmit}>

                                        <div class="form-group">
                                            <label>Email</label>
                                            <div class="input-group mb-3 bg-soft-light input-group-lg rounded-lg">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text border-light text-muted">
                                                        <i class="ri-mail-line"></i>
                                                    </span>
                                                </div>
                                                <input
                                                className="form-control bg-soft-light border-light"
                                                placeholder="Enter Email"
                                                name="email"
                                                type="email"
                                                onChange={this.handleChange}
                                                value={this.state.email}
                                                ></input>
                                            </div>
                                        </div>

                                        <div class="form-group mb-4">
                                            <label>Password</label>
                                            <div class="input-group mb-3 bg-soft-light input-group-lg rounded-lg">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text border-light text-muted">
                                                        <i class="ri-lock-2-line"></i>
                                                    </span>
                                                </div>
                                                <input
                                                className="form-control bg-soft-light border-light"
                                                placeholder="Enter Password"
                                                name="password"
                                                onChange={this.handleChange}
                                                value={this.state.password}
                                                type="password"
                                                ></input>
                                            </div>
                                        </div>


                                        <div>
                                            <button class="btn btn-primary btn-block waves-effect waves-light" type="submit">Sign up</button>
                                        </div>

                                        <div class="mt-4 text-center">
                                            <p class="text-muted mb-0">By registering you agree to the Chatvia <a href="/" class="text-primary">Terms of Use</a></p>
                                        </div>
                                        
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div class="mt-5 text-center">
                            <p>Already have an account ? <a href="/login" class="font-weight-medium text-primary"> Signin </a> </p>
                            <p>© 2020 Chatvia. Crafted with <i class="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}