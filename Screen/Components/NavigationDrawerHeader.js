/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React
import React from 'react';

//Import all required component
import { View, Image, TouchableOpacity } from 'react-native';

const NavigationDrawerHeader = props => {
    const toggleDrawer = () => {
        props.navigationProps.toggleDrawer(); 
        // this.props.navigation.state.params.onSelect({ 'selected':'hello'});
    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={toggleDrawer}>
                <Image
                    source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
                    style={{ width: 25, height: 25, marginLeft: 5 }}
                    />
            </TouchableOpacity>
        </View>
    );
};
export default NavigationDrawerHeader;