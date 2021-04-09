/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React and Hooks we needed
import React, { useState, useEffect } from 'react';

//Import all required component
import { ActivityIndicator, View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const SplashScreen = props => {
    //State for ActivityIndicator animation
    let [animating, setAnimating] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAnimating(false);
            //Check if user_id is set or not
            //If not then send for Authentication
            //else send to Home Screen
            AsyncStorage.getItem('access_token').then(value =>
                    props.navigation.navigate(
                        value === null ? 'Auth' : 'DrawerNavigationRoutes'
                    )
            );
        }, 5000);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../Image/splash.jpg')}
                style={{height:'70%', width:'60%' , marginTop:30,marginBottom:15 }}
                />
                 <Image
                source={require('../Image/aboutreact.png')}
                style={{ width: '100%', height:100 }}
                />
            
        </View>
    );
};
export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        width:'100%',
        padding:0
    },
    activityIndicator: {
        alignItems: 'center',
        height: 80,
    },
});