

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import {
    StyleSheet,
    View,ActivityIndicator,
    Text,
    TextInput,Alert,
    TouchableHighlight
} from "react-native";
import { Icon } from 'react-native-elements'
import { ScrollView } from 'react-native';
import { BackHandler } from 'react-native';
import {
    AdMobBanner,
    AdMobInterstitial,
  } from 'expo-ads-admob';
class GenerateShoppingList extends React.Component {

    constructor(props) {
        super(props);
        this.didFocus = props.navigation.addListener("didFocus", (payload) =>
        BackHandler.addEventListener("hardwareBackPress",async () => {
          let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
          let lastRoute = route.pop();
          if(lastRoute != 'GenerateShoppingList'){
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
        externalData: null,
        count:0,
        filledProducts:[],
        alertFields:0,
        title:'',
        premium:0,

    };

    async fetchData() {
        var DEMO_TOKEN2 = await AsyncStorage.getItem('productsGenerate');
       

        // this.setState({filledProducts:ar2});

        this.setState({ externalData: JSON.parse(DEMO_TOKEN2) })
        
        this.setState({title:this.state.externalData.title})
        let t = JSON.parse(DEMO_TOKEN2);
        let arr = {}
        Object.keys(t.products).map((keyche, index) => {
            arr[keyche] = 0;
        })
        this.setState({filledProducts:arr});



    }





    async componentDidMount() {
        const { navigation } = this.props;

        this.focusListener = navigation.addListener('didFocus', async () => {
            this.setState({externalData: null}),
            this.setState({count:0}),
            this.setState({filledProducts:[]}),
            this.setState({alertFields:0}),
            this.setState({title:''}),
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
    fillPRoductAmount(amount, id){
        let ar2 = {};
  
        let arr = this.state.filledProducts;
        Object.keys(arr).map((keyche, index) => {
          ar2[keyche] = arr[keyche];
        })    
        ar2[id.key] = amount;
        this.state.filledProducts = ar2;
        
    // this.setState({filledProducts:ar2});

    }
  async  generateList(){
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch(global.MyVar+'checkPremium', {
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
        
        if (data.response == 'ok' || data.response < 2) {
            await fetch(global.MyVar+'generateShoppingList', {
                method: 'POST',
                body: JSON.stringify({
                    title:this.state.title,
                    products: this.state.filledProducts,
                    filledProducts: this.state.externalData
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
                      this.dropDownAlertRef.alertWithType('error', '', data.errors[key],{},1000);
          
                    })
          
                    
                  }else{
                    this.props.navigation.navigate('ShoppingLists');
                    
                  }
          
          
                }
                
              ).catch(function (error) {
                
                
                // ADD THIS THROW error
                throw error;
              });
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
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
            
          
        // if(Object.keys(myObject).length)
    }
    deleteProduct(id){
        delete(this.state.externalData.products[id]);
        delete(this.state.filledProducts[id]);
        this.setState({ state: this.state });
    }
    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    render(props) {
        if (this.state.externalData === null) {
            return (
                <View style={styles.MainContainer}>
                   <ActivityIndicator size="large" color="#7DE24E" /> 
                </View>
            )
        } else {

            
            let Add =  <AdMobBanner
            bannerSize="smartBannerLandscape" 
            adUnitID={'ca-app-pub-5428132222163769/6112419882'} 
               
              servePersonalizedAds={true}/>;
              if(this.state.premium != 0){
                Add = <View></View>;
              }
      
            const Card = ({ item }) => {
                let data = this.state.externalData;

                let renderHtml = [];
                Object.keys(data.products).map((key, index) => {
                    let units = [];
                    let settedValued = '';
                    let inputBorder = "silver"
                    if( this.state.alertFields === 1 && this.state.filledProducts[key] === undefined){
                        inputBorder = "red";
                    }
                    if(this.state.filledProducts[key] !== undefined) {
                        settedValued = this.state.filledProducts[key];
                    }

                    Object.keys(data.products[key].unitsRecipes).map((ukey, uindex) => {
                        units.push(
                            <Text style={{marginRight:3, flex: 1}}>{data.products[key].unitsRecipes[ukey].volume}    
                                                     <Text style={{fontStyle: 'italic',paddingLeft: 5}}>{data.products[key].unitsRecipes[ukey].name}</Text></Text>
                        )
                        units.push(
                            <Text style={{marginRight:3, flex: 1}}>{data.products[key].unitsRecipes[ukey].volume}    
                                                     <Text style={{fontStyle: 'italic',paddingLeft: 5}}>{data.products[key].unitsRecipes[ukey].name}</Text></Text>
                        )
                                        
                })
                  
                    renderHtml.push(<View style={{
                        marginRight: 9,

    
                        marginBottom: 15,
                        flexDirection: 'column',
                        flex: 1,
                        width: '95%',
                        marginRight: 10,
                        marginLeft: 15,
                            // borderBottomWidth:4, borderBottomColor:'#689F38',
            
                            shadowColor: '#000000',
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                            shadowRadius: 3,
                            shadowOpacity: 0.5,
                            marginLeft: 15,
                            borderBottomWidth:5,
                            borderRightWidth:5,
                            borderBottomColor:'silver', 
                            borderRightColor:'silver',
                            alignItems: 'center',
                            backgroundColor: '#ffffff',
                            borderRadius: 15,
                        
                    }}>
                        <View style={{
                            maxHeight: 30,
                            flex: 1,
                            marginBottom: 0,
                            paddingBottom: 0,
                            flexDirection: 'row',
                            marginTop:10
                            
                        }}>
                            <Text style={{ flex: 5,fontWeight: 'bold',
                        fontSize: 22,textAlign: 'center', }}>{data.products[key].name}</Text>
                            <View style={{flex: 1, }}>
                            <Icon
                      color={'silver'}
                      
                      type='ionicon'
                      name='trash-outline'
                      onPress={() => {
                        this.deleteProduct(key)
                      }
                      }
                      size={25}
                      style={{fontSize: 18, textAlign: 'center',marginRight:10,}} ></Icon>
                        </View>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: "column",
                        }}>
                            <View style={{flexDirection:'row', flex: 1, width: '100%'}}>
    
                                <TextInput 
                                onChangeText={UserEmail => this.fillPRoductAmount(UserEmail, {key})}

                               
                                blurOnSubmit={false} 
                                autoFocus={false} 
                                autoCorrect={false} 
                                autoCapitalize="none" 
                                style={{
                                    flex: 1,
                                    borderRadius: 15,
                                    marginLeft: 5, marginRight: 5,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 7,
                                    },
                                    shadowOpacity: 0.41,
                                    shadowRadius: 9.11,
                                    borderWidth:1,
                                    borderColor:inputBorder,
    
                                    marginTop:10,
                                    backgroundColor: {inputBorder},
                                    height: 40, paddingLeft: 10,
                                    marginBottom: 10,
    
                                }} 
                                placeholder = {'Количество'}
                                ></TextInput>
                            </View>
                        </View>
                            <View style={{ flex: 1  }}>
                                <Text style={{fontSize:12}}>Сбор на продуктите от рецептите в седмичното меню</Text>
                                <View style={{flexDirection:'row', marginBottom: 10}}>
                                {units}
                                </View>
                            </View>
                            
                    </View>)

        })
        return renderHtml;
    }

        return (
            <View style={styles.MainContainer}>
                <ScrollView style={{  width: '100%',
        marginTop: 40,
        flex: 1,}}>
            <Card></Card>
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 5, marginBottom:10 }}>
        
        <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
this.generateList()        }} underlayColor="white"
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
                color={'green'}
                onPress={() => {

                  this.generateList()

                }

                }
                type='ionicon'
                backgroundColor='silver'
                name='reader-outline'
              ></Icon>

            </View>
            <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
              <Text style={{ flex: 3, marginTop: 5, marginLeft:5 , marginTop:10}}>Генерирай списък</Text>
            </View>
          </View>
        </TouchableHighlight>

      </View>
                
                </ScrollView>
            </View>
        );
        }
    }
};
export default GenerateShoppingList;

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    titleText: {
        padding: 8,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    headingText: {
        padding: 8,
    },
});
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
        width: 200
    },
    inputRow: {
        borderBottomWidth: 1,
        marginBottom: 10,
        marginLeft: 5,
        marginTop: 15,
        width: '45%'
    },
    inputRow2: {
        borderBottomWidth: 1,
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,

        marginTop: 15,
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
        backgroundColor: '#ffffff',
        marginVertical: 3,
        borderBottomWidth: 1,
        flex: 3,
        flexDirection: 'row',
        paddingTop: 2,
        paddingBottom: 2,
        height: 50
    },
    title: {
        paddingLeft: 9,
        fontSize: 16,
        flex: 1
    },
    icon: {
        height: 30,
        width: 30,
        flex: 1
    },
    container: {
        flex: 1,
        alignSelf: 'stretch',

    },

});