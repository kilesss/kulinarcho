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
    Image,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
    } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from './Components/loader';
import DropdownAlert from 'react-native-dropdownalert';

const ForgottenPassword = props => {
    let [userEmail, setUserEmail] = useState('');
    let [userPassword, setUserPassword] = useState('');
    let [loading, setLoading] = useState(false);
    let [errortext, setErrortext] = useState('');

    const handleSubmitPress = () => {
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
        fetch('http://167.172.110.234/api/login', {
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
                console.log(responseJson);

                if (responseJson.errors) {
                    Object.keys(responseJson.errors).map((key, index) => {
                        console.log(responseJson.errors[key])
                        setErrortext(responseJson.errors[key]);
                    })
                  }
                // If server response message same as Data Matched
                if (responseJson.access_token) {
                    console.log(responseJson);
                    if(responseJson.rememberToken ===''){
                        AsyncStorage.setItem('access_token', responseJson.access_token);
                        props.navigation.navigate('DrawerNavigationRoutes');   
                    }else{
                    setErrortext('Акаунта ви все още не е потвърден');

                    }
                } 
            })
            .catch(error => {
                console.log(error);

                //Hide Loader
                setLoading(false);
            });
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

        <Loader loading={loading} />
        
        <View style={{marginTop:50}}>
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
            <View style={{ alignItems: 'center', padding:0, margin:0,
          height: 200}}>
                <Image 
                    source={require('../Image/regImg.jpg')}
                    style={{ backgroundColor: 'green',
          width: '50%',
          height: '100%'
        }}
                    />
            </View>
            <KeyboardAvoidingView enabled style={{borderColor:'black',borderWidth:1,width:'90%',
            borderRadius:10,alignItems: 'center',marginLeft:15, marginTop:-1, paddingBottom:30}}>
                                                   <Text style={{marginLeft:10, marginTop:10, marginRight:10}}>Въведете имейла на който ще получите линк за възстановяване на паролата</Text>

                        <View style={{...styles.SectionStyle, marginTop:5, marginBottom:0}}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={UserEmail => setUserEmail(UserEmail)}
                                underlineColorAndroid="#FFFFFF"
                                placeholder="Имейл" //dummy@abc.com
                                placeholderTextColor="black"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                ref={ref => {
                //   this._emailinput = ref;
                }}
                                returnKeyType="next"
                                onSubmitEditing={() =>{
                //   this._passwordinput && this._passwordinput.focus()
                }}
                                blurOnSubmit={false}
                                />
                        </View>
                        
                        {errortext != '' ? (
                            <Text style={styles.errorTextStyle}> {errortext} </Text>
                        ) : null}
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={handleSubmitPress}>
                            <Text style={styles.buttonTextStyle}>Изпрати</Text>
                        </TouchableOpacity>
                        <Text
                            style={styles.registerTextStyle}
                            onPress={() => props.navigation.navigate('LoginScreen')}>
                            Вход
                        </Text>
                    </KeyboardAvoidingView>
            </View>

        </View>
    );
};
export default ForgottenPassword;

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
        width:200
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
        fontSize: 14,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
});