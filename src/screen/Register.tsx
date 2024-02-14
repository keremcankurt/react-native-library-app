import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { register, reset } from "features/auth/authSlice";
import { AuthScreenNavigationType } from "navigation/types";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { RootState } from "app/store";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Authentication from "component/Authentication";


const Register = () => {
  const { isSuccess } = useAppSelector((state: RootState) => state.auth);
  const navigation = useNavigation<AuthScreenNavigationType<"Register">>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(isSuccess){
      dispatch(reset())
      navigation.navigate("Login")
    }
  }, [isSuccess])

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
    dispatch(register(userData));
  };


  return (
    <Authentication handleSubmit={onSubmit} type="register"/>
  );
};

export default Register;
