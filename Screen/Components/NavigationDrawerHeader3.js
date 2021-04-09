/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React
import React from 'react';

  import { Icon } from 'react-native-elements'

//Import all required component
import { View,} from 'react-native';
const NavigationDrawerHeader = props => {
    const toggleDrawer = (data) => {
        props.navigationProps.state.params.handleSave(data);
    }
    return (
        <View style={{ flexDirection: 'row'}}>
       
        <Icon style={{marginLeft:15, padding:20, backgroundColor:'red'}}
                flip={'horizontal'}
                                        size={30}
                                        color={'white'}
                                        onPress={() => {
                                        
                                            toggleDrawer('newItem');
                                        }
    
                                        }
                                        name='add'
                                    ></Icon>
      </View>
    );
};

export default NavigationDrawerHeader;