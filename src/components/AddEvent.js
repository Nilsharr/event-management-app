import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import TextArea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";
import DateTimePicker from 'react-datetime-picker';

import Map from "./Map/Map"
import { createEvent } from "../actions/events";

const minimumDate = new Date(new Date().setDate(new Date().getDate() + 2));

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
        date: minimumDate,
        maxParticipants: "",
        route: null
    };

    const [event, setEvent] = useState(initialEventState);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { message } = useSelector(state => state.message);
    const [showMapModal, setShowMapModal] = useState(false);

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
                route: event.route
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
                            <DateTimePicker
                                name="date"
                                minDate={minimumDate}
                                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 2))}
                                format="dd-MM-yyyy HH:mm"
                                disableClock={true}
                                dayPlaceholder="dd"
                                monthPlaceholder="MM"
                                yearPlaceholder="yyyy"
                                minutePlaceholder="mm"
                                hourPlaceholder="hh"
                                required={true}
                                value={event.date}
                                onChange={value => handleInputChange({ target: { name: "date", value } })}
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
                            <Button variant="primary" onClick={() => setShowMapModal(true)}>
                                Add route
                            </Button>

                            <Modal show={showMapModal} centered={true} animation={false} size="xl" onHide={() => setShowMapModal(false)}>
                                <Modal.Header closeButton><b>Add Route</b></Modal.Header>
                                <Map event={event} setEvent={setEvent} />
                            </Modal>
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
                </div >
            )}
        </div >
    );
};

export default AddEvent;