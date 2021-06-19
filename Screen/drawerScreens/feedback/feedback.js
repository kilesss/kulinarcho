

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import DropdownAlert from 'react-native-dropdownalert';
import SearchableDropdown from 'react-native-searchable-dropdown';

import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,ActivityIndicator,
  TextInput,
  TouchableHighlight
} from "react-native";
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';

class feeback extends React.Component {


  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
      BackHandler.addEventListener("hardwareBackPress", async () => {
        let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
        let lastRoute = route.pop();
        if (lastRoute != 'feeback') {
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

  state = {
    description: '',
    country: '0',
    placeholder: 'Изберете',
    externalData:null,
    premium:0,
  };
    lenght;



  async componentDidMount() {
    const { navigation } = this.props;
    this.props.navigation.setParams({ handleSave: this._saveDetails });
    this.focusListener = navigation.addListener('didFocus', async () => {
      this.fetchData();
      let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('feeback')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] !== 'feeback') {
        arrRoute.push('feeback')
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



  async fetchData() {


    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');


    fetch(global.MyVar+"getFeedback", {
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
        this.state.premium = data.premium;
        delete data.premium;

        if (data.new_token) {
          AsyncStorage.setItem('access_token', data.new_token);
          delete data.new_token;
          delete data['new_token'];
        }

        this.setState({ externalData: data.response });

      }).done();
  }

  async deleteFeedback(id){
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch(global.MyVar+'deleteFeedback', {
      method: 'POST',
      body: JSON.stringify({
        id: id,
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
            this.dropDownAlertRef.alertWithType('error', '', data.errors[key], {}, 3000);
          })
        } else {
            this.fetchData();
        }
      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
    }


  async submitAddType() {
    console.log(JSON.stringify({
      description: this.state.description,
      type: this.state.country
    }))
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch(global.MyVar+'submitFeedback', {
      method: 'POST',
      body: JSON.stringify({
        description: this.state.description,
        type: this.state.country
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
            this.dropDownAlertRef.alertWithType('error', '', data.errors[key], {}, 3000);
          })
        } else {
          this.dropDownAlertRef.alertWithType('success', '', 'Благодарим ви за обратната връзка', {}, 3000);

        }
        this.fetchData();

      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
  }
  render(props) {

    const renderItem = () => {

      let html = [];
      // id: '1',
      // name: 'test',
      // types: '1',
      // status: 0

      // { name: 'Проблем с приложението', id: '1', icon: () => { } },
      // { name: 'Предложение за приложението', id: '2', icon: () => { } },
      // { name: 'Въпрос свързан с приложението', id: '3', icon: () => { } },
      item = this.state.externalData;
      Object.keys(item).map((key, index) => {
      let statusColor = 'red';
      let status  = 'Необработено'
      let answerText = [];
      let id = item[index].id;
      let typeFeedback = '';
      if(item[index].type == '1'){
          typeFeedback = 'Проблем с приложението';
      }else if(item[index].type == '2'){
        typeFeedback = 'Предложение за приложението';
      }else if(item[index].type == '3'){
        typeFeedback = 'Въпрос свързан с приложението';
      }
      if(item[index].status == 1){
        status = 'Приключен';
        statusColor = '#689F38';
        answerText.push(<View><Text style={{paddingLeft:10, fontSize:18}}>Отговор:</Text>
        <Text style={{paddingLeft:25, color:'silver'}}>{item[index].answer}</Text></View>
        )
      }
      html.push(
        <View style={{
          borderLeftWidth: 4, borderLeftColor: statusColor,
          borderRadius: 15,
          marginLeft: 5, marginRight: 5,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.41,
          shadowRadius: 9.11,
          width: '100%',
          elevation: 6,
          backgroundColor: '#ffffff',
          marginVertical: 3,
          flex: 3,
          flexDirection: 'row',
          marginTop: 15,
        }}>
          <View style={{ marginLeft: 10, marginTop: 6, marginBottom: 5, width: '94%' }} onPress={() => {

          }}>
            <View style={{flexDirection:'row'}}>
            <Text style={{
              paddingLeft: 9,
              fontSize: 16,
              flex: 8,
              paddingBottom:-15,
              marginBottom:2
            }}>{item[key].messages}</Text>
            <Text style={{
              marginBottom:-3,
              paddingLeft: 9,

              fontSize: 16,
              flex: 4, color: statusColor
            }}>{status}</Text>
             <Icon

                                    containerStyle={{
                                      flex: 1,
                                    }}
                                    size={25}
                                    color={'silver'}
                                    name='trash-outline'
                                    color={'black'}
                                    type='ionicon'

                                    onPress={() => {
                                       this.deleteFeedback(id)
                                    }
                                    }
                                   ></Icon>
            </View>
            <Text style={{
              paddingLeft: 9,
              fontSize: 14,
              flex: 1, color: 'silver'
            }}>{typeFeedback}</Text>
            <View>
            {answerText}
              </View>                    

          </View> 
          
        </View>


      );
    })
return html
    }
    if (this.state.externalData === null) {
      return (
        <View style={{  flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: (Platform.OS === 'ios') ? 20 : 0}}>
          <View style={{ width: '100%',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        flexDirection: 'row',
        backgroundColor: '#689F38'}}>
<ActivityIndicator size="large" color="#7DE24E" />
          </View>
        </View>
      )
    } else {

      
      let Add =  <AdMobBanner
      bannerSize="smartBannerLandscape" 
      adUnitID={'ca-app-pub-5428132222163769/5705596900'} 
         
        servePersonalizedAds={true}/>;
        if(this.state.premium != 0){
          Add = <View></View>;
        }

    return (
      <View style={{ width: '100%', flexDirection:'column' }}>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />

        <SearchableDropdown
          style={{}}
          onTextChange={(text) => this.setState({ newProdTitle: text })}
          //On text change listner on the searchable input
          //onItemSelect called after the selection from the dropdown
          containerStyle={{ padding: 5, marginBottom: 10, marginTop: 5, paddingLeft: 10 }}
          //suggestion container style
          textInputStyle={{
            borderRadius: 7,
            padding: 10,
            height: 40,
            borderWidth: 1, borderColor: 'silver',
            //inserted text style
            borderBottomWidth: 1,
            borderColor: '#ccc',
            width: '99%',
            backgroundColor: 'white'
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
          showNoResultDefault={false}

          onItemSelect={(item) => {
            this.setState({ placeholder: item.name }); this.setState({
              country: item.id
            })
          }}

          itemsContainerStyle={{
            //items container style you can pass maxHeight
            //to restrict the items dropdown hieght
            maxHeight: '100%',
            paddingBottom: 0,
            marginBottom: 0
          }}
          items={[
            { name: 'Изберете', id: '0', icon: () => { } },
            { name: 'Проблем с приложението', id: '1', icon: () => { } },
            { name: 'Предложение за приложението', id: '2', icon: () => { } },
            { name: 'Въпрос свързан с приложението', id: '3', icon: () => { } },

          ]}
          showNoResultDefault={'false'}

          //mapping of item array
          defaultIndex={0}
          //default selected item index
          placeholder={this.state.placeholder}
          //place holder for the search input
          resetValue={false}
          //reset textInput Value with true and false state
          underlineColorAndroid="transparent"
        //To remove the underline from the android input
        />

        <TextInput
          multiline={true}
          numberOfLines={9}
          onChangeText={typeTitle => this.setState({ description: typeTitle })}
          style={{
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
        />
        <View style={{ flexDirection: 'row',  marginTop: 5 }}>
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
                <Text style={{ flex: 3, marginTop: 15 }}>Изпрати</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>

        <View style={{width:"100%", marginTop:15, height:350}}>
         
          <ScrollView  style={{}}>
         
          {renderItem()}
           
          </ScrollView>
          {Add}

        </View>
      </View>);
    }
  }
}
export default feeback;
