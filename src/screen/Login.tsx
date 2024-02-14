import React from "react";
import { login } from "features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Authentication from "component/Authentication";

const Login = () => {
  const dispatch = useAppDispatch()
  const onSubmit = (email: string, password: string) => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Lütfen email ve şifre alanlarını doldurun.',
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }
  
    const userData = {
      email,
      password
    };
    dispatch(login(userData));
  };

  return (
    <Authentication handleSubmit={onSubmit} type={"login"}/>
  );
};


export default Login;
