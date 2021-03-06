import React from "react";
import { Text, View } from "react-native";

import { StructForm } from "ezwn-react-native-data-schema/StructForm-cmp";
import { TextButton } from "ezwn-ux-native/app-components/TextButton-cmp";
import { LoginFormProvider, useLoginForm } from "./LoginForm-ctx";
import { Padded } from "ezwn-ux-native/layouts/Padded-cmp";

export const LoginForm = ({ onSuccess, onRegister, loginUrl }) => {
  return (
    <LoginFormProvider
      onSuccess={onSuccess}
      onRegister={onRegister}
      loginUrl={loginUrl}>
      <LoginFormInContext />
    </LoginFormProvider>
  );
};

const loginForm = {
  props: {
    userName: {
      id: "userName",
      type: { primitive: "text", size: [1, 64] }
    },
    password: {
      id: "password",
      type: { primitive: "password", size: [1, 64] }
    }
  }
};

const LoginFormInContext = () => {
  const {
    autoLoggedOut,
    loginFormData,
    updateLoginFormData,
    valid,
    setValid,
    failedOnce,
    onLoginButtonPressed,
    onRegisterButtonPressed
  } = useLoginForm();

  if (!autoLoggedOut) {
    return <></>;
  }

  return <View>
    {failedOnce && <Padded><Text style={{ color: "red" }}>Login failed. Try again.</Text></Padded>}
    <StructForm struct={loginForm} data={loginFormData} updateData={updateLoginFormData} onValidityChange={setValid} />
    <Padded>
      <TextButton alt={false} onPress={onLoginButtonPressed} enabled={valid}>
        Login
        </TextButton>
    </Padded>
    {onRegisterButtonPressed && <Padded>
      <TextButton alt={true} onPress={onRegisterButtonPressed}>
        Register
    </TextButton>
    </Padded>}
  </View>
};
