import {
    GET_EVENTS,
    CREATE_EVENT,
    UPDATE_EVENT,
    DELETE_EVENT,
} from "../actions/types";

const initialState = [];

function eventReducer(events = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_EVENTS:
            return payload;

        case CREATE_EVENT:
            return [...events, payload];

        case UPDATE_EVENT:
            return events.map((event) => {
                if (event.id === payload.id) {
                    return {
                        ...event,
                        ...payload,
                    };
                } else {
                    return event;
                }
            });

        case DELETE_EVENT:
            return events.filter(({ id }) => id !== payload.id);

        default:
            return events;
    }
};

export default eventReducer;