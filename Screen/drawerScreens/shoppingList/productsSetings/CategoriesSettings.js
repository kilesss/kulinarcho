

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React
import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import RBSheet from "react-native-raw-bottom-sheet";
import RBSheet2 from "react-native-raw-bottom-sheet";
import ActionButton from 'react-native-action-button';
import { BottomSheet } from 'react-native-btr';

import DropdownAlert from 'react-native-dropdownalert';

import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList, View,
  Text,
  TextInput,ActivityIndicator,
  Modal,
  TouchableHighlight
} from "react-native";
import { Icon } from 'react-native-elements'

import { BackHandler } from 'react-native';

class CategoriesSettings extends React.Component {

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'CategoriesSettings'){
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
  state = {
    modalVisible: false,
    modalVisible2: false, 
    deleteType:'',
    typeTitle:'Име на продукта',
    token:'',
    data:[],
    externalData: null,
    typeid:'',
    modalEditTitle: 'Редактиране на разфасовката'
  };

  setTypeTitle = (title) => {
    this.setState({typeTitle:title})
  }
   setTypeID = (id) => {
    this.setState({typeid:id})
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  setModalVisible2 = (visible) => {
    this.setState({ modalVisible2: visible });
  } 

  setdeleteType = (title) =>{
    this.setState({deleteType: title})
  }
  async fetchToken(){
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
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    fetch(global.MyVar+"getUnits", {
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
 


  async componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = navigation.addListener('didFocus', async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('CategoriesSettings')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'CategoriesSettings') {
        arrRoute.push('CategoriesSettings')
      }
      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

      this.fetchData();
      // this.fetchDataUnits()
      // this.fetchDataTypes();
    });
  }
  _saveDetails = (prop) => {
      this.setState({typeid:''});
      this.setState({modalEditTitle:'Добавяне на разфасовка'});
      this.setState({typeTitle:''});
      this.RBSheet2.open();
  }
  componentDidUpdate(){
  }

  componentWillUpdate(prevProps){
    if(prevProps.data != this.props.data){
      this.props.data.lenght !==0 ? this.setState({
        isReady: true,
      }) : null
    }
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  async submitEditType(){
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
        await fetch(global.MyVar+'addUnits', {
            method: 'POST',
            body:  JSON.stringify({ id: this.state.typeid, name: this.state.typeTitle }),
            headers: {
              "Content-Type" : "application/json",
              "Accept" : "application/json",
                //Header Defination
                'Authorization': 'Bearer ' + DEMO_TOKEN
            },
           
        }).then(
          async response => {
            const data = await response.json();
            
            if (data.errors) {
              Object.keys(data.errors).map((key, index) => {
                this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key],{},3000);
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
        ).catch(function(error) {
          
           // ADD THIS THROW error
            throw error;
          });
  }
  async submitDeleteType(){
    
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
        await fetch(global.MyVar+'deleteUnits', {
            method: 'POST',
            body:  JSON.stringify({ id: this.state.typeid}),
            headers: {
              "Content-Type" : "application/json",
              "Accept" : "application/json",
                //Header Defination
                'Authorization': 'Bearer ' + DEMO_TOKEN
            },
           
        }).then(
          async response => {
            const data = await response.json();
            
            if (data.errors) {
              Object.keys(data.errors).map((key, index) => {
                this.dropDownAlertRef.alertWithType('error', 'Error', data.errors[key],{},3000);
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
        ).catch(function(error) {
          
           // ADD THIS THROW error
            throw error;
          });
  }
  
  render(props) {
    // );

    if (this.state.externalData === null) {
      return (
        <View style={styles.MainContainer}>
         <ActivityIndicator size="large" color="#7DE24E" /> 
        </View>
      )
    } else {

      this.inputRefs = {};

      const { modalVisible2 } = this.state;
      const { deleteType } = this.state;
      var t = ''

      const showTitle = (item) => {
        if (item === null) {
          item = 'Некатегоризирани'
        }
        if (item !== t) {
          t = item;
          return (<View>
            <Text style={{ marginTop: 10, marginBottom: 10, alignItems: 'center', textAlign: 'center', }}>    {t}
            </Text>
          </View>)
        }

      }
      const renderItem = ({ item }) => {
        return (
          <View>
            {showTitle(item.types)}
            <View style={styles.item}>
              <Text style={styles.title2}>{item.name}</Text>
              <Text style={styles.title}>{item.units}</Text>
              <Icon style={styles.icon}
                size={30}
                onPress={() => {
                  this.setState({modalEditTitle:'Редактиране на разфасовка'});
                  this.setState({typeTitle:item.name});
                  this.setState({typeid:item.id});
                  this.RBSheet.open();
                }

                }
                color={'silver'}
                type='font-awesome-5'

              name='pencil-alt'
              ></Icon>

            </View>
          </View>

        )
      };
     

      return (
        <View style={styles.MainContainer}>
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
      
        <RBSheet2
          ref={ref => {
            this.RBSheet2 = ref;
          }}
          height={180}
          customStyles={{
            container: {
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
                         <View style={styles.modalHeader}>
              <Text style={styles.titlem}>{this.state.modalEditTitle}</Text>
              <View style={styles.dividerm}></View>
            </View>
            <TextInput
              placeholder={'Име'}

              style={{
                width: "92%", height: 50, alignItems: 'center',
                borderLeftWidth: 4, borderLeftColor: '#689F38',
                borderRadius: 15,
                  marginRight: 9,
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
              }}
              defaultValue={this.state.typeTitle}
              onChangeText={typeTitle => this.setTypeTitle(typeTitle)}

            />
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 20, width: '98%', }}>
              <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                this.submitEditType();
                this.RBSheet2.close();
                this.RBSheet.close();

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
                        this.RBSheet2.close();
                        this.RBSheet.close();

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
                this.RBSheet2.close();
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
                        this.RBSheet2.close();
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

        </RBSheet2>
          <RBSheet
            ref={ref => {
              this['RBSheet'] = ref;
            }}
            height={150}

            customStyles={{
              container: {
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }
            }}
          >
            <View style={{}}>
              <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

                <TouchableOpacity onPress={() => {
                  this.RBSheet2.open();

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
                        this.RBSheet2.open();


                      }

                      }
                      type='font-awesome-5'
                      name='pencil-alt'
                    >Редактирай</Icon>
                    <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Редактирай</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

                <TouchableOpacity onPress={() => {
                  this.setModalVisible2(true)

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
                        this.setModalVisible2(true)


                      }

                      }
                      type='ionicon'
                      name='trash-outline'
                    >Редактирай</Icon>
                    <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Изтрий</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </RBSheet>

          <SafeAreaView style={{ width:'98%',  height:'100%'}}>
            <FlatList
              data={this.state.externalData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </SafeAreaView>

          <BottomSheet
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible2}
            onRequestClose={() => {
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.titlem}>Изтриване на Разфасовка</Text>
                  <View style={styles.dividerm}></View>
                </View>
                <Text style={{
                  justifyContent: "center",
                  alignItems: "center", marginLeft: 20
                }}>Сигурни ли сте че искате да изтриете разфасовката <Text style={{ fontStyle: "italic", fontWeight: "bold" }}>{deleteType}</Text></Text>
                <View style={styles.modalBtn}>
                  <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                     this.RBSheet.close();
                     this.setModalVisible2(!modalVisible2);
                     this.submitDeleteType();
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
                            this.RBSheet.close();
                            this.setModalVisible2(!modalVisible2);
                            this.submitDeleteType();
                          }

                          }
                          type='ionicon'
                          backgroundColor='silver'
                          name='checkmark-outline'
                        ></Icon>

                      </View>
                      <View style={{
                        flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1,
                        borderColor: "silver", alignItems: 'center'
                      }}>
                        <Text style={{ flex: 3, marginTop: 15 }}>да</Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                     this.RBSheet.close();
                     this.setModalVisible2(!modalVisible2);
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
                            this.RBSheet.close();
                            this.setModalVisible2(!modalVisible2);
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
          </BottomSheet>


          
          <ActionButton
            buttonColor='#689F38'
            onPress={() => { this._saveDetails() }}
          />
        </View>
      );
    }
  }
};
export default CategoriesSettings;
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
    marginTop: 15,
    width: 200,
    marginLeft: 60
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  inputAndroid: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 10,
    marginTop: 15,
    width: 200,
    marginLeft: 60
  },
  placeholder: {
    color: 'black',
  }
});
const styles = StyleSheet.create({
  modalBtn: {
    flexDirection: "row",
    flex: 2,
    height: 80,
    marginBottom: 50,
  },
  input: {
    borderBottomWidth: 1,
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
  dividerm: {
    width: "100%",
    backgroundColor: "silver",
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
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  activeButton: {
    backgroundColor: 'red',
    width: 100,
    paddingRight: 5,
    paddingLeft: 5,
    borderWidth: 1,
    borderColor: "#20232a",
    borderRadius: 6,
    justifyContent: 'space-between',
    marginRight: 2,
    marginLeft: 2,

  },
  customBtnBG: {
    borderWidth: 1,
    borderColor: "#20232a",
    borderRadius: 6,
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
    paddingTop: 5,
    color: 'silver'
  },
  customBtnBGTopActive: {
    backgroundColor: "#fff",
    alignSelf: 'stretch',
    flex: 1,
    paddingTop: 5


  },
  customBtnText: {
    width: 100,
    paddingRight: 5,
    paddingLeft: 5,
    color: 'silver',
    borderRightWidth: 1


  },
  buttoncontainer: {
    flex: 1,
    justifyContent: 'space-between'
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topView: {
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    backgroundColor: 'white'

  },
  topView2: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    flexDirection: 'row',
    backgroundColor: '#689F38'

  },
  bottomView: {

    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',

  },
  item: {
    borderLeftWidth: 4, borderLeftColor: '#689F38',
    borderRadius: 15,
    marginLeft: 5, marginRight: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    paddingTop: 10,
    elevation: 6,
    backgroundColor: '#ffffff',
    marginVertical: 3,
    flex: 3,
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 7
  },
  title: {
    paddingLeft: 9,
    fontSize: 16,
    flex: 1,
    paddingTop: 7,
    paddingBottom: 7,

  },
  title2: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 9,
    fontSize: 16,
    flex: 2
  },
  icon: {
    height: 30,
    width: 30,
    flex: 1,
    marginTop: 15,
    marginRight: 10
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',

  },

});