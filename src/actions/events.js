import {
    GET_EVENTS,
    CREATE_EVENT,
    UPDATE_EVENT,
    DELETE_EVENT,
    SET_MESSAGE,
} from "./types";

import EventService from "../services/event-service";

export const getEvents = options => async (dispatch) => {
    try {
        const response = await EventService.getAll(options);
        dispatch({
            type: GET_EVENTS,
            payload: response.data,
        });
    } catch (error) {
        console.log(error);
    }
};

export const createEvent = (event) => async (dispatch) => {
    try {
        const response = await EventService.create(event);
        console.log(response);
        dispatch({
            type: CREATE_EVENT,
            payload: response.data,
        });
        return Promise.resolve();
    } catch (error) {
        const message =
            (error.response &&
                error.response.data) ||
            error.response.data ||
            error.toString();
        console.log(message)
        dispatch({
            type: SET_MESSAGE,
            payload: message,
        });
        return Promise.reject();
    }
};

export const updateEvent = (id, event) => async (dispatch) => {
    try {
        await EventService.update(id, event);
        dispatch({
            type: UPDATE_EVENT,
            payload: event,
        });
        return Promise.resolve();
    } catch (error) {
        const message =
            (error.response &&
                error.response.data) ||
            error.response.data ||
            error.toString();

        dispatch({
            type: SET_MESSAGE,
            payload: message,
        });
        return Promise.reject();
    }
}


export const deleteEvent = (id) => async (dispatch) => {
    try {
        await EventService.remove(id);
        dispatch({
            type: DELETE_EVENT,
            payload: { id },
        });
    } catch (error) {
        console.log(error);
    }
};