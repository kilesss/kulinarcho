

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import DropdownAlert from 'react-native-dropdownalert';
import SearchableDropdown from 'react-native-searchable-dropdown';

import {
  View,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity, ActivityIndicator,
  TextInput,
  TouchableHighlight
} from "react-native";
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';

class notification extends React.Component {


  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
      BackHandler.addEventListener("hardwareBackPress", async () => {
        let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
        let lastRoute = route.pop();
        if (lastRoute != 'feeback') {
          route.push(lastRoute);
        }
        let goRoute = route.pop();


        if (goRoute != undefined) {
          AsyncStorage.setItem('backRoute', JSON.stringify(route));
          this.props.navigation.navigate(goRoute);
        }
      })
    );

  }

  state = {
    description: '',
    country: '0',
    placeholder: 'Изберете',
    externalData: null,
    premium: 0,
  };
  lenght;



  async componentDidMount() {
    const { navigation } = this.props;
    this.props.navigation.setParams({ handleSave: this._saveDetails });
    this.focusListener = navigation.addListener('didFocus', async () => {
      this.fetchData();
      let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('feeback')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] !== 'feeback') {
        arrRoute.push('feeback')
      }

      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

    });
  }



  componentDidUpdate() {
  }

  componentWillUpdate(prevProps) {
    if (prevProps.data != this.props.data) {
      this.props.data.lenght !== 0 ? this.setState({
        isReady: true,
      }) : null
    }
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  async deleteRequest(id,notId) {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch(global.MyVar+'deleteRequestUser', {
        method: 'POST',
        body: JSON.stringify({
            requesterId: id,
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            //Header Defination
            'Authorization': 'Bearer ' + DEMO_TOKEN
        },

    }).then(
        async response => {
          this.deleteNotification(notId);
          this.fetchData();


        }
    ).catch(function (error) {

        // ADD THIS THROW error
        throw error;
    });
}
async deleteNotification(id) {
  var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

  await fetch(global.MyVar+'deleteNotification/'+id, {
      method: 'POST',
      body: JSON.stringify({
      }),
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          //Header Defination
          'Authorization': 'Bearer ' + DEMO_TOKEN
      },

  }).then(
      async response => {
        

      }
  ).catch(function (error) {

      // ADD THIS THROW error
      throw error;
  });
}

  async acceptRequest(id, notId) {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

    await fetch(global.MyVar+'acceptRequestUser', {
        method: 'POST',
        body: JSON.stringify({
            requesterId: id,
        }),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            //Header Defination
            'Authorization': 'Bearer ' + DEMO_TOKEN
        },

    }).then(
        async response => {
          
            this.deleteNotification(notId);
            this.fetchData();


        }
    ).catch(function (error) {

        // ADD THIS THROW error
        throw error;
    });
}

  async fetchData() {


    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');


    fetch(global.MyVar+"notification", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then(response => response.json())

      .then(data => {

        if (data.login && data.login == true) {
          AsyncStorage.clear();
          this.props.navigation.navigate('Auth');
        }
        this.state.premium = data.premium;
        delete data.premium;

        if (data.new_token) {
          AsyncStorage.setItem('access_token', data.new_token);
          delete data.new_token;
          delete data['new_token'];
        }

        this.setState({ externalData: data.response });

      }).done();
  }


  render(props) {

    const renderItem = () => {

      let html = [];

      let item = this.state.externalData;
      Object.keys(item).map((key, index) => {
        let title = '';
        let rejectText = '';
        let acceptText = '';
        let id = item[index].id;
        var statusColor = '#689F38';
        if (item[index].type == 1) {
          title = 'Нова заявка';
          rejectText = 'Откажи';
          acceptText = 'Приеми'
        } else if (item[index].type == 2) {
          title = 'Нов списък';
          rejectText = 'Ок';
          acceptText = 'Преглед'
        } else if (item[index].type == 3) {
          title = 'Нова рецепта';
          rejectText = 'Ок';
          acceptText = 'Преглед'
        } else if (item[index].type == 4) {
          title = 'Изтичащ премиум';
          rejectText = 'Ок';
          acceptText = 'Поднови'

        }

        html.push(
          <View style={{
            borderLeftWidth: 4, borderLeftColor: statusColor,
            borderRadius: 15,
            marginLeft: 5, marginRight: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            width: '100%',
            elevation: 6,
            backgroundColor: '#ffffff',
            marginVertical: 3,
            flex: 3,
            flexDirection: 'row',
            marginTop: 15,
          }} onPress={() => {
          }}>
            <TouchableOpacity style={{
              width: '100%', flex: 3,
              flexDirection: 'row',
            }}
              onPress={() => {
                Alert.alert(
                  title,
                  item[key].title,
                  [
                    {
                      text: rejectText,
                      onPress: () => {
                        if (item[index].type == 1) {
                          this.deleteRequest(item[index].pageId.toString(),item[index].id.toString())
                        }
                      },
                      style: "cancel"
                    },
                    {
                      text: acceptText, onPress: () => {
                        if (item[index].type == 1) {
                          if(this.state.premium == 0){
                            Alert.alert(
                              'Премиум функционалност',
                              'Нужно е да имате премиум за да ползвате тази функционалност',
                              [
                                {
                                  text: 'Отказ',
                                  onPress: () => {
                                    this.deleteNotification(item[index].id.toString());

                                  },
                                  style: "cancel"
                                },
                                {
                                  text: 'Купи премиум', onPress: () => {
                                    this.props.navigation.navigate('payments'); 
                                  }
                                }
                              ],
                              { cancelable: false }
                            );
                          }else{
                              this.acceptRequest(item[index].pageId.toString(),item[index].id.toString())
                          }
                        } else if (item[index].type == 2) {
                          AsyncStorage.setItem('listId', item[index].pageId.toString()).then(data => {
                            this.deleteNotification(item[index].id.toString());

                            this.props.navigation.navigate('ShoppingListEditProducts');
                          });
                          //send reject reqkuest
                        } else if (item[index].type == 3) {
                          AsyncStorage.setItem('recipeId', item[index].pageId.toString()).then(data => {
                            this.deleteNotification(item[index].id.toString());

                            this.props.navigation.navigate('ShowRecipe', { name: 'kuyr' });

                          });
                          //send reject reqkuest
                        } else if (item[index].type == 4) {
                          //send reject reqkuest
                        }
                      }
                    }
                  ],
                  { cancelable: false }
                );

              }}>
              <View style={{ marginLeft: 10, marginTop: 6, marginBottom: 5, width: '94%' }} >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{
                    paddingLeft: 9,
                    fontSize: 16,
                    flex: 8,
                    paddingBottom: -15,
                    marginBottom: 2
                  }}>{item[key].title}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>


        );
      })
      return html
    }
    if (this.state.externalData === null) {
      return (
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: (Platform.OS === 'ios') ? 20 : 0
        }}>
          <View style={{
            width: '100%',
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            flexDirection: 'row',
            backgroundColor: '#689F38'
          }}>
            <ActivityIndicator size="large" color="#7DE24E" />
          </View>
        </View>
      )
    } else {


      let Add = <AdMobBanner
        bannerSize="smartBannerLandscape"
        adUnitID={'ca-app-pub-5428132222163769/5705596900'}

        servePersonalizedAds={true} />;
      if (this.state.premium != 0) {
        Add = <View></View>;
      }

      return (
        <View style={{ width: '100%', flexDirection: 'column' }}>
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
          <View style={{ width: "100%", marginTop: 15, height: 350 }}>

            <ScrollView style={{}}>
              {renderItem()}


            </ScrollView>

          </View>
        </View>);
    }
  }
}
export default notification;
