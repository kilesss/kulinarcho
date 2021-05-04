

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import DropdownAlert from 'react-native-dropdownalert';

import {
  View,
  Text,
  Image,
  TextInput,
    FlatList,
  SafeAreaView,
} from "react-native";
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';
import { TouchableOpacity } from 'react-native';

import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';
class searchUser extends React.Component {

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'searchUser'){
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
    premium:0,

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
        arrRoute.push('ShoppingListArchive')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'ShoppingListArchive') {
        arrRoute.push('ShoppingListArchive')
      }
      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

      await this.fetchData('');

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

  async addFollow(follow_id) {

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    
    
    
    await fetch('http://167.172.110.234/api/addFollower', {
      method: 'POST',
      body: JSON.stringify({
        follow_id: follow_id
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
        this.fetchData('');
      }
    ).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }
  async removeFollow(follow_id) {

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    console.log(JSON.stringify({
      follow_id: follow_id
    }));
    console.log(DEMO_TOKEN);
    await fetch('http://167.172.110.234/api/removeFollower', {
      method: 'POST',
      body: JSON.stringify({
        follow_id: follow_id
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
        this.fetchData('');
      }
    ).catch(function (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      // ADD THIS THROW error
      throw error;
    });
  }

  async fetchData(id) {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    fetch("http://167.172.110.234/api/getPublicProfiles/"+id, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN,
        'Cache-Control': 'no-cache'
 
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
        let newData = [];
        Object.keys(data).map((key, index) => {

          newData.push(data[index]);
        })
        this.setState({ externalData: newData });

      }).catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
        throw error;
      }).done();
  }
  render(props) {
    const ShowUser = (props) => {
      let desc = '';
      let picture = '';
      let follow = 0;
      let followColour = 'silver'
      let variable = props.youtube;

      if(variable.follow == 1){
        follow = 1;
        followColour = 'green';
        console.log(variable)
        }
      if(variable.profilePicture != null) {
        picture =         <Image source={{ uri: "https://kulinarcho.s3.eu-central-1.amazonaws.com/profile/"+variable.profilePicture + '?time' + (new Date()).getTime() }}
        style={{ width: 80, marginTop: 10, marginLeft: 10, height: 80, borderColor: 'silver', borderWidth: 1, borderRadius: 40, marginBottom: 5 }}
      />

      }else{
        picture = <Image source={require('../../../Image/circle-cropped.png')}
        style={{ width: 80, marginTop: 10, marginLeft: 10, height: 80, borderColor: 'silver', borderWidth: 1, borderRadius: 40, marginBottom: 5 }}
      />
      }
      if(variable.description != null) {
        desc = variable.description.substring(0,100)
      }
      let isYoutube = (<Text></Text>)
      if (variable.roles == 2) {
        isYoutube = (<Icon style={{ marginLeft: 10 }} type='font-awesome-5'
          name='youtube'
          color={'red'}
        />);
      }
      return (<View >
        <TouchableOpacity onPress={() => {
           AsyncStorage.setItem('userId', variable.id.toString()).then(data => {
            this.props.navigation.navigate('UserProfile', { name: 'kuyr' });

        });

        }}>
          <View style={{
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
            flexDirection: 'row',
          }} >
            <View style={{ flex: 2 }}>
              {picture}
            </View>
            <View style={{ flex: 4, marginTop: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 18 }}>{variable.name}</Text>
                {isYoutube}
              </View>
              <Text style={{ color: 'green' }}>брои рецепти: {variable.count}</Text>
              <Text style={{ color: 'silver' }}>{desc}</Text>
            </View>
            <View style={{ flex: 1, paddingTop: 20 }}>
              <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                onPress={() => { 
                  if(follow == 0){
                      this.addFollow(variable.id);
                  }else{
                    this.removeFollow(variable.id);
                    
                  }
                }}
                size={30}
                containerStyle={{}}
                color={followColour}

                type='font-awesome-5'
                name='user-plus'
                backgroundColor='silver'
              ></Icon>
            </View>
          </View>
        </TouchableOpacity>
      </View>)
    }
    if (this.state.externalData === null) {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.topView}>
            <Text>Loading....</Text>
          </View>
        </View>
      )
    } else {
      console.log(this.state.premium);
      let Add =  <AdMobBanner
      bannerSize="smartBannerLandscape" 
      adUnitID={'ca-app-pub-5428132222163769/7976537020'} 
        onDidFailToReceiveAdWithError={console.log(this.bannerError)} 
        servePersonalizedAds={true}/>;
        if(this.state.premium != 0){
          Add = <View></View>;
        }

      return (

        <View style={{
          height: '100%',
        }}>

          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />


          <SafeAreaView style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                placeholder={'Заглавие'}
                onChangeText={typeTitle => this.setState({ title: typeTitle })}
                style={{
                  flex: 8,
                  height: 50,
                  marginTop: 20,
                  borderRadius: 15,
                  marginLeft: 9, marginRight: 2,
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
                  paddingLeft: 10,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,

                }}
              />
              <Icon style={{ flex: 2, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                size={40}
                containerStyle={{
                  paddingTop: 3,
                  flex: 2,
                  height: 50,
                  marginTop: 20,
                  borderRadius: 15,
                  marginRight: 9,
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
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
                color={'green'}
                onPress={() => {
                    this.fetchData(this.state.title);
                }

                }
                type='ionicon'
                backgroundColor='silver'
                name='search-outline'
              ></Icon>
            </View>
            <FlatList
                            contentContainerStyle={{ paddingBottom: 70 }}

                            data={this.state.externalData}
                            renderItem={data => {

                                return (
                                  <ShowUser youtube={data.item}></ShowUser>

                                );
                            }}
                            keyExtractor={item => item.id}
                        />
            {/* <ScrollView>
              <ShowUser youtube='1'></ShowUser>
              <ShowUser youtube='1' ></ShowUser>
              <ShowUser youtube='0' ></ShowUser>
              <ShowUser youtube='1' ></ShowUser>
              <ShowUser youtube='0' ></ShowUser>
              <ShowUser youtube='1' ></ShowUser>
              <ShowUser youtube='1' ></ShowUser>
              <ShowUser youtube='0' ></ShowUser>
              <ShowUser youtube='0' ></ShowUser>
              <ShowUser youtube='1' ></ShowUser>
              <ShowUser youtube='0' ></ShowUser>
            </ScrollView> */}
          </SafeAreaView>
          {Add}
                  </View>
      );
    }
  }
}
export default searchUser;
