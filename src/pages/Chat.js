import React, { Component } from "react";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { auth } from "../services/firebase";
// import { HashLink } from 'react-router-hash-link';
import { db } from "../services/firebase";
import { writeChats } from "../helpers/db";

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth().currentUser,
            chats: [],
            users: [],
            content: "",
            readError: null,
            writeError: null,
            loadingChats: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.myRef = React.createRef();
    }

    async componentDidMount() {
        this.setState({ readError: null, loadingChats: true });
        // const chatArea = this.myRef.current;
        try {
            db.ref("chats").on("value", (snapshot) => {
                let chats = [];
                snapshot.forEach((snap) => {
                    chats.push(snap.val());
                });
                chats.sort(function (a, b) {
                    return a.timestamp - b.timestamp;
                });
                this.setState({ chats });
                // chatArea.scrollBy(0, chatArea.scrollHeight);
                this.setState({ loadingChats: false });
            });
        } catch (error) {
            this.setState({ readError: error.message, loadingChats: false });
        }
        try {
            db.ref("users").on("value", (snapshot) => {
                let users = [];
                snapshot.forEach((snap) => {
                    users.push(snap.val());
                });
                this.setState({ users });
            });
        } catch (error) {
            this.setState({ readError: error.message, loadingChats: false });
        }
    }

    handleChange(event) {
        this.setState({
            content: event.target.value,
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ writeError: null });
        // const chatArea = this.myRef.current;
        const message = {
            content: this.state.content,
            timestamp: Date.now(),
            uid: this.state.user.uid,
            email: this.state.user.email,
        };
        try {
            await writeChats(message);
            this.setState({ content: "" });
            // chatArea.scrollBy(0, chatArea.scrollHeight);
        } catch (error) {
            this.setState({ writeError: error.message });
        }
    }

    formatTime(timestamp) {
        const d = new Date(timestamp);
        const time = `${d.getDate()}/${
            d.getMonth() + 1
            }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
        return time;
    }
    render() {
        return (

            <div className="layout-wrapper d-lg-flex">

                <div className="side-menu flex-lg-column mr-lg-1">
                    <div className="navbar-brand-box">
                        <a href="index.html" className="logo logo-dark">
                            <span className="logo-sm">
                                <img src="assets/images/logo.svg" alt="" height="30" />
                            </span>
                        </a>

                        <a href="index.html" className="logo logo-light">
                            <span className="logo-sm">
                                <img src="assets/images/logo.svg" alt="" height="30" />
                            </span>
                        </a>
                    </div>

                    <div className="flex-lg-column my-auto">
                        <ul className="nav nav-pills side-menu-nav justify-content-center" role="tablist">
                            <li className="nav-item" data-toggle="tooltip" data-trigger="hover" data-placement="top" title="Profile">
                                <a className="nav-link" id="pills-user-tab" data-toggle="pill" href="#pills-user" role="tab">
                                    <i className="ri-user-2-line"></i>
                                </a>
                            </li>
                            <li className="nav-item" data-toggle="toolt#pills-chatip" data-trigger="hover#pills-chat" data-placement="top" title="Chats">
                                <a className="nav-link active" id="pills-chat-tab" data-toggle="pill" href="#pills-chat" role="tab">
                                    <i className="ri-message-3-line"></i>
                                </a>
                            </li>
                            <li className="nav-item" data-toggle="tooltip" data-trigger="hover" data-placement="top" title="Groups">
                                <a className="nav-link" id="pills-groups-tab" data-toggle="pill" href="#pills-groups" role="tab">
                                    <i className="ri-group-line"></i>
                                </a>
                            </li>
                            <li className="nav-item" data-toggle="tooltip" data-trigger="hover" data-placement="top" title="Contacts">
                                <a className="nav-link" id="pills-contacts-tab" data-toggle="pill" href="#pills-contacts" role="tab">
                                    <i className="ri-contacts-line"></i>
                                </a>
                            </li>
                            <li className="nav-item" data-toggle="tooltip" data-trigger="hover" data-placement="top" title="Settings">
                                <a className="nav-link" id="pills-setting-tab" data-toggle="pill" href="#pills-setting" role="tab">
                                    <i className="ri-settings-2-line"></i>
                                </a>
                            </li>
                            <li className="nav-item dropdown profile-user-dropdown d-inline-block d-lg-none">
                                <a className="nav-link dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                    <img src="assets/images/users/avatar-1.jpg" alt="" className="profile-user rounded-circle" />
                                </a>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="/chat">Profile <i className="ri-profile-line float-right text-muted"></i></a>
                                    <a className="dropdown-item" href="/chat">Setting <i className="ri-settings-3-line float-right text-muted"></i></a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="/chat">Log out <i className="ri-logout-circle-r-line float-right text-muted"></i></a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="flex-lg-column d-none d-lg-block">
                        <ul className="nav side-menu-nav justify-content-center">
                            <li className="nav-item">
                                <a className="nav-link" id="light-dark" href="/chat" data-toggle="tooltip" data-trigger="hover" data-placement="right" title="Dark / Light Mode">
                                    <i className="ri-sun-line theme-mode-icon"></i>
                                </a>
                            </li>

                            <li className="nav-item btn-group dropup profile-user-dropdown">
                                <a className="nav-link dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                    <img src="assets/images/users/avatar-1.jpg" alt="" className="profile-user rounded-circle" />
                                </a>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="/chat">Profile <i className="ri-profile-line float-right text-muted"></i></a>
                                    <a className="dropdown-item" href="/chat">Setting <i className="ri-settings-3-line float-right text-muted"></i></a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="/chat">Log out <i className="ri-logout-circle-r-line float-right text-muted"></i></a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="chat-leftsidebar mr-lg-1">

                    <div className="tab-content">
                        <div className="tab-pane" id="pills-user" role="tabpanel" aria-labelledby="pills-user-tab">
                            <div>
                                <div className="px-4 pt-4">
                                    <div className="user-chat-nav float-right">
                                        <div className="dropdown">
                                            <a href="/chat" className="font-size-18 text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                <i className="ri-more-2-fill"></i>
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a className="dropdown-item" href="/chat">Edit</a>
                                                <a className="dropdown-item" href="/chat">Action</a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item" href="/chat">Another action</a>
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="mb-0">My Profile</h4>
                                </div>

                                <div className="text-center p-4 border-bottom">
                                    <div className="mb-4">
                                        <img src="assets/images/users/avatar-1.jpg" className="rounded-circle avatar-lg img-thumbnail" alt="" />
                                    </div>

                                    <h5 className="font-size-16 mb-1 text-truncate">Patricia Smith</h5>
                                    <p className="text-muted text-truncate mb-1"><i className="ri-record-circle-fill font-size-10 text-success mr-1 d-inline-block"></i> Active</p>
                                </div>
                                <SimpleBar className="p-4 user-profile-desc" data-simplebar>
                                    <div className="text-muted">
                                        <p className="mb-4">If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual.</p>
                                    </div>


                                    <div id="profile-user-accordion-1" className="custom-accordion">
                                        <div className="card shadow-none border mb-2">
                                            <a href="#profile-user-collapseOne" className="text-dark" data-toggle="collapse"
                                                aria-expanded="true"
                                                aria-controls="profile-user-collapseOne">
                                                <div className="card-header" id="profile-user-headingOne">
                                                    <h5 className="font-size-14 m-0">
                                                        <i className="ri-user-2-line mr-2 align-middle d-inline-block"></i> About
                                                    <i className="mdi mdi-chevron-up float-right accor-plus-icon"></i>
                                                    </h5>
                                                </div>
                                            </a>

                                            <div id="profile-user-collapseOne" className="collapse show"
                                                aria-labelledby="profile-user-headingOne" data-parent="#profile-user-accordion-1">
                                                <div className="card-body">

                                                    <div>
                                                        <p className="text-muted mb-1">Name</p>
                                                        <h5 className="font-size-14">Patricia Smith</h5>
                                                    </div>

                                                    <div className="mt-4">
                                                        <p className="text-muted mb-1">Email</p>
                                                        <h5 className="font-size-14">adc@123.com</h5>
                                                    </div>

                                                    <div className="mt-4">
                                                        <p className="text-muted mb-1">Time</p>
                                                        <h5 className="font-size-14">11:40 AM</h5>
                                                    </div>

                                                    <div className="mt-4">
                                                        <p className="text-muted mb-1">Location</p>
                                                        <h5 className="font-size-14 mb-0">California, USA</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card mb-1 shadow-none border">
                                            <a href="#profile-user-collapseTwo" className="text-dark collapsed" data-toggle="collapse"
                                                aria-expanded="false"
                                                aria-controls="profile-user-collapseTwo">
                                                <div className="card-header" id="profile-user-headingTwo">
                                                    <h5 className="font-size-14 m-0">
                                                        <i className="ri-attachment-line mr-2 align-middle d-inline-block"></i> Attached Files
                                                    <i className="mdi mdi-chevron-up float-right accor-plus-icon"></i>
                                                    </h5>
                                                </div>
                                            </a>
                                            <div id="profile-user-collapseTwo" className="collapse" aria-labelledby="profile-user-headingTwo"
                                                data-parent="#profile-user-accordion-1">
                                                <div className="card-body">
                                                    <div className="card p-2 border mb-2">
                                                        <div className="media align-items-center">
                                                            <div className="avatar-sm mr-3">
                                                                <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                                                    <i className="ri-file-text-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div className="media-body">
                                                                <div className="text-left">
                                                                    <h5 className="font-size-14 mb-1">Admin-A.zip</h5>
                                                                    <p className="text-muted font-size-13 mb-0">12.5 MB</p>
                                                                </div>
                                                            </div>

                                                            <div className="ml-4">
                                                                <ul className="list-inline mb-0 font-size-18">
                                                                    <li className="list-inline-item">
                                                                        <a href="/chat" className="text-muted px-1">
                                                                            <i className="ri-download-2-line"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li className="list-inline-item dropdown">
                                                                        <a className="dropdown-toggle text-muted px-1" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                            <i className="ri-more-fill"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-right">
                                                                            <a className="dropdown-item" href="/chat">Action</a>
                                                                            <a className="dropdown-item" href="/chat">Another action</a>
                                                                            <div className="dropdown-divider"></div>
                                                                            <a className="dropdown-item" href="/chat">Delete</a>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="card p-2 border mb-2">
                                                        <div className="media align-items-center">
                                                            <div className="avatar-sm mr-3">
                                                                <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                                                    <i className="ri-image-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div className="media-body">
                                                                <div className="text-left">
                                                                    <h5 className="font-size-14 mb-1">Image-1.jpg</h5>
                                                                    <p className="text-muted font-size-13 mb-0">4.2 MB</p>
                                                                </div>
                                                            </div>

                                                            <div className="ml-4">
                                                                <ul className="list-inline mb-0 font-size-18">
                                                                    <li className="list-inline-item">
                                                                        <a href="/chat" className="text-muted px-1">
                                                                            <i className="ri-download-2-line"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li className="list-inline-item dropdown">
                                                                        <a className="dropdown-toggle text-muted px-1" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                            <i className="ri-more-fill"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-right">
                                                                            <a className="dropdown-item" href="/chat">Action</a>
                                                                            <a className="dropdown-item" href="/chat">Another action</a>
                                                                            <div className="dropdown-divider"></div>
                                                                            <a className="dropdown-item" href="/chat">Delete</a>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="card p-2 border mb-2">
                                                        <div className="media align-items-center">
                                                            <div className="avatar-sm mr-3">
                                                                <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                                                    <i className="ri-image-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div className="media-body">
                                                                <div className="text-left">
                                                                    <h5 className="font-size-14 mb-1">Image-2.jpg</h5>
                                                                    <p className="text-muted font-size-13 mb-0">3.1 MB</p>
                                                                </div>
                                                            </div>

                                                            <div className="ml-4">
                                                                <ul className="list-inline mb-0 font-size-18">
                                                                    <li className="list-inline-item">
                                                                        <a href="/chat" className="text-muted px-1">
                                                                            <i className="ri-download-2-line"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li className="list-inline-item dropdown">
                                                                        <a className="dropdown-toggle text-muted px-1" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                            <i className="ri-more-fill"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-right">
                                                                            <a className="dropdown-item" href="/chat">Action</a>
                                                                            <a className="dropdown-item" href="/chat">Another action</a>
                                                                            <div className="dropdown-divider"></div>
                                                                            <a className="dropdown-item" href="/chat">Delete</a>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="card p-2 border mb-2">
                                                        <div className="media align-items-center">
                                                            <div className="avatar-sm mr-3">
                                                                <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                                                    <i className="ri-file-text-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div className="media-body">
                                                                <div className="text-left">
                                                                    <h5 className="font-size-14 mb-1">Landing-A.zip</h5>
                                                                    <p className="text-muted font-size-13 mb-0">6.7 MB</p>
                                                                </div>
                                                            </div>

                                                            <div className="ml-4">
                                                                <ul className="list-inline mb-0 font-size-18">
                                                                    <li className="list-inline-item">
                                                                        <a href="/chat" className="text-muted px-1">
                                                                            <i className="ri-download-2-line"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li className="list-inline-item dropdown">
                                                                        <a className="dropdown-toggle text-muted px-1" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                            <i className="ri-more-fill"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-right">
                                                                            <a className="dropdown-item" href="/chat">Action</a>
                                                                            <a className="dropdown-item" href="/chat">Another action</a>
                                                                            <div className="dropdown-divider"></div>
                                                                            <a className="dropdown-item" href="/chat">Delete</a>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </SimpleBar>
                            </div>
                        </div>

                        <div className="tab-pane fade show active" id="pills-chat" role="tabpanel" aria-labelledby="pills-chat-tab">
                            <div>
                                <div className="px-4 pt-4">
                                    <h4 className="mb-4">Chats</h4>
                                    <div className="search-box chat-search-box">
                                        <div className="input-group mb-3 bg-light  input-group-lg rounded-lg">
                                            <div className="input-group-prepend">
                                                <button className="btn btn-link text-muted pr-1 text-decoration-none" type="button">
                                                    <i className="ri-search-line search-icon font-size-18"></i>
                                                </button>
                                            </div>
                                            <input type="text" className="form-control bg-light" placeholder="Search messages or users" />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 pb-4" dir="ltr">

                                    <div className="owl-carousel owl-theme" id="user-status-carousel">
                                        <div className="item">
                                            <a href="/chat" className="user-status-box">
                                                <div className="avatar-xs mx-auto d-block chat-user-img online">
                                                    <img src="assets/images/users/avatar-2.jpg" alt="user-img" className="img-fluid rounded-circle" />
                                                    <span className="user-status"></span>
                                                </div>

                                                <h5 className="font-size-13 text-truncate mt-3 mb-1">Patrick</h5>
                                            </a>
                                        </div>
                                        <div className="item">
                                            <a href="/chat" className="user-status-box">
                                                <div className="avatar-xs mx-auto d-block chat-user-img online">
                                                    <img src="assets/images/users/avatar-4.jpg" alt="user-img" className="img-fluid rounded-circle" />
                                                    <span className="user-status"></span>
                                                </div>

                                                <h5 className="font-size-13 text-truncate mt-3 mb-1">Doris</h5>
                                            </a>
                                        </div>

                                        <div className="item">
                                            <a href="/chat" className="user-status-box">
                                                <div className="avatar-xs mx-auto d-block chat-user-img online">
                                                    <img src="assets/images/users/avatar-5.jpg" alt="user-img" className="img-fluid rounded-circle" />
                                                    <span className="user-status"></span>
                                                </div>

                                                <h5 className="font-size-13 text-truncate mt-3 mb-1">Emily</h5>
                                            </a>
                                        </div>

                                        <div className="item">
                                            <a href="/chat" className="user-status-box">
                                                <div className="avatar-xs mx-auto d-block chat-user-img online">
                                                    <img src="assets/images/users/avatar-6.jpg" alt="user-img" className="img-fluid rounded-circle" />
                                                    <span className="user-status"></span>
                                                </div>

                                                <h5 className="font-size-13 text-truncate mt-3 mb-1">Steve</h5>
                                            </a>
                                        </div>

                                        <div className="item">
                                            <a href="/chat" className="user-status-box">
                                                <div className="avatar-xs mx-auto d-block chat-user-img online">
                                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                        T
                                                </span>
                                                    <span className="user-status"></span>
                                                </div>

                                                <h5 className="font-size-13 text-truncate mt-3 mb-1">Teresa</h5>
                                            </a>
                                        </div>

                                    </div>
                                </div>

                                <div className="px-2">
                                    <h5 className="mb-3 px-3 font-size-16">Recent</h5>

                                    <SimpleBar className="chat-message-list">

                                        <ul className="list-unstyled chat-list chat-user-list">
                                            <li>
                                                <a href="/chat">
                                                    <div className="media">

                                                        <div className="chat-user-img align-self-center mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    P
                                                            </span>
                                                            </div>
                                                        </div>

                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Patrick Hendricks</h5>
                                                            <p className="chat-user-message text-truncate mb-0">Hey! there I'm available</p>
                                                        </div>
                                                        <div className="font-size-11">05 min</div>
                                                    </div>
                                                </a>
                                            </li>

                                            <li className="unread">
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    M
                                                            </span>
                                                            </div>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Mark Messer</h5>
                                                            <p className="chat-user-message text-truncate mb-0"><i className="ri-image-fill align-middle mr-1"></i> Images</p>
                                                        </div>
                                                        <div className="font-size-11">12 min</div>

                                                        <div className="unread-message">
                                                            <span className="badge badge-soft-danger badge-pill">02</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>

                                            <li>
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    G
                                                            </span>
                                                            </div>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">General</h5>
                                                            <p className="chat-user-message text-truncate mb-0">This theme is awesome!</p>
                                                        </div>
                                                        <div className="font-size-11">20 min</div>
                                                    </div>
                                                </a>
                                            </li>

                                            <li className="active">
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    G
                                                            </span>
                                                            </div>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Broadcast</h5>
                                                            <p className="chat-user-message text-truncate mb-0">Nice to meet you</p>
                                                        </div>
                                                        <div className="font-size-11">10:12 AM</div>

                                                    </div>
                                                </a>
                                            </li>
                                            <li className="unread">
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    D
                                                            </span>
                                                            </div>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Designer</h5>
                                                            <p className="chat-user-message text-truncate mb-0">Next meeting tomorrow 10.00AM</p>
                                                        </div>
                                                        <div className="font-size-11">12:01 PM</div>
                                                        <div className="unread-message">
                                                            <span className="badge badge-soft-danger badge-pill">01</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    S
                                                            </span>
                                                            </div>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Steve Walker</h5>
                                                            <p className="chat-user-message text-truncate mb-0"><i className="ri-file-text-fill align-middle mr-1"></i> Admin-A.zip</p>
                                                        </div>
                                                        <div className="font-size-11">03:20 PM</div>

                                                    </div>
                                                </a>
                                            </li>
                                            <li className="typing">
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center online mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    A
                                                            </span>
                                                            </div>
                                                            <span className="user-status"></span>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Albert Rodarte</h5>
                                                            <p className="chat-user-message text-truncate mb-0">typing<span className="animate-typing">
                                                                <span className="dot"></span>
                                                                <span className="dot"></span>
                                                                <span className="dot"></span>
                                                            </span></p>
                                                        </div>
                                                        <div className="font-size-11">04:56 PM</div>
                                                    </div>
                                                </a>
                                            </li>

                                            <li>
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center online mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    M
                                                            </span>
                                                            </div>
                                                            <span className="user-status"></span>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Mirta George</h5>
                                                            <p className="chat-user-message text-truncate mb-0">Yeah everything is fine</p>
                                                        </div>
                                                        <div className="font-size-11">12/07</div>

                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    P
                                                            </span>
                                                            </div>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Paul Haynes</h5>
                                                            <p className="chat-user-message text-truncate mb-0">Good morning</p>
                                                        </div>
                                                        <div className="font-size-11">12/07</div>

                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center online mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    J
                                                            </span>
                                                            </div>
                                                            <span className="user-status"></span>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Jonathan Miller</h5>
                                                            <p className="chat-user-message text-truncate mb-0">Hi, How are you?</p>
                                                        </div>
                                                        <div className="font-size-11">12/07</div>

                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    O
                                                            </span>
                                                            </div>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Ossie Wilson</h5>
                                                            <p className="chat-user-message text-truncate mb-0">I've finished it! See you so</p>
                                                        </div>
                                                        <div className="font-size-11">11/07</div>

                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/chat">
                                                    <div className="media">
                                                        <div className="chat-user-img align-self-center online mr-3">
                                                            <div className="avatar-xs">
                                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                    S
                                                            </span>
                                                            </div>
                                                            <span className="user-status"></span>
                                                        </div>
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="text-truncate font-size-15 mb-1">Sara Muller</h5>
                                                            <p className="chat-user-message text-truncate mb-0">Wow that's great</p>
                                                        </div>
                                                        <div className="font-size-11">11/07</div>

                                                    </div>
                                                </a>
                                            </li>


                                        </ul>
                                    </SimpleBar>
                                </div>
                            </div>
                        </div>

                        <div className="tab-pane" id="pills-groups" role="tabpanel" aria-labelledby="pills-groups-tab">
                            <div>
                                <div className="p-4">
                                    <div className="user-chat-nav float-right">
                                        <div data-toggle="tooltip" data-placement="bottom" title="Create group">
                                            <button type="button" className="btn btn-link text-decoration-none text-muted font-size-18 py-0" data-toggle="modal" data-target="#addgroup-exampleModal">
                                                <i className="ri-group-line mr-1"></i>
                                            </button>
                                        </div>

                                    </div>
                                    <h4 className="mb-4">Groups</h4>

                                    <div className="modal fade" id="addgroup-exampleModal" tabindex="-1" role="dialog" aria-labelledby="addgroup-exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title font-size-16" id="addgroup-exampleModalLabel">Create New Group</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body p-4">
                                                    <form>
                                                        <div className="form-group mb-4">
                                                            <label for="addgroupname-input">Group Name</label>
                                                            <input type="text" className="form-control" id="addgroupname-input" placeholder="Enter Group Name" />
                                                        </div>
                                                        <div className="form-group mb-4">
                                                            <label>Group Members</label>
                                                            <div className="mb-3">
                                                                <button className="btn btn-light btn-sm" type="button" data-toggle="collapse" data-target="#groupmembercollapse" aria-expanded="false" aria-controls="groupmembercollapse">
                                                                    Select Members
                                                            </button>
                                                            </div>

                                                            <div className="collapse" id="groupmembercollapse">
                                                                <div className="card border">
                                                                    <div className="card-header">
                                                                        <h5 className="font-size-15 mb-0">Contacts</h5>
                                                                    </div>
                                                                    <div className="card-body p-2">
                                                                        <SimpleBar data-simplebar style={{ maxHeight: 150 }}>
                                                                            <div>
                                                                                <div className="p-3 font-weight-bold text-primary">
                                                                                    A
                                                                            </div>

                                                                                <ul className="list-unstyled contact-list">
                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck1" checked />
                                                                                            <label className="custom-control-label" for="memberCheck1">Albert Rodarte</label>
                                                                                        </div>
                                                                                    </li>

                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck2" />
                                                                                            <label className="custom-control-label" for="memberCheck2">Allison Etter</label>
                                                                                        </div>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>

                                                                            <div>
                                                                                <div className="p-3 font-weight-bold text-primary">
                                                                                    C
                                                                            </div>

                                                                                <ul className="list-unstyled contact-list">
                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck3" />
                                                                                            <label className="custom-control-label" for="memberCheck3">Craig Smiley</label>
                                                                                        </div>
                                                                                    </li>

                                                                                </ul>
                                                                            </div>

                                                                            <div>
                                                                                <div className="p-3 font-weight-bold text-primary">
                                                                                    D
                                                                            </div>

                                                                                <ul className="list-unstyled contact-list">
                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck4" />
                                                                                            <label className="custom-control-label" for="memberCheck4">Daniel Clay</label>
                                                                                        </div>
                                                                                    </li>

                                                                                </ul>
                                                                            </div>

                                                                            <div>
                                                                                <div className="p-3 font-weight-bold text-primary">
                                                                                    I
                                                                            </div>

                                                                                <ul className="list-unstyled contact-list">
                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck5" />
                                                                                            <label className="custom-control-label" for="memberCheck5">Iris Wells</label>
                                                                                        </div>
                                                                                    </li>

                                                                                </ul>
                                                                            </div>

                                                                            <div>
                                                                                <div className="p-3 font-weight-bold text-primary">
                                                                                    J
                                                                            </div>

                                                                                <ul className="list-unstyled contact-list">
                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck6" />
                                                                                            <label className="custom-control-label" for="memberCheck6">Juan Flakes</label>
                                                                                        </div>
                                                                                    </li>

                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck7" />
                                                                                            <label className="custom-control-label" for="memberCheck7">John Hall</label>
                                                                                        </div>
                                                                                    </li>

                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck8" />
                                                                                            <label className="custom-control-label" for="memberCheck8">Joy Southern</label>
                                                                                        </div>
                                                                                    </li>

                                                                                </ul>
                                                                            </div>

                                                                            <div>
                                                                                <div className="p-3 font-weight-bold text-primary">
                                                                                    M
                                                                            </div>

                                                                                <ul className="list-unstyled contact-list">
                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck9" />
                                                                                            <label className="custom-control-label" for="memberCheck9">Michael Hinton</label>
                                                                                        </div>
                                                                                    </li>

                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck10" />
                                                                                            <label className="custom-control-label" for="memberCheck10">Mary Farmer</label>
                                                                                        </div>
                                                                                    </li>

                                                                                </ul>
                                                                            </div>

                                                                            <div>
                                                                                <div className="p-3 font-weight-bold text-primary">
                                                                                    P
                                                                            </div>

                                                                                <ul className="list-unstyled contact-list">
                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck11" />
                                                                                            <label className="custom-control-label" for="memberCheck11">Phillis Griffin</label>
                                                                                        </div>
                                                                                    </li>

                                                                                </ul>
                                                                            </div>

                                                                            <div>
                                                                                <div className="p-3 font-weight-bold text-primary">
                                                                                    R
                                                                            </div>

                                                                                <ul className="list-unstyled contact-list">
                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck12" />
                                                                                            <label className="custom-control-label" for="memberCheck12">Rocky Jackson</label>
                                                                                        </div>
                                                                                    </li>

                                                                                </ul>
                                                                            </div>

                                                                            <div>
                                                                                <div className="p-3 font-weight-bold text-primary">
                                                                                    S
                                                                            </div>

                                                                                <ul className="list-unstyled contact-list">
                                                                                    <li>
                                                                                        <div className="custom-control custom-checkbox">
                                                                                            <input type="checkbox" className="custom-control-input" id="memberCheck13" />
                                                                                            <label className="custom-control-label" for="memberCheck13">Simon Velez</label>
                                                                                        </div>
                                                                                    </li>

                                                                                </ul>
                                                                            </div>
                                                                        </SimpleBar>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="addgroupdescription-input">Description</label>
                                                            <textarea className="form-control" id="addgroupdescription-input" rows="3" placeholder="Enter Description"></textarea>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-link" data-dismiss="modal">Close</button>
                                                    <button type="button" className="btn btn-primary">Create Groups</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="search-box chat-search-box">
                                        <div className="input-group bg-light  input-group-lg rounded-lg">
                                            <div className="input-group-prepend">
                                                <button className="btn btn-link text-decoration-none text-muted pr-1" type="button">
                                                    <i className="ri-search-line search-icon font-size-18"></i>
                                                </button>
                                            </div>
                                            <input type="text" className="form-control bg-light" placeholder="Search groups..." />
                                        </div>
                                    </div>
                                </div>

                                <SimpleBar className="p-4 chat-message-list chat-group-list" data-simplebar>


                                    <ul className="list-unstyled chat-list">
                                        <li>
                                            <a href="/chat">
                                                <div className="media align-items-center">
                                                    <div className="chat-user-img mr-3">
                                                        <div className="avatar-xs">
                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                G
                                                        </span>
                                                        </div>
                                                    </div>
                                                    <div className="media-body overflow-hidden">
                                                        <h5 className="text-truncate font-size-14 mb-0">#General</h5>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/chat">
                                                <div className="media align-items-center">
                                                    <div className="chat-user-img mr-3">
                                                        <div className="avatar-xs">
                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                R
                                                        </span>
                                                        </div>
                                                    </div>
                                                    <div className="media-body overflow-hidden">
                                                        <h5 className="text-truncate font-size-14 mb-0">#Reporting <span className="badge badge-soft-danger badge-pill float-right">+23</span></h5>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/chat">
                                                <div className="media align-items-center">
                                                    <div className="chat-user-img mr-3">
                                                        <div className="avatar-xs">
                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                D
                                                        </span>
                                                        </div>
                                                    </div>
                                                    <div className="media-body overflow-hidden">
                                                        <h5 className="text-truncate font-size-14 mb-0">#Designers</h5>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/chat">
                                                <div className="media align-items-center">
                                                    <div className="chat-user-img mr-3">
                                                        <div className="avatar-xs">
                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                D
                                                        </span>
                                                        </div>
                                                    </div>
                                                    <div className="media-body overflow-hidden">
                                                        <h5 className="text-truncate font-size-14 mb-0">#Developers <span className="badge badge-soft-danger badge-pill float-right">New</span></h5>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/chat">
                                                <div className="media align-items-center">
                                                    <div className="chat-user-img mr-3">
                                                        <div className="avatar-xs">
                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                P
                                                        </span>
                                                        </div>
                                                    </div>
                                                    <div className="media-body overflow-hidden">
                                                        <h5 className="text-truncate font-size-14 mb-0">#Project-alpha</h5>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/chat">
                                                <div className="media align-items-center">
                                                    <div className="chat-user-img mr-3">
                                                        <div className="avatar-xs">
                                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                B
                                                        </span>
                                                        </div>
                                                    </div>
                                                    <div className="media-body overflow-hidden">
                                                        <h5 className="text-truncate font-size-14 mb-0">#Snacks</h5>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </SimpleBar>
                            </div>
                        </div>

                        <div className="tab-pane" id="pills-contacts" role="tabpanel" aria-labelledby="pills-contacts-tab">
                            <div>
                                <div className="p-4">
                                    <div className="user-chat-nav float-right">
                                        <div data-toggle="tooltip" data-placement="bottom" title="Add Contact">
                                            <button type="button" className="btn btn-link text-decoration-none text-muted font-size-18 py-0" data-toggle="modal" data-target="#addContact-exampleModal">
                                                <i className="ri-user-add-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <h4 className="mb-4">Contacts</h4>

                                    <div className="modal fade" id="addContact-exampleModal" tabindex="-1" role="dialog" aria-labelledby="addContact-exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title font-size-16" id="addContact-exampleModalLabel">Add Contact</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body p-4">
                                                    <form>
                                                        <div className="form-group mb-4">
                                                            <label for="addcontactemail-input">Email</label>
                                                            <input type="email" className="form-control" id="addcontactemail-input" placeholder="Enter Email" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label for="addcontact-invitemessage-input">Invatation Message</label>
                                                            <textarea className="form-control" id="addcontact-invitemessage-input" rows="3" placeholder="Enter Message"></textarea>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-link" data-dismiss="modal">Close</button>
                                                    <button type="button" className="btn btn-primary">Invite Contact</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="search-box chat-search-box">
                                        <div className="input-group bg-light  input-group-lg rounded-lg">
                                            <div className="input-group-prepend">
                                                <button className="btn btn-link text-decoration-none text-muted pr-1" type="button">
                                                    <i className="ri-search-line search-icon font-size-18"></i>
                                                </button>
                                            </div>
                                            <input type="text" className="form-control bg-light " placeholder="Search users.." />
                                        </div>
                                    </div>
                                </div>

                                <SimpleBar className="p-4 chat-message-list chat-group-list" data-simplebar>

                                    <div>
                                        <div className="p-3 font-weight-bold text-primary">
                                            A
                                    </div>

                                        <ul className="list-unstyled contact-list">
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Albert Rodarte</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Allison Etter</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <div className="p-3 font-weight-bold text-primary">
                                            C
                                    </div>

                                        <ul className="list-unstyled contact-list">
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Craig Smiley</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <div className="p-3 font-weight-bold text-primary">
                                            D
                                    </div>

                                        <ul className="list-unstyled contact-list">
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Daniel Clay</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Broadcast</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <div className="p-3 font-weight-bold text-primary">
                                            I
                                    </div>

                                        <ul className="list-unstyled contact-list">

                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Iris Wells</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <div className="p-3 font-weight-bold text-primary">
                                            J
                                    </div>

                                        <ul className="list-unstyled contact-list">
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Juan Flakes</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">John Hall</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Joy Southern</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <div className="p-3 font-weight-bold text-primary">
                                            M
                                    </div>

                                        <ul className="list-unstyled contact-list">
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Mary Farmer</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Mark Messer</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Michael Hinton</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <div className="p-3 font-weight-bold text-primary">
                                            O
                                    </div>

                                        <ul className="list-unstyled contact-list">
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Ossie Wilson</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <div className="p-3 font-weight-bold text-primary">
                                            P
                                    </div>

                                        <ul className="list-unstyled contact-list">
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Phillis Griffin</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Paul Haynes</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <div className="p-3 font-weight-bold text-primary">
                                            R
                                    </div>

                                        <ul className="list-unstyled contact-list">
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Rocky Jackson</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                        </ul>
                                    </div>

                                    <div className="mt-3">
                                        <div className="p-3 font-weight-bold text-primary">
                                            S
                                    </div>

                                        <ul className="list-unstyled contact-list">
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Sara Muller</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Simon Velez</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="media align-items-center">
                                                    <div className="media-body">
                                                        <h5 className="font-size-14 m-0">Steve Walker</h5>
                                                    </div>

                                                    <div className="dropdown">
                                                        <a href="/chat" className="text-muted dropdown-toggle" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Block <i className="ri-forbid-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Remove <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                        </ul>
                                    </div>
                                </SimpleBar>
                            </div>
                        </div>

                        <div className="tab-pane" id="pills-setting" role="tabpanel" aria-labelledby="pills-setting-tab">
                            <div>
                                <div className="px-4 pt-4">
                                    <h4 className="mb-0">Settings</h4>
                                </div>

                                <div className="text-center border-bottom p-4">
                                    <div className="mb-4 profile-user">
                                        <img src="assets/images/users/avatar-1.jpg" className="rounded-circle avatar-lg img-thumbnail" alt="" />
                                        <button type="button" className="btn bg-light avatar-xs p-0 rounded-circle profile-photo-edit">
                                            <i className="ri-pencil-fill"></i>
                                        </button>
                                    </div>

                                    <h5 className="font-size-16 mb-1 text-truncate">Patricia Smith</h5>
                                    <div className="dropdown d-inline-block mb-1">
                                        <a className="text-muted dropdown-toggle pb-1 d-block" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                            Available <i className="mdi mdi-chevron-down"></i>
                                        </a>

                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="/chat">Available</a>
                                            <a className="dropdown-item" href="/chat">Busy</a>
                                        </div>
                                    </div>
                                </div>
                                <SimpleBar className="p-4 user-profile-desc" data-simplebar>

                                    <div id="profile-setting-accordion" className="custom-accordion">
                                        <div className="card shadow-none border mb-2">
                                            <a href="#profile-setting-personalinfocollapse" className="text-dark" data-toggle="collapse"
                                                aria-expanded="true"
                                                aria-controls="profile-setting-personalinfocollapse">
                                                <div className="card-header" id="profile-setting-personalinfoheading">
                                                    <h5 className="font-size-14 m-0">
                                                        Personal Info
                                                    <i className="mdi mdi-chevron-up float-right accor-plus-icon"></i>
                                                    </h5>
                                                </div>
                                            </a>

                                            <div id="profile-setting-personalinfocollapse" className="collapse show"
                                                aria-labelledby="profile-setting-personalinfoheading" data-parent="#profile-setting-accordion">
                                                <div className="card-body">

                                                    <div className="float-right">
                                                        <button type="button" className="btn btn-light btn-sm"><i className="ri-edit-fill mr-1 align-middle"></i> Edit</button>
                                                    </div>

                                                    <div>
                                                        <p className="text-muted mb-1">Name</p>
                                                        <h5 className="font-size-14">Patricia Smith</h5>
                                                    </div>

                                                    <div className="mt-4">
                                                        <p className="text-muted mb-1">Email</p>
                                                        <h5 className="font-size-14">adc@123.com</h5>
                                                    </div>

                                                    <div className="mt-4">
                                                        <p className="text-muted mb-1">Time</p>
                                                        <h5 className="font-size-14">11:40 AM</h5>
                                                    </div>

                                                    <div className="mt-4">
                                                        <p className="text-muted mb-1">Location</p>
                                                        <h5 className="font-size-14 mb-0">California, USA</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card shadow-none border mb-2">
                                            <a href="#profile-setting-privacycollapse" className="text-dark collapsed" data-toggle="collapse"
                                                aria-expanded="false"
                                                aria-controls="profile-setting-privacycollapse">
                                                <div className="card-header" id="profile-setting-privacyheading">
                                                    <h5 className="font-size-14 m-0">
                                                        Privacy
                                                    <i className="mdi mdi-chevron-up float-right accor-plus-icon"></i>
                                                    </h5>
                                                </div>
                                            </a>
                                            <div id="profile-setting-privacycollapse" className="collapse" aria-labelledby="profile-setting-privacyheading"
                                                data-parent="#profile-setting-accordion">
                                                <div className="card-body">
                                                    <div className="py-3">
                                                        <div className="media align-items-center">
                                                            <div className="media-body overflow-hidden">
                                                                <h5 className="font-size-13 mb-0 text-truncate">Profile photo</h5>

                                                            </div>
                                                            <div className="dropdown ml-2">
                                                                <button className="btn btn-light btn-sm dropdown-toggle w-sm" type="button" data-toggle="dropdown"  aria-expanded="false">
                                                                    Everyone <i className="mdi mdi-chevron-down"></i>
                                                                </button>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="/chat">Everyone</a>
                                                                    <a className="dropdown-item" href="/chat">selected</a>
                                                                    <a className="dropdown-item" href="/chat">Nobody</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="py-3 border-top">
                                                        <div className="media align-items-center">
                                                            <div className="media-body overflow-hidden">
                                                                <h5 className="font-size-13 mb-0 text-truncate">Last seen</h5>

                                                            </div>
                                                            <div className="ml-2">
                                                                <div className="custom-control custom-switch">
                                                                    <input type="checkbox" className="custom-control-input" id="privacy-lastseenSwitch" checked />
                                                                    <label className="custom-control-label" for="privacy-lastseenSwitch"></label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="py-3 border-top">
                                                        <div className="media align-items-center">
                                                            <div className="media-body overflow-hidden">
                                                                <h5 className="font-size-13 mb-0 text-truncate">Status</h5>

                                                            </div>
                                                            <div className="dropdown ml-2">
                                                                <button className="btn btn-light btn-sm dropdown-toggle w-sm" type="button" data-toggle="dropdown"  aria-expanded="false">
                                                                    Everyone <i className="mdi mdi-chevron-down"></i>
                                                                </button>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="/chat">Everyone</a>
                                                                    <a className="dropdown-item" href="/chat">selected</a>
                                                                    <a className="dropdown-item" href="/chat">Nobody</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="py-3 border-top">
                                                        <div className="media align-items-center">
                                                            <div className="media-body overflow-hidden">
                                                                <h5 className="font-size-13 mb-0 text-truncate">Read receipts</h5>

                                                            </div>
                                                            <div className="ml-2">
                                                                <div className="custom-control custom-switch">
                                                                    <input type="checkbox" className="custom-control-input" id="privacy-readreceiptSwitch" checked />
                                                                    <label className="custom-control-label" for="privacy-readreceiptSwitch"></label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="py-3 border-top">
                                                        <div className="media align-items-center">
                                                            <div className="media-body overflow-hidden">
                                                                <h5 className="font-size-13 mb-0 text-truncate">Groups</h5>

                                                            </div>
                                                            <div className="dropdown ml-2">
                                                                <button className="btn btn-light btn-sm dropdown-toggle w-sm" type="button" data-toggle="dropdown"  aria-expanded="false">
                                                                    Everyone <i className="mdi mdi-chevron-down"></i>
                                                                </button>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="/chat">Everyone</a>
                                                                    <a className="dropdown-item" href="/chat">selected</a>
                                                                    <a className="dropdown-item" href="/chat">Nobody</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="card shadow-none border mb-2">
                                            <a href="#profile-setting-securitynoticollapse" className="text-dark collapsed" data-toggle="collapse"
                                                aria-expanded="false"
                                                aria-controls="profile-setting-securitynoticollapse">
                                                <div className="card-header" id="profile-setting-securitynotiheading">
                                                    <h5 className="font-size-14 m-0">
                                                        Security
                                                    <i className="mdi mdi-chevron-up float-right accor-plus-icon"></i>
                                                    </h5>
                                                </div>
                                            </a>
                                            <div id="profile-setting-securitynoticollapse" className="collapse" aria-labelledby="profile-setting-securitynotiheading"
                                                data-parent="#profile-setting-accordion">
                                                <div className="card-body">

                                                    <div>
                                                        <div className="media align-items-center">
                                                            <div className="media-body overflow-hidden">
                                                                <h5 className="font-size-13 mb-0 text-truncate">Show security notification</h5>

                                                            </div>
                                                            <div className="ml-2">
                                                                <div className="custom-control custom-switch">
                                                                    <input type="checkbox" className="custom-control-input" id="security-notificationswitch" />
                                                                    <label className="custom-control-label" for="security-notificationswitch"></label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card shadow-none border mb-2">
                                            <a href="#profile-setting-helpcollapse" className="text-dark collapsed" data-toggle="collapse"
                                                aria-expanded="false"
                                                aria-controls="profile-setting-helpcollapse">
                                                <div className="card-header" id="profile-setting-helpheading">
                                                    <h5 className="font-size-14 m-0">
                                                        Help
                                                    <i className="mdi mdi-chevron-up float-right accor-plus-icon"></i>
                                                    </h5>
                                                </div>
                                            </a>
                                            <div id="profile-setting-helpcollapse" className="collapse" aria-labelledby="profile-setting-helpheading"
                                                data-parent="#profile-setting-accordion">
                                                <div className="card-body">

                                                    <div>
                                                        <div className="py-3">
                                                            <h5 className="font-size-13 mb-0"><a href="/chat" className="text-body d-block">FAQs</a></h5>
                                                        </div>
                                                        <div className="py-3 border-top">
                                                            <h5 className="font-size-13 mb-0"><a href="/chat" className="text-body d-block">Contact</a></h5>
                                                        </div>
                                                        <div className="py-3 border-top">
                                                            <h5 className="font-size-13 mb-0"><a href="/chat" className="text-body d-block">Terms & Privacy policy</a></h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SimpleBar>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="user-chat w-100">
                    <div className="d-lg-flex">
                        <div className="w-100">
                            <div className="p-3 p-lg-4 border-bottom">
                                <div className="row align-items-center">
                                    <div className="col-sm-4 col-8">
                                        <div className="media align-items-center">
                                            <div className="d-block d-lg-none mr-2">
                                                <a href="/chat" className="user-chat-remove text-muted font-size-16 p-2"><i className="ri-arrow-left-s-line"></i></a>
                                            </div>
                                            <div className="mr-3">
                                                <img src="assets/images/users/avatar-4.jpg" className="rounded-circle avatar-xs" alt="" />
                                            </div>
                                            <div className="media-body overflow-hidden">
                                                <h5 className="font-size-16 mb-0 text-truncate"><a href="/chat" className="text-reset user-profile-show">Broadcast</a> <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ml-1"></i></h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-8 col-4">
                                        <ul className="list-inline user-chat-nav text-right mb-0">

                                            <li className="list-inline-item">
                                                <div className="dropdown">
                                                    <button className="btn nav-btn dropdown-toggle" type="button" data-toggle="dropdown"  aria-expanded="false">
                                                        <i className="ri-search-line"></i>
                                                    </button>
                                                    <div className="dropdown-menu p-0 dropdown-menu-right dropdown-menu-md">
                                                        <div className="search-box p-2">
                                                            <input type="text" className="form-control bg-light border-0" placeholder="Search.." />
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>

                                            <li className="list-inline-item d-none d-lg-inline-block">
                                                <button type="button" className="btn nav-btn user-profile-show" onClick={() => auth().signOut()} title="Logout">
                                                    <i className="ri-user-2-line"></i>
                                                </button>
                                            </li>

                                            <li className="list-inline-item">
                                                <div className="dropdown">
                                                    <button className="btn nav-btn dropdown-toggle" type="button" data-toggle="dropdown"  aria-expanded="false">
                                                        <i className="ri-more-fill"></i>
                                                    </button>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <a className="dropdown-item d-block d-lg-none user-profile-show" href="/chat">View profile <i className="ri-user-2-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Archive <i className="ri-archive-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Muted <i className="ri-volume-mute-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                    </div>
                                                </div>
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* <SimpleBar className="chat-conversation p-3 p-lg-4" data-simplebar="init">
                            <ul className="list-unstyled mb-0">
                                <li>
                                    <div className="conversation-list">
    
                                        <div className="user-chat-content">
                                            <div className="ctext-wrap">
                                                <div className="ctext-wrap-content">
                                                    <p className="mb-0">
                                                        Good morning
                                                    </p>
                                                    <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">10:00</span></p>
                                                </div>
                                                <div className="dropdown align-self-start">
                                                    <a className="dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                        <i className="ri-more-2-fill"></i>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" href="/chat">Copy <i className="ri-file-copy-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Save <i className="ri-save-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Forward <i className="ri-chat-forward-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="conversation-name">Doris Brown</div>
                                        </div>
                                    </div>
                                </li>
    
                                <li className="right">
                                    <div className="conversation-list">
                                        <div className="chat-avatar">
                                            <img src="assets/images/users/avatar-1.jpg" alt=""/>
                                        </div>
    
                                        <div className="user-chat-content">
                                            <div className="ctext-wrap">
                                                <div className="ctext-wrap-content">
                                                    <p className="mb-0">
                                                        Good morning, How are you? What about our next meeting?
                                             simplebar-offset"       </p>
                                                    <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">10:02</span></p>
                                                </div>
                                                    
                                                <div className="dropdown align-self-start">
                                                    <a className="dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                        <i className="ri-more-2-fill"></i>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" href="/chat">Copy <i className="ri-file-copy-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Save <i className="ri-save-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Forward <i className="ri-chat-forward-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="conversation-name">Patricia Smith</div>
                                        </div>
                                    </div>
                                </li>

                                <li> 
                                    <div className="chat-day-title">
                                        <span className="title">Today</span>
                                    </div>
                                </li>
    
                                <li>
                                    <div className="conversation-list">
                                        <div className="chat-avatar">
                                            <img src="assets/images/users/avatar-4.jpg" alt=""/>
                                        </div>
    
                                        <div className="user-chat-content">
                                            
                                            <div className="ctext-wrap">
                                                <div className="ctext-wrap-content">
                                                    <p className="mb-0">
                                                        Yeah everything is fine
                                                    </p>
                                                    <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">10:05</span></p>
                                                </div>
                                                <div className="dropdown align-self-start">
                                                    <a className="dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                        <i className="ri-more-2-fill"></i>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" href="/chat">Copy <i className="ri-file-copy-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Save <i className="ri-save-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Forward <i className="ri-chat-forward-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                    </div>
                                                </div>
                                            </div>
    
                                            <div className="ctext-wrap">
                                                <div className="ctext-wrap-content">
                                                    <p className="mb-0">
                                                        & Next meeting tomorrow 10.00AM
                                                    </p>
                                                    <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">10:05</span></p>
                                                </div>
                                                <div className="dropdown align-self-start">
                                                    <a className="dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                        <i className="ri-more-2-fill"></i>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" href="/chat">Copy <i className="ri-file-copy-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Save <i className="ri-save-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Forward <i className="ri-chat-forward-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="conversation-name">Doris Brown</div>
                                        </div>
                                        
                                    </div>
                                </li>
                            
                                <li className="right">
                                    <div className="conversation-list">
                                        <div className="chat-avatar">
                                            <img src="assets/images/users/avatar-1.jpg" alt=""/>
                                        </div>
    
                                        <div className="user-chat-content">
                                            <div className="ctext-wrap">
                                                <div className="ctext-wrap-content">
                                                    <p className="mb-0">
                                                        Wow that's great
                                                    </p>
                                                    <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">10:06</span></p>
                                                </div>
                                                <div className="dropdown align-self-start">
                                                    <a className="dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                        <i className="ri-more-2-fill"></i>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" href="/chat">Copy <i className="ri-file-copy-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Save <i className="ri-save-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Forward <i className="ri-chat-forward-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                    </div>
                                                </div>
                                            </div>
    
                                            <div className="conversation-name">Patricia Smith</div>
                                        </div>
                                        
                                    </div>
                                </li>
    
                                <li>
                                    <div className="conversation-list">
                                        <div className="chat-avatar">
                                            <img src="assets/images/users/avatar-4.jpg" alt=""/>
                                        </div>
    
                                        <div className="user-chat-content">
                                            <div className="ctext-wrap">
                                        
                                                <div className="ctext-wrap-content">
                                                    <ul className="list-inline message-img  mb-0">
                                                        <li className="list-inline-item message-img-list">
                                                            <div>
                                                                <a className="popup-img d-inline-block m-1" href="assets/images/small/img-1.jpg" title="Project 1">
                                                                    <img src="assets/images/small/img-1.jpg" alt="" className="rounded border"/>
                                                                </a>
                                                            </div>
                                                            <div className="message-img-link">
                                                                <ul className="list-inline mb-0">
                                                                    <li className="list-inline-item">
                                                                        <a href="/chat">
                                                                            <i className="ri-download-2-line"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li className="list-inline-item dropdown">
                                                                        <a className="dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                            <i className="ri-more-fill"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu">
                                                                            <a className="dropdown-item" href="/chat">Copy <i className="ri-file-copy-line float-right text-muted"></i></a>
                                                                            <a className="dropdown-item" href="/chat">Save <i className="ri-save-line float-right text-muted"></i></a>
                                                                            <a className="dropdown-item" href="/chat">Forward <i className="ri-chat-forward-line float-right text-muted"></i></a>
                                                                            <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </li>

                                                        <li className="list-inline-item message-img-list">
                                                            <div>
                                                                <a className="popup-img d-inline-block m-1" href="assets/images/small/img-2.jpg" title="Project 2">
                                                                    <img src="assets/images/small/img-2.jpg" alt="" className="rounded border"/>
                                                                </a>
                                                            </div>
                                                            <div className="message-img-link">
                                                                <ul className="list-inline mb-0">
                                                                    <li className="list-inline-item">
                                                                        <a href="/chat">
                                                                            <i className="ri-download-2-line"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li className="list-inline-item dropdown">
                                                                        <a className="dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                            <i className="ri-more-fill"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu">
                                                                            <a className="dropdown-item" href="/chat">Copy <i className="ri-file-copy-line float-right text-muted"></i></a>
                                                                            <a className="dropdown-item" href="/chat">Save <i className="ri-save-line float-right text-muted"></i></a>
                                                                            <a className="dropdown-item" href="/chat">Forward <i className="ri-chat-forward-line float-right text-muted"></i></a>
                                                                            <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">10:09</span></p>
                                                </div>
                                                    
                                                <div className="dropdown align-self-start">
                                                    <a className="dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                        <i className="ri-more-2-fill"></i>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" href="/chat">Copy <i className="ri-file-copy-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Save <i className="ri-save-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Forward <i className="ri-chat-forward-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            
                                            <div className="conversation-name">Doris Brown</div>
                                        </div>
                                        
                                    </div>
                                </li>
    
                                <li className="right">
                                    <div className="conversation-list">
                                        <div className="chat-avatar">
                                            <img src="assets/images/users/avatar-1.jpg" alt=""/>
                                        </div>
    
                                        <div className="user-chat-content">
                                            <div className="ctext-wrap">
                                        
                                                <div className="ctext-wrap-content">
                                                    <div className="card p-2 mb-2">
                                                        <div className="media align-items-center">
                                                            <div className="avatar-sm mr-3">
                                                                <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                                                    <i className="ri-file-text-fill"></i>
                                                                </div>
                                                            </div>
                                                            <div className="media-body">
                                                                <div className="text-left">
                                                                    <h5 className="font-size-14 mb-1">admin_v1.0.zip</h5>
                                                                    <p className="text-muted font-size-13 mb-0">12.5 MB</p>
                                                                </div>
                                                            </div>
    
                                                            <div className="ml-4">
                                                                <ul className="list-inline mb-0 font-size-20">
                                                                    <li className="list-inline-item">
                                                                        <a href="/chat" className="text-muted">
                                                                            <i className="ri-download-2-line"></i>
                                                                        </a>
                                                                    </li>
                                                                    <li className="list-inline-item dropdown">
                                                                        <a className="dropdown-toggle text-muted" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                            <i className="ri-more-fill"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-right">
                                                                            <a className="dropdown-item" href="/chat">Share <i className="ri-share-line float-right text-muted"></i></a>
                                                                            <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">10:16</span></p>
                                                </div>
                                                    
                                                <div className="dropdown align-self-start">
                                                    <a className="dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                        <i className="ri-more-2-fill"></i>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" href="/chat">Copy <i className="ri-file-copy-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Save <i className="ri-save-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Forward <i className="ri-chat-forward-line float-right text-muted"></i></a>
                                                        <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            
                                            <div className="conversation-name">Patricia Smith</div>
                                        </div>
                                        
                                    </div>
                                </li>

                                <li>
                                    <div className="conversation-list">
                                        <div className="chat-avatar">
                                            <img src="assets/images/users/avatar-4.jpg" alt=""/>
                                        </div>
                                        
                                        <div className="user-chat-content">
                                            <div className="ctext-wrap">
                                                <div className="ctext-wrap-content">
                                                    <p className="mb-0">
                                                        typing
                                                        <span className="animate-typing">
                                                            <span className="dot"></span>
                                                            <span className="dot"></span>
                                                            <span className="dot"></span>
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
        
                                            <div className="conversation-name">Doris Brown</div>
                                        </div>
                                        
                                    </div>
                                </li>
                                
                            </ul>
                        </SimpleBar> */}

                            <SimpleBar className="chat-conversation p-3 p-lg-4" data-simplebar="init">
                                <ul className="list-unstyled mb-0">
                                {this.state.chats.map((chat, index) => {
            return (
                                    <li key={index} className={this.state.user.uid === chat.uid ? "" : "right"}>
                                        <div className="conversation-list">
                                            <div className="user-chat-content">
                                                <div className="ctext-wrap">
                                                    <div className="ctext-wrap-content">
                                                        <p className="mb-0">
                                                        {chat.content}
                                                    </p>
                                                        <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{this.formatTime(chat.timestamp)}</span></p>
                                                    </div>
                                                    <div className="dropdown align-self-start">
                                                        <a className="dropdown-toggle" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                            <i className="ri-more-2-fill"></i>
                                                        </a>
                                                        <div className="dropdown-menu">
                                                            <a className="dropdown-item" href="/chat">Copy <i className="ri-file-copy-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Save <i className="ri-save-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Forward <i className="ri-chat-forward-line float-right text-muted"></i></a>
                                                            <a className="dropdown-item" href="/chat">Delete <i className="ri-delete-bin-line float-right text-muted"></i></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="conversation-name">{chat.email}</div>
                                            </div>
                                        </div>
                                    </li>
            );
        })}
                                </ul>
                            </SimpleBar>
                            <div className="p-3 p-lg-4 border-top mb-0">
                                <div className="row no-gutters">
                                {/* <form onSubmit={this.handleSubmit}> */}
                                    <div className="col">
                                        <div>
                                            <input type="text" className="form-control form-control-lg bg-light border-light" placeholder="Enter Message..." 
                                            onChange={this.handleChange}
                                            value={this.state.content}/>
                                            {this.state.error ? (
                                                <p className="text-danger">{this.state.error}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <div className="chat-input-links ml-md-2">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <button type="button" className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect" data-toggle="tooltip" data-placement="top" title="Emoji">
                                                        <i className="ri-emotion-happy-line"></i>
                                                    </button>
                                                </li>
                                                <li className="list-inline-item">
                                                    <button type="button" className="btn btn-link text-decoration-none font-size-16 btn-lg waves-effect" data-toggle="tooltip" data-placement="top" title="Attached File">
                                                        <i className="ri-attachment-line"></i>
                                                    </button>
                                                </li>
                                                <li className="list-inline-item">
                                                    <button type="button" className="btn btn-primary font-size-16 btn-lg chat-send waves-effect waves-light"
                                                    onClick={this.handleSubmit}>
                                                        <i className="ri-send-plane-2-fill"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                {/* </form> */}
                                </div>
                            </div>
                        </div>

                        <div className="user-profile-sidebar">
                            <div className="px-3 px-lg-4 pt-3 pt-lg-4">
                                <div className="user-chat-nav text-right">
                                    <button type="button" className="btn nav-btn" id="user-profile-hide">
                                        <i className="ri-close-line"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="text-center p-4 border-bottom">
                                <div className="mb-4">
                                    <img src="assets/images/users/avatar-4.jpg" className="rounded-circle avatar-lg img-thumbnail" alt="" />
                                </div>

                                <h5 className="font-size-16 mb-1 text-truncate">Doris Brown</h5>
                                <p className="text-muted text-truncate mb-1"><i className="ri-record-circle-fill font-size-10 text-success mr-1"></i> Active</p>
                            </div>

                            <SimpleBar className="p-4 user-profile-desc" data-simplebar>
                                <div className="text-muted">
                                    <p className="mb-4">If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual.</p>
                                </div>

                                <div id="profile-user-accordion" className="custom-accordion">
                                    <div className="card shadow-none border mb-2">
                                        <a href="#collapseOne" className="text-dark" data-toggle="collapse"
                                            aria-expanded="true"
                                            aria-controls="collapseOne">
                                            <div className="card-header" id="headingOne">
                                                <h5 className="font-size-14 m-0">
                                                    <i className="ri-user-2-line mr-2 align-middle d-inline-block"></i> About
                                                <i className="mdi mdi-chevron-up float-right accor-plus-icon"></i>
                                                </h5>
                                            </div>
                                        </a>

                                        <div id="collapseOne" className="collapse show"
                                            aria-labelledby="headingOne" data-parent="#profile-user-accordion">
                                            <div className="card-body">

                                                <div>
                                                    <p className="text-muted mb-1">Name</p>
                                                    <h5 className="font-size-14">Doris Brown</h5>
                                                </div>

                                                <div className="mt-4">
                                                    <p className="text-muted mb-1">Email</p>
                                                    <h5 className="font-size-14">adc@123.com</h5>
                                                </div>

                                                <div className="mt-4">
                                                    <p className="text-muted mb-1">Time</p>
                                                    <h5 className="font-size-14">11:40 AM</h5>
                                                </div>

                                                <div className="mt-4">
                                                    <p className="text-muted mb-1">Location</p>
                                                    <h5 className="font-size-14 mb-0">California, USA</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card mb-1 shadow-none border">
                                        <a href="#collapseTwo" className="text-dark collapsed" data-toggle="collapse"
                                            aria-expanded="false"
                                            aria-controls="collapseTwo">
                                            <div className="card-header" id="headingTwo">
                                                <h5 className="font-size-14 m-0">
                                                    <i className="ri-attachment-line mr-2 align-middle d-inline-block"></i> Attached Files
                                                <i className="mdi mdi-chevron-up float-right accor-plus-icon"></i>
                                                </h5>
                                            </div>
                                        </a>
                                        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo"
                                            data-parent="#profile-user-accordion">
                                            <div className="card-body">
                                                <div className="card p-2 border mb-2">
                                                    <div className="media align-items-center">
                                                        <div className="avatar-sm mr-3">
                                                            <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                                                <i className="ri-file-text-fill"></i>
                                                            </div>
                                                        </div>
                                                        <div className="media-body">
                                                            <div className="text-left">
                                                                <h5 className="font-size-14 mb-1">admin_v1.0.zip</h5>
                                                                <p className="text-muted font-size-13 mb-0">12.5 MB</p>
                                                            </div>
                                                        </div>

                                                        <div className="ml-4">
                                                            <ul className="list-inline mb-0 font-size-18">
                                                                <li className="list-inline-item">
                                                                    <a href="/chat" className="text-muted px-1">
                                                                        <i className="ri-download-2-line"></i>
                                                                    </a>
                                                                </li>
                                                                <li className="list-inline-item dropdown">
                                                                    <a className="dropdown-toggle text-muted px-1" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                        <i className="ri-more-fill"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-right">
                                                                        <a className="dropdown-item" href="/chat">Action</a>
                                                                        <a className="dropdown-item" href="/chat">Another action</a>
                                                                        <div className="dropdown-divider"></div>
                                                                        <a className="dropdown-item" href="/chat">Delete</a>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card p-2 border mb-2">
                                                    <div className="media align-items-center">
                                                        <div className="avatar-sm mr-3">
                                                            <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                                                <i className="ri-image-fill"></i>
                                                            </div>
                                                        </div>
                                                        <div className="media-body">
                                                            <div className="text-left">
                                                                <h5 className="font-size-14 mb-1">Image-1.jpg</h5>
                                                                <p className="text-muted font-size-13 mb-0">4.2 MB</p>
                                                            </div>
                                                        </div>

                                                        <div className="ml-4">
                                                            <ul className="list-inline mb-0 font-size-18">
                                                                <li className="list-inline-item">
                                                                    <a href="/chat" className="text-muted px-1">
                                                                        <i className="ri-download-2-line"></i>
                                                                    </a>
                                                                </li>
                                                                <li className="list-inline-item dropdown">
                                                                    <a className="dropdown-toggle text-muted px-1" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                        <i className="ri-more-fill"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-right">
                                                                        <a className="dropdown-item" href="/chat">Action</a>
                                                                        <a className="dropdown-item" href="/chat">Another action</a>
                                                                        <div className="dropdown-divider"></div>
                                                                        <a className="dropdown-item" href="/chat">Delete</a>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card p-2 border mb-2">
                                                    <div className="media align-items-center">
                                                        <div className="avatar-sm mr-3">
                                                            <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                                                <i className="ri-image-fill"></i>
                                                            </div>
                                                        </div>
                                                        <div className="media-body">
                                                            <div className="text-left">
                                                                <h5 className="font-size-14 mb-1">Image-2.jpg</h5>
                                                                <p className="text-muted font-size-13 mb-0">3.1 MB</p>
                                                            </div>
                                                        </div>

                                                        <div className="ml-4">
                                                            <ul className="list-inline mb-0 font-size-18">
                                                                <li className="list-inline-item">
                                                                    <a href="/chat" className="text-muted px-1">
                                                                        <i className="ri-download-2-line"></i>
                                                                    </a>
                                                                </li>
                                                                <li className="list-inline-item dropdown">
                                                                    <a className="dropdown-toggle text-muted px-1" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                        <i className="ri-more-fill"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-right">
                                                                        <a className="dropdown-item" href="/chat">Action</a>
                                                                        <a className="dropdown-item" href="/chat">Another action</a>
                                                                        <div className="dropdown-divider"></div>
                                                                        <a className="dropdown-item" href="/chat">Delete</a>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card p-2 border mb-2">
                                                    <div className="media align-items-center">
                                                        <div className="avatar-sm mr-3">
                                                            <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                                                <i className="ri-file-text-fill"></i>
                                                            </div>
                                                        </div>
                                                        <div className="media-body">
                                                            <div className="text-left">
                                                                <h5 className="font-size-14 mb-1">Landing-A.zip</h5>
                                                                <p className="text-muted font-size-13 mb-0">6.7 MB</p>
                                                            </div>
                                                        </div>

                                                        <div className="ml-4">
                                                            <ul className="list-inline mb-0 font-size-18">
                                                                <li className="list-inline-item">
                                                                    <a href="/chat" className="text-muted px-1">
                                                                        <i className="ri-download-2-line"></i>
                                                                    </a>
                                                                </li>
                                                                <li className="list-inline-item dropdown">
                                                                    <a className="dropdown-toggle text-muted px-1" href="/chat" role="button" data-toggle="dropdown"  aria-expanded="false">
                                                                        <i className="ri-more-fill"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-right">
                                                                        <a className="dropdown-item" href="/chat">Action</a>
                                                                        <a className="dropdown-item" href="/chat">Another action</a>
                                                                        <div className="dropdown-divider"></div>
                                                                        <a className="dropdown-item" href="/chat">Delete</a>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </SimpleBar>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}