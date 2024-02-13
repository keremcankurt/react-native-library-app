import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';
import { useAppDispatch } from 'app/hooks';
import { Book, addBook, updateBook } from 'features/book/bookSlice';
import BookForm from 'component/BookForm';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationType, HomeStackParamList } from 'navigation/types';

type BookRouteType = RouteProp<HomeStackParamList, "UpdateBook">;
const UpdateBook = () => {
  const navigation = useNavigation<HomeScreenNavigationType<"UpdateBook">>();

  const { user } = useSelector((state: RootState) => state.auth);

  const route = useRoute<BookRouteType>();
  const { book } = route.params;
  const dispatch = useAppDispatch()
  const [bookData, setBookData] = useState<Book>(book);
  const handleUpdateBook = async () => {
    try {
      if (bookData.coverImage === "" || 
          bookData.name === "" ||
          bookData.ISBN === "" ||
          bookData.description === "" ||
          bookData.genre === "" ||
          bookData.authors.some(author => author.trim() === "")) {
        throw new Error('Lütfen tüm alanları doldurun.');
      }
      const data = {
        name: bookData.name,
        ISBN: bookData.ISBN,
        description: bookData.description,
        coverImage: bookData.coverImage,
        genre: bookData.genre,
        authors: bookData.authors
      }
      if(user){
        dispatch(updateBook({data, userId: user._id, bookId: book._id}))
        .then(() => {
          setBookData({
            name: '',
            _id: '',
            ISBN: '',
            authors: [''],
            coverImage: '',
            description: '',
            genre: ''
          })
          navigation.navigate("Home");
        })
      }
  
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Kitap güncelleme işlemi sırasında bir hata oluştu',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };
  return <BookForm bookData={bookData} setBookData={setBookData} handleSubmit={handleUpdateBook} />;
}

export default UpdateBook

const styles = StyleSheet.create({})