

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

import {
  ScrollView,
  Alert,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableHighlight
} from "react-native";
import SearchableDropdown from 'react-native-searchable-dropdown';
import { BackHandler } from 'react-native';

class Accounts extends React.Component {


  state = {
    modalVisible: false,
    modalVisible2: false,
    deleteType: '',
    typeTitle: 'Име',
    token: '',
    isActive: false,
    data: [],
    externalData: null,
    typeid: '',
    modalEditTitle: 'Редактиране на списък',
    externalDataDropdown: null,
    selectedDropdown: '',
    externalDataProducts: null,
    sum: 0,
    amount: 0,
sort:'',
    externalDataProducts: [],
    selectedIndex: '',
    volume: '',
    price: '',
    finalPrice: '',
    dropdownSelect: '',
    placeholder: "Продукт",
    test: 0,
    externalDataTypes: [],
    externalDataUnits: [],
    typesPlaceholder: 'Тип',
    unitsPlaceholder: 'Разфасовка',
    unitID: 0,
    typesID: 0,
    newProdTitle: '',
    unbuyedProduct: 0
  };

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'Accounts'){
          route.push(lastRoute);
      }
      let goRoute = route.pop();
      console.log(goRoute);
      console.log(route);
      if(goRoute != undefined){
        AsyncStorage.setItem('backRoute', JSON.stringify(route));
        this.props.navigation.navigate(goRoute);
      }
    })
  );
  
  }
  setTypeTitle = (title) => {
    this.setState({ typeTitle: title })
  }
  setTypeID = (id) => {
    this.setState({ typeid: id })
  }
  setActive = (id) => {
    this.setState({ isActive: id })
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  setModalVisible2 = (visible) => {
    this.setState({ modalVisible2: visible });
  }

  setdeleteType = (title) => {
    this.setState({ deleteType: title })
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


  async fetchDataShoppingLists() {

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

    fetch("http://167.172.110.234/api/shoppingList", {
      method: "GET",
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then(response => response.json())
      .then(data => {
        let newData = [];
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key],{},1000);
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

        Object.keys(data).map((key, index) => {
          if (data[index].isShared == 1) {
            this.setState({ selectedDropdown: data[index].id })
          }
          newData.push({ 'label': data[index].name, 'value': data[index].id })
        })


        this.setState({ externalDataDropdown: newData });

      }).catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
        throw error;
      }).done();
  }

  async fetchData() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    this.setState({ unbuyedProduct: 0 });
    if(this.state.selectedDropdown !== 0){
    fetch("http://167.172.110.234/api/getShoppingListProducts?listId=" + this.state.selectedDropdown+"&sort="+this.state.sort, {
      method: "GET",
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then(response => response.json())
      .then(data => {
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key],{},1000);
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

        let sum = 0;
        let sumUnbyed = 0;

        let newData = [];
        Object.keys(data).map((key, index) => {
          sum = sum+1;
        if(data[key].status === 1){
          sumUnbyed = sumUnbyed+1;
        }
          newData.push(data[index]);
        })
        if(sum > 0 && sumUnbyed > 0 && sum === sumUnbyed){
          Alert.alert(
            "Приключване на списъка",
            "Всички продукти в списъка са купени искате ли да приключите списъка",
            [
              {
                text: "Отказ",
                onPress: () => { console.log("Cancel Pressed") },
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
  }
  async submitAddType() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
console.log( JSON.stringify({
  id: this.state.typeid,
  price: this.state.price,
  amount: this.state.amount,
  listId: this.state.selectedDropdown,
  productId: this.state.dropdownSelect,
  unitId: this.state.unitID,
  typeId: this.state.typesID,
  name: this.state.newProdTitle,
  activeList: this.state.selectedDropdown,
}));
    await fetch('http://167.172.110.234/api/AddProductShoppingList', {
      method: 'POST',
      body: JSON.stringify({
        id: this.state.typeid,
        price: this.state.price,
        amount: this.state.amount,
        listId: this.state.selectedDropdown,
        productId: this.state.dropdownSelect,
        unitId: this.state.unitID,
        typeId: this.state.typesID,
        name: this.state.newProdTitle,
        activeList: this.state.selectedDropdown,
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", 
        //Header Defination
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },

    }).then(
      async response => {
        console.log(response);
        const data = await response.json();
        
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key],{},1000);
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

        this.fetchData();
      }
    ).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }

  async archiveShoppingList() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

    await fetch('http://167.172.110.234/api/archiveList', {
      method: 'POST',
      body: JSON.stringify({
        listId: this.state.selectedDropdown,
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
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key],{},1000);
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

        this.forceUpdate();
        this.setState({ externalData: null })

        this.setState({ selectedDropdown: '' })
        await this.fetchDataShoppingLists();
        this.fetchData();
      }
    ).catch(function (error) {
      console.log('There has been a problem with your fetchaaaaaaaaaaaaaaa operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }

  async fetchDataProducts() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch("http://167.172.110.234/api/getProducts", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN,
        'Cache-Control': 'no-cache'
      }
    }).then(response => response.json())
      .then(data => {
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key],{},1000);
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
        let newData = [];
        Object.keys(data).map((key, index) => {

          newData.push(data[index]);
        })
        this.setState({ externalDataProducts: newData });
      })
  }
  async fetchDataTypes() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    fetch("http://167.172.110.234/api/getTypes", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then(response => response.json())
      .then(data => {
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key],{},1000);
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
        let newData = [];
        Object.keys(data).map((key, index) => {
          newData.push(data[index]);
        })

        this.setState({ externalDataTypes: newData });

      }).done();
  }
  async fetchDataUnits() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    fetch("http://167.172.110.234/api/getUnits", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then(response => response.json())
      .then(data => {
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key],{},1000);
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

        let newData = [];

        Object.keys(data).map((key, index) => {
          newData.push(data[index]);
        })

        this.setState({ externalDataUnits: newData });

      }).done();
  }
  async submitEditType() {

    var active = 0;
    if (this.state.isActive == 1) {
      active = 1
    }
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');


    await fetch('http://167.172.110.234/api/shoppingListBuy', {
      method: 'POST',
      body: JSON.stringify({
        listID: this.state.selectedDropdown,
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
        console.log(data);
        if (data.errors) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key],{},1000);
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
        this.fetchData();
      }
    ).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }


  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('Accounts')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'Accounts') {
        arrRoute.push('Accounts')
      }
      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

      await this.fetchDataShoppingLists();
      await this.fetchData();
      await this.fetchDataProducts();
      await this.fetchDataUnits();
      await this.fetchDataTypes();
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

  render(props) {
    if (this.state.externalData === null || this.state.externalDataDropdown === null) {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.topView}>
            <Text>Loading....</Text>
          </View>
        </View>
      )
    } else {

      var addProductView = [];
      if (this.state.test === 1) {
        addProductView.push(
          <View style={{ maxHeight: 200 }}>
            <SearchableDropdown
              style={{}}
              //On text change listner on the searchable input
              onTextChange={(text) => console.log(text)}
              onItemSelect={(item) => {

                this.setState({
                  typesID: item.id,
                });
                this.setState({
                  typesPlaceholder: item.name,
                });
              }}
              placeholder={this.state.placeholderType}
              //onItemSelect called after the selection from the dropdown
              containerStyle={{ padding: 5 }}
              //suggestion container style
              textInputStyle={{
                //inserted text style
                borderBottomWidth: 1,
                borderColor: '#ccc',
                width: 270
              }}
              itemStyle={{
                //single dropdown item style
                padding: 10,
                borderBottomWidth: 1,
                borderColor: '#ccc',
                width: 270

              }}
              itemTextStyle={{
                //text style of a single dropdown item
                color: '#222',
              }}
              itemsContainerStyle={{
                //items container style you can pass maxHeight
                //to restrict the items dropdown hieght
                maxHeight: '100%',
                width: '100%',
                paddingBottom: 0,
                marginBottom: 0
              }}
              items={this.state.externalDataTypes}
              placeholder={this.state.typesPlaceholder}
              //mapping of item array
              // defaultIndex={this.state.selectedIndex}
              //default selected item index
              //place holder for the search input
              resetValue={false}
              //reset textInput Value with true and false state
              underlineColorAndroid="transparent"
            //To remove the underline from the android input
            />


            <SearchableDropdown
              //On text change listner on the searchable input
              onTextChange={(text) => console.log(text)}
              onItemSelect={(item) => {
                this.setState({
                  unitsPlaceholder: item.name,
                });
                this.setState({
                  unitID: item.id,
                });
              }}
              placeholder={this.state.placeholderUnits}
              //onItemSelect called after the selection from the dropdown
              containerStyle={{ padding: 5 }}
              //suggestion container style
              textInputStyle={{
                //inserted text style
                borderBottomWidth: 1,
                borderColor: '#ccc',
                width: 270
              }}
              itemStyle={{
                //single dropdown item style
                padding: 10,
                borderBottomWidth: 1,
                borderColor: '#ccc',
                width: 270

              }}
              itemTextStyle={{
                //text style of a single dropdown item
                color: '#222',
              }}
              itemsContainerStyle={{
                //items container style you can pass maxHeight
                //to restrict the items dropdown hieght
                maxHeight: '100%',
                width: '100%',
                paddingBottom: 0,
                marginBottom: 0
              }}
              placeholder={this.state.unitsPlaceholder}

              items={this.state.externalDataUnits}
              //mapping of item array
              // defaultIndex={this.state.selectedIndex}
              //default selected item index
              //place holder for the search input
              resetValue={false}
              //reset textInput Value with true and false state
              underlineColorAndroid="transparent"
            //To remove the underline from the android input
            />
          </View>

        )
      }

      const { modalVisible } = this.state;
      const { modalVisible2 } = this.state;

      const { typeTitle } = this.state;

      const showDescr = (desc) => {
        if (desc !== '') {
          return <Text style={styles.title}>{desc}</Text>
        } else {
          return <Text></Text>
        }
      }
      const showPhoto = (desc) => {
        if (desc !== null) {
          return (<Image source={{ uri: 'https://kulinarcho.s3.eu-central-1.amazonaws.com/products/' + desc+'?time'+(new Date()).getTime() }}
            style={{ width: '100%', height: '100%' }}
          />)
        }
      }

      const renderLoop = (item) => {
        var color = {
          textDecorationLine: 'none',
          paddingLeft: 9,
          fontSize: 16,
          flex: 1,
          // color:'black',
          // backgroundColor: 'red',
        };
        var fields = [];
        var cat = '';
        Object.keys(item).map((key, index) => {
          if (item[key].status === 1) {
            color = {
              textDecorationLine: 'line-through',
              paddingLeft: 9,
              fontSize: 16,
              flex: 1,

            }
          }else{
              color = {
                textDecorationLine: 'none',
                paddingLeft: 9,
                fontSize: 16,
                flex: 1,
                // color:'black',
                // backgroundColor: 'red',
              }
            }
          

          if (this.state.sort == 'typeAsc' || this.state.sort == 'typeDesc') {
            if (cat !== item[key].type) {
              cat = item[key].type;
              fields.push(<Text>{cat}</Text>);
            }
          }
          fields.push(<View style={{
            backgroundColor: 'white',
            marginVertical: 3,
            flex: 4,
            flexDirection: 'row',
            paddingTop: 2,
            paddingBottom: 2,
          }}>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => {
              this.setState({ modalEditTitle: 'Купи  продукт' })


              this.setAmount(item[key].value);
              this.setFinalPrice(item[key].finalPrice);
              this.setPrice(item[key].price);
              this.setProductID(item[key].id);
              this.setModalVisible(true)
            }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '40%' }}>
                  {showPhoto(item[key].photo)}
                </View>
                <View style={{ width: '60%' }}>

                  <Text style={color}>{item[key].name}</Text>
                  {showDescr(item[key].description)}

                  <Text style={color}>{item[key].value} {item[key].unitsName} x {item[key].price} = {item[key].finalPrice}</Text>
                </View>
              </View>
            </TouchableOpacity>

          </View>)

        })
        return fields;

      }


      return (
        <View style={styles.MainContainer}>
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />

          <View style={{ height: '14%' }}>
            
            <View style={{ flex: 1, flexDirection: 'row', }}>
             
              <TouchableOpacity style={{ flex: 1, height: 20,  }}
                onPress={() => {
                  this.setState({ placeholder: "Продукт" });
                  this.setState({ selectedIndex: '' })
                  this.setState({ amount: 0 })
                  this.setState({ price: 0 })
                  this.setState({ finalPrice: 0.00 })
                  this.setState({ dropdownSelect: '' })

                  this.setModalVisible2(true)
                  this.setState({ typesPlaceholder: 'Тип' })
                  this.setState({ unitsPlaceholder: 'Разфасовка' })
                  this.setState({ unitID: 0 })
                  this.setState({ typesID: 0 })
                  this.setState({ newProdTitle: '' });

                }

                }
              >
                <Text style={{ textDecorationLine: 'underline', alignSelf: "center", paddingTop: 10, }}>Добави продукт</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={{ marginTop: 10, height: '78%', flexGrow: 0, zIndex: 0 }}>

            {renderLoop(this.state.externalData)}
          </ScrollView>

          <Text style={{ height: "10%", alignSelf: "flex-end", paddingTop: 10 }}>Общо: {this.state.sum} лв. </Text>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            }}
          >

            <View style={styles.centeredView}>
              <View style={styles.modalView}>
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
                    style={styles.inputRow}
                    defaultValue={this.state.amount}
                    onChangeText={typeTitle => this.setAmount(typeTitle)}
                  />
                  <TextInput
                    placeholder={"Цена"}
                    style={styles.inputRow2}
                    defaultValue={this.state.price}
                    onChangeText={typeTitle => this.setPrice(typeTitle)}
                  />
                </View>
                {/* <View style={{
                  marginTop: 0,
                  flexDirection: 'row', justifyContent: 'flex-end'
                }}>
                  <Text style={{ width: 50 }}>Общо:</Text>
                  <Text style={{ width: 50 }}>{this.state.finalPrice}</Text>
                </View> */}
                <View style={styles.modalBtn}>
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#00cf0e" }}
                    onPress={() => {
                      this.setModalVisible(!modalVisible);
                      this.submitEditType();
                    }}
                  >
                    <Text style={styles.textStyle}>Запази</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#f00000" }}
                    onPress={() => {
                      this.setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>Откажи</Text>
                  </TouchableHighlight>
                </View>

              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible2}
            onRequestClose={() => {
            }}
          >

            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.titlem}>{this.state.modalEditTitle}</Text>
                  <View style={styles.dividerm}></View>
                </View>
                <View style={{ maxHeight: 200 }}>

                  <SearchableDropdown
                    onTextChange={(text) => { this.setState({ newProdTitle: text }) }}
                    //On text change listner on the searchable input
                    onItemSelect={(item) => { this.setProductID(item.id); this.setState({ placeholder: item.name }) }}
                    onItemSelectNoResult={(item) => { this.setState({ test: 1 }) }}
                    //onItemSelect called after the selection from the dropdown
                    containerStyle={{ padding: 5 }}
                    suggestion container style
                    textInputStyle={{
                      //inserted text style
                      borderBottomWidth: 1,
                      borderColor: '#ccc',
                      width: 270
                    }}
                    itemStyle={{
                      //single dropdown item style
                      padding: 10,
                      borderBottomWidth: 1,
                      borderColor: '#ccc',
                      width: 270

                    }}
                    itemTextStyle={{
                      //text style of a single dropdown item
                      color: '#222',
                    }}
                    showNoResult={'true'}
                    showNoResultTitle={'Създай продукт'}
                    showNoResultColor={'green'}
                    showNoResultViewStyle={{
                      marginTop: 10, marginLeft: 20
                    }}
                    itemsContainerStyle={{
                      //items container style you can pass maxHeight
                      //to restrict the items dropdown hieght
                      maxHeight: '100%',
                      width: '80%',
                      paddingBottom: 0,
                      marginBottom: 0
                    }}
                    items={this.state.externalDataProducts}
                    //mapping of item array
                    defaultIndex={this.state.selectedIndex}
                    //default selected item index
                    placeholder={this.state.placeholder}
                    //place holder for the search input
                    resetValue={false}
                    //reset textInput Value with true and false state
                    underlineColorAndroid="transparent"
                  //To remove the underline from the android input
                  />
                  {addProductView}
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
                    style={styles.inputRow}
                    defaultValue={this.state.amount}
                    onChangeText={typeTitle => this.setAmount(typeTitle)}
                  />


                  <TextInput
                    style={styles.inputRow2}
                    defaultValue={this.state.price}
                    onChangeText={typeTitle => this.setPrice(typeTitle)}
                  />
                </View>
                <View style={{
                  marginTop: 0,
                  flexDirection: 'row', justifyContent: 'flex-end'
                }}>
                  {/* <Text style={{ width: 50 }}>Общо:</Text>
                                    <Text style={{ width: 50 }}>{this.state.finalPrice}</Text> */}
                </View>
                <View style={styles.modalBtn}>
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#00cf0e" }}
                    onPress={() => {
                      this.setModalVisible2(!modalVisible2);
                      this.submitAddType();
                    }}
                  >
                    <Text style={styles.textStyle}>Запази</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#f00000" }}
                    onPress={() => {
                      this.setModalVisible2(!modalVisible2);
                    }}
                  >
                    <Text style={styles.textStyle}>Откажи</Text>
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
export default Accounts;
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
    // height: '100%',
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
