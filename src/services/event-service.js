import serverInstance from "../server/server";
import { SortBy } from "../helpers/enums";

const token = JSON.parse(sessionStorage.getItem("token"));
const authorizationToken = token ? { Authorization: `Bearer ${token}` } : {};

const getAll = (options) => {
  options = options || {};
  const params = {
    page: options.page || 1,
    limit: options.limit || 100,
    sortBy: options.sortBy || SortBy.name,
    name: options.searchByName,
    country: options.country,
    city: options.city,
    dateStart: options.dateStart,
    dateEnd: options.dateEnd
  };

  return serverInstance.get("/events", { params, headers: authorizationToken });
};

const get = id => {
  return serverInstance.get(`/events/${id}`, { headers: authorizationToken });
};

const create = data => {
  return serverInstance.post("/events", data, { headers: authorizationToken });
};

const update = (id, data) => {
  return serverInstance.put(`/events/${id}`, data, { headers: authorizationToken });
};

const remove = id => {
  return serverInstance.delete(`/events/${id}`, { headers: authorizationToken });
};

const eventService = {
  getAll,
  get,
  create,
  update,
  remove,
};

export default eventService;