import { Route, Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

export { PrivateRoute };

function PrivateRoute({ component: Component, ...rest }) {
    const { isLoggedIn } = useSelector(state => state.auth);

    return (
        <Route {...rest} render={props => {
            if (!isLoggedIn) {
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
            return <Component {...props} />
        }} />
    );
}