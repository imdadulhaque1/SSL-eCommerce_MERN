import React, { useEffect } from 'react';


const Layout = ({title="Title", className, children}) => {
    useEffect(() => {
        document.title = title;
    }, [])
    return (
        <div>
            <div className="mb-3">
                <h1>Menu</h1>
            </div>
            <div className={className}>{children}</div>
        </div>
    )
}

export default Layout;