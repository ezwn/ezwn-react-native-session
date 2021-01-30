import React, { useContext, useEffect, useState } from "react";
import { useStorage } from "ezwn-storage-native/JSONAsyncStorage";

const SessionContext = React.createContext();

const generateFetch = (dataServerUrl, dataServerUser, dataServerPassword) => {
  const loginInit = (dataServerUser && dataServerPassword)
    ? {
      headers: {
        Authorization: 'Basic ' + btoa(`${dataServerUser}:${dataServerPassword}`)
      }
    }
    : { headers: {} };

  return (input, paramInit) => {
    if (input === undefined) {
      throw new Error();
    }

    const url = `${dataServerUrl}${input}`;

    // console.log({ url, dataServerUser, dataServerPassword })

    const headers = paramInit && paramInit.headers ? { ...loginInit.headers, ...paramInit.headers } : loginInit.headers;
    const init = paramInit ? { ...loginInit, ...paramInit, headers } : loginInit

    return fetch(url, init)
  }
}

export const SessionProvider = ({ children, defaultUserInfo, storageKey, dataServerUrl }) => {
  const [settings, setSettings, loaded] = useStorage(
    storageKey,
    () => ({
      dataServerUrl,
      dataServerUser: null,
      dataServerPassword: null
    })
  );

  const { dataServerUser, dataServerPassword } = settings;

  const [currentUser, setCurrentUser] = useState(defaultUserInfo);

  const [fetchFn, setFetchFn] = useState(() => generateFetch(dataServerUrl, dataServerUser, dataServerPassword));

  const [securedFetch, setSecuredFetch] = useState(false);

  useEffect(() => {
    setFetchFn(() => generateFetch(dataServerUrl, dataServerUser, dataServerPassword));
    setSecuredFetch(!!dataServerUser);
  }, [dataServerUrl, dataServerUser, dataServerPassword]);

  const setUserCredentials = (user, password) => {
    setSettings({
      ...settings,
      dataServerUser: user,
      dataServerPassword: password
    })
  }

  function resetUserCredentials() {
    setSettings({
      ...settings,
      dataServerUser: null,
      dataServerPassword: null
    });

    setCurrentUser(defaultUserInfo);
  }

  return loaded ? (
    <SessionContext.Provider
      value={{
        setUserCredentials,
        resetUserCredentials,
        currentUser,
        setCurrentUser,
        fetch: fetchFn,
        securedFetch
      }}
    >
      {children}
    </SessionContext.Provider>
  ) : null;
};

SessionProvider.defaultProps = {
  defaultUserInfo: {
    id: null
  },
  storageKey: "session-settings",
  dataServerUrl: null
};

export const useSession = () => {
  return useContext(SessionContext);
};
