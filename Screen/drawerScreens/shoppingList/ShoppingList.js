

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';


import {
  Alert,
  View,
  Text,
  TouchableHighlight
} from "react-native";

class ShoppingList extends React.Component {

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'ShoppingList'){
          route.push(lastRoute);
      }
      let goRoute = route.pop();
         console.log(goRoute);
      console.log(route);
              AsyncStorage.setItem('backRoute', JSON.stringify(route));
        this.props.navigation.navigate(goRoute);
    })
  );
  
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
    externalDataDropdown: null,
    selectedDropdown: '',
    externalDataProducts: null,
    sum: 0,
    amount: 0,
    sort: '',
    externalDataProducts: [],
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
    unbuyedProduct: 0
  };

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
    let listId = await AsyncStorage.getItem('listId');
    let listName = await AsyncStorage.getItem('listName');
    this.setState({ listId: listId })
    this.setState({ listName: listName })
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    this.setState({ unbuyedProduct: 0 });
    if (this.state.selectedDropdown !== 0) {
      fetch("http://167.172.110.234/api/getShoppingListProducts?listId=" + this.state.selectedDropdown + "&sort=" + this.state.sort, {
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
            sum = sum + 1;
            if (data[key].status === 1) {
              sumUnbyed = sumUnbyed + 1;
            }
            newData.push(data[index]);
          })
          if (sum > 0 && sumUnbyed > 0 && sum === sumUnbyed) {
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
        this.fetchData();
      }
    ).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }

  async submitDeleteType() {
    console.log(JSON.stringify({ id: this.state.dropdownSelect2, status: 1 }));
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch('http://167.172.110.234/api/deleteProductFromList', {
      method: 'POST',
      body: JSON.stringify({ id: this.state.dropdownSelect2, status: 1 }),
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
        arrRoute.push('ShoppingList')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'ShoppingList') {
        arrRoute.push('ShoppingList')
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
    return (<View style={{
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10,
      backgroundColor: '#d1e3d1'
    }}>
      <View style={{ marginTop: 20 }}>
        <TouchableHighlight style={{ height: 50 }} onPress={() => { console.log('dasdasd') }}>
          <View style={styles.button}>
            <View style={{ backgroundColor: 'silver', height: 50, paddingBottom: 4, flex: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", }}>
              <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                size={30}
                containerStyle={{
                  backgroundColor: '#ebebeb',
                  padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                }}
                color={'orange'}
                onPress={() => {

                  // this.setState({modalEditTitle: 'Редактиране на списък'})
                  this.setState({ productId: item.id })
                  AsyncStorage.setItem('productId', item.id.toString());
                  this['RBSheet2'].open()
                  // this.RBSheet.open()

                }

                }
                type='ionicon'
                backgroundColor='silver'
                name='build-outline'
              >Редактирай</Icon>

            </View>
            <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
              <Text style={{ flex: 3, marginTop: 15 }}>Приключи списък</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
        <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => { console.log('dasdasd') }}>
          <View style={styles.button}>
            <View style={{ backgroundColor: 'silver', height: 50, paddingBottom: 4, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", }}>
              <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                size={30}
                containerStyle={{
                  backgroundColor: '#ebebeb',
                  padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                }}
                color={'green'}
                onPress={() => {

                  // this.setState({modalEditTitle: 'Редактиране на списък'})
                  this.setState({ productId: item.id })
                  AsyncStorage.setItem('productId', item.id.toString());
                  this['RBSheet2'].open()
                  // this.RBSheet.open()

                }

                }
                type='ionicon'
                backgroundColor='silver'
                name='build-outline'
              ></Icon>

            </View>
            <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
              <Text style={{ flex: 3, marginTop: 15 }}>Редактирай</Text>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => { console.log('dasdasd') }}>
          <View style={styles.button}>
            <View style={{ backgroundColor: 'silver', height: 50, paddingBottom: 4, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", }}>
              <Icon style={{ flex: 2, marginRight: 15, height: 40, borderRightWidth: 1, borderColor: 'silver' }}
                size={30}
                containerStyle={{
                  backgroundColor: '#ebebeb',
                  padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                }}
                color={'red'}
                onPress={() => {

                  // this.setState({modalEditTitle: 'Редактиране на списък'})
                  this.setState({ productId: item.id })
                  AsyncStorage.setItem('productId', item.id.toString());
                  this['RBSheet2'].open()
                  // this.RBSheet.open()

                }

                }
                type='ionicon'
                backgroundColor='silver'
                name='build-outline'
              >Редактирай</Icon>

            </View>
            <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
              <Text style={{ flex: 3, marginTop: 15 }}>teste</Text>
            </View>
          </View>
        </TouchableHighlight>

      </View>
    </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: '#d1e3d1'
  },
  button: {
    flex: 3, flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginLeft: 10, marginRight: 10, borderRadius: 10, borderWidth: 1, borderColor: "silver", height: 50,
    padding: 10
  },
  countContainer: {
    alignItems: "center",
    padding: 10
  },
  countText: {
    color: "#FF00FF"
  }
});
export default ShoppingList;
