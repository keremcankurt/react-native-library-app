import React, { useEffect, useState } from "react";
import {  ImageBackground, StyleSheet, Text, TextInput, View, Animated, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { register, reset } from "features/auth/authSlice";
import { AuthScreenNavigationType } from "navigation/types";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { RootState } from "app/store";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const backgroundImage = require("../../assets/background.jpg");

interface FormData {
  email: string;
  password: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  });
  const { isSuccess, isLoading } = useAppSelector((state: RootState) => state.auth);
  const navigation = useNavigation<AuthScreenNavigationType<"Register">>()
  const dispatch = useAppDispatch()
  const { email, password } = formData;

  const animY = new Animated.Value(1000); 

  useEffect(() => {
    Animated.timing(
      animY, 
      {
        toValue: 0, 
        duration: 1000, 
        useNativeDriver: false,
      }
    ).start();
  }, []);

  useEffect(() => {
    if(isSuccess){
      dispatch(reset())
      navigation.navigate("Login")
    }
  }, [isSuccess])

  const onChange = (name: keyof FormData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const onSubmit = () => {
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
  
    const userData: FormData = {
      email,
      password
    };
    dispatch(register(userData));
  };


  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <Animated.View style={[styles.container, {transform: [{translateY: animY}]}]}>
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Hoşgeldiniz</Text>
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            onChangeText={(text) => onChange("email", text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            onChangeText={(text) => onChange("password", text)}
            value={password}
            secureTextEntry
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={onSubmit} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            )}
          </TouchableOpacity>
          <View style={styles.login}>
            <Text>Zaten bir hesabın var mı?</Text>
            <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={{ color: '#007bff' }} >Giriş Yap</Text>
          </TouchableOpacity>
          </View>
          
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)", 
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  login: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 5
  },
});

export default Register;
