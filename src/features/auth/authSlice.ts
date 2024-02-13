import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "./authService";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  _id: string;
  email: string;
  role: string;
}

const loadUserFromStorage = createAsyncThunk<User | null>('auth/loadUserFromStorage', async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
});

interface AuthState {
  user: User | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
} as AuthState

export const login = createAsyncThunk<User, { email: string; password: string }>(
  'auth/login',
  async (data, thunkAPI) => {
    try {
      const response = await authService.login(JSON.stringify(data));
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      await AsyncStorage.setItem('user', JSON.stringify(result));
      return result;
    } catch (error) {
      const err = error as Error;
      console.log(err)
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: err.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const register = createAsyncThunk<User, { email: string; password: string }>('auth/register', async (data, thunkAPI) => {
  try {
    const response = await authService.register(JSON.stringify(data));
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    Toast.show({
      type: 'success',
      text1: 'registration is successful',
      text2: result.message,
      position: 'bottom',
      visibilityTime: 2000,
      autoHide: true,
    });
    return result;
  } catch (error) {
    const err = error as Error;
    Toast.show({
      type: 'error',
      text1: 'Something went wrong',
      text2: err.message,
      position: 'bottom',
      visibilityTime: 2000,
      autoHide: true,
    });
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    logoutUser: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.user = null;
      AsyncStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export { loadUserFromStorage };
export const { reset, logoutUser } = authSlice.actions;
export default authSlice.reducer;
