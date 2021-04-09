

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'
import ImageModal from 'react-native-image-modal';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Text, TouchableHighlight,
} from "react-native";
import { BackHandler } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';

class UserProfile extends React.Component {

    state = {
        externalData: null,
        description: '',
        username: '',
        profilePicture: '',
        promocode: '',
        role: '',
        youtube: '',
        premium:0,
    }

    constructor(props) {
        super(props);
        this.didFocus = props.navigation.addListener("didFocus", (payload) =>
        BackHandler.addEventListener("hardwareBackPress",async () => {
          let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
          let lastRoute = route.pop();
          if(lastRoute != 'UserProfile'){
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

    async componentDidMount() {
        const { navigation } = this.props;
      
        this.focusListener = navigation.addListener('didFocus', async () => {
            let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
            let arrRoute = [];
      
            if (route === null) {
              arrRoute.push('UserProfile')
            } else {
              arrRoute = route
            }
            if (arrRoute[arrRoute - 1] != 'UserProfile') {
              arrRoute.push('UserProfile')
            }  
            AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

                    // await this.fetchDataShoppingLists();
            this.setState({ externalData: null });
            this.setState({ description: '' });
            this.setState({ username: '' });
            this.setState({ profilePicture: '' });
            this.setState({ promocode: '' });
            this.setState({ role: '' });
            this.setState({ youtube: '' });
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




    async fetchData() {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
        var userId = await AsyncStorage.getItem('userId');
        fetch("http://167.172.110.234/api/getPublicProfile/" + userId, {
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
                this.setState({ description: data.user.description });
                this.setState({ username: data.user.name });
                this.setState({ profilePicture: data.user.profilePicture });
                this.setState({ promocode: data.user.promocode });
                this.setState({ role: data.user.role });
                this.setState({ youtube: data.user.youtube });
                let newData = [];


                Object.keys(data.recipe).map((key, index) => {
                    newData.push(data.recipe[key]);
                })
                this.setState({ externalData: newData });
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

            let profileBtn = [];

            const Card = ({ item }) => {
                let photo = '';
                if (item.photo != null) {
                    photo = <ImageModal
                        borderRadius={80}
                        resizeMode="cover"
                        imageBackgroundColor="#fff"
                        source={{ uri: "https://kulinarcho.s3.eu-central-1.amazonaws.com/recipes/" + item.photo + '?time' + (new Date()).getTime() }}
                        style={{
                            marginLeft: 10, marginBottom: 10,
                            marginTop: 15,
                            width: 80,
                            height: 80,
                            alignSelf: 'center',
                        }}
                    />
                } else {
                    photo = <ImageModal
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
                }
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
                                width: '93%',
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
                                    {photo}
                                    <View style={{
                                        width: '100%',
                                        paddingLeft: 9,
                                        flex: 2,
                                        flexDirection: 'column',

                                    }} >
                                        <Text style={{
                                            alignItems: 'flex-end', color: 'green',
                                        }}>
                                            {item.cat}                    </Text>
                                        <View
                                            style={{
                                                width: '100%',
                                                // flex: 1,

                                                height: 80,

                                            }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{

                                                    height: 35,
                                                    fontSize: 14,
                                                    fontWeight: '200',
                                                    // fontFamily: 'sans-serif',
                                                    marginBottom: 4,
                                                    color: '#808080',
                                                }}>{item.description}</Text>
                                            </View>

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
                                                <Text style={{ marginRight: 10 }}>Време за приготвяне: </Text>
                                                <Text style={{
                                                    fontSize: 16,
                                                    fontWeight: '200',
                                                    // fontFamily: 'sans-serif',
                                                    marginBottom: 4,
                                                    color: '#808080',
                                                }}>{item.all_time}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                )
            }

            profileBtn.push(<View><Text style={{ backgroundColor: 'white', color: '#77d169' }} >Follow</Text></View>)
            let promocodeText = <Text></Text>
            let youtubeText = <Text></Text>
            let ImageText = ''
            let descriptionText = ''
            if (this.state.promocode != null) {
                promocodeText = <View><Text>Промокод:</Text><Text style={{ color: 'green', fontSize: 18 }}>{this.state.promocode}</Text></View>
            }
            if (this.state.youtube != null) {
                youtubeText = <View><Icon style={{}} type='font-awesome-5' size={50}
                    name='youtube'
                    color={'red'}
                /></View>
            }
            if (this.state.profilePicture != null) {
                ImageText = <ImageModal
                    borderRadius={120}
                    resizeMode="cover"
                    imageBackgroundColor="#689F38"
                    source={{ uri: "https://kulinarcho.s3.eu-central-1.amazonaws.com/profile/" + this.state.profilePicture + '?time' + (new Date()).getTime() }}
                    style={{
                        width: 120, marginTop: 10, marginLeft: 10, marginTop: 30, height: 120,
                        alignSelf: 'center',
                    }}
                />
            } else {
                ImageText = <ImageModal
                    borderTopLeftRadius={120}
                    resizeMode="cover"
                    imageBackgroundColor="#689F38"
                    source={require('../../../Image/circle-profile.png')}
                    style={{
                        width: 120, marginTop: 10, marginLeft: 10, marginTop: 30, height: 120,
                        alignSelf: 'center', borderRadius: 150
                    }}
                />

            }

            if (this.state.description != null) {
                descriptionText = this.state.description.substring(0, 200);
            }

            return (
                <View>
                    <View style={{}}>
                        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />

                        <View style={{ flexDirection: 'row', backgroundColor: '#689F38', height: 180 }}>
                            <View style={{ flex: 2, borderRadius: 60 }}>
                                {ImageText}
                            </View>
                            <View style={{ flexDirection: 'column', flex: 3 }}>
                                <View style={{ flex: 1, marginBottom: 0 }}>
                                    <Text style={{ flex: 1, fontSize: 22, marginTop: 5, color: 'white', margin: 0, padding: 0 }}>{this.state.username}</Text>
                                </View>
                                <View style={{ flex: 2, marginBottom: 0, padding: 0 }}>

                                    <Text style={{ flex: 1 }}>{descriptionText}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#e6e6e6', alignItems: 'center', flexDirection: 'row', paddingLeft: 10, paddingBottom: 10 }}>
                            <View style={{ flex: 2, height: 55 }}>
                                <TouchableOpacity
                                    onPress={() => {

                                        this.dropDownAlertRef.alertWithType('success', 'Преминахте на личен профил', 'Вече може да управлявате нещата който са лично ваши', {}, 2000);

                                    }}
                                    style={{
                                        flex: 1, backgroundColor: 'white', marginTop: 20, borderColor: '#77d169', borderWidth: 2, height: 40,
                                        alignItems: 'center', paddingTop: 8, borderRadius: 16, marginRight: 20
                                    }}>
                                    {profileBtn}
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, marginRight: 15 }}>
                                {youtubeText}
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                {promocodeText}
                            </View>

                        </View>

                        <View style={{ paddingTop: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>

                                <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                                    this.submitAddType();

                                }} underlayColor="white">
                                    <View >


                                    </View>
                                </TouchableHighlight>
                            </View>
                            <FlatList
                                contentContainerStyle={{ paddingBottom: 220 }}

                                data={this.state.externalData}
                                renderItem={data => {

                                    return (
                                        <Card item={data.item} />

                                    );
                                }}
                                keyExtractor={item => item.id}
                            />

                        </View>
                    </View>

                </View>
            );
        }
    }
}

export default UserProfile;
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
        marginTop: 40,
        flex: 1,
    },
    inputRow: {
        borderBottomWidth: 1,
        marginBottom: 10,
        marginLeft: 5,
        marginTop: 15,
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
        paddingTop: 5,
        paddingLeft: 10
    },
    customBtnBGTopActive: {
        backgroundColor: "#fff",
        alignSelf: 'stretch',
        flex: 1,
        paddingTop: 10,

        paddingLeft: 10


    },
    customBtnText: {
        paddingLeft: 10,
        paddingRight: 5,


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
});