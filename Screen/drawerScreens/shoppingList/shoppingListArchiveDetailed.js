

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React


import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet } from 'react-native';

import DropdownAlert from 'react-native-dropdownalert';
import ImageModal from 'react-native-image-modal';
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';
import {
  Dimensions,
  SafeAreaView,
  TouchableHighlight,
  FlatList,
  Alert,ActivityIndicator,

  View,
  Text,
} from "react-native";
import { BackHandler } from 'react-native';
import { Icon } from 'react-native-elements'

class shoppingListArchiveDetailed extends React.Component {

  state = {
    externalData: null,
    premium:0,
  }


  async componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('didFocus', async () => {


      // await this.fetchDataShoppingLists();
      await this.fetchData();
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


  handleBackButtonClick() {

    return true;
}
  async archiveShoppingList(id) {


    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

    await fetch(global.MyVar+'deleteArchiveWeekMenu', {
      method: 'POST',
      body: JSON.stringify({
        id: id,
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        //Header Defination
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },

    }).then(
      async response => {
        const data = await response.json();
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key], {}, 1000);
          })
        }
        if (data.login && data.login == true) {
          AsyncStorage.clear();
          this.props.navigation.navigate('Auth');
        }

        if (data.new_token) {
          AsyncStorage.setItem('access_token', data.new_token);
          delete data.new_token;
          delete data['new_token'];
        }

        this.setState({ externalData: '' });

        this.fetchData();
      }
    ).catch(function (error) {

      // ADD THIS THROW error
      throw error;
    });
  }
  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'shoppingListArchiveDetailed'){
          route.push(lastRoute);
      }
      let goRoute = route.pop();


      if(goRoute != undefined){
        AsyncStorage.setItem('backRoute', JSON.stringify(route));
        this.props.navigation.navigate(goRoute);
      }
    })
  );

  }

  async restoreShoppingList() {

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch(global.MyVar+'checkPremium', {
      method: 'POST',
      body: JSON.stringify({ types: 'shopping' }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        //Header Defination
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },

    }).then(
      async response => {
        const data = await response.json();

        if (data.login && data.login == true) {
          AsyncStorage.clear();
          this.props.navigation.navigate('Auth');
        }

        if (data.new_token) {
          AsyncStorage.setItem('access_token', data.new_token);
          delete data.new_token;
          delete data['new_token'];
        }

        if (data.response == 'ok' || data.response < 2) {

    var active = 0;
    if (this.state.isActive == 1) {
      active = 1
    }
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

    var DEMO_TOKEN2 = await AsyncStorage.getItem('ArchiveWeekMenuID');



    await fetch(global.MyVar+'restoreArchive', {
      method: 'POST',
      body: JSON.stringify({
        listID: DEMO_TOKEN2,

      }),

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        //Header Defination
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },

    }).then(
      async response => {
        const data = await response.json();
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key], {}, 1000);
          })
        }
        if (data.login && data.login == true) {
          AsyncStorage.clear();
          this.props.navigation.navigate('Auth');
        }


        if (data.new_token) {
          AsyncStorage.setItem('access_token', data.new_token);

          delete data.new_token;
          delete data['new_token'];

        }

        this.props.navigation.navigate('ShoppingLists');

        // this.fetchData();
      }
    ).catch(function (error) {

      // ADD THIS THROW error
      throw error;
    });
        } else {
          Alert.alert(
            'Достигнат лимит',
            'Достигнахте лимита си на безплатни списъци за пазар. Може да увеличите лимита като преминете на премиум план',
            [
              {
                text: 'Отказ',
                onPress: () => {
                  return null;
                },
              },
              {
                text: 'Премиум',
                onPress: () => {
                  this.props.navigation.navigate('payments');
                },
              },
            ],
            { cancelable: false }
          );
        }

      }
    ).catch(function (error) {

      // ADD THIS THROW error
      throw error;
    });
  }

  async fetchData() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    var DEMO_TOKEN2 = await AsyncStorage.getItem('ArchiveWeekMenuID');
console.log(JSON.stringify({
  id: DEMO_TOKEN2,
}))
    fetch(global.MyVar+"getShoppingListArchive", {
      method: "POST",
      body: JSON.stringify({
        id: DEMO_TOKEN2,
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then( async response => {
      const data = await response.json();
      console.log(data);
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key], {}, 1000);
          })
        }
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
        this.setState({externalData: JSON.parse(data[0].list)});

      }).catch(function (error) {

        // ADD THIS THROW error
        throw error;
      }).done();
  }
  showRecipe(id) {
    AsyncStorage.setItem('recipeId', id.toString()).then(data => {
      this.props.navigation.navigate('ShowRecipe', { name: 'kuyr' });


    });
  }
  render(props) {
    var cat = '';

    let Add =  <AdMobBanner
    bannerSize="smartBannerLandscape"
    adUnitID={'ca-app-pub-5428132222163769/6112419882'}

      servePersonalizedAds={true}/>;
      if(this.state.premium != 0){
        Add = <View></View>;
      }

    const Card = ({ item }) => {
      let { width } = Dimensions.get('window');
      let fields = [];
      if (this.state.sort == 'typeAsc' || this.state.sort == 'typeDesc') {
        if (cat !== item.type) {
          cat = item.type;
          fields.push(<Text style={{ marginLeft: 30, marginTop: 20 }}>{cat}</Text>);
        }
      }

      var buyedDesign = 'none';
      var buyedColor = '#689F38';

      if (item.status === 1) {
        buyedDesign = 'line-through'
        buyedColor = 'silver';
      }
      let categoryColor = 'silver';
      var img = ''
      if (item.photo !== null) {
        img = 'https://kulinarcho.s3.eu-central-1.amazonaws.com/products/' + item.photo;
      } else {
        img = 'https://comps.canstockphoto.com/wicker-picnic-basket-eps-vector_csp48110640.jpg'
      }
      return (
        <View>
          {fields}

          <View
            elevation={5}
            style={{
              borderLeftWidth: 4, borderLeftColor: buyedColor,
              // borderBottomWidth:4, borderBottomColor:'#689F38',

              shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowRadius: 3,
              shadowOpacity: 0.5,
              width: width - 30,
              marginLeft: 15,
              marginTop: 20,
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 6,
            }}>
            <View style={{ flex: 1, flexDirection: 'column', width: '100%' }}>
              <View style={{
                flex: 1, flexDirection: 'row', width: '100%', borderBottomWidth: 1,
                borderBottomColor: 'silver',
              }}>
                <Text
                  style={{
                    marginLeft: 30,
                    flex: 1,
                    fontSize: 19,
                    fontWeight: '200',
                    // fontFamily: 'sans-serif',
                    marginBottom: 4,
                    alignSelf: 'center',
                    textDecorationLine: buyedDesign
                  }}>
                  {item.name}
                </Text>

              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <ImageModal
                  borderRadius={60}
                  resizeMode="cover"
                   imageBackgroundColor="#ffffff"
                  source={{ uri: img+'?time'+(new Date()).getTime() }}
                  style={{
                    marginTop: 15,
                    width: 60,
                    height: 60,
                    alignSelf: 'center',
                  }}
                />

                <View style={{
                  width: '100%',
                  paddingLeft: 9,
                  flex: 2,
                  flexDirection: 'column',

                }} >


                  <Text
                    style={{
                      width: '100%',
                      // flex: 1,
                      fontSize: 16,
                      fontWeight: '200',
                      // fontFamily: 'sans-serif',
                      marginBottom: 4,
                      color: '#808080',
                      textDecorationLine: buyedDesign

                    }}>
                    {item.description}
                  </Text>

                  <Text style={{
                    alignItems: 'flex-end', color: categoryColor, textDecorationLine: buyedDesign
                  }}>
                    {item.type}
                  </Text>
                </View>
                <View style={{
                  flex: 1,
                  flexDirection: 'column',
                  paddingRight: 5,
                  paddingTop: 5,
                  alignItems: 'flex-end',
                  // marginLe,
                }}>
                  <Text
                    style={{
                      // flex: 1,
                      fontSize: 18,
                      fontWeight: '100',
                      // fontFamily: 'roboto',
                    }}>
                    {item.price} лв.
                  </Text>
                  <Text style={{ alignItems: 'flex-end', color: '#808080', fontSize: 12 }}>
                    {item.value} {item.unitsName}
                  </Text>
                  <Text style={{ alignItems: 'flex-end', color: '#808080', fontSize: 18, borderTopWidth: 1, borderColor: 'black' }}>
                    {item.finalPrice} лв.
                  </Text>
                  </View>
              </View>

            </View>
          </View>

        </View>
      );
    };
    const renderItem = () => {
      let finnal = [];
      let data = this.state.externalData;

      Object.keys(data).map((key, index) => {

        if (data[key]) {
          finnal.push(<View style={styles.container}>

            <Card style={{ flex: 1, marginLeft: 0, marginRight: 0, marginBottom: 0, paddingBottom: 0, marginTop: 0 }}>
              <View style={{ flex: 1, flexDirection: "row", borderBottomColor: 'silver', borderBottomWidth: 1, }}>
                <Text style={{ marginTop: 10, width: '100%' }}>{data[key].name} </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row", borderBottomColor: 'silver', }}>
                <Text style={{ marginTop: 10 }}>{data[key].description}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row", borderBottomColor: 'silver', }}>
                <Text style={{ marginTop: 10 }}>{data[key].value}{data[key].unitsName} x {data[key].price} = {data[key].finalPrice} </Text>
              </View>
            </Card>

          </View>)
        }

      })
      return finnal;


    };

    if (this.state.externalData === null) {
      return (
        <View style={styles.MainContainer}>
          <ActivityIndicator size="large" color="#7DE24E" />
        </View>
      )
    } else {
      return (

        <View style={styles.MainContainer}>
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />

          <SafeAreaView >
            <FlatList
              contentContainerStyle={{ paddingBottom: 70 }}

              data={this.state.externalData}
              renderItem={data => {

                return (

                  <Card item={data.item} />
                );
              }}
              keyExtractor={item => item.id}
            />
          </SafeAreaView >
          <View style={{
            position: 'absolute',
            flex: 1,
            flexDirection: 'row',
            left: 0,
            right: 0,
            bottom: 70,
            borderTopWidth: 1,
            borderTopColor: 'silver',
            flexDirection: 'row',
            backgroundColor: 'white',
          }}>{Add}</View>


          <View style={{
            position: 'absolute',
            flex: 1,
            flexDirection: 'row',
            left: 0,
            right: 0,
            bottom: -10,
            borderTopWidth: 1,
            borderTopColor: 'silver',
            flexDirection: 'row',
            backgroundColor: 'white',
            height: 70,
          }}>
            <TouchableHighlight style={{ height: 45, flex: 2, marginTop: 5 }} onPress={() => {
              this.restoreShoppingList();
            }} underlayColor="white">
              <View style={{
                flex: 3, flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.41,
                shadowRadius: 9.11,
                elevation: 6,
                marginLeft: 15, marginRight: 10, borderRadius: 10, borderWidth: 1, borderColor: "silver", height: 45,
                padding: 10
              }}>
                <View style={{ backgroundColor: 'silver', height: 45, paddingBottom: 4, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", }}>
                  <Icon style={{ flex: 1, marginRight: 15, height: 40, borderRightWidth: 1, borderColor: 'silver' }}
                    size={30}
                    containerStyle={{
                      backgroundColor: '#ebebeb',
                      padding: 10, paddingBottom: 10, paddingTop: 5, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                    }}
                    color={'green'}
                    onPress={() => {
                      this.restoreShoppingList();

                    }

                    }
                    type='ionicon'
                    backgroundColor='silver'
                    name='checkmark-outline'
                  ></Icon>

                </View>

                <View style={{ flex: 3, backgroundColor: 'white', height: 45, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                  <Text style={{ flex: 3, marginTop: 10 }}>Възстанови списък</Text>
                </View>
              </View>
            </TouchableHighlight>

          </View>


        </View>
      );
    }
  }
};
export default shoppingListArchiveDetailed;
const styles = StyleSheet.create({
  MainContainer:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },
  scrollView: {
    flex: 1,
    marginBottom: 60,

    width: '100%',
    height: '50%'
  },
  container: {
    width: '100%',
    flex: 1,
  },
  inputRow: {
    borderBottomWidth: 1,
    marginBottom: 10,
    marginLeft: 5,
    width: '45%'
  },
  icon: {
    height: 30,
    width: 30,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    flex: 1,
    height: 40,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    alignSelf: 'stretch',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignSelf: 'stretch',

    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  titlem: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#000",
    alignSelf: 'stretch',
    margin: 0,
    padding: 0,

  },
  dividerm: {
    width: "100%",
    height: 10,
    backgroundColor: "#30ff49",
    borderBottomWidth: 2,
    borderBottomColor: "#000"
  },
  modalBtn: {
    flexDirection: "row",
    flex: 2,
    height: 80,
    marginBottom: 50,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});