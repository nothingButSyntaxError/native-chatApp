import React, {useLayoutEffect, useEffect, useState} from 'react';
import {SafeAreaView, View,  StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native';
import CustomListItem from '../components/CustomListItem';
import {auth, db} from '../firebase';
import {Avatar} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {containerStyle} from 'react-native-elements';
import * as firebase from 'firebase';


const Home = ({navigation}) => {

  const [chats, setChats] = useState([]);

  const user = firebase.auth().currentUser;

  const signOut = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    })
  }

  useEffect(() => {
    const unsubscribe = db.collection('chats').onSnapshot(snapshot => (
      setChats(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    ))
    return unsubscribe;
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Connect',
      headerLeft: () => (
        <View style={{marginLeft: 20}}>
          <TouchableOpacity onPress={signOut}>
            <Avatar rounded source={{uri: auth?.currentUser?.photoURL}} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 80, marginRight: 20}}>
          <TouchableOpacity>
            <AntDesign onPress={() => navigation.navigate('ChangePfp')} name='camerao' size={24} color='black' />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons onPress={() => navigation.navigate('AddNewChat')} name='pencil-plus' size={24} color="black" />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation])

  const enterChat = (id, chatName) => {
      navigation.navigate('Chat', {
        id,
        chatName,
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{backgroundColor: '#282828', width: '100%', height: '100%'}}>
           {chats.map(({id, data: {chatName, chatter1, chatter0}}) => (
             user.email === chatter1 || user.email === chatter0 ?
            <CustomListItem key={id} id={id} chatName={id} style={{color: '282828'}} enterChat={enterChat} />
          :null))}
      </ScrollView>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {},
})
