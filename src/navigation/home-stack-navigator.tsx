
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { HomeStackParamList } from "./types"
import Home from "screen/Home"
import UpdateBook from "screen/UpdateBook"
import Book from "screen/Book"

const Stack = createNativeStackNavigator<HomeStackParamList>()

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Book"
        component={Book}
        options={{
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          
        }}
      />
      <Stack.Screen
        name="UpdateBook"
        component={UpdateBook}
        options={{
          headerTitleAlign: "center",
          title: "Güncelle",
          headerTitleStyle: {
            fontWeight: 'bold',
            
          },
          
        }}
      />
    </Stack.Navigator>
  )
}

export default HomeStackNavigator