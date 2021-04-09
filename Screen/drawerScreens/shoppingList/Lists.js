

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import ActionButton from 'react-native-action-button';

import DropdownAlert from 'react-native-dropdownalert';
import { BottomSheet } from 'react-native-btr';

import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  Text,
  TextInput,
  Alert,
  Modal,
  TouchableHighlight
} from "react-native";
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';

class Lists extends React.Component {

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'ShoppingLists'){
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

  state = {
    modalVisible: false,
    modalVisible2: false,
    deleteType: '',
    typeTitle: 'Име',
    token: '',
    isActive: false,
    data: [],
    externalData: null,
    editList:false,
    editList2:false,
    typeid: '',
    modalEditTitle: 'Редактиране на списък',
    count: false,

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

  setdeleteType = (title) => {
    this.setState({ deleteType: title })
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
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    fetch("http://167.172.110.234/api/shoppingList", {
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

        Object.keys(data).map((key, index) => {
          newData.push(data[index]);
        })
        this.setState({ externalData: newData });
      }).done();
  }
  async checkPremium() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch('http://167.172.110.234/api/checkPremium', {
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
        this.setState({ count: data.response })

      }
    ).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }
  async submitDeleteType() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch('http://167.172.110.234/api/deleteList', {
      method: 'POST',
      body: JSON.stringify({ id: this.state.typeid }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        //Header Defination
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },

    }).then(
      async response => {
        const data = await response.json();
        this.dropDownAlertRef.alertWithType('success', '', 'Списъка е изтрит', {}, 1000);

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
  async submitEditType() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    var active = 0;
    if (this.state.isActive == 1) {
      active = 1
    }

    await fetch('http://167.172.110.234/api/updateList', {
      method: 'POST',
      body: JSON.stringify({ id: this.state.typeid, name: this.state.typeTitle, isShared: active }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        //Header Defination
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },

    }).then(
      async response => {


        const data = await response.json();
        if (data.errors !== undefined) {
          Object.keys(data.errors).map((key, index) => {
            this.dropDownAlertRef.alertWithType('error', '', data.errors[key], {}, 1000);

          })


        } else {
          if (this.state.typeid != '') {
            this.dropDownAlertRef.alertWithType('success', '', 'Списъка е редактиран', {}, 1000);
          } else {
            this.dropDownAlertRef.alertWithType('success', '', 'Списъка е създаден', {}, 1000);

          }

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
    this.props.navigation.setParams({ handleSave: this._saveDetails });

    this.focusListener = navigation.addListener('didFocus', async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('ShoppingLists')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'ShoppingLists') {
        arrRoute.push('ShoppingLists')
      }
      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

      this.fetchData();
      this.checkPremium();
      this.setState({editList2:false})
      this.setState({editList:false})
    });
  }

  _saveDetails = (prop) => {
    if (this.state.count == 'ok' || this.state.count < 2) {
      this.setTypeTitle('');
      this.setTypeID('');
      this.setActive(false);
      this.setState({editList:true})

      this.setState({ modalEditTitle: 'Добави нов списък' })
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
  async archiveShoppingList(id) {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

    await fetch('http://167.172.110.234/api/archiveList', {
      method: 'POST',
      body: JSON.stringify({
        listId: id,
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
        this.dropDownAlertRef.alertWithType('success', '', 'Списъка е преместен в архив', {}, 1000);
        this.setState({editList2:false})

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
      console.log('There has been a problem with your fetchaaaaaaaaaaaaaaa operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }

  toggle = () => this.setState({editList: !this.state.editList})
  toggle2 = () => this.setState({editList2: !this.state.editList2})

  render(props) {

    if (this.state.externalData === null && this.state.count === false) {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.topView}>
            <Text>Loading....</Text>
          </View>
        </View>
      )
    } else {


      const { modalVisible2 } = this.state;
      const { modalVisible } = this.state;

      const { typeTitle } = this.state;

      const renderItem = ({ item }) => (

        <View style={{ borderLeftWidth: 4, borderLeftColor: '#689F38',
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
        marginVertical: 3,
        flex: 3,
        flexDirection: 'row',
        marginTop: 15,}}>
          <TouchableOpacity style={{ marginLeft: 10, marginTop: 6, marginBottom: 5, width: '87%' }} onPress={() => {
            AsyncStorage.setItem('listName', item.name)
            AsyncStorage.setItem('listId', item.id.toString()).then(data => {
              this.props.navigation.navigate('ShoppingListEditProducts');
            });
          }}>
            <Text style={{
              paddingLeft: 9,
              fontSize: 18,
              flex: 1,
            }}>{item.name}</Text>
            <Text style={{
              paddingLeft: 9,
              fontSize: 14,
              flex: 1, color: 'silver'
            }}>Брой артикули: {item.count}</Text>
          </TouchableOpacity>
          <View style={{ paddingTop: 10 }}>
            <Icon style={{
              paddingTop: 10, marginRight: 15,
              paddingRight: 20,
              height: 30,
              width: 30,
              flex: 1
            }}
              size={30}
              color={'silver'}
              onPress={() => {
                this.setTypeTitle(item.name);
                this.setTypeID(item.id);
                this.setState({editList2:true})
              }

              }
              type='font-awesome-5'

              name='pencil-alt'
            >Редактирай</Icon>

          </View>
        </View>


      );

      return (
        <View style={styles.MainContainer}>
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />


          <BottomSheet
            visible={this.state.editList}
            onBackButtonPress={this.toggle}
            onBackdropPress={this.toggle}
          >
            <View
              style={{
                  backgroundColor:'white',
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  height:200
                }}
            >
              <Text style={styles.titlem}>{this.state.modalEditTitle}</Text>
              <TextInput
                style={{
                  width: "92%", height: 40,
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

                  backgroundColor: '#ffffff',
                  paddingLeft: 10
                }}
                 defaultValue={typeTitle}
                 onSubmitEditing={() => {   this.setState({editList:false});
                 this.submitEditType(); }}
                 blurOnSubmit={false}
                placeholder={'Име: '}
                onChangeText={typeTitle => this.setTypeTitle(typeTitle)}

              />


              <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
      this.setState({editList:false});
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
                          backgroundColor:'green' ,
                          padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                        }}
                        color={ '#ebebeb'}
                        onPress={() => {
                          this.setState({editList:false});
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
                <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {       this.setState({editList:false})
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
                          backgroundColor: 'red',
                          padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                        }}
                        color={'#ebebeb'}
                        onPress={() => {

                          this.setState({editList:false})


                        }

                        }
                        type='ionicon'
                        backgroundColor='silver'
                        name='close-outline'
                      >Запази</Icon>

                    </View>
                    <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                      <Text style={{ flex: 3, marginTop: 15 }}>Отказ</Text>
                    </View>
                  </View>
                </TouchableHighlight>

              </View>

            </View>
          </BottomSheet>
          <BottomSheet
            visible={this.state.editList2}
            onBackButtonPress={this.toggle2}
            onBackdropPress={this.toggle2}
          >
            <View
              style={{
                backgroundColor:'white',
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  height:170
                }}
            >
            <View style={{
              flexDirection: 'row', marginTop: 25, marginLeft: 20
            }}>
              <TouchableOpacity onPress={() => {
                this.setModalVisible(true);
              }
              }>
                <View style={{ flexDirection: 'row', }}>
                  <Icon style={styles.icon}
                    borderRadius={15}
                    containerStyle={{
                      backgroundColor: '#ebebeb',
                      borderRadius: 20,
                      padding: 5
                    }}
                    type='ionicon'
                    size={25}
                    color={'black'}
                    onPress={() => {
                      this.setModalVisible(true);

                    }

                    }
                    name='archive-outline'
                  > Архивирай</Icon>
                  <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Приключи списъка</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

              <TouchableOpacity onPress={() => {
        this.setState({editList2:false})
        this.setState({editList:true})
                this.setState({ modalEditTitle: 'Редактиране на списък' })
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
                      this.setState({ modalEditTitle: 'Редактиране на списък' })
                      this.setState({editList2:false})
                      this.setState({editList:true})

                    }

                    }
                    type='font-awesome-5'
                    name='pencil-alt'
                  >Редактирай</Icon>
                  <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Редактирай списъка</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => {

              this.setModalVisible2(true)
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
                  color={'black'}
                  type='ionicon'
                  name='trash-outline'

                  onPress={() => {

                    this.setModalVisible2(true)
                  }
                  }
                  size={25}
                  style={styles.icon} ></Icon><Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Изтрий списъка</Text>
              </View>
            </TouchableOpacity>



          </View>
          </BottomSheet>
          <View style={styles.container}>
            <FlatList
              data={this.state.externalData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>

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
                  <Text style={styles.titlem}>Изтриване на списък</Text>
                  <View style={styles.dividerm}></View>
                </View>
                <Text style={{
                  justifyContent: "center",
                  alignItems: "center", marginLeft: 20
                }}>Сигурни ли сте че искате да изтриете списъка <Text style={{ fontStyle: "italic", fontWeight: "bold" }}>{this.state.deleteType}</Text></Text>

                <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                  <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                    this.submitDeleteType();
                    this.setState({editList2:false})

                    this.setModalVisible2(!modalVisible2);
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
                            this.submitDeleteType();
                            this.setState({editList2:false})

                            this.setModalVisible2(!modalVisible2);
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
        this.setState({editList2:false})

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

                            this.setState({editList2:false})

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
          </Modal>

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
                  <Text style={styles.titlem}>Приключване на списъка</Text>
                  <View style={styles.dividerm}></View>
                </View>
                <Text style={{
                  justifyContent: "center",
                  alignItems: "center", marginLeft: 20
                }}>Сигурни ли сте че искате да приключите списъка</Text>

                <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                  <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                            this.archiveShoppingList(this.state.typeid)
                            this.setState({editList2:false})

                    this.setModalVisible(!modalVisible);
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
                            this.archiveShoppingList(this.state.typeid)

                            this.setState({editList2:false})

                            this.setModalVisible(!modalVisible);
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
        this.setState({editList2:false})

                    this.setModalVisible(!modalVisible);
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

                            this.setState({editList2:false})

                            this.setModalVisible(!modalVisible);


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

          <ActionButton
            buttonColor='#689F38'
            onPress={() => { this._saveDetails() }}
          />
        </View >
      );
    }
  }
};
export default Lists;

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
    borderBottomWidth: 1,
    marginBottom: 10,
    marginTop: 15,
    width: '100%'
  },

  titlem: {
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 20,
    color: "#000",
    alignSelf: 'stretch',
    margin: 0,
    padding: 0,

  },
  dividerm: {
    width: "100%",
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: "silver"
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
    elevation: 5,
    height: 170
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
    backgroundColor: '#30ff49',
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
    paddingTop: 5
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
    paddingLeft: 5


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
    paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },
  topView: {
    width: '100%',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    backgroundColor: '#689F38'

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

    elevation: 6,
    backgroundColor: '#ffffff',
    marginVertical: 3,
    flex: 3,
    flexDirection: 'row',
    marginTop: 15,
  },
  title: {
    paddingLeft: 9,
    fontSize: 16,
    flex: 1
  },
  icon: {
    color: 'green',
    height: 30,
    width: 30,
    flex: 1
  },
  container: {
    height: '90%',
    flex: 1,
    alignSelf: 'stretch',

  },

});