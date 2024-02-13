import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AuthStackParamList } from "./types"
import Login from "screen/Login"
import Register from "screen/Register"

const Stack = createNativeStackNavigator<AuthStackParamList>()
const AuthStackNavigator = () => {
  
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'none'}}>
        <Stack.Screen name="Login"  component={Login}/>
        <Stack.Screen name="Register" component={Register}/>
    </Stack.Navigator>
  )
}

export default AuthStackNavigator