import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { RootBottomTabParamList } from "./types"
import HomeStackNavigator from "./home-stack-navigator"
import AddBook from "screen/AddBook"
import { Ionicons } from "@expo/vector-icons"


const Tab = createBottomTabNavigator<RootBottomTabParamList>()

const BottomTabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name="HomeStack"
          component={HomeStackNavigator}
          options={() => ({
            title: "Ana Sayfa",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
              ),
          })}
        />
        <Tab.Screen
          name="AddBook"
          component={AddBook}
          options={() => ({
            title: "Kitap Ekle",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add" size={size} color={color} />
              ),
          })}
        />
      </Tab.Navigator>
    )
  }
  
  export default BottomTabNavigator