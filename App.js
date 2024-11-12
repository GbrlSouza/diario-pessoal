import React, { useState } from 'react';
import { View, Text, Button, TextInput, Image, FlatList, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { launchImageLibrary } from 'react-native-image-picker';
import ReactNativeBiometrics from 'react-native-biometrics';

const Tab = createBottomTabNavigator();

const authenticateWithBiometrics = async () => {
  const rnBiometrics = new ReactNativeBiometrics();

  const { available, biometryType } = await rnBiometrics.isSensorAvailable();

  if (available) {
    const result = await rnBiometrics.simplePrompt({
      promptMessage: 'Autentique-se com biometria',
    });

    if (result.success) {
      alert('Autenticado com sucesso!');
    } else {
      alert('Falha na autenticação');
    }
  } else {
    alert('Sensor biométrico não disponível');
  }
};

const AddEntryScreen = () => {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const handleAddImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSaveEntry = () => {
    console.log('Entrada salva:', content, imageUri);
    setContent('');
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Escreva seu diário..."
        value={content}
        onChangeText={setContent}
        multiline
        style={styles.textInput}
      />
      <Button title="Adicionar Foto" onPress={handleAddImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Salvar Entrada" onPress={handleSaveEntry} />
    </View>
  );
};

const HomeScreen = () => {
  const entries = [
    { id: '1', date: '2024-11-12', content: 'Hoje foi um dia bom!' },
    { id: '2', date: '2024-11-13', content: 'Reflexão do dia...' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diário Pessoal</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryItem}>
            <Text>{item.date}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Button title="Autenticar com Biomentria" onPress={authenticateWithBiometrics} />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Adicionar Entrada" component={AddEntryScreen} />
        <Tab.Screen name="Configurações" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  entryItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});
