/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React and Hook we needed
import React, { useState } from 'react';

//Import all required component
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,ScrollView,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from './Components/loader';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
const LoginScreen = props => {
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState('');
  let [loading, setLoading] = useState(false);
  let [errortext, setErrortext] = useState('');
  state = { user: null };
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);

  async function signInWithGoogleAsync  ()  {
    try {
      const result = await Google.logInAsync({
        androidClientId: "799869158940",
        //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
        scopes: ["profile", "email"]

      })
      if (result.type === "success") {
        const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
           firebase.auth().signInAndRetrieveDataWithCredential(credential).then(function(result){
             console.log(result);
           });
   this.props.navigation.navigate('Where you want to go');
 } else {
   console.log("cancelled")
 }
    } catch (e) {
      console.log("error", e)
    }
}


    async function facebookLogIn() {
      // try {
        await Facebook.initializeAsync({
          appId: '3838307209625245',
        });
        const {
          type,
          token,
          expirationDate,
          permissions,
          declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile','email'],
        });
        if (type === 'success') {
          // Get the user's name using Facebook's Graph API
          const response = await fetch(`https://graph.facebook.com/me?fields=name,email&access_token=${token}`);
          await response.json().then(response => {
            setLoading(true);
      
            loginFB(response.email, response.name)

          })
        } else {
          // type === 'cancel'
        }
      // } catch ({ message }) {
      //   alert(`Facebook Login Error: ${message}`);
      // }
    }



      async function loginFB(emailFB, nameFB){
        await fetch(global.MyVar+'login', {
          method: 'POST',
          body: JSON.stringify({
            type:'fb',
            email: emailFB,
            name:nameFB
          }),
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
  
        }).then(response => response.json())
        .then(responseJson => {
          //Hide Loader
          setLoading(false);
          
  
          if (responseJson.errors) {
            Object.keys(responseJson.errors).map((key, index) => {
              
              setErrortext(responseJson.errors[key]);
            })
          }
          // If server response message same as Data Matched
          if (responseJson.access_token) {
            
            if (responseJson.rememberToken === '') {
              AsyncStorage.setItem('access_token', responseJson.access_token);
              props.navigation.navigate('DrawerNavigationRoutes');
            } else {
              setErrortext('Акаунта ви все още не е потвърден');
  
            }
          }
        }).catch(function (error) {
          
          // ADD THIS THROW error
          throw error;
        });
        }
      
  const run = () => {
    Alert.alert('Logged in with Google!', 'Name:' + ' ' + client.name + '\n' + 'Email:' + ' ' + client.email);
  }

  async function signInWithGoogleAsync2() {
console.log('sssssssssssssssssssssssss'); 
    try {
      const result = await Google.logInAsync({
        androidClientId: '1052999349908-kjhff3atsjdfdisrjetn08mh5gp2emqg.apps.googleusercontent.com',
        // iosClientId: YOUR_CLIENT_ID_HERE,
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${result.accessToken}`)
        // 
        
        const clientdata = await response.json();
        setClient(clientdata)
        // 
        // Alert.alert('Logged in with Google!', 'Name:' + ' ' + client.name + '\n' + 'Email:' + ' ' + client.email);
        run();
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e)
      return { error: true };
    }
  };

  handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('Имейла е задължителен');
      return;
    }
    if (!userPassword) {
      alert('Паролата е задължителна');
      return;
    }
    setLoading(true);
    var dataToSend = { email: userEmail, password: userPassword };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    
    formBody = formBody.join('&');
    console.log(formBody)
    fetch(global.MyVar+'login', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    }).then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        setLoading(false);
        

        if (responseJson.errors) {
          Object.keys(responseJson.errors).map((key, index) => {
            
            setErrortext(responseJson.errors[key]);
          })
        }
        // If server response message same as Data Matched
        if (responseJson.access_token) {
          
          if (responseJson.rememberToken === '') {
            AsyncStorage.setItem('access_token', responseJson.access_token);
            props.navigation.navigate('DrawerNavigationRoutes');
          } else {
            setErrortext('Акаунта ви все още не е потвърден');

          }
        }
      })
      .catch(error => {
        

        //Hide Loader
        setLoading(false);
      });
  };
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>

      <Loader loading={loading} />

      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('../Image/aboutreact.png')}
            style={{
              width: '50%',
              height: 100,
              resizeMode: 'contain',
            }}
          />
        </View>
        <View style={{
          alignItems: 'center', padding: 0, margin: 0,
          height: 200
        }}>
          <Image
            source={require('../Image/regImg.jpg')}
            style={{
              backgroundColor: 'green',
              width: '50%',
              height: '100%'
            }}
          />
        </View>
        <KeyboardAvoidingView enabled style={{
          borderColor: 'black', borderWidth: 1, width: '90%',
          borderRadius: 10, alignItems: 'center', marginLeft: 15, marginTop: -1, paddingBottom: 30
        }}>

          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserEmail => setUserEmail(UserEmail)}
              underlineColorAndroid="#FFFFFF"
              placeholder="Имейл" //dummy@abc.com
              placeholderTextColor="black"
              autoCapitalize="none"
              keyboardType="email-address"
              blurOnSubmit={false}
              onSubmitEditing={() => { thirdTextInput.focus(); }}
              returnKeyType="next"
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserPassword => setUserPassword(UserPassword)}
              underlineColorAndroid="#FFFFFF"
              placeholder="Парола" //12345
              placeholderTextColor="black"
              keyboardType="default"
              returnKeyType="next"
              secureTextEntry={true} 
              ref={(input) => {thirdTextInput = input; }}
              blurOnSubmit={false}
              onSubmitEditing={() => { handleSubmitPress() }}
            />
          </View>
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}> {errortext} </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitPress}>
            <Text style={styles.buttonTextStyle}>Вход</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 10 }}>
            {/* Facebook LoginButton */}
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={{...styles.buttonStyle, marginLeft:50,backgroundColor: '#3b5998',marginTop:10,paddingTop:5}} onPress={facebookLogIn}>
                          <Text style={{ flex:1, justifyContent: 'center', height:45, textAlign: 'center', color: '#ffffff', marginTop:5 }}>Login with Facebook</Text>
                        </TouchableOpacity>
            </View>
            {/* Google LoginButton */}
            {/* <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.googloginBtn} onPress={signInWithGoogleAsync}>
                          <Text style={{flex:1, justifyContent: 'center', textAlign: 'center', color: '#ffffff', marginTop:5}}>Login with Google</Text>
                        </TouchableOpacity>
            </View> */}
          </View>
          <Text
            style={styles.registerTextStyle}
            onPress={() => props.navigation.navigate('RegisterScreen')}>
            Регистрация
                        </Text>
          <Text
            style={{ ...styles.registerTextStyle, color: 'silver', marginTop:9 }}
            onPress={() => props.navigation.navigate('ForgottenPassword')}>
            Забравена парола
                        </Text>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );

}
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#689F38',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
    width: 200
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#6e6e6e',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'silver',
  },
  registerTextStyle: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  fbloginBtn: {
    backgroundColor: '#3b5998',
    height: 45,
    paddingTop: 7,
    width:'50%',
    alignItems: 'center',
    borderRadius: 50,
    marginRight: 5
  },
  googloginBtn: {
    backgroundColor: '#db4a39',
    height: 30,
    borderRadius: 50,
    marginRight: 5
  }
});