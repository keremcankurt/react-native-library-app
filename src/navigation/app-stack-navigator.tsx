import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React, { useEffect } from "react"
import BottomTabNavigator from "./bottom-tab-navigator"
import { AppStackParamList } from "./types"
import { RootState } from "app/store"
import HomeStackNavigator from "./home-stack-navigator"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { getAllBooks } from "features/book/bookSlice"

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStackNavigator = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getAllBooks())
  },[])
  
  //Kullanıcı admin ise kitap ekle (tab nagivator) kısmını getiriyoruz
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={user?.role === "admin" ? BottomTabNavigator : HomeStackNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default AppStackNavigator