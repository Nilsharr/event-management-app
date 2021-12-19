import serverInstance from "../server/server";

const login = (login, password) => {
    return serverInstance.post("/users/login-admin", { login, password });
};

const verifyToken = token => {
    return serverInstance.post("/users/verify-token", { token })
}

const authService = {
    login,
    verifyToken,
};
export default authService