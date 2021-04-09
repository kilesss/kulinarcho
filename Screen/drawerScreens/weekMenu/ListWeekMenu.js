

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
    Alert,
    Dimensions,
    TouchableOpacity,
    View,
    Text,
    ScrollView,
} from "react-native";
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';

class ListWeekMenu extends React.Component {

    state = {
        externalData: null,
    }


    async componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', async () => {
            let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
            let arrRoute = [];
      
            if (route === null) {
              arrRoute.push('ListWeekMenu')
            } else {
              arrRoute = route
            }
            if (arrRoute[arrRoute - 1] != 'ListWeekMenu') {
              arrRoute.push('ListWeekMenu')
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


    async archiveShoppingList(id) {


        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
        await fetch('http://167.172.110.234/api/archiveWeekMenu', {
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
            console.log('There has been a problem with your fetchaaaaaaaaaaaaaaa operation: ' + error.message);
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
          if(lastRoute != 'ListWeekMenu'){
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

    async fetchData() {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

        fetch("http://167.172.110.234/api/weekMenu", {
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

            }).catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                throw error;
            }).done();
    }
    showRecipe(id) {
        AsyncStorage.setItem('weekMenuID', id.toString()).then(data => {
            this.props.navigation.navigate('AddWeekMenu', { name: 'kuyr' });

        });
    }
    render(props) {
        const renderItem = () => {
            let finnal = [];
            let data = this.state.externalData;
            let { width } = Dimensions.get('window');

            Object.keys(data).map((key, index) => {

                finnal.push(

                    <View>
                        <TouchableOpacity key={data[index].id} style={{}} onPress={() => this.showRecipe(data[index].id)}>

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
                                            {data[index].title}
                                        </Text>
                                        </View>
                                        <View style={{ marginRight:10, marginLeft:10}}>
                                        <Icon style={styles.icon}
                                            size={25}
                                            color={'silver'}
                                            onPress={() => {
                                                Alert.alert(
                                                    'Изтиване ' + data[index].title,
                                                    'Сигурни ли сте че искате да изтриете менюто ' + data[index].title + '? Това действие е перманентно! ',
                                                    [
                                                        {
                                                            text: 'Отказ',
                                                            onPress: () => {
                                                                return null;
                                                            },
                                                        },
                                                        {
                                                            text: 'Потвърди',
                                                            onPress: () => {
                                                                console.log(data[index].id);
                                                                this.archiveShoppingList(data[index].id);
                                                            },
                                                        },
                                                    ],
                                                    { cancelable: false }
                                                );
                                            }}
                                            type='font-awesome-5'

                                            name='trash-alt'

                                        >Редактирай</Icon>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Text style={{
                                            width: '100%',
                                            // flex: 1,
                                            fontSize: 16,
                                            fontWeight: '200',
                                            // fontFamily: 'sans-serif',
                                            marginBottom: 4,
                                            color: '#808080',
                                            marginLeft:10

                                        }}>Начална дата: {data[index].beginDate} </Text>
                                        <Text style={{
                                            width: '100%',
                                            // flex: 1,
                                            fontSize: 16,
                                            fontWeight: '200',
                                            // fontFamily: 'sans-serif',
                                            marginBottom: 4,
                                            color: '#808080',
                        
                                            marginLeft:10

                                        }}>Крайна дата: {data[index].endDate} </Text>



                                        {/* </TouchableOpacity> */}

                                    </View>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </View >

                )
            })
            return finnal;


        };
        if (this.state.externalData === null) {
            return (
                <View style={styles.MainContainer}>
                    <View style={styles.topView}>
                        <Text>Loading....</Text>
                    </View>
                </View>
            )
        } else {
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
export default ListWeekMenu;
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
        marginRight:10,
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