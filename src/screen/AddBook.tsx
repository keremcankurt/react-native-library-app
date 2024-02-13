import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';
import { useAppDispatch } from 'app/hooks';
import { Book, addBook } from 'features/book/bookSlice';
import BookForm from 'component/BookForm';

const AddBook = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch()
  const [bookData, setBookData] = useState<Book>({
    name: '',
    _id: '',
    ISBN: '',
    authors: [''],
    coverImage: '',
    description: '',
    genre: ''
  });
  const handleAddBook = async () => {
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
        dispatch(addBook({data,id: user._id}))
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
        })
      }
  
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Kitap ekleme işlemi sırasında bir hata oluştu',
        text2: error.message,
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };
  return <BookForm bookData={bookData} setBookData={setBookData} handleSubmit={handleAddBook} />;
}

export default AddBook

const styles = StyleSheet.create({})