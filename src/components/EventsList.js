import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";

import { getEvents, deleteEvent } from "../actions/events";
import Map from "./Map/Map"

const EventsList = () => {
    const [currentEvent, setCurrentEvent] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchName, setSearchName] = useState("");
    const [showMapModal, setShowMapModal] = useState(false);

    const events = useSelector(state => state.events);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);

    const refreshData = () => {
        setCurrentEvent(null);
        setCurrentIndex(-1);
    };

    const setActiveEvent = (event, index) => {
        setCurrentEvent(event);
        setCurrentIndex(index);
    };

    const findByName = () => {
        refreshData();
        dispatch(getEvents({ searchByName: searchName }));
    };

    const removeEvent = () => {
        dispatch(deleteEvent(currentEvent._id))
            .then(() => {
                refreshData();
                dispatch(getEvents());
            })
            .catch(e => {
                console.log(e);
            });
    };

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByName}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <h4>Events List</h4>

                <ul className="list-group">
                    {events &&
                        events.map((event, index) => (
                            <li
                                className={
                                    "list-group-item " + (index === currentIndex ? "active" : "")
                                }
                                onClick={() => setActiveEvent(event, index)}
                                key={index}
                            >
                                {event.name}
                            </li>
                        ))}
                </ul>

            </div>
            <div className="col-md-6">
                {currentEvent ? (
                    <div>
                        <h4>Event</h4>
                        <div>
                            <label>
                                <strong>Name:</strong>
                            </label>{" "}
                            {currentEvent.name}
                        </div>
                        <div>
                            <label>
                                <strong>Details:</strong>
                            </label>{" "}
                            {currentEvent.details}
                        </div>
                        <div>
                            <label>
                                <strong>Address:</strong>
                            </label>{" "}
                            {`${currentEvent.address.country}, ${currentEvent.address.city}, ${currentEvent.address.street}`}
                        </div>
                        <div>
                            <label>
                                <strong>Date:</strong>
                            </label>{" "}
                            {new Date(currentEvent.date).toUTCString()}
                            {/* {new Date(currentEvent.date).toLocaleString()} */}

                        </div>
                        <div>
                            <label>
                                <strong>Maximum number of participants:</strong>
                            </label>{" "}
                            {currentEvent.maxParticipants}
                        </div>
                        <div>
                            <label>
                                <strong>Current number of participants:</strong>
                            </label>{" "}
                            {currentEvent.participants.length}
                        </div>
                        <div className="mt-3">
                            <Button variant="primary" onClick={() => setShowMapModal(true)}>
                                Show route
                            </Button>

                            <Modal show={showMapModal} centered={true} animation={false} size="xl" onHide={() => setShowMapModal(false)}>
                                <Modal.Header closeButton><b>Route</b></Modal.Header>
                                <Map event={currentEvent} canSetRoute={false} />
                            </Modal>
                        </div>

                        <div className="mt-3">
                            <button className="btn btn-warning mr-2" type="button"
                                onClick={() => window.location.assign(`/events/${currentEvent._id}`)}>
                                Edit
                            </button>

                            <button className="btn btn-danger" type="button"
                                onClick={removeEvent}>
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <br />
                        <p>Click on an Event</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsList;