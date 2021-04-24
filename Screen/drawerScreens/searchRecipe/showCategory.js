

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import DropdownAlert from 'react-native-dropdownalert';
import ImageModal from 'react-native-image-modal';

import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView, FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions
} from "react-native";
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';

class showCategory extends React.Component {

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
    BackHandler.addEventListener("hardwareBackPress",async () => {
      let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
      let lastRoute = route.pop();
      if(lastRoute != 'searchRecipe'){
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
    title: '',
    showExtend: 0,
    externalData: [],
    page: 0,
    page2: 0,
    onEndReachedCalledDuringMomentum: false,
    finnish: 0,
    category: 0,
    categories: [],
    selectedCategories: [],
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
        arrRoute.push('searchRecipe')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'searchRecipe') {
        arrRoute.push('searchRecipe')
      }
      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

      this.setState({ title: '' });
      this.setState({ showExtend: 0 });
      this.setState({ externalData: [] });
      this.setState({ page: 0 });
      this.setState({ onEndReachedCalledDuringMomentum: false });
      this.setState({ finnish: 0 });
      this.setState({ category: 0 });
      this.setState({ categories: [] });
      this.setState({ selectedCategories: [] });
      this.fetchData(0)

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

  updateselectedCat(text) {
    this.setState({ selectedCategories: text });

  }
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }


  async fetchData(id) {
    // 
    let p = 0;
    if (id != 0) {
      p = this.state.page + 1;
    }
    let r = this.state.page + 1
    await this.setState({ page: r });

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    var category = await AsyncStorage.getItem('categoryId');
    console.log(JSON.stringify({
      page: p,
      title: this.state.title,
      category: category
    }));
    fetch("http://167.172.110.234/api/getPublicRecipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        //Header Defination
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },
      body: JSON.stringify({
        page: p,
        title: this.state.title,
        category: category
      }),
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

        if (data.response == 'error') {
          this.dropDownAlertRef.alertWithType('error', '', "Моля въведете заглавие или категория", {}, 1000);

        } else {
          if (Object.keys(data.response).length > 0) {
            this.setState({ finnish: 0 });
            this.setState({ showExtend: 0 })

            let newData = [];
            if (this.state.page > 1) {
              newData = this.state.externalData;
            }
            Object.keys(data.response).map((key, index) => {
              newData.push(data.response[index]);
            })
            if (Object.keys(data.response).length != 10) {
              this.setState({ finnish: 1 });
            }
            this.setState({ externalData: newData });

          } else {
            this.setState({ finnish: 1 });

            this.dropDownAlertRef.alertWithType('info', '', "Няма открити рецепти.", {}, 1000);

          }
        }

      }).catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
        throw error;
      }).done();
  }




  render(props) {
 

    const Card = ({ item }) => {
      return (
        <TouchableHighlight style={{ width:'100%'}} onPress={() => {AsyncStorage.setItem('recipeId', item.id.toString()).then(data => {
          this.props.navigation.navigate('showPublicRecipes', { name: 'kuyr' });
        });}}> 

        <View
          style={{
          }}>
          <View style={{ flex: 1, flexDirection: 'column', width: '100%' }}>
            <View style={{ flex: 1, flexDirection: 'row', borderRadius:15 }}>
              <ImageModal
                resizeMode="cover"
                source={{ uri: 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/roast-beef-recipes-536cd86.jpg' + '?time' + (new Date()).getTime() }}
                style={{
                  borderRadius:15,
                  marginLeft: 10, marginBottom: 10,
                  width: 80,
                  height: 80,
                  alignSelf: 'center',
                }}
              />
              <TouchableOpacity style={{
                width: '100%',
                paddingLeft: 9,
                flex: 2,
                flexDirection: 'column',
                height:80
              }} onPress={() => {
                AsyncStorage.setItem('recipeId', item.id.toString()).then(data => {
                  this.props.navigation.navigate('showPublicRecipes', { name: 'kuyr' });
                });
              }}>
                            <Text style={{ fontSize: 20, borderBottomColor: 'silver',
                             borderBottomWidth: 1,  fontWeight: '400', color: '#000' }}>{item.title}</Text>

                <Text style={{
                  alignItems: 'flex-end', color: 'green', marginBottom: 10
                }}>
                  {item.catTitle}                    </Text>
                <View
                  style={{
                    width: '100%',
                    // flex: 1,

                    height: 80,

                  }}>

                  
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </TouchableHighlight>

      )
    }
    const ListFooterComponent = () => {

      if (this.state.page == 0 || this.state.finnish == 1) {
        return (<View></View>)
      } else {
        return (
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {

              this.fetchData(this.state.page);

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
                      this.fetchData(this.state.page);
                    }

                    }
                    type='ionicon'
                    backgroundColor='silver'
                    name='checkmark-outline'
                  ></Icon>

                </View>
                <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                  <Text style={{ flex: 3, marginTop: 15 }}>Зареди още...</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>

        )
      }
    };
    if (this.state.externalData === null) {
      return (
        <View>
          <View>
            <Text>Loading....</Text>
          </View>
        </View>
      )
    } else {
      const WINDOW = Dimensions.get('window')

      return (

        <View style={{
          height: '100%',
        }}>

          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} startDelta={WINDOW.height - 150} endDelta={WINDOW.height - 200} />


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
                  this.setState({ page: 0 })
                  this.setState({ externalData: [] })
  
                  this.fetchData(0);
                }

                }
                type='ionicon'
                backgroundColor='silver'
                name='search-circle-outline'
              ></Icon>
            </View>
            
            
            <FlatList
              contentContainerStyle={{ paddingBottom: 350 }}
              data={this.state.externalData}

              renderItem={data => {

                return (

                  <Card item={data.item} />
                );
              }}
              keyExtractor={item => item.id}

              ListFooterComponent={() => <ListFooterComponent />}
            />
            <ScrollView>




            </ScrollView>



          </SafeAreaView>
        </View >)
    };
    // }
  }
}
export default showCategory;
