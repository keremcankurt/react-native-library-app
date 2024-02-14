import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationType, HomeStackParamList } from 'navigation/types';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { RootState } from 'app/store';
import { deleteBook } from 'features/book/bookSlice';
import Toast from 'react-native-toast-message';

type BookRouteType = RouteProp<HomeStackParamList, "Book">;

const Book = () => {
  const navigation = useNavigation<HomeScreenNavigationType<"Book">>();

  const { user } = useAppSelector((state: RootState) => state.auth);
  const { isLoading } = useAppSelector((state: RootState) => state.book);
  const dispatch = useAppDispatch()

  const route = useRoute<BookRouteType>();
  const { book } = route.params;
  //Ekran başlığı kitap ismi yapılıyor
  useEffect(() => {
    navigation.setOptions({
      title: `${book.name}`,
    });
  },[book])

  const handleDelete = () => {
    if (user?.role === 'admin') {
      dispatch(deleteBook({ userId: user._id, bookId: book._id }))
        .then(() => {
          navigation.goBack();
        })
        .catch((error: {message: string}) => {
          Toast.show({
            type: 'error',
            text1: 'Silme işlemi başarısız oldu',
            text2: error.message,
            position: 'bottom',
            visibilityTime: 2000,
            autoHide: true,
          });
        });
    }
  };
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${book.coverImage}` }}
          style={styles.image}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}><Text style={{fontWeight: 'bold'}}>ISBN:</Text> {book.ISBN}</Text>
        <Text style={styles.infoText}><Text style={{fontWeight: 'bold'}}>Yazarlar:</Text> {book.authors.join(', ')}</Text>
        <Text style={styles.infoText}><Text style={{fontWeight: 'bold'}}>Tür:</Text> {book.genre}</Text>
        <Text style={styles.description}>{book.description}</Text>
      </View>
      {
        user?.role === "admin" &&
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, {backgroundColor: "lightgreen"}]} onPress={() => navigation.navigate("UpdateBook",{book})}>
          <Text style={styles.buttonText}>Güncelle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: "red"}]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Sil</Text>
        </TouchableOpacity>
      </View>
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10
  },
  description: {
    fontSize: 16,
    textAlign: 'justify',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 40,
    justifyContent: 'center',
    gap: 10
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  }
});

export default Book;
