

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
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Image,
    ScrollView,
} from "react-native";
import { BackHandler } from 'react-native';
import {
    AdMobBanner,
    AdMobInterstitial,
  } from 'expo-ads-admob';
class showPublicRecipes extends React.Component {

    state = {
        externalData: null,
        premium:0,

    }


    async componentDidMount() {
        const { navigation } = this.props;

        this.focusListener = navigation.addListener('didFocus', async () => {
            let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
            let arrRoute = [];
      
            if (route === null) {
              arrRoute.push('showPublicRecipes')
            } else {
              arrRoute = route
            }
            if (arrRoute[arrRoute - 1] != 'showPublicRecipes') {
              arrRoute.push('showPublicRecipes')
            }    
            AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

                         // await this.fetchDataShoppingLists();
            await this.fetchData();
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



    constructor(props) {
        super(props);
        this.didFocus = props.navigation.addListener("didFocus", (payload) =>
        BackHandler.addEventListener("hardwareBackPress",async () => {
          let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
          let lastRoute = route.pop();
          if(lastRoute != 'showPublicRecipes'){
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

    async addTocoockBook() {
        let DEMO_TOKEN2 = await AsyncStorage.getItem('recipeId');

    
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
        fetch("http://167.172.110.234/api/transferRecipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            //Header Defination
            'Authorization': 'Bearer ' + DEMO_TOKEN
          },
          body: JSON.stringify({
            recipe_id: DEMO_TOKEN2,
          }),
        }).then(response => response.json())
          .then(data => {
              if(data.response == 'ok'){
                this.dropDownAlertRef.alertWithType('success', '', "Рецептата е добавена в вашана готварска книга", {}, 2000);

              }else{
                this.dropDownAlertRef.alertWithType('error', '', "Рецептата вече съществува във вашана готварска книга", {}, 2000);

              }
            console.log(data.response);
            if (data.login && data.login == true) {
              AsyncStorage.clear();
              this.props.navigation.navigate('Auth');
            }
    
            if (data.new_token) {
              AsyncStorage.setItem('access_token', data.new_token);
    
              delete data.new_token;
              delete data['new_token'];
    
            }

          }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
          }).done();
      }
    
    async fetchData() {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
        let DEMO_TOKEN2 = await AsyncStorage.getItem('recipeId');
        fetch("http://167.172.110.234/api/showRecipe?id=" + DEMO_TOKEN2, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + DEMO_TOKEN
            }
        }).then(response => response.json())
            .then(data => {
                console.log(data);
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
                if (data.response !== '') {
                    console.log(data);
                    this.setState({ externalData: data });
                } else {
                    this.props.navigation.navigate('ListRecipes', { name: 'kuyr' });


                }
            }).catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                throw error;
            }).done();
    }


    render(props) {

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
            adUnitID={'ca-app-pub-5428132222163769/6112419882'} 
              onDidFailToReceiveAdWithError={console.log(this.bannerError)} 
              servePersonalizedAds={true}/>;
              if(this.state.premium != 0){
                Add = <View></View>;
              }
      
            const renderItemProducts = () => {
                let finnal = [];
                let data = this.state.externalData.recipe_products;
                Object.keys(data).map((key, index) => {
                    let hint = '';
                    if(data[index].hint != null && data[index].hint  != '' ) {
                        hint = "("+data[index].hint+")"
                    }
                    finnal.push(
                        <Text style={{
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
                            height: 45,
                            marginTop: 10,
                            paddingTop: 10,
                            elevation: 6,
                            backgroundColor: '#ffffff',
                            paddingLeft: 10
                        }}>{data[index].productName}: {hint} {data[index].volume}{data[index].unitsName}</Text>
                    )
                })
                return finnal;


            };

            const renderItemSteps = () => {
                let finnal = [];
                let data = this.state.externalData.recipe_steps;
                Object.keys(data).map((key, index) => {
                    console.log(data[key]);

                    if (data[key] !== undefined) {
                        finnal.push(
                            <Text style={{
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
                                marginTop: 10,
                                paddingTop: 10,
                                elevation: 6,
                                backgroundColor: '#ffffff',
                                paddingLeft: 10
                            }}><Text style={{ fontWeight: 'bold' }}>{data[key].stepId}. </Text>{data[key].step}</Text>
                        )
                    }
                })
                return finnal;


            };
            let photo = '';
            if(this.state.externalData.recipe.photo != null){
              photo =  <Image source={{ uri: 'https://kulinarcho.s3.eu-central-1.amazonaws.com/recipes/' + this.state.externalData.recipe.photo+'?time'+(new Date()).getTime() }} resizeMethod={'auto'} style={{  flex: 1,
                aspectRatio:0.9,width:'96%', 
                resizeMode: 'contain', borderRadius: 15,  paddingBottom: 0,  }} />
            }else{
                photo =<Image
                source={require('../../../Image/rsz_plate.png')}
                resizeMethod={'resize'} style={{  flex: 1,
                width:'96%', height:300,
                borderRadius: 15,  paddingBottom: 0,  }} />
                if (this.state.externalData.recipe.categories == 1) {
                    photo =<Image
                    source={require('../../../Image/salad.jpg')}
                    resizeMethod={'resize'} 
                    style={{  flex: 1,
                        width:'96%', height:300, borderRadius: 15,  paddingBottom: 0,  }} />
                
                }
                if (this.state.externalData.recipe.categories == 2) {
                    photo =<Image
                    source={require('../../../Image/supa.jpg')}
                    resizeMethod={'resize'} style={{  flex: 1,
                        width:'96%', height:300, borderRadius: 15,  paddingBottom: 0,  }} />          
                }
                if (this.state.externalData.recipe.categories == 3) {
                    photo =<Image
                    source={require('../../../Image/predqstie.jpg')}
                    resizeMethod={'resize'} style={{  flex: 1,
                        width:'96%', height:300, borderRadius: 15,  paddingBottom: 0,  }} />
                }
                if (this.state.externalData.recipe.categories == 4) {
                    photo =<Image
                    source={require('../../../Image/souse.jpg')}
                    resizeMethod={'resize'} style={{  flex: 1,
                        width:'96%', height:300, borderRadius: 15,  paddingBottom: 0,  }} />
                }
                if (this.state.externalData.recipe.categories == 5) {
                    photo =<Image
                    source={require('../../../Image/meal.jpg')}
                    resizeMethod={'resize'} style={{  flex: 1,
                        width:'96%', height:300, borderRadius: 15,  paddingBottom: 0,  }} />
                }
                if (this.state.externalData.recipe.categories == 6) {

                    photo =<Image
                    source={require('../../../Image/vege.jpg')}
                    resizeMethod={'resize'} style={{  flex: 1,
                    aspectRatio:0.9,width:'96%', 
                    resizeMode: 'contain', borderRadius: 15,  paddingBottom: 0,  }} />

                }
                if (this.state.externalData.recipe.categories == 7) {
                    photo =<Image
                    source={require('../../../Image/bread.jpg')}
                    resizeMethod={'resize'} style={{  flex: 1,
                        width:'96%', height:300, borderRadius: 15,  paddingBottom: 0,  }} />
                }
                if (this.state.externalData.recipe.categories == 8) {
                    photo =<Image
                    source={require('../../../Image/dessert.jpg')}
                    resizeMethod={'resize'} style={{  flex: 1,
                        width:'96%', height:300, borderRadius: 15,  paddingBottom: 0,  }} />
                }


      }
            
            return (

                <View style={styles.MainContainer}>
                                            <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />

                    <TouchableOpacity
                        style={{ paddingBottom: 5, marginRight: 10, marginBottom: 10, marginTop: 5, borderBottomWidth: 1, alignSelf: 'flex-end',
                         height: 25, width: 200, flexDirection: 'row' }}
                        onPress={() => {
                            this.addTocoockBook();
                        }

                        }
                    >
                        <Text>Добави в готварска книга

                        </Text>
                    </TouchableOpacity>
                    

                    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }} >
                        <Text style={{
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
                            height: 45,
                            alignItems: 'center',
                            textAlign: 'center',
                            marginTop: 10,
                            elevation: 6,
                            backgroundColor: '#ffffff',
                            paddingLeft: 10
                        }}>{this.state.externalData.recipe.title} </Text>

                        <View style={{
                            borderRadius: 15,
                            marginLeft: 19, marginRight: 9,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 7,
                            },
                            shadowOpacity: 0.41,
                            shadowRadius: 9.11,
                            paddingBottom: 10,
                            elevation: 6,
                            backgroundColor:'white',
                            height:400, paddingLeft:10
                        }}>
                           {photo}

                        </View>

                        <Text style={{
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
                            height: 45,
                            paddingTop: 10,
                            marginTop: 10,
                            elevation: 6,
                            backgroundColor: '#ffffff',
                            paddingLeft: 10
                        }}>Порции: {this.state.externalData.recipe.portion} </Text>
                        <View style={{
                            flexDirection: 'column',
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
                            height: 80,
                            paddingTop: 10,
                            marginTop: 10,
                            elevation: 6,
                            backgroundColor: '#ffffff',
                            paddingLeft: 10
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 4, fontSize: 16 }}>Приготовления</Text>
                                <Text style={{ flex: 3, fontSize: 16 }}>Готвене</Text>
                                <Text style={{ flex: 3, fontSize: 16 }}>Общо</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ flex: 4 }}>{this.state.externalData.recipe.prep_time}м.</Text>
                                <Text style={{ flex: 3 }}>{this.state.externalData.recipe.cook_time}м.</Text>
                                <Text style={{ flex: 3 }}>{this.state.externalData.recipe.all_time}м.</Text>
                            </View>
                        </View>
                        <Text style={{
                            flex: 3, fontWeight: 'bold', paddingTop: 20, width: '90%', paddingLeft: 10, fontSize: 16, borderBottomColor: 'silver',
                            borderBottomWidth: 1, marginBottom: 15
                        }}>Продукти: </Text>
                        {renderItemProducts()}



                        <View style={{ flex: 1, }}>
                            <Text style={{ flex: 3, fontWeight: 'bold', paddingTop: 20, width: '90%', paddingLeft: 10, fontSize: 16, borderBottomColor: 'silver', borderBottomWidth: 1, marginBottom: 15 }}>Стъпки: </Text>
                        </View>
                        <View style={{ marginBottom: 15, }}>
                            {renderItemSteps()}


                        </View>
                        
                    </ScrollView>

                </View>
            );
        }
    }
};
export default showPublicRecipes;
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

        width: '100%',
        height: '50%'
    },
    container: {
        width: '100%',
        marginTop: 20,
        flex: 1,
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
});