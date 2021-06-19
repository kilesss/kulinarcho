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

    KeyboardAvoidingView,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Loader from './Components/loader';

const RegisterScreen = props => {
    let [userName, setUserName] = useState('');
    let [userEmail, setUserEmail] = useState('');
    let [password, setPassword] = useState('');
    let [loading, setLoading] = useState(false);
    let [errortext, setErrortext] = useState('');
    let [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

    const handleSubmitButton = () => {
        Keyboard.dismiss()

        setErrortext('');
        if (!userName) {
            setErrortext('Името е задължително');
            return;
        }
        if (!userEmail) {
            setErrortext('Имейла е задължителен');
            return;
        }
        if (!password) {
            setErrortext('Паролата е задължителен');
            return;
        }

        //Show Loader
        setLoading(true);
        var dataToSend = JSON.stringify({
            name: userName,
            email: userEmail,
            password: password,
        });
        

        fetch(global.MyVar+'signup', {
            method: 'POST',
            body: dataToSend,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                //Header Defination
            },
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.errors) {
                    Object.keys(responseJson.errors).map((key, index) => {
                        setErrortext(responseJson.errors[key]);

                    })
                }
                //Hide Loader
                setLoading(false);
                if (responseJson.access_token) {
                    // If server response message same as Data Matched
                    setIsRegistraionSuccess(true);
                } else {
                    setErrortext('Регистрацията не е успешна');
                }
            })
            .catch(error => {
                //Hide Loader
                setLoading(false);
                console.error(error);
            });
    };
    if (isRegistraionSuccess) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                }}>

                <Image
                    source={require('../Image/splash3.png')}
                    style={{ width: '100%', height: '60%', resizeMode: 'contain', alignSelf: 'center' }}
                />
                <Text style={styles.successTextStyle}>Регистрацията е успешна</Text>
                <Text style={{
                    color: 'silver',
                    textAlign: 'center',
                    fontSize: 11,
                    padding: 30,
                    paddingTop: 5
                }}>Проверете емайла си за емайл за потвърждение на регистрацията ви</Text>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.5}
                        onPress={() => props.navigation.navigate('LoginScreen')}>
                        <Text style={styles.buttonTextStyle}>Вход</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    return (
        <ScrollView style={{
            flex: 1,

            width: '100%',
            height: '50%'
        }}>
            <View style={{ flex: 1, backgroundColor: 'white', height: '100%'}}>
                <Loader loading={loading} />

                <View style={{ marginTop: 50 }}>
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
                                onChangeText={UserName => setUserName(UserName)}
                                underlineColorAndroid="#FFFFFF"
                                placeholder="Име"
                                placeholderTextColor="black"
                                autoCapitalize="sentences"
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.secondTextInput.focus(); }}

                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={UserEmail => setUserEmail(UserEmail)}
                                underlineColorAndroid="#F6F6F7"
                                placeholder="Имейл"
                                placeholderTextColor="black"
                                keyboardType="email-address"

                                ref={(input) => { this.secondTextInput = input; }}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.thirdTextInput.focus(); }}
                            />
                        </View>
                        <View style={styles.SectionStyle}>

                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={UserPassword => setPassword(UserPassword)}
                                underlineColorAndroid="#FFFFFF"
                                placeholder="Парола" //12345
                                placeholderTextColor="black"
                                keyboardType="default"

                                secureTextEntry={true}

                                ref={(input) => { this.thirdTextInput = input; }}
                                blurOnSubmit={false}
                                onSubmitEditing={handleSubmitButton}
                            />
                        </View>


                        {errortext != '' ? (
                            <Text style={styles.errorTextStyle}> {errortext} </Text>
                        ) : null}
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={handleSubmitButton}>
                            <Text style={styles.buttonTextStyle}>Регистрация</Text>
                        </TouchableOpacity>
                     
                        <Text
                            style={{  color: 'black',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 14}}
                            onPress={() => props.navigation.navigate('LoginScreen')}>
                            Вход
                        </Text>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </ScrollView>
    );
};
export default RegisterScreen;

const styles = StyleSheet.create({
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
        width: 200,
        justifyContent: 'center',

    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
        alignItems: 'center',

    },
    inputStyle: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: 'silver',
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
    successTextStyle: {
        color: 'green',
        textAlign: 'center',
        fontSize: 20,
        padding: 30,
        paddingBottom: 10
    },
});