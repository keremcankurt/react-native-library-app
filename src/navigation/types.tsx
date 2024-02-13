import { CompositeNavigationProp, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Book } from "features/book/bookSlice"


export type AuthStackParamList = {
    Welcome: undefined
    Login: undefined
    Register: undefined
}

export type RootBottomTabParamList = {
    HomeStack: NavigatorScreenParams<HomeStackParamList>
    AddBook: undefined
}

export type HomeStackParamList = {
    Home: undefined
    UpdateBook: {
      book: Book
  }
    Book: {
        book: Book
    }
}

export type AppStackParamList = {
    Root: NavigatorScreenParams<RootBottomTabParamList>
}

export type RootStackParamList = {
    AppStack: NavigatorScreenParams<AppStackParamList>
    AuthStack: NavigatorScreenParams<AuthStackParamList>
}

declare global {
    namespace ReactNavgation{
        interface RootParamList extends RootStackParamList {}
    }
}

export type AuthScreenNavigationType<
  RouteName extends keyof AuthStackParamList
> = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList, RouteName>,
  NativeStackNavigationProp<AppStackParamList, "Root">
>

export type HomeScreenNavigationType<
  RouteName extends keyof HomeStackParamList
> = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, RouteName>,
  NativeStackNavigationProp<HomeStackParamList, "Home">
>