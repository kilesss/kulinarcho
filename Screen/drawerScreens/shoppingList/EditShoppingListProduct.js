import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';

import {
  View,
  Text,
  TextInput,ActivityIndicator,

  TouchableHighlight
} from "react-native";
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';

import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';
class EditShoppingListProduct extends React.Component {

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'EditShoppingListProduct'){
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

  handleBackButtonClick() {
    //this.props.navigation.goBack(null);

    
    this.props.navigation.navigate('ShoppingListEditProducts');
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
    modalEditTitle: 'Редактиране на списък',
    listID: '',
    externalDataProducts: null,
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
    titleProd: '',
    premium:0,

  };


  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      
      var id = await AsyncStorage.getItem('listId')
      this.setState({ placeholder: "Продукт", })
      this.setState({ price: '' });
      this.setState({ amount: '' });
      this.setState({ listId: '' });
      this.setState({ dropdownSelect: '' });
      this.setState({ unitId: 0 });
      this.setState({ typesID: '' });
      this.setState({ newProdTitle: '' });
      this.setState({ listID: id });
      this.setState({ typeid: '' });
      this.setState({ titleProd: '' });
      await this.fetchData();
      await this.fetchDataProducts();
      await this.fetchDataTypes();
      await this.fetchDataUnits();
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

  async fetchData() {
    let listId = await AsyncStorage.getItem('listId');
    let productId = await AsyncStorage.getItem('productId');

    this.setState({ dropdownSelect: productId });
    let listName = await AsyncStorage.getItem('listName');
    this.setState({ listId: listId })
    this.setState({ listName: listName })
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    this.setState({ unbuyedProduct: 0 });
    fetch(global.MyVar+"getShoppingListProducts?listId=" + this.state.listId + "&productId=" + this.state.dropdownSelect, {
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
        
        
        this.setState({ price: data[0].price });
        this.setState({ amount: data[0].value });
        this.setState({ listId: this.state.listId });
        this.setState({ titleProd: data[0].name });
        this.setState({ typeid: data[0].id });
        this.setState({ dropdownSelect: data[0].productId });
        this.setState({ description: data[0].description });

      }).done();

  }

  async submitAddType() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    console.log(JSON.stringify({
      id: this.state.typeid,
      price: this.state.price,
      amount: this.state.amount,
      listId: this.state.listID,
      productId: this.state.dropdownSelect,
      unitId: this.state.unitID,
      typeId: this.state.typesID,
      name: this.state.newProdTitle,
    }))
    await fetch(global.MyVar+'AddProductShoppingList', {
      method: 'POST',
      body: JSON.stringify({
        id: this.state.dropdownSelect,
        price: this.state.price,
        amount: this.state.amount,
        listId: this.state.listID,
        productId: this.state.typeid,
        unitId: this.state.unitID,
        typeId: this.state.typesID,
        name: this.state.newProdTitle,
        description: this.state.description
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


        if (data.login && data.login == true) {
          AsyncStorage.clear();
          this.props.navigation.navigate('Auth');
        }

        if (data.new_token) {
          AsyncStorage.setItem('access_token', data.new_token);
          delete data.new_token;
          delete data['new_token'];
        }
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key], {}, 1000);
          })
        } else {
          this.props.navigation.navigate('ShoppingListEditProducts');

        }
      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
  }
  async fetchDataProducts() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch(global.MyVar+"getProducts", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN,
        'Cache-Control': 'no-cache'
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

        if (data.new_token) {
          AsyncStorage.setItem('access_token', data.new_token);
          delete data.new_token;
          delete data['new_token'];
        }
        this.state.premium = data.premium;
                delete data.premium;
        let newData = [];
        Object.keys(data).map((key, index) => {

          newData.push(data[index]);
        })
        this.setState({ externalDataProducts: newData });
      })
  }
  async fetchDataTypes() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    fetch(global.MyVar+"getTypes", {
      method: "GET",
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

        this.setState({ externalDataTypes: newData });

      }).done();
  }
  async fetchDataUnits() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    fetch(global.MyVar+"getUnits", {
      method: "GET",
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

        this.setState({ externalDataUnits: newData });

      }).done();
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

  render(props) {
    if (this.state.externalDataProducts === null) {
      return (
        <View style={styles.MainContainer}>
          <ActivityIndicator size="large" color="#7DE24E" /> 
        </View>
      )
    } else {
      
      let Add =  <AdMobBanner
      bannerSize="smartBannerLandscape" 
      adUnitID={'ca-app-pub-5428132222163769/6112419882'} 
         
        servePersonalizedAds={true}/>;
        if(this.state.premium != 0){
          Add = <View></View>;
        }

      return (

        <View style={styles.MainContainer}>
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
          <View style={{ height: '7%' }}>
          </View>
          {/* <Card style={{ flex: 1, marginLeft: 0, marginRight: 0 }}> */}

          <View style={{ maxHeight: 200 }}>

            <Text style={{
              borderRadius: 15,
              marginLeft: 5, marginRight: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.41,
              shadowRadius: 9.11,
              elevation: 6,
              backgroundColor: '#ffffff',
              height: 50, paddingLeft: 10,
              marginBottom: 20,
              marginTop: 20
            }}
            > {this.state.titleProd}</Text>


          </View>

          <TextInput
            placeholder={'Описание'}
            defaultValue={this.state.description}
            onChangeText={typeTitle => this.setState({description:typeTitle})}
            theme={{ colors: { placeholder: '#689F38', primary: 'silver' }, roundness: 15 }}
            style={{
              borderRadius: 15,
              marginLeft: 5, marginRight: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.41,
              shadowRadius: 9.11,
              elevation: 6,
              backgroundColor: '#ffffff',
              height: 50, paddingLeft: 10,
              marginBottom: 20,
            }}
            blurOnSubmit={false}
            onSubmitEditing={() => { this.secondTextInput.focus(); }}
          />

          <TextInput
                      ref={(input) => { this.secondTextInput = input; }}
                      blurOnSubmit={false}
                      onSubmitEditing={() => { this.thirdTextInput.focus(); }}
                      keyboardType='number-pad'

            placeholder={'Количество'}
            theme={{ colors: { placeholder: '#689F38', primary: 'silver' }, roundness: 15 }}
            defaultValue={this.state.amount}
            onChangeText={typeTitle => this.setAmount(typeTitle)}
            style={{
              borderRadius: 15,
              marginLeft: 5, marginRight: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.41,
              shadowRadius: 9.11,
              elevation: 6,
              backgroundColor: '#ffffff',
              height: 50, paddingLeft: 10,
              marginBottom: 20,
            }}

          />

          <TextInput
          ref={(input) => { this.thirdTextInput = input; }}
          blurOnSubmit={false}
          onSubmitEditing={() => {               this.submitAddType();
          }}
          keyboardType='number-pad'

            placeholder={'Цена'}
            theme={{ colors: { placeholder: '#689F38', primary: 'silver' }, roundness: 15 }}
            style={{
              borderRadius: 15,
              marginLeft: 5, marginRight: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.41,
              shadowRadius: 9.11,
              elevation: 6,
              backgroundColor: '#ffffff',
              height: 50, paddingLeft: 10,
              marginBottom: 20,
            }}

            defaultValue={this.state.price}
            onChangeText={typeTitle => this.setPrice(typeTitle)}

          />

          <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
            <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
              this.submitAddType();

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
                      this.submitAddType();


                    }

                    }
                    type='ionicon'
                    backgroundColor='silver'
                    name='checkmark-outline'
                  ></Icon>

                </View>
                <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                  <Text style={{ flex: 3, marginTop: 15 }}>Запази</Text>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
              this.props.navigation.navigate('ShoppingListEditProducts');
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

                      this.props.navigation.navigate('ShoppingListEditProducts');


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

        </View>
      );
    }
  }
}
export default EditShoppingListProduct;
const styles = StyleSheet.create({
  modalBtn: {
    flexDirection: "row",
    flex: 2,
    height: 80,
    marginBottom: 40,
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
    height: 10,
    backgroundColor: "#30ff49",
    borderBottomWidth: 2,
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
    margin: 15,
    marginTop: 0,
    marginBottom: 0
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
    flex: 1
  },
  container: {


  },

});
