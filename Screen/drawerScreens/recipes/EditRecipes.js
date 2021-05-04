

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
import RBSheet from "react-native-raw-bottom-sheet";
import { BackHandler } from 'react-native';
import { BottomSheet } from 'react-native-btr';
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';
import {
  StyleSheet,
  View,
  Text, 
  TextInput,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,

} from "react-native";
import { Icon } from 'react-native-elements'
import SearchableDropdown from 'react-native-searchable-dropdown';
import * as ImagePicker from 'expo-image-picker';

class AddRecipes extends React.Component {

  state = {
    textInputIngridients: [],
    textInputArea: [],
    key: 0,
    modalVisible: false,
    unitName: false,
    amount: '',
    title: '',
    portions: '',
    time1: '',
    hint: '',

    time2: '',
    description: '',

    time3: '',
    externalData: null,
    product: false,
    textInput: '',
    id: 0,
    photoText: 'Избери',
    havePhoto: 0,
    premium:0,

  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  setProductID = (id) => {
    this.setState({ placeholder: id.name })

    this.setState({ unitName: id.units })
    this.setState({ product: id.name })
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

    if (product !== false && this.state.unitId !== '' ) {


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
      
    }
  }
  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('AddRecipes')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'AddRecipes') {
        arrRoute.push('AddRecipes')
      }
      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

      // await this.fetchDataShoppingLists();
      await this.fetchData();
      await this.fetchDataUnits();
      await this.fetchDataRecipe();
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

  async fetchData() {

    this.setState({ textInputIngridients: [] });
    this.setState({ textInputArea: [] });
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
   
    this.setState({ externalData: null });
    this.setState({ product: false });
    this.setState({ textInput: '' });
    this.setState({ id: 0 });
    this.setState({ image64: '' });


    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');


    fetch("http://167.172.110.234/api/getProducts", {
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
        this.state.premium = data.premium;
        delete data.premium;
        let newData = [];

        Object.keys(data).map((key, index) => {
          newData.push(data[index]);
        })
        this.setState({ externalData: newData });

      }).done();
  }
  async fetchDataRecipe() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');



    let DEMO_TOKEN2 = await AsyncStorage.getItem('recipeId');
    this.setState({ id: DEMO_TOKEN2 });
    await fetch("http://167.172.110.234/api/showRecipe?id=" + DEMO_TOKEN2, {
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
        this.state.premium = data.premium;
                delete data.premium;
        let newData = [];
        Object.keys(data.recipe_products).map((key, index) => {

          newData.push({
            product: data.recipe_products[index].productName,
            amount: data.recipe_products[index].volume,
            unitName: data.recipe_products[index].unitsName,
            productId: data.recipe_products[index].id,
            unitid: data.recipe_products[index].unitId,
            hint: data.recipe_products[index].hint

          });
        })
        let textInputArea = [];

        let arr = this.state.textInput;
        let ar2 = {};
        Object.keys(data.recipe_steps).map((keyche, index) => {


          // let key2 = this.state.key + 1;
          let t = 'step_' + keyche
          ar2[t] = data.recipe_steps[keyche].step;

          textInputArea.push(<TextInput multiline={true}
            onChangeText={(test) => {
              this.multiInput(test, 'step_' + keyche);
            }}
            defaultValue={data.recipe_steps[keyche].step}
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
            }} key={keyche} />);
          this.setState({ key: keyche });

        });

        this.setState({ textInput: ar2 })

        this.setState({ textInputIngridients: newData });
        this.setState({ title: data.recipe.title });
        this.setState({ portions: data.recipe.portion });
        if (data.recipe.prep_time !== null) {
          this.setState({ time1: data.recipe.prep_time });
        }
        if (data.recipe.cook_time !== null) {
          this.setState({ time2: data.recipe.cook_time });
        }
        if (data.recipe.all_time !== null) {
          this.setState({ time3: data.recipe.all_time });
        }

        // this.setState({textInputIngridients: data.recipe.title});
        this.setState({ textInputArea: textInputArea });
      
        if (data.recipe.photo != '' && data.recipe.photo != null) {

          this.setState({ havePhoto: 1 });
          this.setState({ photoText: 'Изтрий' });
          this.setState({ image: 'https://kulinarcho.s3.eu-central-1.amazonaws.com/recipes/' + data.recipe.photo });
        }else{
          this.setState({ havePhoto: 0 });
          this.setState({ photoText: 'Избери' });
          this.setState({ image: '' });

        }


        this.setState({ externalDataRecipe: data });
      }).done();
  }
  multiInput(test, name) {

    let ar2 = {};

    let arr = this.state.textInput;
    Object.keys(arr).map((keyche, index) => {
      ar2[keyche] = arr[keyche];
    })
    ar2[name] = test;

    this.setState({ textInput: ar2 })
  }
  _handleMultiInput(test, name) {
    let kur = { key: name, val: test }
    let arr = this.state.textInput;
    // arr[kur.key] = text;
    console.log(arr);
    // this.setState({ textInput: arr })
  }
  async fetchDataUnits() {

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');


    fetch("http://167.172.110.234/api/getRecipeUnits", {
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

    await fetch('http://167.172.110.234/api/recipesEdit', {
      method: 'POST',
      body: JSON.stringify({
        id: this.state.id,
        title: this.state.title,
        portions: this.state.portions,
        time1: this.state.time1,
        time2: this.state.time2,
        time3: this.state.time3,
        description:this.state.description,
        textInputIngridients: this.state.textInputIngridients,
        textInput: this.state.textInput,
        photo: this.state.image64,

        image: this.state.image
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
        if (data.errors !== undefined) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', '', data.errors[key], {}, 1000);

          })

        } else {
          this.props.navigation.navigate('ListRecipes');

        }

      }

    ).catch(function (error) {
      console.log(error);
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
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
      onChangeText={(test) => {

        this.multiInput(test, 'step_' + key2)
      }}

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
  async deleteImage() {
    this.setState({image64:''});
    this.setState({image:''});
    let t = await AsyncStorage.getItem('recipeId');

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

  await fetch("http://167.172.110.234/api/deleteImage", {
      method: "POST",
      body: JSON.stringify({
        type: "recipe",
        recipeId: t,

      }),
      method: 'POST',
     
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        //Header Defination
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },
     
    }).then(
      async response => {
        console.log(response)
      }
    ).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  };



  async pickImage() {
    this.setState({checkCamera:true})
  };
  
  async launchGalery(){
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
  
  
    if (result.width > 1024) {
      let prop = result.width / 1024;
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
  async launchCamera(){
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });


   
    if (result.width > 1024) {
      let prop = result.width / 1024;
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




  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'AddRecipes'){
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
  render(props) {
    const { modalVisible } = this.state;
    var test = ''
    let img = '';
    if(this.state.image !== ''){
     img = <Image source={{ uri: this.state.image + '?time' + (new Date()).getTime() }} resizeMethod={'auto'} style={{
        flex: 1,
        aspectRatio: 0.7, marginTop: 5, width: '96%',
        resizeMode: 'contain', borderRadius: 15, paddingBottom: 0,
      }} />
    }else{
      img = <Image
       source={require('../../../Image/rsz_plate.png')} resizeMethod={'auto'} style={{
        flex: 1,
        aspectRatio: 0.7, marginTop: 5, width: '96%',
        resizeMode: 'contain', borderRadius: 15, paddingBottom: 0,
      }} />
    }
      test = <View style={{
        borderRadius: 15,
        marginLeft: 19, marginRight: 9,
        
        marginBottom: 10,
        backgroundColor: '#f2f2f2',
      }}>
      {img}
      </View>

    let Add =  <AdMobBanner
    bannerSize="smartBannerLandscape" 
    adUnitID={'ca-app-pub-5428132222163769/6112419882'} 
      onDidFailToReceiveAdWithError={console.log(this.bannerError)} 
      servePersonalizedAds={true}/>;
      if(this.state.premium != 0){
        Add = <View></View>;
      }

    return (
      <View style={styles.MainContainer}>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
        <BottomSheet
            animationType="slide"
            transparent={true}
            visible={this.state.checkCamera}
            onBackdropPress={() => {
              this.setState({checkCamera: false})
              }}
            onRequestClose={() => {
            this.setState({checkCamera: false})
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
        <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }} >

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
              <Text style={{ flex: 1, marginBottom: 15, marginLeft: 20, textAlign: 'center', fontWeight: '200', fontSize: 18 }}>Избор на изображение</Text>


              {test}


              <TouchableHighlight style={{ height: 50, flex: 1, marginTop: 15 }} onPress={() => {
                if (this.state.havePhoto == 1) {
                  this.setState({ havePhoto: 0 });
                  this.setState({ photoText: 'Избери' });
                  this.setState({ image: '' });
                  this.deleteImage();

                } else {
                  this.pickImage()

                }
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
                        if (this.state.havePhoto == 1) {
                          this.deleteImage();
                          this.setState({ havePhoto: 0 });
                          this.setState({ photoText: 'Избери' });
                          this.setState({ image: '' });

                        } else {
                          this.pickImage()

                        }
                      }

                      }
                      type='ionicon'
                      backgroundColor='silver'
                      name='camera-outline'
                    ></Icon>

                  </View>
                  <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                    <Text style={{ flex: 3, marginTop: 15 }}>{this.state.photoText}</Text>
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
                if(value.hint != null && value.hint  != '' ) {
                    hint = "("+value.hint+")"
                }
                console.log(value)
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
                  <Text style={{ flex: 1, marginLeft: 10 }}>{value.amount} {value.unitName}</Text>
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
                this.setState({ unitPlaceholder: 'Разфасовка' });
                // this.setModalVisible(true)0
                this['RBSheet'].open()
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
                        this.setState({ unitPlaceholder: 'Разфасовка' });
                        // this.setModalVisible(true)0
                        this['RBSheet'].open()
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

            <View style={{
              borderColor: '#689F38', borderWidth: 1, borderRadius: 10, padding: 5, marginLeft: 5, marginRight: 5, marginBottom: 10
            }}    >
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
            </View>


            <TouchableHighlight style={{ height: 50, flex: 1, marginTop: 15 }} onPress={() => {
              this.submitRecipe()
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
                      this.submitRecipe()

                    }

                    }
                    type='ionicon'
                    backgroundColor='silver'
                    name='checkmark'
                  ></Icon>

                </View>
                <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                  <Text style={{ flex: 3, marginTop: 15 }}>Запази рецепта</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
        <RBSheet
          ref={ref => {
            this['RBSheet'] = ref;
          }}
          height={320}

          customStyles={{
            container: {
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
          <View>
            <View style={styles.modalHeader}>
              <Text style={styles.titlem}>Добави продукт</Text>
            </View>
            <View style={{ maxHeight: 200 }}>
              <SearchableDropdown
                style={{}}
                onTextChange={(text) => console.log(text)}
                //On text change listner on the searchable input
                onItemSelect={(item) => this.setProductID(item)}
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
                onTextChange={(text) => console.log(text)}
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
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#00cf0e" }}
                onPress={() => {
                  this['RBSheet'].close()
                  this.submitEditType();
                }}
              >
                <Text style={styles.textStyle}>Запази</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#f00000" }}
                onPress={() => {
                  this['RBSheet'].close()
                }}
              >
                <Text style={styles.textStyle}>Откажи</Text>
              </TouchableHighlight>
            </View>

          </View>
        </RBSheet>
      </View>
    );
  }
};
export default AddRecipes;
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