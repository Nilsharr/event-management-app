import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import EditEvent from "./components/EditEvent";
import EventsList from "./components/EventsList";
import AddEvent from "./components/AddEvent";
import PageNotFound from "./components/PageNotFound"

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import AuthService from './services/auth-service';

import { history } from "./helpers/history";

const App = () => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyToken = () => {
      const token = JSON.parse(sessionStorage.getItem("token"));
      if (token !== null) {
        AuthService.verifyToken(token)
          .then(response => {
            if (!response.data.isValid) {
              dispatch(logout());
              sessionStorage.removeItem("token");
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    }
    verifyToken();
  }, [dispatch]);

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage());
    });
  }, [dispatch]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Router history={history}>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Events
          </Link>

          {isLoggedIn && (
            <><div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/add-event"} className="nav-link">
                  Add Event
                </Link>
              </li>
            </div><div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a href="/add-event" className="nav-link" onClick={logOut}>
                    Log Out
                  </a>
                </li>
              </div></>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <PrivateRoute exact path={["/", "/events"]} component={EventsList} />
            <PrivateRoute exact path="/add-event" component={AddEvent} />
            <PrivateRoute exact path="/events/:id" component={EditEvent} />
            <Route exact path="/login" component={Login} />
            <Route path="*" component={PageNotFound} />
          </Switch>
        </div>
      </div>
    </Router >
  );
};

export default App;