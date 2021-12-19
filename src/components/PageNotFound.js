import React from 'react';

const PageNotFound = () => {
    return (
        <div id='error'>
            <h1 className="notFoundTitle">Looks like there is nothing here.</h1>
            <p className="notFoundDesc">
                It looks like nothing was found at this location.
                Maybe try one of the links in the menu or press back to go to the previous page.
            </p>
        </div>
    );
};

export default PageNotFound;