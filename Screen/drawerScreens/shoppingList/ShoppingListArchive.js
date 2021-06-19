

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import DropdownAlert from 'react-native-dropdownalert';
import {
  StyleSheet,
  TouchableOpacity,
  View, Dimensions,
  Modal,ActivityIndicator,
  TouchableHighlight,
  Text, SafeAreaView, FlatList,
} from "react-native";
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';

class ShoppingListArchive extends React.Component {

  state = {
    externalData: null,
    modalVisible2: false,
    itemId: false,
    premium:'',

  }


  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      let route = await AsyncStorage.getItem('backRoute'); 
      route= JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('ShoppingListArchive')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute.length  - 1] !== 'ShoppingListArchive') {

        arrRoute.push('ShoppingListArchive')
      }
      

      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));
      let route2 = await AsyncStorage.getItem('backRoute');
      // await this.fetchDataShoppingLists();
      await this.fetchData();
      
      
      // if(this.state.premium === 0){
      //   AdMobInterstitial.setAdUnitID("ca-app-pub-5428132222163769/7210250269");
      //   await AdMobInterstitial.requestAdAsync({servePersonalizedAds:false});
      //   await AdMobInterstitial.showAdAsync().then(data => {
      //     
      //   })
      // }
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
  }

  setModalVisible2 = (visible) => {
    this.setState({ modalVisible2: visible });
  }

  async archiveShoppingList(id) {


    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

    await fetch(global.MyVar+'deleteShoppingListArchive', {
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
        } else {
          this.dropDownAlertRef.alertWithType('success', '', 'Архива е изтрит', {}, 1000);

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
      if(lastRoute != 'ShoppingListArchive'){
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
  async fetchData() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

    fetch(global.MyVar+"getShoppingListArchive", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then(response => response.json())
      .then(data => {
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
        this.setState({premium: data.premium});
       

        delete data.premium;

        if (data.new_token) {
          AsyncStorage.setItem('access_token', data.new_token);

          delete data.new_token;
          delete data['new_token'];

        }
        let newData = [];
        Object.keys(data).map((key, index) => {
          newData.push(data[index]);
        })

        this.setState({ externalData: newData });

      }).catch(function (error) {
        
        // ADD THIS THROW error
        throw error;
      }).done();
  }
  showRecipe(id) {
    AsyncStorage.setItem('ArchiveWeekMenuID', id.toString()).then(data => {
      this.props.navigation.navigate('shoppingListArchiveDetailed', { name: 'kuyr' });

    });
  }
  render(props) {

    if (this.state.externalData === null) {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.topView}>
            <Text>Loading....</Text>
          </View>
        </View>
      )
    } else {

      let Add =  <AdMobBanner
      bannerSize="smartBannerLandscape" 
      adUnitID={'ca-app-pub-5428132222163769/6098486751'} 
         
        servePersonalizedAds={true}/>;
        if(this.state.premium != 0){
          Add = <View></View>;
        }

      var cat = '';

      const Card = ({ item }) => {
        let { width } = Dimensions.get('window');
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

        return (
          <View>
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
                marginLeft: 5,
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
                    {item.title}
                  </Text>
                  <Icon style={styles.icon}
                    size={30}
                    color={'silver'}
                    onPress={() => {
                      this.setModalVisible2(true)
                      this.setState({ itemId: item.id });
                    }}
                    name='delete-forever'
                  ></Icon>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>

                  <TouchableOpacity style={{
                    width: '100%',
                    paddingLeft: 9,
                    flex: 2,
                    flexDirection: 'column',

                  }} onPress={() => {
                    AsyncStorage.setItem('ArchiveWeekMenuID', item.id.toString()).then(data => {
                      this.props.navigation.navigate('shoppingListArchiveDetailed', { name: 'kuyr' });

                    });
                  }}>



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
                      Дата:  {item.created_at}
                    </Text>

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
                      Брой продукти: {item.countProduct}
                    </Text>

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
                      Сума купени продукти:  {item.finalPrice} лв.
                    </Text>

                  </TouchableOpacity>

                </View>

              </View>
            </View>
          </View>
        );
      };
      
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
                      {Add}

          </SafeAreaView >
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible2}
            onRequestClose={() => {
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.titlem}>Изтриване на списък </Text>
                  <View style={styles.dividerm}></View>
                </View>
                <Text style={{
                  justifyContent: "center",
                  alignItems: "center", marginLeft: 20
                }}>Сигурни ли сте че искате да изтриете списъка <Text style={{ fontStyle: "italic", fontWeight: "bold" }}>{this.state.deleteType}</Text></Text>

                <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                  <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                    this.archiveShoppingList(this.state.itemId);
                    this.setModalVisible2(!this.state.modalVisible2);
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
                      marginLeft: 15, marginRight: 10, borderRadius: 10, borderWidth: 1, borderColor: "silver", height: 50,
                      padding: 10
                    }}>
                      <View style={{ backgroundColor: 'silver', height: 50, paddingBottom: 4, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", }}>
                        <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                          size={30}
                          containerStyle={{
                            backgroundColor: '#ebebeb',
                            padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                          }}
                          color={'green'}
                          onPress={() => {
                            this.archiveShoppingList(this.state.itemId);

                            this.setModalVisible2(!this.state.modalVisible2);
                          }

                          }
                          type='ionicon'
                          backgroundColor='silver'
                          name='checkmark-outline'
                        ></Icon>

                      </View>
                      <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                        <Text style={{ flex: 3, marginTop: 15 }}>да</Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {

                    this.setModalVisible2(!this.state.modalVisible2);
                  }} underlayColor="white"
                  >
                    <View style={{
                      flex: 3, flexDirection: "row",
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 7,
                      },
                      shadowOpacity: 0.41,
                      shadowRadius: 9.11,
                      elevation: 6,
                      alignItems: "center",
                      backgroundColor: "white",
                      marginLeft: 10, marginRight: 15, borderRadius: 10, borderWidth: 1, borderColor: "silver", height: 50,
                      padding: 10
                    }}>
                      <View style={{ backgroundColor: 'silver', height: 50, paddingBottom: 4, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", }}>
                        <Icon style={{ flex: 2, marginRight: 15, height: 40, borderRightWidth: 1, borderColor: 'silver' }}
                          size={30}
                          containerStyle={{
                            backgroundColor: '#ebebeb',
                            padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                          }}
                          color={'red'}
                          onPress={() => {


                            this.setModalVisible2(!this.state.modalVisible2);


                          }

                          }
                          type='ionicon'
                          backgroundColor='silver'
                          name='close-outline'
                        >Редактирай</Icon>

                      </View>
                      <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                        <Text style={{ flex: 3, marginTop: 15 }}>Не</Text>
                      </View>
                    </View>
                  </TouchableHighlight>

                </View>
              </View>
            </View>
          </Modal>


        </View>
      );
    }
  }
};
export default ShoppingListArchive;
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
    marginTop: 20,
    flex: 1,
  },
  inputRow: {
    borderBottomWidth: 1,
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 15,
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
    margin: 15
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    alignSelf: 'stretch',
  },
  modalView: {
    height: 150,

    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
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