import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { RootState } from 'app/store';
import { logoutUser } from 'features/auth/authSlice';
import { Book } from 'features/book/bookSlice';
import { HomeScreenNavigationType } from 'navigation/types';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Filters {
  ISBN: string;
  name: string;
  author: string;
}

const Home = () => {
  const [sorting, setSorting] = useState<string>('name');
  const [sortedBooks, setSortedBooks] = useState<Book[]>([]);
  const { isLoading, books } = useAppSelector((state: RootState) => state.book);
  const dispatch = useAppDispatch()
  const [filters, setFilters] = useState<Filters>({
    ISBN: '',
    name: '',
    author: ''
  });
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);


  //Kitaplar değiştiği zaman tekrardan filtreleme işlemi yapılıyor (örnek olarak güncelleme işlemi veya kitap silme işleminde)
  useEffect(() => {
    handleFilterSubmit()
  },[books])
  //Kitap filtreleme işlemi yapıldığında tekrardan kitapları sıralamak gerekiyor
  useEffect(() => {
    handleSortChange(sorting)
  },[filteredBooks])

  const handleFilterChange = (type: keyof Filters, text: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [type]: text
    }));
  };
  const handleFilterSubmit = () => {
    if (books.length === 0) {
      return; 
    }
  
    //Kitap filtreleme işlemi
    const filtered = books.filter(book => {
      if (filters.ISBN && !book.ISBN.includes(filters.ISBN)) {
        return false;
      }
      if (filters.name && !book.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      //filtreleme de belirtilen yazar ismi ile kitapların herhangi bi yazarı eşleşiyorsa
      if (filters.author && !book.authors.some((a: String) => a.toLowerCase().includes(filters.author.toLowerCase()))) {
        return false;
      }
      return true;
    });
    setFilteredBooks(filtered);
  };

  const handleSortChange = (type: string) => {
    let sorted: Book[] = [];
  
    switch (type) {
      case 'name':
        sorted = [...filteredBooks].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'author':
        sorted = [...filteredBooks].sort((a, b) => a.authors.join('').localeCompare(b.authors.join('')));
        break;
      case 'ISBN':
        sorted = [...filteredBooks].sort((a, b) => a.ISBN.localeCompare(b.ISBN));
        break;
      default:
        sorted = filteredBooks;
        break;
    }
  
    setSortedBooks(sorted);
  };
  
  const navigation = useNavigation<HomeScreenNavigationType<"Home">>()
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View >
      <Text style={styles.title}>Kitap Arama</Text>
      <TouchableOpacity onPress={() => dispatch(logoutUser())} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => handleFilterChange('ISBN', text)}
          value={filters.ISBN}
          placeholder="ISBN Numarasına Göre Ara"
        />
        <TextInput
          style={styles.input}
          onChangeText={text => handleFilterChange('name', text)}
          value={filters.name}
          placeholder="Kitap İsmine Göre Ara"
        />
        <TextInput
          style={styles.input}
          onChangeText={text => handleFilterChange('author', text)}
          value={filters.author}
          placeholder="Yazarlara Göre Ara"
        />
      </View>
      <Button title="Filtrele" onPress={handleFilterSubmit} />
      <View style={styles.divider} />
      {
        sortedBooks.length > 0 &&
        <View style={styles.filterContainer}>
        <Picker
          selectedValue={sorting}
          style={{ height: 50, width: 260 }}
          onValueChange={(itemValue) => {
            setSorting(itemValue as string);
            handleSortChange(itemValue as string);
          }}
        >
          <Picker.Item label="İsme Göre" value="name" />
          <Picker.Item label="Yazara Göre" value="author" />
          <Picker.Item label="ISBN Numarasına Göre" value="ISBN" />
        </Picker>
      </View>
      }
      {
        books.length > 0 ?
       ( filteredBooks.length > 0 ?
        <ScrollView >
          <View style={styles.booksContainer}>
            {sortedBooks.map((book, index) => (
              <TouchableOpacity key={index} style={styles.book} onPress={() => navigation.navigate('Book', {book})}>
                <Image
                  style={styles.image}
                  source={{ uri: `data:image/jpeg;base64,${book.coverImage}` }}
                  
                />
                <Text style={styles.bookName}>{book.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>: <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Aramanıza uygun kitap bulunmamaktadır.</Text>)
        
        :
        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Kitap Listesi Boş.</Text>
      }
    </View>
  );
};

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  image: {
    width: width / 2 - 60,
    height: height / 4,
    resizeMode: 'contain',
    borderRadius: 5
  },
  book: {
    width: width / 2 - 60,
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 20,
  },
  booksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  bookName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5, 
  },
  logoutButton: {
    position: 'absolute',
    top: 5,
    right: 10,
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  }
});


export default Home;
