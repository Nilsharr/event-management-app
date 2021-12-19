import axios from "axios";

export default axios.create({
    baseURL: "https://runner-app-server.azurewebsites.net",
    headers: {
        "Content-type": "application/json"
    }
});