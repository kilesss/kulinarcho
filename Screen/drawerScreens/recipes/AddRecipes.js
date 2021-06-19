

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import DropdownAlert from 'react-native-dropdownalert';
import { BackHandler } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import { Picker } from '@react-native-picker/picker';

import {
  AdMobBanner,
} from 'expo-ads-admob';
import {
  StyleSheet,
  View,
  Text,
  TextInput, ActivityIndicator,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { Icon } from 'react-native-elements'
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as ImagePicker from 'expo-image-picker';

class EditRecipes extends React.Component {

  state = {
    textInputIngridients: [],
    textInputArea: [],
    key: 0,
    modalVisible: false,
    unitName: false,
    amount: '',
    title: '',
    portions: '',
    description: '',
    time1: '',
    time2: '',
    unitId: '',
    time3: '',
    externalData: null,
    externalDataUnits: null,
    unitPlaceholder: 'Разфасовка',
    product: false,
    textInput: '',
    placeholder: '',
    categoryId: '',
    typesPlaceholder: '',
    newProdTitle: '',
    hint: '',
    unitsPlaceholder: '',
    count: false,
    RBSheet2: false,
    RBSheet: false,
    premium: 0,
    categoryplaceholder: 'Категория',
    catIndex: 0,
    selectedValue: ''
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  setProductID = (id) => {
    this.setState({ product: id.name })
    this.setState({ placeholder: id.name })
    this.setState({ productId: id.id })

  }
  setProductUnit = (id) => {
    this.setState({ unitName: id.name })
    this.setState({ unitId: id.id })
    this.setState({ unitPlaceholder: id.name })


  }

  submitEditType = () => {
    let unitName = this.state.unitName;
    let product = this.state.product;
    let productId = this.state.productId;
    let amount = this.state.amount;

    if (product !== false && this.state.unitId !== '') {


      let arr = this.state.textInputIngridients;
      let arr2 = {};
      // arr2.push({unitName:unitName,product:product,productId:productId,amount:amount })
      arr2['unitName'] = unitName;
      arr2['unitid'] = this.state.unitId
      arr2['product'] = product;
      arr2['productId'] = productId;
      arr2['amount'] = amount;
      arr2['hint'] = this.state.hint;
      arr.push(arr2);
      this.setState({ textInputIngridients: arr })
    } else {
      if (product === false) {
        this.dropDownAlertRef.alertWithType('error', '', 'Не сте избрали продукт', {}, 2000);
      }
      if (this.state.unitId === '') {
        this.dropDownAlertRef.alertWithType('error', '', 'Не сте избрали разфасовка', {}, 2000);
      }
      // if (amount === '') {
      //   this.dropDownAlertRef.alertWithType('error', '', 'Не сте избрали количество', {}, 2000);
      // }
    }
  }
  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('EditRecipes')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'EditRecipes') {
        arrRoute.push('EditRecipes')
      }
      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

      this.setState({ key: 0 });
      this.setState({ modalVisible: false });
      this.setState({ unitName: false });
      this.setState({ amount: '' });
      this.setState({ title: '' });
      this.setState({ portions: '' });
      this.setState({ time1: '' });
      this.setState({ time2: '' });
      this.setState({ time3: '' });
      this.setState({ description: '' });
      this.setState({ externalData: false });
      this.setState({ product: false });
      this.setState({ image: '' });
      this.setState({ hint: '' });
      this.setState({ image64: '' });
      this.setState({ textInputIngridients: [] });
      this.setState({ textInputArea: [] });
      this.setState({ textInput: {} });      // await this.fetchDataShoppingLists();
      await this.fetchData();
      await this.fetchDataUnits();
      await this.checkPremium();

    });
  }

  async checkPremium() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch(global.MyVar+'checkPremium', {
      method: 'POST',
      body: JSON.stringify({ types: 'recipe' }),
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

        this.setState({ count: data.response })

      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
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


  setAmount = (id) => {
    this.setState({ amount: id })
  }
  setStep = (id) => {
  }
  async setImage(img) {

    this.setState({ image: img })
  }
  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
      BackHandler.addEventListener("hardwareBackPress", async () => {
        let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
        let lastRoute = route.pop();
        if (lastRoute != 'EditRecipes') {
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
  async fetchData() {


    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');


    fetch(global.MyVar+"getProducts", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then(response => response.json())

      .then(data => {

        this.state.premium = data.premium;
        delete data.premium;

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
        this.state.premium = data.premium;
        delete data.premium;
        Object.keys(data).map((key, index) => {

          newData.push(data[index]);
        })
        this.setState({ externalData: newData });

      }).done();
  }

  async fetchDataUnits() {

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');


    fetch(global.MyVar+"getRecipeUnits", {
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

        if (data.new_token) {
          AsyncStorage.setItem('access_token', data.new_token);
          delete data.new_token;
          delete data['new_token'];
        }
        let newData = [];
        this.state.premium = data.premium;
        delete data.premium;
        Object.keys(data).map((key, index) => {

          newData.push(data[index]);
        })

        this.setState({ externalDataUnits: newData });

      }).done();
  }
  async submitRecipe() {


    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

    await fetch(global.MyVar+'recipesAdd', {
      method: 'POST',
      body: JSON.stringify({
        title: this.state.title,
        portions: this.state.portions,
        description: this.state.description,
        time1: this.state.time1,
        time2: this.state.time2,
        time3: this.state.time3,
        textInputIngridients: this.state.textInputIngridients,
        textInput: this.state.textInput,
        photo: this.state.image64,
        category: this.state.selectedValue
      }),
      bodyParser: {
        json: { limit: '50mb', extended: true },
        urlencoded: { limit: '50mb', extended: true }
      },
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
        if (data.errors !== undefined) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', '', data.errors[key], {}, 1000);

          })


        } else {
          this.props.navigation.navigate('ListRecipes');

        }

      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
  }

  _handleMultiInput(name) {
    return (text) => {
      let kur = { key: name, val: text }
      let arr = this.state.textInput;
      arr[kur.key] = text;
      this.setState({ textInput: arr })
    }
  }
  setdeleteType = (index) => {
    let arr = this.state.textInputIngridients;
    delete arr[index];
    this.setState({ textInputIngridients: arr })

  }
  addTextAreaInput = () => {
    let key2 = parseInt(this.state.key) + 1;
    this.setState({ key: key2 });
    let textInputArea = this.state.textInputArea;
    textInputArea.push(<TextInput multiline={true}
      onChangeText={this._handleMultiInput('step_' + key2)}

      numberOfLines={4}
      style={{
        borderLeftWidth: 4, borderLeftColor: '#689F38',
        borderRadius: 15,
        marginLeft: 9, marginRight: 9,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        marginBottom: 20,

        elevation: 6,
        backgroundColor: '#ffffff',
        paddingLeft: 10
      }}
      placeholder={'Стъпка ' + key2.toString()}
      key={key2} />);
    this.setState({ textInputArea })
  }



  async pickImage() {
    this.setState({ checkCamera: true })
  };

  async launchGalery() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.width > 640) {
      let prop = result.width / 640;
      const manipResult = await ImageManipulator.manipulateAsync(
        result.localUri || result.uri,
        [{ resize: { width: result.width / prop, height: result.height / prop } }],
        { format: 'jpeg' }
      );
      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: 'base64' });
      this.setState({ image64: base64 })

    } else {
      const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
      this.setState({ image64: base64 })
    }


    if (!result.cancelled) {
      this.setImage(result.uri);
    }
  }
  async launchCamera() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (result.width > 640) {
      let prop = result.width / 640;
      const manipResult = await ImageManipulator.manipulateAsync(
        result.localUri || result.uri,
        [{ resize: { width: result.width / prop, height: result.height / prop } }],
        { format: 'jpeg' }
      );
      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: 'base64' });
      this.setState({ image64: base64 })

    } else {
      const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
      this.setState({ image64: base64 })
    }


    if (!result.cancelled) {
      this.setImage(result.uri);
    }
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

  async submitEditType2() {

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch(global.MyVar+'createProducts', {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.newProdTitle,
        unitId: this.state.unitId,
        typeId: this.state.categoryId,
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


          this.fetchData()
          this.setState({ product: this.state.placeholder })

          this.setState({ productId: data.response })

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

      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
  }
  render(props) {
    const { modalVisible } = this.state;
    var test = ''
    if (this.state.image !== '') {
      test = <View style={{
        borderRadius: 15,
        marginLeft: 9, marginRight: 9,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        marginBottom: 20,
        paddingBottom: 10,
        elevation: 6,
        backgroundColor: '#ffffff',
        paddingLeft: 10,
        paddingRight: 10
      }}>
        <Image source={{ uri: this.state.image + '?time' + (new Date()).getTime() }} resizeMethod={'auto'} style={{
          flex: 1,
          aspectRatio: 0.7, marginTop: 10, width: '96%',
          resizeMode: 'contain', borderRadius: 15, paddingBottom: 0,
        }} />

      </View>
    } else {
      test = <Text></Text>

    }
    if (this.state.externalData === null && this.state.count === false && this.state.externalDataUnits === null) {
      return (
        <View style={styles.MainContainer}>
          <ActivityIndicator size="large" color="#7DE24E" />
        </View>
      )
    } else {
      
      let Add = <AdMobBanner
        bannerSize="smartBannerLandscape"
        adUnitID={'ca-app-pub-5428132222163769/6112419882'}
        
        servePersonalizedAds={true} />;
      if (this.state.premium != 0) {
        Add = <View></View>;
      }

      if (this.state.count == 'ok' || this.state.count < 10) {
        return (
          <View style={styles.MainContainer}>
            <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
            <BottomSheet
              animationType="slide"
              transparent={true}
              visible={this.state.checkCamera}
              onBackdropPress={() => {
                this.setState({ checkCamera: false })
              }}
              onRequestClose={() => {
                this.setState({ checkCamera: false })
              }}
            >

              <View style={{
                backgroundColor: '#fff',
                width: '100%',
                height: 120,
                justifyContent: 'center',
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}>
                <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

                  <TouchableOpacity onPress={() => {
                    this.launchCamera()

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
                          this.launchCamera()


                        }

                        }
                        type='ionicon'
                        backgroundColor='silver'
                        name='camera-outline'
                      >Редактирай</Icon>
                      <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Камера</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

                  <TouchableOpacity onPress={() => {
                    this.launchGalery()

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
                          this.launchGalery()
                        }

                        }
                        type='ionicon'
                        name='images-outline'
                      >Редактирай</Icon>
                      <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Галерия</Text>
                    </View>
                  </TouchableOpacity>
                </View>

              </View>
            </BottomSheet>
            <ScrollView keyboardShouldPersistTaps='always' style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }} >

              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              </View>
              <View style={styles.container}>
                <View>
                  <TextInput
                    style={{
                      borderRadius: 15,
                      marginLeft: 9, marginRight: 9,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 7,
                      },
                      height: 50,
                      shadowOpacity: 0.41,
                      shadowRadius: 9.11,
                      marginBottom: 20,

                      elevation: 6,
                      backgroundColor: '#ffffff',
                      paddingLeft: 10
                    }}

                    placeholder={'Заглавие'}
                    defaultValue={this.state.title}
                    onChangeText={title => this.setState({ title: title })}
                  />


                </View>
                <View style={{ borderColor: '#689F38', borderWidth: 1, borderRadius: 10, padding: 5, marginLeft: 5, marginRight: 5, marginBottom: 10 }}>

                  <Text style={{ flex: 1, marginBottom: 15, marginLeft: 20, textAlign: 'center', fontWeight: '200', fontSize: 18 }}>Категория</Text>

                  <View style={{
                    flex: 1,
                    alignItems: "center", borderRadius: 15,
                    marginLeft: 9, marginRight: 9,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 7,
                    },
                    shadowOpacity: 0.41,
                    shadowRadius: 9.11,
                    marginBottom: 20,

                    elevation: 6,
                    backgroundColor: 'white',
                  }}>
                    <Picker
                      selectedValue={this.state.selectedValue}
                      style={{ height: 40, width: '90%' }}
                      onValueChange={(itemValue, itemIndex) => {  this.state.selectedValue = itemValue }}
                      itemStyle={{ backgroundColor: "red", color: "blue", fontFamily: "Ebrima", fontSize: 17 }}
                    >

                      <Picker.Item label="Избери" value="" />
                      <Picker.Item label="Салати" value="1" />
                      <Picker.Item label="Супи" value="2" />
                      <Picker.Item label="Предястия" value="3" />
                      <Picker.Item label="Сосове" value="4" />
                      <Picker.Item label="Ястия с месо" value="5" />
                      <Picker.Item label="Ястия без месо" value="6" />
                      <Picker.Item label="Тестени" value="7" />
                      <Picker.Item label="Десерти" value="8" />
                      <Picker.Item label="Риба" value="9" />
                      <Picker.Item label="Напитки" value="10" />
                      <Picker.Item label="Зимнина" value="11" />
                      <Picker.Item label="Бебешки и детски храни" value="12" />
                      <Picker.Item label="Други" value="13" />
                    </Picker>
                  </View>
                </View>
                <View style={{ borderColor: '#689F38', borderWidth: 1, borderRadius: 10, padding: 5, marginLeft: 5, marginRight: 5, marginBottom: 10 }}>
                  <Text style={{ flex: 1, marginBottom: 15, marginLeft: 20, textAlign: 'center', fontWeight: '200', fontSize: 18 }}>Избор на изображение</Text>


                  {test}
                  <TouchableHighlight style={{ height: 50, flex: 1, marginTop: 15 }} onPress={() => {
                    this.pickImage()
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
                            this.pickImage()
                          }

                          }
                          type='ionicon'
                          backgroundColor='silver'
                          name='camera-outline'
                        ></Icon>

                      </View>
                      <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                        <Text style={{ flex: 3, marginTop: 15 }}>Избери</Text>
                      </View>
                    </View>
                  </TouchableHighlight>

                </View>

                <View style={{ borderColor: '#689F38', borderWidth: 1, borderRadius: 10, padding: 5, marginLeft: 5, marginRight: 5, marginBottom: 10 }}>

                  <Text style={{ flex: 1, marginBottom: 15, marginLeft: 20, textAlign: 'center', fontWeight: '200', fontSize: 18 }}>Описание</Text>



                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    style={{
                      borderRadius: 15,
                      marginLeft: 9, marginRight: 9,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 7,
                      },
                      height: 90,
                      shadowOpacity: 0.41,
                      shadowRadius: 9.11,
                      marginBottom: 20,

                      elevation: 6,
                      backgroundColor: '#ffffff',
                      paddingLeft: 10
                    }}
                    defaultValue={this.state.description}
                    onChangeText={time1 => this.setState({ description: time1 })}
                  />

                </View>
                <View style={{ borderColor: '#689F38', borderWidth: 1, borderRadius: 10, padding: 5, marginLeft: 5, marginRight: 5, marginBottom: 10 }}>

                  <Text style={{ flex: 1, marginBottom: 15, marginLeft: 20, textAlign: 'center', fontWeight: '200', fontSize: 18 }}>Време за готвене</Text>



                  <TextInput
                    placeholder={'Приготовления'}
                    keyboardType='numeric'

                    style={{
                      borderRadius: 15,
                      marginLeft: 9, marginRight: 9,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 7,
                      },
                      height: 50,
                      shadowOpacity: 0.41,
                      shadowRadius: 9.11,
                      marginBottom: 20,

                      elevation: 6,
                      backgroundColor: '#ffffff',
                      paddingLeft: 10
                    }}
                    defaultValue={this.state.time1}
                    onChangeText={time1 => this.setState({ time1: time1 })}
                  />

                  <TextInput
                    placeholder={'Готвене'}
                    keyboardType='numeric'

                    style={{
                      borderRadius: 15,
                      marginLeft: 9, marginRight: 9,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 7,
                      },
                      height: 50,
                      shadowOpacity: 0.41,
                      shadowRadius: 9.11,
                      marginBottom: 20,

                      elevation: 6,
                      backgroundColor: '#ffffff',
                      paddingLeft: 10
                    }}
                    defaultValue={this.state.time2}
                    onChangeText={time2 => this.setState({ time2: time2 })}
                  />
                  <TextInput
                    placeholder={'Общо'}
                    keyboardType='numeric'

                    style={{
                      borderRadius: 15,
                      marginLeft: 9, marginRight: 9,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 7,
                      },
                      height: 50,
                      shadowOpacity: 0.41,
                      shadowRadius: 9.11,
                      marginBottom: 20,

                      elevation: 6,
                      backgroundColor: '#ffffff',
                      paddingLeft: 10
                    }}
                    defaultValue={this.state.time3}
                    onChangeText={time3 => this.setState({ time3: time3 })}
                  />



                  <TextInput
                    placeholder={'Порции'}
                    keyboardType='numeric'

                    style={{
                      borderRadius: 15,
                      marginLeft: 9, marginRight: 9,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 7,
                      },
                      height: 50,
                      shadowOpacity: 0.41,
                      shadowRadius: 9.11,
                      marginBottom: 20,

                      elevation: 6,
                      backgroundColor: '#ffffff',
                      paddingLeft: 10
                    }} defaultValue={this.state.portions}
                    onChangeText={portions => this.setState({ portions: portions })}
                  />
                </View>
                <View style={{ borderColor: '#689F38', borderWidth: 1, borderRadius: 10, padding: 5, marginLeft: 5, marginRight: 5, marginBottom: 10 }}>

                  <Text style={{ flex: 1, marginBottom: 15, marginLeft: 20, textAlign: 'center', fontWeight: '200', fontSize: 18 }}>Продукти<Text style={{ color: 'red' }}>*</Text></Text>

                  {this.state.textInputIngridients.map((value, index) => {
                    let hint = '';
                    if (value.hint != '') {
                      hint = '(' + value.hint + ')';
                    }
                    return (<View style={{
                      flexDirection: "row", flex: 3, paddingTop: 10, paddingLeft: 10, borderLeftWidth: 4, borderLeftColor: '#689F38',
                      borderRadius: 15,
                      marginLeft: 9, marginRight: 9,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 7,
                      },
                      height: 50,
                      shadowOpacity: 0.41,
                      shadowRadius: 9.11,
                      marginBottom: 20,

                      elevation: 6,
                      backgroundColor: '#ffffff',
                      paddingLeft: 10
                    }}    >
                      <Text style={{ flex: 2 }}>{value.product} {hint}</Text>
                      <Text style={{ flex: 1 }}>{value.amount} {value.unitName}</Text>
                      <Icon
                        name='delete-forever'
                        color={'red'}
                        onPress={() => {
                          this.setdeleteType(index);
                        }
                        }
                        size={30}
                        style={styles.icon} ></Icon>
                    </View>)

                  })}



                  <TouchableHighlight style={{ height: 50, flex: 1, marginTop: 15 }} onPress={() => {
                    this.setState({ placeholder: 'Продукт' });
                    this.setState({ amount: '' });
                    this.setState({ unitName: '' });
                    this.setState({ hint: '' });

                    this.setState({ unitPlaceholder: 'Разфасовка' });
                    // this.setModalVisible(true)0
                    this.setState({ RBSheet: true });
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
                            this.setState({ placeholder: 'Продукт' });
                            this.setState({ amount: '' });
                            this.setState({ unitName: '' });
                            this.setState({ hint: '' });
                            this.setState({ unitPlaceholder: 'Разфасовка' });
                            // this.setModalVisible(true)0
                            this.setState({ RBSheet: true });
                          }

                          }
                          type='ionicon'
                          backgroundColor='silver'
                          name='checkmark'
                        ></Icon>

                      </View>
                      <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                        <Text style={{ flex: 3, marginTop: 15 }}>Добави продукт</Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>


                <Text style={{ flex: 1, marginBottom: 15, marginLeft: 20, textAlign: 'center', fontWeight: '200', fontSize: 18 }}>Стъпки</Text>

                {this.state.textInputArea.map((value, index) => {
                  return value
                })}



                <TouchableHighlight style={{ height: 50, flex: 1, marginTop: 15 }} onPress={() => {
                  this.addTextAreaInput(this.state.textInput.length)
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
                          this.addTextAreaInput(this.state.textInput.length)
                        }

                        }
                        type='ionicon'
                        backgroundColor='silver'
                        name='checkmark'
                      ></Icon>

                    </View>
                    <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                      <Text style={{ flex: 3, marginTop: 15 }}>Добави стъпка</Text>
                    </View>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style={{ height: 50, flex: 1, marginTop: 15 }} onPress={() => {
                  this.submitRecipe()
                }} underlayColor="white">
                  <View style={{
                    flex: 3, flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#c1ffbd",
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
                    <View style={{
                      backgroundColor: 'silver', height: 50, paddingBottom: 4, borderTopWidth: 1, borderBottomWidth: 1,
                      borderColor: "silver",
                    }}>
                      <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                        size={30}
                        containerStyle={{
                          backgroundColor: 'silver',
                          padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                        }}
                        color={'green'}
                        onPress={() => {
                          this.submitRecipe()

                        }

                        }
                        type='ionicon'
                        backgroundColor='silver'
                        name='add-outline'
                      ></Icon>

                    </View>
                    <View style={{ flex: 3, backgroundColor: '#c1ffbd', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                      <Text style={{ flex: 3, marginTop: 15 }}>Добави рецепта</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            </ScrollView>
            {Add}
            <BottomSheet
              visible={this.state.RBSheet2}
              onBackButtonPress={this.toggle}
              onBackdropPress={this.toggle}
            >
              <View style={{
                backgroundColor: '#fff',
                width: '100%',
                height: 320,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}>

                <View>
                  <Text style={{ textAlign: 'center', marginBottom: 10, marginTop: 5, fontSize: 16, fontWeight: 'bold' }}>Създай продукт</Text>
                  <Text style={{
                    borderRadius: 15,
                    marginLeft: 10, marginRight: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 7,
                    },
                    shadowOpacity: 0.41,
                    shadowRadius: 9.11,
                    textAlign: 'center',
                    elevation: 6,
                    backgroundColor: '#ffffff',
                    height: 50, paddingTop: 15,
                    fontSize: 16,
                    fontWeight: '300', color: 'silver',
                    marginBottom: 10,
                  }}>{this.state.newProdTitle}</Text>
                  <View style={{ maxHeight: 250 }}>

                    <SearchableDropdown
                      //On text change listner on the searchable input
                      onItemSelect={(item) => { this.setState({ categoryId: item.id }); this.setState({ typesPlaceholder: item.name }) }}

                      //onItemSelect called after the selection from the dropdown
                      containerStyle={{ padding: 5 }}
                      suggestion container style
                      textInputStyle={{
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
                        marginBottom: 10,
                      }}
                      itemStyle={{
                        backgroundColor: '#ffffff',
                        marginLeft: 5, marginRight: 5,
                        //single dropdown item style
                        padding: 10,
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                      }}
                      itemTextStyle={{
                        //text style of a single dropdown item
                        color: '#222',
                      }}
                      showNoResult={'false'}
                      showNoResultDefault={'false'}

                      showNoResultViewStyle={{
                        marginTop: 10, marginLeft: 20
                      }}
                      itemsContainerStyle={{
                        //items container style you can pass maxHeight
                        //to restrict the items dropdown hieght
                        paddingTop: 10,
                        marginTop: -20,
                        borderRadius: 15,
                        marginLeft: 1, marginRight: 1,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 7,
                        },
                        shadowOpacity: 0.41,
                        shadowRadius: 9.11,

                        elevation: 6,
                      }}
                      items={this.state.externalDataTypes}
                      //mapping of item array
                      defaultIndex={this.state.selectedIndex}
                      //default selected item index
                      placeholder={this.state.typesPlaceholder}
                      //place holder for the search input
                      resetValue={false}
                      //reset textInput Value with true and false state
                      underlineColorAndroid="transparent"
                    //To remove the underline from the android input
                    />
                  </View>

                  <View style={{ maxHeight: 150 }}>

                    <SearchableDropdown
                      //On text change listner on the searchable input
                      onItemSelect={(item) => { this.setState({ unitId: item.id }); this.setState({ unitsPlaceholder: item.name }); }}
                      showNoResultDefault={'false'}

                      //onItemSelect called after the selection from the dropdown
                      containerStyle={{ padding: 5 }}

                      suggestion container style
                      textInputStyle={{
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
                        marginBottom: 10,

                      }}
                      itemStyle={{
                        backgroundColor: '#ffffff',
                        marginLeft: 5, marginRight: 5,
                        //single dropdown item style
                        padding: 10,
                        borderBottomWidth: 1,
                        borderColor: '#ccc',

                      }}
                      itemTextStyle={{

                        //text style of a single dropdown item
                        color: '#222',
                      }}
                      showNoResult={'false'}

                      itemsContainerStyle={{

                        //items container style you can pass maxHeight
                        //to restrict the items dropdown hieght
                        paddingTop: 10,
                        marginTop: -20,
                        borderRadius: 15,
                        marginLeft: 1, marginRight: 1,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 7,
                        },
                        shadowOpacity: 0.41,
                        shadowRadius: 9.11,

                        elevation: 6,
                      }}
                      items={this.state.externalDataUnits}
                      //mapping of item array
                      defaultIndex={this.state.selectedIndex}
                      //default selected item index
                      placeholder={'sdfsdfsdfsdfsdfdf'}
                      //place holder for the search input
                      resetValue={false}
                      //reset textInput Value with true and false state
                      underlineColorAndroid="transparent"
                    //To remove the underline from the android input
                    />
                  </View>
                  <View style={styles.modalBtn}>
                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: "#00cf0e", marginLeft: 10 }}
                      onPress={() => {
                        this.setState({ placeholder: this.state.newProdTitle });
                        this.setState({ RBSheet2: false });

                        this.setState({ RBSheet: true });

                        this.submitEditType2();
                      }}
                    >
                      <Text style={styles.textStyle}>Запази</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={{ ...styles.openButton, backgroundColor: "#f00000" }}
                      onPress={() => {
                        this.setState({ RBSheet: true });
                        this.setState({ RBSheet2: false });

                      }}
                    >
                      <Text style={styles.textStyle}>Откажи</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </BottomSheet>
            <BottomSheet
              visible={this.state.RBSheet}
              onBackButtonPress={this.toggle}
              onBackdropPress={this.toggle}
            >
              <View style={{
                backgroundColor: '#fff',
                width: '100%',
                height: 350,
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                justifyContent: "center",
                alignItems: "center"
              }}>

                <View>
                  <View style={styles.modalHeader}>
                    <Text style={styles.titlem}>Добави продукт</Text>
                  </View>
                  <View style={{ maxHeight: 200 }}>
                    <SearchableDropdown
                      style={{}}
                      onTextChange={(text) => this.setState({ newProdTitle: text })}
                      //On text change listner on the searchable input
                      onItemSelect={(item) => { this.setProductID(item); }}
                      //onItemSelect called after the selection from the dropdown
                      containerStyle={{ padding: 5 }}
                      //suggestion container style
                      textInputStyle={{
                        borderRadius: 7,
                        padding: 10,
                        height: 40,
                        borderWidth: 1, borderColor: 'silver',
                        //inserted text style
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                        width: '100%'
                      }}
                      itemStyle={{
                        //single dropdown item style
                        padding: 10,
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                        width: '100%'

                      }}
                      itemTextStyle={{
                        //text style of a single dropdown item
                        color: '#222',
                      }}
                      showNoResult={'true'}
                      showNoResultDefault={false}
                      showNoResultTitle={'Създай продукт'}
                      onItemSelectNoResult={(item) => {
                        this.fetchDataTypes()
                        this.fetchDataUnits();

                        this.setState({ unitsPlaceholder: 'Разфасовки' });
                        this.setState({ typesPlaceholder: 'Категория' });
                        this.setState({ RBSheet2: true });
                        this.setState({ RBSheet: false });
                      }}
                      itemsContainerStyle={{
                        //items container style you can pass maxHeight
                        //to restrict the items dropdown hieght
                        maxHeight: '100%',
                        paddingBottom: 0,
                        marginBottom: 0
                      }}
                      items={this.state.externalData}
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
                  </View>
                  <View style={{
                    backgroundColor: 'white',
                    marginTop: 0,
                    flexDirection: "row",
                    marginBottom: 10,
                  }}>
                    <TextInput
                      placeholder={'Подсказка'}

                      style={{
                        backgroundColor: 'white',
                        borderRadius: 7,
                        padding: 10,
                        height: 40,
                        borderWidth: 1, borderColor: 'silver',
                        borderBottomWidth: 1,
                        marginLeft: 5,
                        marginTop: 15,
                        width: '97%'
                      }}
                      defaultValue={this.state.hint}
                      onChangeText={typeTitle => this.setState({ hint: typeTitle })}
                    />
                  </View>
                  <View style={{
                    backgroundColor: 'white',
                    marginTop: 0,
                    flexDirection: "row",
                    marginBottom: 20,
                    maxHeight: 150
                  }}>
                    <TextInput
                      placeholder={'Количество'}
                      keyboardType='numeric'

                      style={styles.inputRowFullWidth}
                      defaultValue={this.state.amount}
                      onChangeText={typeTitle => this.setAmount(typeTitle)}
                    />
                    <SearchableDropdown
                      style={{}}
                      //On text change listner on the searchable input
                      onItemSelect={(item) => this.setProductUnit(item)}
                      //onItemSelect called after the selection from the dropdown
                      containerStyle={{
                        backgroundColor: 'white',

                        marginLeft: 5,
                        marginTop: 15,
                        width: '49%'
                      }}
                      //suggestion container style
                      textInputStyle={{
                        borderRadius: 7,
                        padding: 10,
                        height: 40,
                        borderWidth: 1, borderColor: 'silver',
                        //inserted text style
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                        width: '100%'
                      }}
                      itemStyle={{
                        //single dropdown item style
                        padding: 10,
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                        width: '100%'

                      }}
                      itemTextStyle={{
                        //text style of a single dropdown item
                        color: '#222',
                      }}
                      itemsContainerStyle={{
                        //items container style you can pass maxHeight
                        //to restrict the items dropdown hieght
                        maxHeight: '100%',
                        paddingBottom: 0,
                        marginBottom: 0
                      }}
                      showNoResultDefault={'false'}

                      items={this.state.externalDataUnits}
                      //mapping of item array
                      //default selected item index
                      placeholder={this.state.unitPlaceholder}
                      //place holder for the search input
                      resetValue={false}
                      //reset textInput Value with true and false state
                      underlineColorAndroid="transparent"
                    //To remove the underline from the android input
                    />

                    {/* <Text style={{
                  borderBottomWidth: 1, color: '#C7C7CD', paddingLeft: 10, borderBottomColor: '#C7C7CD',
                  width: 50, marginBottom: 10, paddingBottom: 0, paddingTop: 15
                }}>{this.state.unitName}</Text> */}

                  </View>

                  <View style={styles.modalBtn}>
                    <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                      this.setState({ RBSheet: false });
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
                        <View style={{ backgroundColor: 'silver', height: 50, paddingBottom: 4, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", }}>
                          <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                            size={30}
                            containerStyle={{
                              backgroundColor: '#ebebeb',
                              padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                            }}
                            color={'green'}
                            onPress={() => {
                              this.setState({ RBSheet: false });
                              this.submitEditType();
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
                      this.setState({ RBSheet: false });
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
                              this.setState({ RBSheet: false });
                            }

                            }
                            type='ionicon'
                            backgroundColor='silver'
                            name='close-outline'
                          >Редактира��</Icon>

                        </View>
                        <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                          <Text style={{ flex: 3, marginTop: 15 }}>Откажи</Text>
                        </View>
                      </View>
                    </TouchableHighlight>

                  </View>

                </View>
              </View>
            </BottomSheet>
          </View>
        );
      } else {
        return (
          <View style={{
            borderRadius: 15,
            marginLeft: 9, marginRight: 9,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            marginBottom: 20,
            marginTop: 20,
            elevation: 6,
            backgroundColor: '#ffffff',
          }}>
            <View style={{ borderBottomBottom: 1, borderBottomColor: 'silver', width: '100%' }}>
              <Text style={{ fontSize: 21, textAlign: 'center', marginBottom: 5, marginTop: 10 }}>Достигнат лимит</Text>
            </View>



            <View style={{ height: 150 }}>
              <View style={{ flexDirection: 'row', borderBottomBottom: 1, borderBottomWidth: 1, borderBottomColor: 'silver', width: '100%', marginBottom: 20 }}>
                <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>Достигнахте лимита си на безплатни рецептви в готварската си книга. Може да увеличите лимита
                 като преминете на премиум план</Text>
              </View>
              <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                this.props.navigation.navigate('payments');
              }} underlayColor="white"
              >
                <View style={{
                  flexDirection: "row",
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
                      size={35}
                      containerStyle={{
                        backgroundColor: '#ebebeb',
                        padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
                        paddingTop: 5
                      }}
                      color={'gold'}
                      onPress={() => {

                        this.props.navigation.navigate('payments');

                      }

                      }
                      type='ionicon'
                      backgroundColor='silver'
                      name='star'
                    ></Icon>

                  </View>
                  <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                    <Text style={{ flex: 3, marginTop: 5, marginLeft: 5, }}>Премиум</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>



          </View>
        )
      }
    }
  }
};
export default EditRecipes;
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
    marginBottom: 20,

    width: '100%',
    height: '50%'
  },
  container: {
    width: '100%',
    marginTop: 20,
    flex: 1,
    marginBottom: 20
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
    flex: 1
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

    paddingBottom: 10,
    paddingTop: 10,
    alignSelf: 'center',

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

  inputRowFullWidth: {
    backgroundColor: 'white',
    borderRadius: 7,
    padding: 10,
    height: 40,
    borderWidth: 1, borderColor: 'silver',
    borderBottomWidth: 1,
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 15,
    width: '47%'
  },
});