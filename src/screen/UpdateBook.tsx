import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Toast from 'react-native-toast-message';
import { RootState } from 'app/store';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Book, updateBook } from 'features/book/bookSlice';
import BookForm from 'component/BookForm';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationType, HomeStackParamList } from 'navigation/types';

//Update book alanına hangi parametrelerin geldiğini öğrenmek için kullanıyoruz
type BookRouteType = RouteProp<HomeStackParamList, "UpdateBook">;
const UpdateBook = () => {
  const navigation = useNavigation<HomeScreenNavigationType<"UpdateBook">>();

  const { user } = useAppSelector((state: RootState) => state.auth);

  const route = useRoute<BookRouteType>();
  //Güncellenecek kitabı paramterle olarak alıyoruz
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