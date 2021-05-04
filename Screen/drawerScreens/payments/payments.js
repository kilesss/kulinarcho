

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';


import {
  View,
  Text,
  Image, StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity
} from "react-native";
import { BackHandler } from 'react-native';
import { ScrollView } from 'react-native';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import DropdownAlert from 'react-native-dropdownalert';

class payments extends React.Component {

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'payments'){
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
    this.props.navigation.navigate('HomeScreen');
    return true;
  }

  state = {
    description: '',
    country: '0', 
    client: null,
    modalVisible: false,
    creditCart:null,
    amount:0
  };

  processResponse(response) {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]).then(res => ({
      statusCode: res[0],
      data: res[1]
    }));
  }



  async componentDidMount() {
    const { navigation } = this.props;
    this.props.navigation.setParams({ handleSave: this._saveDetails });

    this.focusListener = navigation.addListener('didFocus', async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('payments')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'payments') {
        arrRoute.push('payments')
      }
      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

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


async makepayment(){
  if(this.state.creditCart.valid == false){
    this.dropDownAlertRef.alertWithType('error', '', 'Данните са непълни или невалидни!', {}, 1000);

  }else{
    // console.log(this.state.creditCart);
    // Object {
    //   "status": Object {
    //     "cvc": "valid",
    //     "expiry": "valid",
    //     "number": "valid",
    //   },
    //   "valid": true,
    //   "values": Object {
    //     "cvc": "412",
    //     "expiry": "03/24",
    //     "number": "4170 9903 0367 3808",
    //     "type": "visa",
    //   },
    // }
    this.setState({modalVisible:false});
    this.submitPayment();

  }

}

  async submitPayment() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch('http://167.172.110.234/api/makePayment', {
      method: 'POST',
      body: JSON.stringify({
        amount: this.state.amount,
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
          this.dropDownAlertRef.alertWithType('success', 'success', 'Вашето плащане е успешно', {}, 1000);

        }
      }
    ).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }
  onChange = form => {

    this.setState({creditCart:form})
  }
  render(props) {

    return (
      <ScrollView>
                        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ ...styles.modalText, borderBottomWidth: 1, borderBottomColor: 'silver', fontSize: 22, width: '100%', marginTop: 10 }}>Плащане</Text>
              <Text style={{ ...styles.modalText, width: '100%', fontSize: 18 }}>Сума: 5.99 лв</Text>
              <View style={{marginBottom: 20, height:350}}>
              <CreditCardInput onChange={this.onChange} />

              </View>
              <View style={{flexDirection:'row'}}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() =>{
                   this.makepayment();

                } }
              > 
                <Text style={styles.textStyle}>Плати</Text>
              </Pressable>
              <Pressable
                style={{...styles.button, backgroundColor:'red', marginLeft:15}}
                onPress={() =>{
                  this.setState({modalVisible:false});
                } }
              > 
                <Text style={styles.textStyle}>Отказ</Text>
              </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
            <Text style={{ fontSize: 21, textAlign: 'center', marginBottom: 5, marginTop: 10 }}>Безплатен абонамент</Text>
          </View>
          <View style={{ borderBottomBottom: 1, borderBottomWidth: 1, borderBottomColor: 'silver', width: '100%' }}>
            <Text style={{ fontSize: 18, textAlign: 'center', color: 'green', marginBottom: 5, marginTop: 10 }}>
              За всяка ваша рецепта публикувана като публична получавате по 7 дена премиум.
            </Text>
          </View>
          <View>
            <View style={{
              alignItems: 'center', padding: 0, margin: 0,
              height: 200
            }}>
              <Image
                source={require('../../../Image/regImg.jpg')}
                style={{
                  width: '50%',
                  height: '100%'
                }}
              />
            </View>
          </View>

          <View>
            <View style={{ flexDirection: 'row', borderBottomBottom: 1, borderBottomWidth: 1, borderBottomColor: 'silver', width: '100%', marginBottom: 20 }}>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>Неограничено ползване от теб и цялата група</Text>
            </View>
            <View style={{ paddingLeft: 20, paddingBottom: 10 }}>
              <Text style={{ flex: 1 }}>* Персонален съпорт</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой седмични менюта</Text>
              <Text style={{ flex: 1 }}>* Неограничено добавяне на рецепти</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой списъци за пазар</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой продукти и персонални снимки на всеки продукт</Text>
              <Text style={{ flex: 1 }}>* Възможност за създаване на група с членовете на вашето семейство</Text>
              <Text style={{ flex: 1 }}>* Възможност за използване на проложението с личен профил и групов профил</Text>

            </View>
          </View>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: '#7DE24E',
                borderWidth: 0,
                color: '#FFFFFF',
                borderColor: '#7DE24E',
                height: 40,
                flex: 1,
                justifyContent: 'center',

                alignItems: 'center',
                borderRadius: 30,
                marginLeft: 35,
                marginRight: 35,
                marginTop: 20,
                marginBottom: 20,
              }}
              activeOpacity={0.5}
              onPress={() =>    {                    this.props.navigation.navigate('ListRecipes');
            }}
            >
              <Text style={{
                color: '#FFFFFF',
                paddingVertical: 10,
                fontSize: 16,
              }}>Възползвай се</Text>
            </TouchableOpacity>
          </View>


        </View>
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
            <Text style={{ fontSize: 21, textAlign: 'center', marginBottom: 5, marginTop: 10 }}>6 месечен план</Text>
          </View>
          <View style={{ borderBottomBottom: 1, borderBottomWidth: 1, borderBottomColor: 'silver', width: '100%' }}>
            <Text style={{ fontSize: 21, textAlign: 'center', color: 'green', marginBottom: 5, marginTop: 10 }}>5.99 лв</Text>
          </View>
          <View>
            <View style={{
              alignItems: 'center', padding: 0, margin: 0,
              height: 200
            }}>
              <Image
                source={require('../../../Image/regImg.jpg')}
                style={{
                  width: '50%',
                  height: '100%'
                }}
              />
            </View>
          </View>

          <View>
            <View style={{ flexDirection: 'row', borderBottomBottom: 1, borderBottomWidth: 1, borderBottomColor: 'silver', width: '100%', marginBottom: 20 }}>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>Неограничено ползване от теб и цялата група</Text>
            </View>
            <View style={{ paddingLeft: 20, paddingBottom: 10 }}>
              <Text style={{ flex: 1 }}>* Персонален съпорт</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой седмични менюта</Text>
              <Text style={{ flex: 1 }}>* Неограничено добавяне на рецепти</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой списъци за пазар</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой продукти и персонални снимки на всеки продукт</Text>
              <Text style={{ flex: 1 }}>* Възможност за създаване на група с членовете на вашето семейство</Text>
              <Text style={{ flex: 1 }}>* Възможност за използване на проложението с личен профил и групов профил</Text>

            </View>
          </View>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: '#7DE24E',
                borderWidth: 0,
                color: '#FFFFFF',
                borderColor: '#7DE24E',
                height: 40,
                flex: 1,
                justifyContent: 'center',

                alignItems: 'center',
                borderRadius: 30,
                marginLeft: 35,
                marginRight: 35,
                marginTop: 20,
                marginBottom: 20,
              }}
              activeOpacity={0.5}
              onPress={() =>    {this.setState({modalVisible: true});this.setState({amount:5.99})            }}
            >
              <Text style={{
                color: '#FFFFFF',
                paddingVertical: 10,
                fontSize: 16,
              }}>Купи</Text>
            </TouchableOpacity>
          </View>


        </View>

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
            <Text style={{ fontSize: 21, textAlign: 'center', marginBottom: 5, marginTop: 10 }}>1 годишен план</Text>
          </View>
          <View style={{ borderBottomBottom: 1, borderBottomWidth: 1, borderBottomColor: 'silver', width: '100%' }}>
            <Text style={{ fontSize: 21, textAlign: 'center', color: 'green', marginBottom: 5, marginTop: 10 }}>9 .99 лв</Text>
          </View>
          <View>
            <View style={{
              alignItems: 'center', padding: 0, margin: 0,
              height: 200
            }}>
              <Image
                source={require('../../../Image/regImg.jpg')}
                style={{
                  width: '50%',
                  height: '100%'
                }}
              />
            </View>
          </View>

          <View>
            <View style={{ flexDirection: 'row', borderBottomBottom: 1, borderBottomWidth: 1, borderBottomColor: 'silver', width: '100%', marginBottom: 20 }}>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>Неограничено ползване от теб и цялата група</Text>
            </View>
            <View style={{ paddingLeft: 20, paddingBottom: 10 }}>
            <Text style={{ flex: 1 }}>* Персонален съпорт</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой седмични менюта</Text>
              <Text style={{ flex: 1 }}>* Неограничено добавяне на рецепти</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой списъци за пазар</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой продукти и персонални снимки на всеки продукт</Text>
              <Text style={{ flex: 1 }}>* Възможност за създаване на група с членовете на вашето семейство</Text>
              <Text style={{ flex: 1 }}>* Възможност за използване на проложението с личен профил и групов профил</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: '#7DE24E',
                borderWidth: 0,
                color: '#FFFFFF',
                borderColor: '#7DE24E',
                height: 40,
                flex: 1,
                justifyContent: 'center',

                alignItems: 'center',
                borderRadius: 30,
                marginLeft: 35,
                marginRight: 35,
                marginTop: 20,
                marginBottom: 20,
              }}
              activeOpacity={0.5}
              onPress={() =>    {this.setState({modalVisible: true});this.setState({amount:9.99})            }}
            >
              <Text style={{
                color: '#FFFFFF',
                paddingVertical: 10,
                fontSize: 16,
              }}>Купи</Text>
            </TouchableOpacity>
          </View>


        </View>

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
            <Text style={{ fontSize: 21, textAlign: 'center', marginBottom: 5, marginTop: 10 }}>Перманентен план</Text>
          </View>
          <View style={{ borderBottomBottom: 1, borderBottomWidth: 1, borderBottomColor: 'silver', width: '100%' }}>
            <Text style={{ fontSize: 21, textAlign: 'center', color: 'green', marginBottom: 5, marginTop: 10 }}>19.99 лв</Text>
          </View>
          <View>
            <View style={{
              alignItems: 'center', padding: 0, margin: 0,
              height: 200
            }}>
              <Image
                source={require('../../../Image/regImg.jpg')}
                style={{
                  width: '50%',
                  height: '100%'
                }}
              />
            </View>
          </View>

          <View>
            <View style={{ flexDirection: 'row', borderBottomBottom: 1, borderBottomWidth: 1, borderBottomColor: 'silver', width: '100%', marginBottom: 20 }}>
              <Text style={{ textAlign: 'center', fontSize: 16 }}>Неограничено ползване от теб и цялата група</Text>
            </View>
            <View style={{ paddingLeft: 20, paddingBottom: 10 }}>
            <Text style={{ flex: 1 }}>* Персонален съпорт</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой седмични менюта</Text>
              <Text style={{ flex: 1 }}>* Неограничено добавяне на рецепти</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой списъци за пазар</Text>
              <Text style={{ flex: 1 }}>* Неограничен брой продукти и персонални снимки на всеки продукт</Text>
              <Text style={{ flex: 1 }}>* Възможност за създаване на група с членовете на вашето семейство</Text>
              <Text style={{ flex: 1 }}>* Възможност за използване на проложението с личен профил и групов профил</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: '#7DE24E',
                borderWidth: 0,
                color: '#FFFFFF',
                borderColor: '#7DE24E',
                height: 40,
                flex: 1,
                justifyContent: 'center',

                alignItems: 'center',
                borderRadius: 30,
                marginLeft: 35,
                marginRight: 35,
                marginTop: 20,
                marginBottom: 20,
              }}
              activeOpacity={0.5}
              onPress={() =>    {this.setState({modalVisible: true});this.setState({amount:19.99})            }}
            >
              <Text style={{
                color: '#FFFFFF',
                paddingVertical: 10,
                fontSize: 16,
              }}>Купи</Text>
            </TouchableOpacity>
          </View>


        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: '100%',
    height:300,
  },
  modalView: {
    width: '95%',
    flexDirection:'column',
    backgroundColor: "white",
    borderRadius: 20,
    paddingBottom: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width:'40%',
    borderColor:'silver', 
    borderWidth:1
  },
  buttonOpen: {
    backgroundColor: "#F194FF",

  },
  buttonClose: {
    backgroundColor: "#33ff3a",
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default payments;
