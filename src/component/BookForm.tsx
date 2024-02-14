import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';


//Prop olarak geçilen alanların içerikleri belirleniyor
interface BookFormProps {
    bookData: {
      name: string;
      _id: string;
      ISBN: string;
      authors: string[];
      coverImage: string;
      description: string;
      genre: string;
    };
    setBookData: React.Dispatch<React.SetStateAction<{
      name: string;
      _id: string;
      ISBN: string;
      authors: string[];
      coverImage: string;
      description: string;
      genre: string;
    }>>;
    handleSubmit: () => void;
  }
  const BookForm: React.FC<BookFormProps> = ({ bookData, setBookData, handleSubmit }) => {

    const { isLoading } = useSelector((state: RootState) => state.book);



  const handleImageChange = async () => {
    try {
        //Kitap kapağı için görsel alınırken öncelikle dosya erişim izni istiyoruz
      let result: ImagePicker.ImagePickerResult | null = null;
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (permissionResult.granted === false) {
        throw new Error('Dosya erişim izni reddedildi.');
      }
  
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3,4],
        quality: 1, 
        base64: true
      });
      //Seçilen resmi base64 türünde alıyoruz(veritabanına base64 formatında kaydettiğimiz için)
      if (result && !result.canceled && result.assets && result.assets.length > 0 && result.assets[0].base64) {
        const base64 = result.assets[0].base64;
        setBookData({ ...bookData, coverImage: base64 });
      } else {

        console.log('Kullanıcı resim seçme işlemini iptal etti veya resim URI bulunamadı.');
      }
      
    } catch (error) {
      console.error('Resim seçme işlemi sırasında bir hata oluştu:', error);
    }
  };

  const handleNameChange = (name: string) => {
    setBookData({ ...bookData, name });
  };

  const handleISBNChange = (ISBN: string) => {
    setBookData({ ...bookData, ISBN });
  };

  const handleDescriptionChange = (description: string) => {
    setBookData({ ...bookData, description });
  };

  const handleGenreChange = (genre: string) => {
    setBookData({ ...bookData, genre });
  };

  const handleAuthorChange = (author: string, index: number) => {
    const updatedAuthors = [...bookData.authors];
    updatedAuthors[index] = author;
    setBookData({ ...bookData, authors: updatedAuthors });
  };

  const addAuthorInput = () => {
    setBookData({ ...bookData, authors: [...bookData.authors, ''] });
  };

  const removeAuthorInput = (index: number) => {
    const updatedAuthors = [...bookData.authors];
    updatedAuthors.splice(index, 1);
    setBookData({ ...bookData, authors: updatedAuthors });
  };

  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={handleImageChange}>
          {bookData.coverImage ? ( 
            
            <Image source={{ uri: `data:image/jpeg;base64,${bookData.coverImage}` }}  style={styles.image} />
          ) : (
            <Text>Resim Ekle</Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Kitap Adı"
        value={bookData.name}
        onChangeText={handleNameChange}
      />

      <TextInput
        style={styles.input}
        placeholder="ISBN"
        value={bookData.ISBN}
        onChangeText={handleISBNChange}
      />

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Tanım"
        value={bookData.description}
        onChangeText={handleDescriptionChange}
        multiline={true}
        numberOfLines={4} 
      />

      <TextInput
        style={styles.input}
        placeholder="Tür"
        value={bookData.genre}
        onChangeText={handleGenreChange}
      />
      {bookData.authors.map((author, index) => (
        <View key={index} style={styles.authorInputContainer}>
          <TextInput
            style={[styles.input, styles.authorInput]}
            placeholder="Yazar"
            value={author}
            onChangeText={(text) => handleAuthorChange(text, index)}
          />
          {index !== 0 && (
            <TouchableOpacity onPress={() => removeAuthorInput(index)} style={styles.removeAuthorButton}>
              <Text style={styles.removeAuthorButtonText}>Sil</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      <TouchableOpacity onPress={addAuthorInput} style={styles.addAuthorButton}>
        <Text style={styles.addAuthorButtonText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
      <Text style={styles.addButtonLabel}>Kitabı Kaydet</Text>
    </TouchableOpacity>
    </ScrollView>
  );
};

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width, 
    marginVertical: 20,
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 5,
  },
  authorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorInput: {
    flex: 1,
  },
  removeAuthorButton: {
    marginLeft: 10,
  },
  removeAuthorButtonText: {
    color: 'red',
  },
  addAuthorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addAuthorButtonText: {
    fontSize: 20,
  },
  descriptionInput: {
    height: 100, 
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButtonLabel: {
    color: 'white',
    fontSize: 18,
  },
});

export default BookForm;
