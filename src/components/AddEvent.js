import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import TextArea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";

import { createEvent } from "../actions/events";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const AddEvent = () => {
    const form = useRef();
    const checkBtn = useRef();

    const initialEventState = {
        name: "",
        details: "",
        country: "",
        city: "",
        street: "",
        date: "",
        maxParticipants: "",
        route: ""
    };

    const [event, setEvent] = useState(initialEventState);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();

    const handleInputChange = e => {
        const { name, value } = e.target;
        setEvent({ ...event, [name]: value });
    };

    const handleAddEvent = e => {
        e.preventDefault();
        setLoading(true);
        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            const data = {
                name: event.name,
                details: event.details,
                address: { country: event.country, city: event.city, street: event.street },
                date: event.date,
                maxParticipants: event.maxParticipants,
                //route: event.route
                route: [{
                    "timestamp": 123,
                    "coords": {
                        "latitude": 1,
                        "longtitude": 2,
                        "altitudde": 3,
                        "accuracy": 4,
                        "heading": 5,
                        "speed": 6
                    }
                }]
            };

            dispatch(createEvent(data))
                .then(data => {
                    /*setEvent({
                        name: data.name,
                        details: data.details,
                        country: data.address.country,
                        city: data.address.city,
                        street: data.address.street,
                        date: data.date,
                        maxParticipants: data.maxParticipants,
                        route: data.route
                    });*/
                    setSubmitted(true);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    };

    const newEvent = () => {
        setEvent(initialEventState);
        setSubmitted(false);
    }

    const addRoute = () => {
        console.log("...");
    }

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>Event submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newEvent}>
                        Add new
                    </button>
                    {/* go to events */}
                </div>
            ) : (
                <div>
                    <Form onSubmit={handleAddEvent} ref={form}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="name"
                                value={event.name}
                                onChange={handleInputChange}
                                validations={[required]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="details">Details</label>
                            <TextArea
                                className="form-control"
                                name="details"
                                value={event.details}
                                onChange={handleInputChange}
                                validations={[required]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="country"
                                value={event.country}
                                onChange={handleInputChange}
                                validations={[required]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="city"
                                value={event.city}
                                onChange={handleInputChange}
                                validations={[required]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="street">Street</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="street"
                                value={event.street}
                                onChange={handleInputChange}
                                validations={[required]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <Input
                                type="date"
                                className="form-control"
                                name="date"
                                min={new Date().toJSON().slice(0, 10)}
                                value={event.date}
                                onChange={handleInputChange}
                                validations={[required]}
                            />
                            {(message && message.errorMessages && message.errorMessages.invalidDate) && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message.errorMessages.invalidDate}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="maxParticipants">Max Participants</label>
                            <Input
                                type="number"
                                className="form-control"
                                name="maxParticipants"
                                min={1}
                                max={999999}
                                value={event.maxParticipants}
                                onChange={handleInputChange}
                                validations={[required]}
                            />
                            {(message && message.errorMessages && (message.errorMessages.notEnoughParticipants || message.errorMessages.tooManyParticipants)) && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message.errorMessages.notEnoughParticipants || message.errorMessages.tooManyParticipants}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary btn-block"
                                type="button"
                                onClick={addRoute}>
                                Add route
                            </button>
                        </div>

                        <div className="form-group mt-4">
                            <button className="btn btn-success btn-block" disabled={loading}>
                                {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Add Event</span>
                            </button>
                        </div>

                        {(message && message.error) && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {message.error}
                                </div>
                            </div>
                        )}

                        {/* clear button */}
                        <CheckButton style={{ display: "none" }} ref={checkBtn} />
                    </Form>
                </div>
            )}
        </div>
    );
};

export default AddEvent;