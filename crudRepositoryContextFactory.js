import React, { useCallback, useContext, useState, createContext } from "react";
import { useHistory } from "react-router";
import crudBackendClientFactory from "./crudBackendClientFactory";
import { useSession } from "lib/ezwn-react-native-persist-common/Session-ctx";

export default (endpoint, createNew) => {

  const backendClient = crudBackendClientFactory(endpoint);

  const CrudRepositoryContext = createContext();

  const CrudRepositoryProvider = ({ children }) => {
    const [list, setList] = useState([]);
    const { fetch } = useSession();
    const history = useHistory();

    // Backend interaction
    const findAll = useCallback(() => {
      backendClient.findAll(fetch)
        .then((items) => {
          setList(items);
        }).catch(() => {
          history.replace("/login")
        });
    }, [fetch]);

    const save = useCallback((item) => {
      backendClient.save(fetch, item)
        .then(() => {
          findAll();
        }).catch(() => {
          history.replace("/login")
        });
    }, [fetch]);

    const deleteItem = useCallback((item) => {
      backendClient.delete(fetch, item)
        .then(() => {
          findAll();
        }).catch(() => {
          history.replace("/login")
        });
    }, [fetch]);

    // public interface
    const findById = (id) => {
      return list.find(r => r.id === id);
    }

    const replace = (newItem) => {
      save(newItem);
    }

    const insertNew = () => {
      const item = createNew();
      setList([list, item]);
      return item;
    }

    const deleteById = (id) => {
      deleteItem(list.find(r => r.id === id));
    }

    return (
      <CrudRepositoryContext.Provider
        value={{
          list,
          findAll,
          replace,
          findById,
          insertNew,
          deleteById
        }}
      >
        {children}
      </CrudRepositoryContext.Provider>
    );
  };

  const useCrudRepository = () => {
    return useContext(CrudRepositoryContext);
  };

  return {
    CrudRepositoryProvider,
    useCrudRepository
  }
};
