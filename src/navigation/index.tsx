import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStackNavigator from './auth-stack-navigator'
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';
import { useAppDispatch } from 'app/hooks';
import { loadUserFromStorage } from 'features/auth/authSlice';
import AppStackNavigator from './app-stack-navigator';

const Navigation = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [])

  //Kullanıcı eğer giriş yapmamışsa Auth navigator(giriş ve kayıt olma ekranları)-giriş yapmışsa app navigator(ana sayfa) gösterilecek
  return (
    <NavigationContainer>
      {!user ?
        <AuthStackNavigator/>
        :
        <AppStackNavigator/>
      }
    </NavigationContainer>
  )
}

export default Navigation
