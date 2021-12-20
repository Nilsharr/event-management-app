import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import events from "./events"

export default combineReducers({
    auth,
    message,
    events
});