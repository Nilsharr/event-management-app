import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
} from "./types";

import AuthService from "../services/auth-service";

export const login = (username, password) => async (dispatch) => {
    try {
        const response = await AuthService.login(username, password);
        sessionStorage.setItem("token", JSON.stringify(response.data.token));
        dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data,
        });
        return Promise.resolve();
    }
    catch (error) {
        const message =
            (error.response &&
                error.response.data) ||
            error.response.data ||
            error.toString();

        dispatch({
            type: LOGIN_FAIL,
        });

        dispatch({
            type: SET_MESSAGE,
            payload: message,
        });
        return Promise.reject();
    }
};

export const logout = () => (dispatch) => {
    sessionStorage.removeItem("token");

    dispatch({
        type: LOGOUT,
    });
};