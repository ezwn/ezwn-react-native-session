import React from "react";

import { useSession } from "./Session-ctx";

export const RestrictedAccess = ({ children, role }) => {
    const session = useSession();

    if (!session.currentUser || !session.currentUser.roles)
        return <></>;

    const { currentUser: { roles } } = session;




    
    const allowed = roles.indexOf(role) !== -1;

    return <>{allowed && children}</>
}

RestrictedAccess.defaultProps = {
    roles: []
}
