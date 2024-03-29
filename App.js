/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React
import React from 'react';

//Import Navigators from React Navigation
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
//Import all the screens needed
import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import RegisterScreen from './Screen/RegisterScreen';
import ForgottenPassword from './Screen/ForgottenPassword';
import DrawerNavigationRoutes from './Screen/DrawerNavigationRouter';
import ProductsSettings from './Screen/drawerScreens/shoppingList/productsSetings/ProductsSettings';
// global.MyVar = global.MyVar+'';
global.MyVar = 'http://192.168.100.5/kulinarchophp/public/api/';

const Auth = createStackNavigator({
    //Stack Navigator for Login and Sign up Screen 
    LoginScreen: {
        screen: LoginScreen,
        navigationOptions: {
            headerShown: false,
        },
    },
    ForgottenPassword: {
        screen: ForgottenPassword,
        navigationOptions: {
            headerShown: false,
        },
    },
    RegisterScreen: {
        screen: RegisterScreen,
        navigationOptions: {
            headerShown: false,

            title: 'Register',
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        },
    },
    ProductsSettings: {
        screen: ProductsSettings,
        navigationOptions: {
            title: 'ProductsSettings',
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        },
    },
    
});

/* Switch Navigator for those screens which needs to be switched only once
 and we don't want to switch back once we switch from them to the next one */
const App = createSwitchNavigator({
    SplashScreen: {
        /* SplashScreen which will come once for 5 Seconds */
        screen: SplashScreen,
        navigationOptions: {
            /* Hiding header for Splash Screen */
            headerShown: false,
        },
    },
    Auth: {
        /* Auth Navigator which includer Login Signup will come once */
        screen: Auth,
    },
    
    ProductsSettings: {
        screen: ProductsSettings,
        navigationOptions: {
            title: 'ProductsSettings',
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        },
    },
    DrawerNavigationRoutes: {
        /* Navigation Drawer as a landing page */
        screen: DrawerNavigationRoutes,
        navigationOptions: {
            /* Hiding header for Navigation Drawer as we will use our custom header */
            headerShown: false,
        },
    },
});

export default createAppContainer(App);