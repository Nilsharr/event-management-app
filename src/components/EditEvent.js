import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEvent } from "../actions/events";
import EventService from "../services/event-service";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import TextArea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const Event = (props) => {
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

    const [currentEvent, setCurrentEvent] = useState(initialEventState);
    const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { message } = useSelector(state => state.message);

    const dispatch = useDispatch();

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentEvent({ ...currentEvent, [name]: value });
    };

    const getEvent = id => {
        EventService.get(id)
            .then(response => {
                setCurrentEvent({
                    _id: response.data._id,
                    name: response.data.name,
                    details: response.data.details,
                    country: response.data.address.country,
                    city: response.data.address.city,
                    street: response.data.address.street,
                    date: new Date(response.data.date).toJSON().slice(0, 10),
                    maxParticipants: response.data.maxParticipants,
                    route: response.data.route
                });
            })
            .catch(e => {
                console.log(e);
            });
    };

    useEffect(() => {
        getEvent(props.match.params.id);
    }, [props.match.params.id]);

    const handleEditEvent = e => {
        e.preventDefault();
        setLoading(true);
        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            const data = {
                event: {
                    _id: currentEvent._id,
                    name: currentEvent.name,
                    details: currentEvent.details,
                    address: { country: currentEvent.country, city: currentEvent.city, street: currentEvent.street },
                    date: currentEvent.date,
                    maxParticipants: currentEvent.maxParticipants,
                    //route: currentEvent.route
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
                }
            };
            dispatch(updateEvent(currentEvent._id, data))
                .then(response => {
                    console.log(response);
                    setLoading(false);
                    setUpdateSuccessMessage("The tutorial was updated successfully!");

                })
                .catch(e => {
                    console.log(e);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }

    const editRoute = () => {
        console.log("...");
    }

    return (
        <div>
            {currentEvent ? (
                <div className="edit-form">
                    <h4>Event</h4>
                    <Form onSubmit={handleEditEvent} ref={form}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <Input
                                type="text"
                                className="form-control"
                                name="name"
                                value={currentEvent.name}
                                onChange={handleInputChange}
                                validations={[required]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="details">Details</label>
                            <TextArea
                                className="form-control"
                                name="details"
                                value={currentEvent.details}
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
                                value={currentEvent.country}
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
                                value={currentEvent.city}
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
                                value={currentEvent.street}
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
                                value={currentEvent.date}
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
                                value={currentEvent.maxParticipants}
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
                                onClick={editRoute}>
                                Edit route
                            </button>
                        </div>

                        <div className="form-group">
                            <button className="btn btn-success btn-block" disabled={loading}>
                                {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Update</span>
                            </button>
                            <p className="mt-3">{updateSuccessMessage}</p>
                        </div>

                        {(message && message.error) && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {message.error}
                                </div>
                            </div>
                        )}

                        <CheckButton style={{ display: "none" }} ref={checkBtn} />
                    </Form>
                </div>
            ) : (
                <div>
                    <br />
                    <p>Click on an Event...</p>
                </div>
            )}
        </div>
    );
};

export default Event;