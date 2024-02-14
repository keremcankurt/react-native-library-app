import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookService from "./bookService";
import { Toast } from "react-native-toast-message/lib/src/Toast";


//Kitap bilgilerini tutuyoruz ve diğer alanlarda da kullandığımız için export etmemiz gerekiyor
export interface Book {

  name: string;
  _id: string;
  ISBN: string;
  authors: string[];
  coverImage: string;
  description: string;
  genre: string;
}

interface BookState {
  books: Book[];
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: BookState = {
  books: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getAllBooks = createAsyncThunk<Book[], void>(
  'book/getAllBooks',
  async (_, thunkAPI) => {
    try {
      const response = await bookService.getAllBooks();
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
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
  }
);
export const deleteBook = createAsyncThunk<string, {userId: string, bookId: string}>(
  'book/delete',
  async (data, thunkAPI) => {
    try {
      const response = await bookService.deleteBook(data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return data.bookId;
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
  }
);
export const addBook = createAsyncThunk<Book, any>(
  'book/add',
  async ({data, id}, thunkAPI) => {
    try {
      const response = await bookService.addBook(JSON.stringify(data),id);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      Toast.show({
        type: 'success',
        text1: 'Yeni Kitap',
        text2: result.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
        
      });
      return result.data;
    } catch (error) {
      const err = error as Error;
      alert("Hata: " + err.message);
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
export const updateBook = createAsyncThunk<Book, any>(
  'book/update',
  async ({data, userId, bookId}, thunkAPI) => {
    try {
      const response = await bookService.updateBook(JSON.stringify(data),userId, bookId);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      Toast.show({
        type: 'success',
        text1: 'GÜncelleme',
        text2: result.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
        
      });
      return result.data;
    } catch (error) {
      const err = error as Error;
      alert("Hata: " + err.message);
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
export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
      })
      .addCase(getAllBooks.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = state.books.filter(book => book._id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books.push(action.payload)
      })
      .addCase(addBook.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.books.findIndex(book => book._id === action.payload._id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state) => {
        state.isLoading = false;
      })
  }
});

export const { reset } = bookSlice.actions;
export default bookSlice.reducer;
