

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { BackHandler } from 'react-native';

import {
    StyleSheet,
    View,ActivityIndicator,
    Text,
    ScrollView,
    Dimensions} from "react-native";
    import {
        AdMobBanner,
        AdMobInterstitial,
      } from 'expo-ads-admob';
class weekMenuArchiveDetailed extends React.Component {

    state = {
        externalData: null,
        premium:0,

    }


    async componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', async () => {
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


    async archiveShoppingList(id) {


        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

        await fetch('https://kulinarcho.com/api/deleteArchiveWeekMenu', {
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

                this.setState({ externalData: '' });

                this.fetchData();
            }
        ).catch(function (error) {
            
            // ADD THIS THROW error
            throw error;
        });
    }
    constructor(props) {
        super(props);
        this.didFocus = props.navigation.addListener("didFocus", (payload) =>
        BackHandler.addEventListener("hardwareBackPress",async () => {
          let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
          let lastRoute = route.pop();
          if(lastRoute != 'weekMenuArchiveDetailed'){
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

    async fetchData() {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
        var DEMO_TOKEN2 = await AsyncStorage.getItem('ArchiveWeekMenuID');

        fetch("https://kulinarcho.com/api/getArchiveWeekMenu?id=" + DEMO_TOKEN2, {
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
                this.setState({ externalData: data });

            }).catch(function (error) {
                
                // ADD THIS THROW error
                throw error;
            }).done();
    }
    showRecipe(id) {
        AsyncStorage.setItem('recipeId', id.toString()).then(data => {
            this.props.navigation.navigate('ShowRecipe', { name: 'kuyr' });


        });
    }
    render(props) {
        const renderItem = () => {
            let finnal = [];
            let data = this.state.externalData;
            let { width } = Dimensions.get('window');

            Object.keys(data).map((key, index) => {

                if (data[key]) {
                    finnal.push(
                        <View>

                                <View
                                    elevation={5}
                                    style={{
                                        borderLeftWidth: 4, borderLeftColor: '#689F38',
                                        // borderBottomWidth:4, borderBottomColor:'#689F38',

                                        shadowColor: '#000000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowRadius: 3,
                                        shadowOpacity: 0.5,
                                        width: width - 30,
                                        marginLeft: 15,
                                        marginTop: 20,
                                        alignItems: 'center',
                                        backgroundColor: '#ffffff',
                                        borderRadius: 6,
                                    }}>
                                    <View style={{ flex: 1, flexDirection: 'column', width: '100%' }}>
                                        <View style={{
                                            flex: 1, flexDirection: 'row', width: '100%', borderBottomWidth: 1,
                                            borderBottomColor: 'silver',
                                        }}>
                                            <View>
                                                <Text
                                                    style={{
                                                        marginLeft: 10,
                                                        flex: 1,
                                                        fontSize: 19,
                                                        fontWeight: '200',
                                                        // fontFamily: 'sans-serif',
                                                        marginBottom: 4,
                                                    }}>
                                                    {data[key].title}
                                                </Text>
                                            </View>
                                           
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            {renderProducts(data[key].recipes)}




                                            {/* </TouchableOpacity> */}

                                        </View>

                                    </View>
                                </View>
                        </View >

                        // <View style={styles.container}>

                        //     <Card style={{ flex: 1, marginLeft: 0, marginRight: 0 }}>
                        //         <View style={{ flex: 1, flexDirection: "row", borderBottomColor: 'silver', borderBottomWidth: 1 }}>
                        //             <Text style={{ flex: 1, marginTop: 10 }}>{data[key].title} </Text>
                        //         </View>

                        //     </Card>

                        // </View>
                    )
                }

            })
            return finnal;


        };

        const renderProducts = (data) => {
            let finnal = [];

            Object.keys(data).map((key, index) => {
                finnal.push(
                        <Text style={{ flex: 1, marginTop: 5,marginBottom:5, marginLeft:10, fontSize:16 }}>{data[index].title} </Text>
                )

            })
            return finnal;


        };
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
      
            return (

                <View style={styles.MainContainer}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }} >
                        {renderItem()}

                    </ScrollView>
                </View>
            );
        }
    }
};
export default weekMenuArchiveDetailed;
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
        marginBottom: 60,

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