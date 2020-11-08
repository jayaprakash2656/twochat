import React, { Component } from "react";

export default class Forgotpassword extends Component {

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

                        <h4>Reset Password</h4>
                        <p className="text-muted mb-4">Reset Password With Chatvia.</p>
                        
                    </div>

                    <div className="card">
                        <div className="card-body p-4">
                            <div className="p-3">
                                <div className="alert alert-success text-center mb-4" role="alert">
                                    Enter your Email and instructions will be sent to you!
                                </div>
                                <form action="/">

                                    <div className="form-group mb-4">
                                        <label>Email</label>
                                        <div className="input-group mb-3 bg-soft-light input-group-lg rounded-lg">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text border-light text-muted">
                                                    <i className="ri-mail-line"></i>
                                                </span>
                                            </div>
                                            <input type="email" className="form-control bg-soft-light border-light" placeholder="Enter Email"/>
                                            
                                        </div>
                                    </div>

                                    <div>
                                        <button className="btn btn-primary btn-block waves-effect waves-light" type="submit">Reset</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <p>Remember It ? <a href="/" className="font-weight-medium text-primary"> Signin </a> </p>
                        <p>© 2020 Chatvia. Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  }
}