

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
import RBSheet from "react-native-raw-bottom-sheet";
import ImageModal from 'react-native-image-modal';
import ActionButton from 'react-native-action-button';

import {
  Dimensions,
  Alert,
  SafeAreaView,
  FlatList,ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';


class ListEditProducts extends React.Component {

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
      BackHandler.addEventListener("hardwareBackPress", async () => {
        let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
        let lastRoute = route.pop();
        if (lastRoute != 'ListEditProducts') {
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



  handleBackButtonClick() {

    this.props.navigation.navigate('ShoppingLists');
    return true;
  }
  state = {
    modalVisible: false,
    modalVisible2: false,
    modalVisible3: false,
    deleteType: '',
    typeTitle: 'Име',
    token: '',
    isActive: false,
    data: [],
    externalData: null,
    typeid: '',
    modalEditTitle: 'Купи продукт',
    selectedDropdown: '',
    sum: 0,
    amount: 0,
    sort: '',
    selectedIndex: '',
    volume: '',
    price: '',
    finalPrice: '',
    dropdownSelect: '',
    dropdownSelect2: '',
    placeholder: "Продукт",
    test: 0,
    externalDataTypes: [],
    externalDataUnits: [],
    typesPlaceholder: 'Тип',
    unitsPlaceholder: 'Разфасовка',
    unitID: 0,
    typesID: 0,
    newProdTitle: '',
    unbuyedProduct: 0,
    time: 60 * 20, // 20 minutes,
    premium:0,

  };


  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  setModalVisible2 = (visible) => {
    this.setState({ modalVisible2: visible });
  }
  setModalVisible3 = (visible) => {
    this.setState({ modalVisible3: visible });
  }

  setdeleteType = (title) => {
    this.setState({ deleteType: title })
  }
  setDropdownSelect = (title) => {
    this.setState({ dropdownSelect2: title })
  }
  setFinalPrice = (title) => {
    this.setState({ finalPrice: title })
  }
  setPrice = (id) => {
    this.setState({ price: id })
  }
  setProductID = (id) => {
    this.setState({ typeid: id })

  }

  setAmount = (id) => {
    this.setState({ amount: id })
  }
  async fetchToken() {
  }

  processResponse(response) {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]).then(res => ({
      statusCode: res[0],
      data: res[1]
    }));
  }



  async fetchData() {
    let listId = await AsyncStorage.getItem('listId');
    let listName = await AsyncStorage.getItem('listName');
    this.setState({ listId: listId })
    this.setState({ listName: listName })
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    this.setState({ unbuyedProduct: 0 });
    fetch("https://kulinarcho.com/api/getShoppingListProducts?listId=" + this.state.listId + "&sort=" + this.state.sort, {
      method: "GET",
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then(response => response.json())
      .then(data => {
        
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key], {}, 1000);
          })
        }
        this.state.premium = data.premium;
        delete data.premium; 
        let exist = data.exist;
        delete data.exist;
        if(Object.keys(data).length === 0 && exist == false) {
          this.props.navigation.navigate('ShoppingLists');
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
        let finnalSum = 0;
        let sum = 0;
        let sumUnbyed = 0;
        let newData = [];
        

        Object.keys(data).map((key, index) => {
          sum = sum + 1;
          if (data[key].status === 1) {
            finnalSum = finnalSum + data[key].finalPrice;
            sumUnbyed = sumUnbyed + 1;
          }
          newData.push(data[index]);
        })

        this.setState({ sum: finnalSum.toFixed(2) });
        if (sum > 0 && sumUnbyed > 0 && sum === sumUnbyed) {
          Alert.alert(
            "Приключване на списъка",
            "Всички продукти в списъка са купени искате ли да приключите списъка",
            [
              {
                text: "Продължи пазаруването",
                onPress: () => {  },
                style: "cancel"
              },
              { text: "Приключи", onPress: () => this.archiveShoppingList() }
            ],
            { cancelable: false }
          );
        }
        this.setState({ externalData: newData });
      }).done();

  }


  async archiveShoppingList() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch('https://kulinarcho.com/api/archiveList', {
      method: 'POST',
      body: JSON.stringify({
        listId: this.state.listId,
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
      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
  }


  async submitEditType() {

    let data = this.state.externalData;
    let finnalprice = 0;
    Object.keys(data).map((key, index) => {
     
      if (data[key].id == this.state.typeid) {

        if (data[key].status == 0) {
          data[key].status = 1;
          finnalprice = (parseFloat(finnalprice)+parseFloat(data[key].finalPrice))
                }else{
          data[key].status = 0;
          finnalprice = (parseFloat(finnalprice)-parseFloat(data[key].finalPrice))
        }
        data[key].price = this.state.price
        data[key].value = this.state.amount
        data[key].finalPrice = (this.state.amount * this.state.price).toFixed(2)
      }else{
        if (data[key].status == 1) {
          finnalprice = (parseFloat(finnalprice)+parseFloat(data[key].finalPrice))
        }else{
        }
      }
     
    });   
    if(finnalprice > 0){
      this.setState({externalData:data});
      this.setState({sum:finnalprice.toFixed(2)});      
    }
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');



    await fetch('https://kulinarcho.com/api/shoppingListBuy', {
      method: 'POST',
      body: JSON.stringify({
        listID: this.state.listId,
        id: this.state.typeid,
        volume: this.state.amount,
        price: this.state.price
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

        // let arr = this.state.externalData;
        // Object.keys(arr).map((key, index) => {
        //   if (arr[key].id == this.state.typeid) {
        //     if (arr[key].status == 0) {
        //       arr[key].status = 1;
        //     } else {
        //       arr[key].status = 0;
        //     }

        //   }
        // })
        // this.setState({ externalData: arr })
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
        // this.fetchData();
      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
  }

  async submitDeleteType() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch('https://kulinarcho.com/api/deleteProductFromList', {
      method: 'POST',
      body: JSON.stringify({ id: this.state.productId, status: 1 }),
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
          this['RBSheet2'].close()

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
        this.fetchData();

      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
  }

  async checkForUpdate() {
    let listId = await AsyncStorage.getItem('listId');
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch('https://kulinarcho.com/api/checkProductsStatus', {
      method: 'POST',
      body: JSON.stringify({ listId: listId }),

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        //Header Defination
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },

    }).then(
      async response => {


        const data = await response.json();
        if (data != 0) {
          
          this.fetchData();
        }
      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
  }
  async componentDidMount() {
    // this.interval = setInterval(
    //   () => { this.setState(({ time }) => ({ time: time - 1 })); this.checkForUpdate();  },
    //   15000
    // );
    const { navigation } = this.props;
    this.props.navigation.setParams({ handleSave: this._saveDetails });
    this.focusListener = navigation.addListener('didFocus', async () => {

      await this.fetchData();

    });
  }

  componentDidUpdate() {
    const { time } = this.state;
    if (time <= 0) {
      clearInterval(this.interval);
    }
  }

  _saveDetails = (prop) => {

    this.setState({
      sort: prop,
    });
    this.fetchData();

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
    clearInterval(this.interval);

    this.focusListener.remove();
  }

  render(props) {
    if (this.state.externalData === null) {

      return (
        <View style={styles.MainContainer}>
          <ActivityIndicator size="large" color="#7DE24E" /> 
        </View>
      )
    } else {
      let Add =  <AdMobBanner
      bannerSize="smartBannerLandscape" 
      adUnitID={'ca-app-pub-5428132222163769/9394695947'} 
         
        servePersonalizedAds={true}/>;
        if(this.state.premium != 0){
          Add = <View></View>;
        }


      const { modalVisible3 } = this.state;

      var cat = ''; 

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
        let categoryColor = '#689F38';
        var imgPer = <ImageModal
          borderRadius={60}
          imageBackgroundColor="#ffffff"
          source={require('../../../Image/rsz_basket.png')}
          style={{

            width: 60,
            height: 60,
            alignSelf: 'center',
          }}
        />
        if (item.photo !== null && item.photo !== "") {
          imgPer = <ImageModal
            borderRadius={60}
            imageBackgroundColor="#ffffff"
            source={{ uri: 'https://kulinarcho.s3.eu-central-1.amazonaws.com/products/' + item.photo + '?time' + (new Date()).getTime() }}
            style={{

              width: 60,
              height: 60,
              alignSelf: 'center',
            }}
          />
        }
        return (
          <View>
            {fields}

            <View
              elevation={5}
              style={{
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
                borderBottomWidth: 5,
                borderRightWidth: 5,
                borderBottomColor: 'silver',
                borderRightColor: 'silver',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: 15,
              }}>
              <View style={{ flex: 1, flexDirection: 'column', width: '100%' }}>
                <View style={{
                  flex: 1, flexDirection: 'row', width: '95%', marginTop: 10,
                }}>
                  <TouchableOpacity style={{
                    marginLeft: 30,
                    flex: 1,
                    fontSize: 19,
                    fontWeight: '200',
                    // fontFamily: 'sans-serif',
                    alignSelf: 'center',
                    textDecorationLine: buyedDesign
                  }}
                    onPress={() => {
                      this.setState({ typeid: item.id });

                      if (item.price > 0) {
                        this.setState({ price: item.price });
                      } else {
                        this.setState({ price: '' });
                      }
                      if (item.value > 0) {
                        this.setState({ amount: item.value });
                      } else {
                        this.setState({ amount: '' });
                      }

                      this.RBSheet.open()
                    }}>

                    <Text
                      style={{
                        marginLeft: 30,
                        flex: 1,
                        fontWeight: 'bold',
                        fontSize: 22,
                        // fontFamily: 'sans-serif',
                        marginBottom: 4,
                        alignSelf: 'center',
                        textDecorationLine: buyedDesign
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                  <Icon style={styles.icon}
                    size={30}
                    color={'silver'}
                    onPress={() => {

                      // this.setState({modalEditTitle: 'Редактиране на списък'})
                      this.setState({ productId: item.id })
                      AsyncStorage.setItem('productId', item.id.toString());
                      this['RBSheet2'].open()
                      // this.RBSheet.open()

                    }

                    }
                    type='font-awesome-5'

                    name='pencil-alt'

                  >Редактирай</Icon>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  {imgPer}

                  <TouchableOpacity style={{
                    width: '100%',
                    paddingLeft: 9,
                    height: 60,

                    flex: 2,
                    flexDirection: 'column',

                  }} onPress={() => {
                    this.setState({ typeid: item.id });

                    if (item.price > 0) {
                      this.setState({ price: item.price });
                    } else {
                      this.setState({ price: '' });
                    }
                    if (item.value > 0) {
                      this.setState({ amount: item.value });
                    } else {
                      this.setState({ amount: '' });
                    }
                    this.RBSheet.open()
                  }}>



                    <Text
                      style={{
                        width: '100%',
                        // flex: 1,
                        fontSize: 16,
                        fontWeight: '200',
                        // fontFamily: 'sans-serif',
                        color: '#808080',
                        textDecorationLine: buyedDesign

                      }}>
                      {item.description}
                    </Text>

                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    flex: 1,
                    height: 50,
                    flexDirection: 'column',
                    paddingRight: 5,
                    paddingTop: 5,
                    alignItems: 'flex-end',
                    // marginLe,
                  }}
                    onPress={() => {
                      this.setState({ typeid: item.id });

                      if (item.price > 0) {
                        this.setState({ price: item.price });
                      } else {
                        this.setState({ price: '' });
                      }
                      if (item.value > 0) {
                        this.setState({ amount: item.value });
                      } else {
                        this.setState({ amount: '' });
                      }

                      this.RBSheet.open()
                    }}>



                    <Text
                      style={{
                        // flex: 1,
                        fontSize: 14,
                        fontWeight: '100',
                        textDecorationLine: buyedDesign
                        // fontFamily: 'roboto',
                      }}>
                      {item.price} лв.
                    </Text>
                    <Text style={{ alignItems: 'flex-end', color: 'black', fontSize: 14, color: categoryColor, textDecorationLine: buyedDesign }}>
                      <Text style={{ marginRight: 5 }}> X</Text>
                      {item.value} {item.unitsName}
                    </Text>

                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={{
                    
                  }}
                    onPress={() => {
                      this.setState({ typeid: item.id });

                      if (item.price > 0) {
                        this.setState({ price: item.price });
                      } else {
                        this.setState({ price: '' });
                      }
                      if (item.value > 0) {
                        this.setState({ amount: item.value });
                      } else {
                        this.setState({ amount: '' });
                      }

                      this.RBSheet.open()
                    }}>
                <View style={{ flexDirection: 'row', height: 40 }}>
                
                  <View style={{
                    marginTop: -10,
                    height: 50,
                    backgroundColor: 'transparent',
                    borderStyle: 'solid',
                    borderRightWidth: 50,
                    borderBottomWidth: 50,
                    borderRightColor: 'transparent',
                    borderBottomColor: buyedColor,
                    borderBottomLeftRadius: 15, marginLeft: -2
                  }}></View>
                  <View style={{ flex: 2, color: categoryColor, textDecorationLine: buyedDesign, alignContent: 'flex-start', height: 50 }} >
                    <Text style={{ marginTop: 5, textAlign: 'left', color: categoryColor, textDecorationLine: buyedDesign }}>
                      {item.type}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ textAlign: 'right', marginRight: 10, marginTop: 5, fontSize: 20, fontWeight: 'bold', 
                    textDecorationLine: buyedDesign }}>{item.finalPrice} лв.</Text></View>
                </View>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        );
      };

      return (
        <View style={styles.MainContainer}>
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={200}
            customStyles={{
              wrapper: {
                backgroundColor: "transparent"
              },
              container: {
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                justifyContent: "center",
                alignItems: "center", 
                borderWidth:1
              }
            }}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.titlem}>{this.state.modalEditTitle}</Text>
              <View style={styles.dividerm}></View>
            </View>
            <View style={{
              marginTop: 0,
              flexDirection: "row",
            }}>

              <Text style={{
                marginLeft: 5,
                marginTop: 15,
                width: '45%'
              }}>Количество</Text>
              <Text style={{
                marginLeft: 5,
                marginRight: 5,

                marginTop: 15,
                width: '40%'
              }}>Цена</Text>
            </View>
            <View style={{
              marginTop: 0,
              flexDirection: "row",
              marginBottom: 20
            }}>
              <TextInput
                placeholder={'Количество'}
                keyboardType='number-pad'

                style={styles.inputRow}
                defaultValue={this.state.amount}
                onChangeText={typeTitle => this.setAmount(typeTitle)}
              />
              <TextInput
                placeholder={"Цена"}
                keyboardType='number-pad'

                style={styles.inputRow2}
                defaultValue={this.state.price}
                onChangeText={typeTitle => this.setPrice(typeTitle)}
              />
            </View>

            <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
              <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                this.RBSheet.close()
                this.submitEditType();
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
                  <View style={{ backgroundColor: 'silver', height: 50, paddingBottom: 4, borderTopWidth: 1,borderColor: 'silver' }}>
                    <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                      size={30}
                      containerStyle={{
                        backgroundColor: '#ebebeb',
                        padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                      }}
                      color={'green'}
                      onPress={() => {
                        this.RBSheet.close()
                        this.submitEditType();

                      }

                      }
                      type='ionicon'
                      backgroundColor='silver'
                      name='add-circle-outline'
                    ></Icon>

                  </View>
                  <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                    <Text style={{ flex: 3, marginTop: 15 }}>Купи</Text>
                  </View>
                </View>
              </TouchableHighlight>
              <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                this.RBSheet.close()
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

                        this.RBSheet.close()


                      }

                      }
                      type='ionicon'
                      backgroundColor='silver'
                      name='close-outline'
                    ></Icon>

                  </View>
                  <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                    <Text style={{ flex: 3, marginTop: 15 }}>Откажи</Text>
                  </View>
                </View>
              </TouchableHighlight>

            </View>

          </RBSheet>
          <RBSheet
            ref={ref => {
              this['RBSheet2'] = ref;
            }}
            height={140}
            customStyles={{
              container: {
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }
            }}
          >

            <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('EditShoppingListProduct');

              }
              }>
                <View style={{ flexDirection: 'row' }}>

                  <Icon style={styles.icon}
                    containerStyle={{
                      backgroundColor: '#ebebeb',
                      borderRadius: 20,
                      padding: 5
                    }}
                    size={25}
                    color={'black'}

                    onPress={() => {
                      this.props.navigation.navigate('EditShoppingListProduct');


                    }

                    }
                    type='font-awesome-5'

                    name='pencil-alt'
                  >Редактирай</Icon>
                  <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Редактирай продукта</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => {

this.submitDeleteType();
            }
            }>
              <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

                <Icon
                  containerStyle={{
                    backgroundColor: '#ebebeb',
                    borderRadius: 20,
                    padding: 5
                  }}
                  size={25}
                  color={'silver'}
                  name='trash-outline'
                  color={'black'}
                  type='ionicon'

                  onPress={() => {

                    this.submitDeleteType();
                                    }
                  }
                  size={25}
                  style={styles.icon} ></Icon><Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Изтрий продукта</Text>
              </View>
            </TouchableOpacity>



          </RBSheet>

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
              Alert.alert(
                "Приключване на списъка",
                "Сигурни ли сте че искате да приключите списъка",
                [
                  {
                    text: "Продължи пазаруването",
                    onPress: () => {  },
                    style: "cancel"
                  },
                  { text: "Приключи", onPress: () => this.archiveShoppingList() }
                ],
                { cancelable: false }
              );
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
                      Alert.alert(
                        "Приключване на списъка",
                        "Сигурни ли сте че искате да приключите списъка",
                        [
                          {
                            text: "Продължи пазаруването",
                            onPress: () => {  },
                            style: "cancel"
                          },
                          { text: "Приключи", onPress: () => this.archiveShoppingList() }
                        ],
                        { cancelable: false }
                      );
                    }

                    }
                    type='ionicon'
                    backgroundColor='silver'
                    name='checkmark-outline'
                  ></Icon>

                </View>
                <View style={{ flex: 3, backgroundColor: 'white', height: 45, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                  <Text style={{ flex: 3, marginTop: 10 }}>Приключи списък</Text>
                </View>
              </View>
            </TouchableHighlight>

            <Text style={{
              flex: 1, marginTop: 15, textAlign: 'center', alignItems: 'center',
              fontSize: 16, fontWeight: '300', color: '#8c8c8c',
            }} >Общо: {this.state.sum} лв. </Text>
          </View>
          <ActionButton
            buttonColor='#689F38'
            offsetY={65}
            onPress={() => {
              this.props.navigation.navigate('AddShoppingListProduct', { user: 'asdasdsdasd' });
            }}
          />
        </View>
      );
    }
  }
};
export default ListEditProducts;
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    flex: 2,
    width: 200,
    height: 30,
    padding: 0
  },
});
const styles = StyleSheet.create({
  modalBtn: {
    flexDirection: "row",
    flex: 2,
    height: 80,
    marginBottom: 50,
  },
  inputRadio: {
    flexDirection: "row",
    height: 20,
    paddingRight: 10
  },
  input: {

    marginBottom: 10,
    marginTop: 15,
    width: 200
  },

  titlem: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#000",
    alignSelf: 'stretch',
    margin: 0,
    padding: 0,

  },
  inputRow: {
    borderBottomWidth: 1,
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 5,
    width: '45%'
  },
  inputRow2: {
    borderBottomWidth: 1,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,

    marginTop: 5,
    width: '40%'
  },
  inputRowText: {
    marginLeft: 5,
    marginTop: 15,
    width: '45%'
  },
  inputRowText2: {
    marginLeft: 5,
    marginRight: 5,

    marginTop: 15,
    width: '40%'
  },
  dividerm: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#000"
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    flex: 1,
    height: 40,
    margin: 15
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  activeButton: {
    width: 100,
    paddingRight: 5,
    paddingLeft: 5,
    justifyContent: 'space-between',
    marginRight: 2,
    marginLeft: 2,

  },
  customBtnBG: {
    justifyContent: 'space-between',
    marginRight: 2,
    marginLeft: 2,
  },
  activeButtonTop: {
    backgroundColor: '#38e8ff',
    width: 100,
    paddingRight: 5,
    paddingLeft: 5,
    borderColor: "#20232a",

  },
  customBtnBGTop: {
    alignSelf: 'stretch',
    flex: 1,
    paddingTop: 5
  },
  customBtnBGTopActive: {
    backgroundColor: "#fff",
    alignSelf: 'stretch',
    flex: 1,
    paddingTop: 5


  },
  customBtnText: {
    color: '#adadad',
    width: 100,
    paddingRight: 5,
    paddingLeft: 5
  },
  customBtnTextActive: {
    color: 'black',
    width: 100,
    paddingRight: 5,
    paddingLeft: 5
  },
  buttoncontainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  bottomView: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',

  },

  bottomButtonActive: {
    flexDirection: 'row',
    backgroundColor: 'green',
    width: '40%',
    height: 40
  },
  bottomButton: {
    fontSize: 5
  },
  MainContainer:
  {
    height: '100%',
    // marginTop: 5,
    // marginBottom: 5,
    // flex: 1,
    // paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },
  topView: {
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    flexDirection: 'row',

  },
  topView2: {
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    flexDirection: 'row',
    backgroundColor: '#689F38'

  },

  item: {
    marginVertical: 3,

    flex: 3,
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2

  },
  title: {
    paddingLeft: 9,
    fontSize: 16,
    flex: 1,

  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 10,
    marginTop: 10,
    flex: 1
  },
  container: {


  },

});
