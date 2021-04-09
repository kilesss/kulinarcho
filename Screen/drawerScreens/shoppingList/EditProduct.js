import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import ImageModal from 'react-native-image-modal';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  View,
  Text,
  TouchableHighlight,
} from "react-native";
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';




class EditProduct extends React.Component {

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'EditProduct'){
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

  handleBackButtonClick() {
    this.props.navigation.navigate('ProductsSettings');
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
    description: '',
    dropdownSelect2: '',
    placeholder: "Продукт",
    test: 0,
    externalDataTypes: [],
    externalDataUnits: [],
    typesPlaceholder: 'Тип',
    unitsPlaceholder: 'Разфасовка',
    unitID: 0,
    typesID: 0,
    image: '',
    image64: '',
    newProdTitle: '',
    unbuyedProduct: 0,
    placeholderType: 'Тип',
    placeholderUnits: 'Разфасофка',
    imagebtnText: 'Направи снимка'
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
      this.setState({ unitID: '' });
      this.setState({ typesID: '' });
      this.setState({ newProdTitle: '' });
      this.setState({ listID: id });
      this.setState({ typeid: '' });
      this.setState({ newProdTitle: '' });
      this.setState({ image64: '' });
      this.setState({ image: '' });
      this.setState({ placeholderType: 'Тип' });
      this.setState({ placeholderUnits: 'Разфасофка' });
      this.setState({ typeTitle: 'Име' });


      await this.fetchDataProducts();
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


  async submitEditType() {

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
console.log(JSON.stringify({
  id: this.state.typeid,
  name: this.state.newProdTitle,
  unitId: this.state.unitID,
  typeId: this.state.typesID,
  photo: this.state.image64
}));
    await fetch('http://167.172.110.234/api/createProducts', {
      method: 'POST',
      body: JSON.stringify({
        id: this.state.typeid,
        name: this.state.newProdTitle,
        unitId: this.state.unitID,
        typeId: this.state.typesID,
        photo: this.state.image64
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
          this.props.navigation.navigate('ProductsSettings');

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
        console.log(data);

      }
    ).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }
  async fetchDataProducts() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    var t = await AsyncStorage.getItem('productId');

    await fetch("http://167.172.110.234/api/getProducts?productId=" + t, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN,
        'Cache-Control': 'no-cache'
      }
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({ newProdTitle: data[0].name });
        this.setState({ placeholderType: data[0].types });
        this.setState({ placeholderUnits: data[0].units });
        this.setState({ image: data[0].photo });
        this.setState({ typeid: data[0].id });
        this.setState({ typesID: data[0].typesId });
        this.checkName();

        this.setState({ unitID: data[0].unitsId });
        // {"id":"","name":"Hakuna","unitId":"","typeId":249,"photo":""}
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
  async deleteImage() {
    this.setState({image64:''});
    this.setState({image:''});
    var t = await AsyncStorage.getItem('productId');

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    console.log(DEMO_TOKEN);
    console.log(JSON.stringify({
      type: 'products',
      productId: t,

    }));
  await fetch("http://167.172.110.234/api/deleteImage", {
      method: "POST",
      body: JSON.stringify({
        type: 'products',
        productId: t,

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

setPrice = (id) => {
  this.setState({ price: id })
}
setProductID = (id) => {
  this.setState({ typeid: id })

}

setAmount = (id) => {
  this.setState({ amount: id })
}
setTypeTitle = (title) => {
  this.setState({ newProdTitle: title })
}

async pickImage() {
  this.checkName();

  let result = await ImagePicker.launchCameraAsync({
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
};
async setImage(img) {

  this.setState({ image: img })
}

checkName() {
  if (this.state.image != '' && this.state.image != null) {
    this.setState({ imagebtnText: 'Изтрий снимка' })
  } else {
    this.setState({ imagebtnText: 'Направи снимка' })

  }
}
render(props) {
  if (this.state.externalDataProducts === null) {
    return (
      <View style={styles.MainContainer}>
        <View style={styles.topView}>
          <Text>Loading....</Text>
        </View>
      </View>
    )
  } else {
    var test = ''
    if (this.state.image !== '' && this.state.image !== null) {
      if (this.state.image64 !== '') {
        test =
          <View style={{
            alignItems: 'center', justifyContent: 'center', width: '100%',
            marginLeft: '20%', marginRight: '20%',
          }}>
            <ImageModal
              borderRadius={60}
              resizeMode="cover"
              imageBackgroundColor="#F2F2F2"
              source={{ uri: this.state.image }}
              style={{
                marginTop: 15,
                width: 200,
                height: 200,
                alignSelf: 'center',
              }}
            />
          </View>


      } else {

        test =

          <View style={{ marginLeft: '20%', marginRigh: '20%' }}>
            <ImageModal
              borderRadius={60}
              resizeMode="cover"
              imageBackgroundColor="#F2F2F2"
              source={{ uri: 'https://kulinarcho.s3.eu-central-1.amazonaws.com/products/' + this.state.image + '?time' + (new Date()).getTime() }}
              style={{
                marginTop: 15,
                width: 200,
                height: 200,
                alignSelf: 'center',
              }}
            />

          </View>
      }


    } else {
      test = <Text ></Text>

    }

    return (

      <View style={styles.MainContainer}>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
        <View style={{ height: '7%' }}>
         
        </View>
        {/* <Card style={{ flex: 1, marginLeft: 0, marginRight: 0 }}> */}

        <View style={{ maxHeight: 200 }}>


          <Text style={{
            width: "92%", height: 50, alignItems: 'center',
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
            elevation: 6,
            marginTop: 15,
            marginLeft: 15,

            backgroundColor: '#ffffff',
            paddingLeft: 10
          }}>{this.state.newProdTitle}</Text>



          <View style={{ maxHeight: 200, marginTop: 20 }}>

            <SearchableDropdown
              style={{ width: 150 }}
              //On text change listner on the searchable input
              onTextChange={(text) => console.log(text)}
              onItemSelect={(item) => {
                this.setState({ placeholderType: item.name })
                this.setState({
                  typesID: item.id,
                });
              }}
              placeholder={this.state.placeholderType}
              //onItemSelect called after the selection from the dropdown
              containerStyle={{ padding: 5 }}
              suggestion container style
              textInputStyle={{
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
                elevation: 6,
                backgroundColor: '#ffffff',
                height: 50, paddingLeft: 10,
                marginBottom: 10,
              }}
              showNoResultDefault={'false'}
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
              itemTextStyle={{
                //text style of a single dropdown item
                color: '#222',
              }}
              itemsContainerStyle={{
                //items container style you can pass maxHeight
                //to restrict the items dropdown hieght
                maxHeight: '85%',
                width: '95%',
                marginLeft:10,
                paddingBottom: 0,
                marginBottom: 0
              }}
              items={this.state.externalDataTypes}
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


          
          {test}
          <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, width: '97%', marginBottom: 50 }}>

            <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
              if (this.state.image !== '') {
                this.deleteImage();
                this.setState({ image: '' });
                this.setState({ imagebtnText: 'Направи снимка' })
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
                      if (this.state.image !== '') {
                        this.setState({ image: '' });
                        this.setState({ imagebtnText: 'Направи снимка' })
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
                  <Text style={{ flex: 3, marginTop: 15 }}>{this.state.imagebtnText}</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>





          <View style={{ flex: 1, flexDirection: 'row', marginTop: 20, width: '98%', }}>
            <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
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
              this.props.navigation.navigate('ProductsSettings');
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
                      this.props.navigation.navigate('ProductsSettings');
                    }

                    }
                    type='ionicon'
                    backgroundColor='silver'
                    name='close-outline'
                  >Редактирай</Icon>

                </View>
                <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                  <Text style={{ flex: 3, marginTop: 15 }}>Откажи</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}
}
export default EditProduct;
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
    borderBottomWidth: 1, borderBottomColor: 'silver',
    marginBottom: 10,
    marginTop: 15,
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
  inputRowFull: {
    borderBottomWidth: 1,
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 5,
    width: '100%'
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
