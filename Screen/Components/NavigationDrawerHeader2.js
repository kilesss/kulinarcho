/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React
import React from 'react';
// import {
//     MenuContext,
//     Menu,
//     MenuOptions,
//     MenuOption,
//     MenuTrigger,
//   } from 'react-native-popup-menu';
  import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
  import { Icon } from 'react-native-elements'

//Import all required component
import { View, Image, TouchableOpacity,Text ,StyleSheet} from 'react-native';
let _menu = null;
const NavigationDrawerHeader = props => {
    const toggleDrawer = (data) => {
        props.navigationProps.state.params.handleSave(data);
    }
    return (
        <View style={{ flexDirection: 'row', marginRight:20}}>
        <Menu styles={{flex:1, marginRight:10}}
          ref={(ref) => (_menu = ref)}
          button={
                <Icon style={{flex:1}}
                flip={'horizontal'}
                                        size={35}
                                        color={'white'}
                                        onPress={() => {
                                        
                                            _menu.show()
                                        }
    
                                        }
                                        name='filter-list'
                                    ></Icon>
          }>
            <MenuItem
              onPress={() => {
                toggleDrawer('null');
                _menu.hide();
              }}>
             <Text> Сортирай</Text>
            </MenuItem>
    
            <MenuItem
              onPress={() => {
                toggleDrawer('asc');
                _menu.hide();
              }}>
             <Text>Име (А-Я)</Text>
            </MenuItem>
          <MenuItem
            onPress={() => {
                toggleDrawer('desc');
             
                _menu.hide();
            }}>
             <Text>Име (Я-А)</Text>
          </MenuItem>
          <MenuItem
            onPress={() => {
                toggleDrawer('typeAsc');

              _menu.hide();
            }}>
             <Text>Категория (А-Я)</Text>
          </MenuItem>
          <MenuItem
            onPress={() => {
                toggleDrawer('typeDesc');

              _menu.hide();
            }}>
             <Text>Категория (Я-А)</Text>
          </MenuItem>
        </Menu>
        
      </View>
    );
};

export default NavigationDrawerHeader;