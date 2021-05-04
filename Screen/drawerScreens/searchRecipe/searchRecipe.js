

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
  Image,
  SafeAreaView,
  ScrollView, 
  TouchableOpacity,
  TouchableHighlight,
  Dimensions
} from "react-native";

import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';

class searchRecipe extends React.Component {

  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
      BackHandler.addEventListener("hardwareBackPress", async () => {
        let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
        let lastRoute = route.pop();
        if (lastRoute != 'searchRecipe') {
          route.push(lastRoute);
        }
        let goRoute = route.pop();
        console.log(goRoute);
        console.log(route);
        if (goRoute != undefined) {
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
    externalDataCat: null,
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
      let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
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
      this.setState({ externalDataCat: null });
      this.fetchCategories()


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

  async fetchCategories() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    fetch("http://167.172.110.234/api/getCategories", {
      method: "GET",
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },
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

        this.setState({ externalDataCat: newData });


      }).catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
        throw error;
      }).done();
  }


  async fetchData(id) {
    let p = 0;
    if (id != 0) {
      p = this.state.page + 1;
    }
    let r = this.state.page + 1
    await this.setState({ page: r });

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
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
        category: this.state.categories
      }),
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
    const SquareView = (props) => {
      let selected = '#fff'
      if (this.state.categories.indexOf(props.id) > -1) {

        selected = '#689F38'
      }

      // if(this.state.category == props.id){
      //   selected = '#689F38'
      // }
      return (
        <View
          style={{
            height: 50,
            width: 150,
          }}
        >
          <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
            let r = this.state.categories;

            if (this.state.categories.indexOf(props.id) > -1) {
              r.splice(r.indexOf(props.id), 1);

            } else {
              r.push(props.id);
            }

            this.setState({ categories: r });

          }} underlayColor="white">
            <View style={{
              backgroundColor: selected,

              flex: 3, flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.41,
              shadowRadius: 9.11,
              elevation: 6,
              marginRight: 10, borderRadius: 10, borderWidth: 1, borderColor: "silver", height: 50,
              padding: 10
            }}>

              <View style={{ flex: 3, backgroundColor: selected, height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                <Text style={{ flex: 3, marginTop: 15 }}>{props.title}</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
    const RenderExtend = (props) => {

      if (this.state.showExtend == 1) {
        let t = [];
        let r = []
        Object.keys(this.state.externalDataCat).map((key, index) => {
          if (this.state.categories.indexOf(this.state.externalDataCat[key].id) > -1) {
            r.push(<Text style={{ marginLeft: 10, color: '#828181' }}>{this.state.externalDataCat[key].title}</Text>)
          }
          t.push(<SquareView id={this.state.externalDataCat[key].id} title={this.state.externalDataCat[key].title} />)
        });
        return (
          <View>
            <ScrollView style={{ marginTop: 10, marginBottom: 20, }} horizontal={true} >
              {t}
            </ScrollView>
            <Text style={{ borderBottomWidth: 1, borderBottomColor: 'silver', marginBottom: 5 }}>Избрани категории: </Text>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              {r}
            </View>
          </View>
        )
      } else {
        return (<View></View>)
      }
    }
    const Card = ({ item }) => {
      return (
        <TouchableHighlight style={{ width: '100%' }} onPress={() => {
          AsyncStorage.setItem('recipeId', item.id.toString()).then(data => {
            this.props.navigation.navigate('showPublicRecipes', { name: 'kuyr' });
          });
        }}>

          <View
            style={{
              borderLeftWidth: 4, borderLeftColor: '#689F38',
              // borderBottomWidth:4, borderBottomColor:'#689F38',
              height: 160,
              shadowColor: '#000000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowRadius: 3,
              shadowOpacity: 0.5,
              marginLeft: 15,
              marginTop: 20,
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 6,
            }}>
            <View style={{ flex: 1, flexDirection: 'column', width: '100%' }}>
              <Text style={{ fontSize: 20, borderBottomColor: 'silver', borderBottomWidth: 1, textAlign: 'center', fontWeight: '400', color: 'silver' }}>{item.title}</Text>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <ImageModal
                  borderRadius={80}
                  resizeMode="cover"
                  imageBackgroundColor="#fff"
                  source={{ uri: 'https://s.clipartkey.com/mpngs/s/35-354348_cook-clipart-food-recipe-recipe-clipart.png' + '?time' + (new Date()).getTime() }}
                  style={{
                    marginLeft: 10, marginBottom: 10,
                    marginTop: 15,
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

                }} onPress={() => {
                  AsyncStorage.setItem('recipeId', item.id.toString()).then(data => {
                    this.props.navigation.navigate('showPublicRecipes', { name: 'kuyr' });
                  });
                }}>
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

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ marginRight: 10 }}>Порции: </Text>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '200',
                        // fontFamily: 'sans-serif',
                        marginBottom: 4,
                        color: '#808080',
                      }}>{item.portion}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ marginRight: 10 }}>Порции: </Text>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '200',
                        // fontFamily: 'sans-serif',
                        marginBottom: 4,
                        color: '#808080',
                      }}>{item.all_time}</Text>
                    </View>
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

    const WINDOW = Dimensions.get('window')
    console.log(this.state.premium);
    let Add =  <AdMobBanner
    bannerSize="smartBannerLandscape" 
    adUnitID={'ca-app-pub-5428132222163769/2159241746'} 
      onDidFailToReceiveAdWithError={console.log(this.bannerError)} 
      servePersonalizedAds={true}/>;
      if(this.state.premium != 0){
        Add = <View></View>;
      }

    return (

      <View style={{
        height: '100%',
      }}>

        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} startDelta={WINDOW.height - 150} endDelta={WINDOW.height - 200} />

        {/* {Add} */}

        <SafeAreaView style={{ flexDirection: 'column' }}>

          <ScrollView>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, marginRight: 10 }}>
                <View style={{
                  flex: 1,
                  backgroundColor: 'white', borderColor: 'silver', borderWidth: 1, borderRadius: 10, marginRight: 20, marginLeft: 5
                }}>
                  <TouchableOpacity onPress={() => {
                    AsyncStorage.setItem('categoryId', '1').then(data => {
                      this.props.navigation.navigate('showCategory', { name: 'kuyr' });
                    });
                  }}>
                    <View>
                      <Image
                        source={require('../../../Image/salad.jpg')}
                        style={{
                          width: (WINDOW.width / 2) - 37,
                          height: (WINDOW.width / 2) - 37,
                          marginTop: 0,
                          marginLeft: 0,
                          borderRadius: 10,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          resizeMode: 'cover',

                        }}
                      />
                      <Text style={{ marginTop: 10, fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Салати</Text>
                    </View>
                  </TouchableOpacity>

                </View>
                <View style={{
                  flex: 1,
                  backgroundColor: 'white', borderColor: 'silver', borderWidth: 1, borderRadius: 10, marginRight: 20, marginLeft: 5
                }}>
                  <TouchableOpacity onPress={() => {
                    AsyncStorage.setItem('categoryId', '2').then(data => {
                      this.props.navigation.navigate('showCategory', { name: 'kuyr' });
                    });
                  }}>
                    <View>
                      <Image
                        source={require('../../../Image/supa.jpg')}
                        style={{
                          width: (WINDOW.width / 2) - 37,
                          height: (WINDOW.width / 2) - 37,
                          marginTop: 0,
                          marginLeft: 0,
                          borderRadius: 10,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          resizeMode: 'cover',

                        }}
                      />
                      <Text style={{ marginTop: 10, fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Супи</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, marginRight: 10 }}>
                <View style={{
                  flex: 1,
                  backgroundColor: 'white', borderColor: 'silver', borderWidth: 1, borderRadius: 10, marginRight: 20, marginLeft: 5
                }}>
                  <TouchableOpacity onPress={() => {
                    AsyncStorage.setItem('categoryId', '3').then(data => {
                      this.props.navigation.navigate('showCategory', { name: 'kuyr' });
                    });
                  }}>
                    <View>
                      <Image
                        source={require('../../../Image/predqstie.jpg')}
                        style={{
                          width: (WINDOW.width / 2) - 37,
                          height: (WINDOW.width / 2) - 37,
                          marginTop: 0,
                          marginLeft: 0,
                          borderRadius: 10,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          resizeMode: 'cover',

                        }}
                      />
                      <Text style={{ marginTop: 10, fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Предястия</Text>
                    </View>
                  </TouchableOpacity>

                </View>
                <View style={{
                  flex: 1,
                  backgroundColor: 'white', borderColor: 'silver', borderWidth: 1, borderRadius: 10, marginRight: 20, marginLeft: 5
                }}>
                  <TouchableOpacity onPress={() => {
                    AsyncStorage.setItem('categoryId', '4').then(data => {
                      this.props.navigation.navigate('showCategory', { name: 'kuyr' });
                    });
                  }}>
                    <View>
                      <Image
                        source={require('../../../Image/souse.jpg')}
                        style={{
                          width: (WINDOW.width / 2) - 37,
                          height: (WINDOW.width / 2) - 37,
                          marginTop: 0,
                          marginLeft: 0,
                          borderRadius: 10,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          resizeMode: 'cover',

                        }}
                      />
                      <Text style={{ marginTop: 10, fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Сосове</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, marginRight: 10 }}>
                <View style={{
                  flex: 1,
                  backgroundColor: 'white', borderColor: 'silver', borderWidth: 1, borderRadius: 10, marginRight: 20, marginLeft: 5
                }}>
                  <TouchableOpacity onPress={() => {
                    AsyncStorage.setItem('categoryId', '5').then(data => {
                      this.props.navigation.navigate('showCategory', { name: 'kuyr' });
                    });
                  }}>
                    <View>
                      <Image
                        source={require('../../../Image/meal.jpg')}
                        style={{
                          width: (WINDOW.width / 2) - 37,
                          height: (WINDOW.width / 2) - 37,
                          marginTop: 0,
                          marginLeft: 0,
                          borderRadius: 10,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          resizeMode: 'cover',

                        }}
                      />
                      <Text style={{ marginTop: 10, fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Ястия с месо</Text>
                    </View>
                  </TouchableOpacity>

                </View>
                <View style={{
                  flex: 1,
                  backgroundColor: 'white', borderColor: 'silver', borderWidth: 1, borderRadius: 10, marginRight: 20, marginLeft: 5
                }}>
                  <TouchableOpacity onPress={() => {
                    AsyncStorage.setItem('categoryId', '6').then(data => {
                      this.props.navigation.navigate('showCategory', { name: 'kuyr' });
                    });
                  }}>
                    <View>
                      <Image
                        source={require('../../../Image/vege.jpg')}
                        style={{
                          width: (WINDOW.width / 2) - 37,
                          height: (WINDOW.width / 2) - 37,
                          marginTop: 0,
                          marginLeft: 0,
                          borderRadius: 10,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          resizeMode: 'cover',

                        }}
                      />
                      <Text style={{ marginTop: 10, fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Ястия без месо</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 10, marginRight: 10 }}>
                <View style={{
                  flex: 1,
                  backgroundColor: 'white', borderColor: 'silver', borderWidth: 1, borderRadius: 10, marginRight: 20, marginLeft: 5
                }}>
                  <TouchableOpacity onPress={() => {
                    AsyncStorage.setItem('categoryId', '7').then(data => {
                      this.props.navigation.navigate('showCategory', { name: 'kuyr' });
                    });
                  }}>
                    <View>
                      <Image
                        source={require('../../../Image/bread.jpg')}
                        style={{
                          width: (WINDOW.width / 2) - 37,
                          height: (WINDOW.width / 2) - 37,
                          marginTop: 0,
                          marginLeft: 0,
                          borderRadius: 10,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          resizeMode: 'cover',

                        }}
                      />
                      <Text style={{ marginTop: 10, fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Тестени</Text>
                    </View>
                  </TouchableOpacity>

                </View>
                <View style={{
                  flex: 1,
                  backgroundColor: 'white', borderColor: 'silver', borderWidth: 1, borderRadius: 10, marginRight: 20, marginLeft: 5
                }}>
                  <TouchableOpacity onPress={() => {
                    AsyncStorage.setItem('categoryId', '8').then(data => {
                      this.props.navigation.navigate('showCategory', { name: 'kuyr' });
                    });
                  }}>
                    <View>
                      <Image
                        source={require('../../../Image/dessert.jpg')}
                        style={{
                          width: (WINDOW.width / 2) - 37,
                          height: (WINDOW.width / 2) - 37,
                          marginTop: 0,
                          marginLeft: 0,
                          borderRadius: 10,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          resizeMode: 'cover',

                        }}
                      />
                      <Text style={{ marginTop: 10, fontSize: 16, textAlign: 'center', marginBottom: 10 }}>Десерти</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
              
              
              

            </View>



          </ScrollView>


        </SafeAreaView>

      </View >)
    // }
  }
}
export default searchRecipe;
