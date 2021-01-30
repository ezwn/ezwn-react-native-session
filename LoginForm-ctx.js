import React, { useContext, useEffect, useState } from "react";

import { useSession } from "./Session-ctx";

const SessionManagementContext = React.createContext();

/**
 * Notice: automatically logs out at context loading
 */
export const LoginFormProvider = ({
  children,
  loginUrl,
  onSuccess,
  onRegister: onRegisterButtonPressed
}) => {

  if (!onSuccess || !loginUrl) {
    throw new Error();
  }

  const { setCurrentUser, setUserCredentials, resetUserCredentials, fetch, securedFetch } = useSession();

  const [autoLoggedOut, setAutoLoggedOut] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    userName: "n",
    password: "a1*a1*a1*"
  });
  const [valid, setValid] = useState(false);
  const [failedOnce, setFailedOnce] = useState(false);

  // Auto logout
  useEffect(() => {
    if (!autoLoggedOut) {
      resetUserCredentials();
    }
  }, [autoLoggedOut]);

  useEffect(() => {
    async function backendLogin(onSuccess, onFailure) {
      try {
        const resp = await fetch(loginUrl, { method: "GET" });
        const currentUser = await resp.json();
        setCurrentUser(currentUser);
        setTimeout(() => onSuccess(currentUser), 200);
      } catch (err) {
        console.error("login failure")
        onFailure();
      }
    }

    // Detect logout done
    if (!autoLoggedOut && !securedFetch) {
      setAutoLoggedOut(true);
    }

    // Check new login settings by calling the backend
    if (autoLoggedOut && securedFetch) {
      backendLogin(
        onSuccess,
        () => {
          setFailedOnce(true);
          setAutoLoggedOut(false)
        }
      );
    }
  }, [autoLoggedOut, securedFetch]);

  const updateLoginFormData = (valueMap) => {
    setLoginFormData({
      ...loginFormData,
      ...valueMap
    })
  }

  const onLoginButtonPressed = () => setUserCredentials(loginFormData.userName, loginFormData.password);

  return (
    <SessionManagementContext.Provider
      value={{
        autoLoggedOut,
        failedOnce,
        loginFormData,
        updateLoginFormData,
        valid,
        setValid,
        onLoginButtonPressed,
        onRegisterButtonPressed
      }}
    >
      {children}
    </SessionManagementContext.Provider>
  );
};

LoginFormProvider.defaultProps = {
  loginUrl: "/login"
}

export const useLoginForm = () => {
  return useContext(SessionManagementContext);
};
