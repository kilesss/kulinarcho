

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import DropdownAlert from 'react-native-dropdownalert';
import { Icon } from 'react-native-elements'
import jwt_decode from "jwt-decode";
import { BackHandler } from 'react-native';

import {
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
    View,
    Image,
    Text, TouchableHighlight,
    TextInput,
} from "react-native";

class ShowProfile extends React.Component {


    state = {
        externalData: null,
        typeDisplay: 0,
        repPass: '',
        newPass: '',
        pass: '',
        name: '',
        expire: '',
        expire_date: '',
        requestJoinEmail: '',
        activeProfile: 0,
        activeGroupProfile: 0,
        requests: [],
        groupUsers: [],
        typeProfile: '',
        master: 0,
        pageView: 1,
        externalDataFollowers: null,
        username: '',
        premium: 0,
        groupUser:0,
        group: 0,
        userId: 0,

    }
    constructor(props) {
        super(props);
        this.didFocus = props.navigation.addListener("didFocus", (payload) =>
            BackHandler.addEventListener("hardwareBackPress", async () => {
                let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
                let lastRoute = route.pop();
                if (lastRoute != 'ShowProfile') {
                    route.push(lastRoute);
                }
                let goRoute = route.pop();
                console.log(goRoute);
                console.log(route);
                AsyncStorage.setItem('backRoute', JSON.stringify(route));
                this.props.navigation.navigate(goRoute);
            })
        );

    }
    async componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', async () => {
            let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
            let arrRoute = [];

            if (route === null) {
                arrRoute.push('ShowProfile')
            } else {
                arrRoute = route
            }
            if (arrRoute[arrRoute - 1] != 'ShowProfile') {
                arrRoute.push('ShowProfile')
            }
            AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

            // await this.fetchDataShoppingLists();
            await this.fetchData();
            await this.fetchFollowers();
            await this.checkPremium();

        });
    }
    async checkPremium() {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
        var decoded = jwt_decode(DEMO_TOKEN);
        console.log(decoded);
        if (decoded.userid != decoded.oldId) {
            this.setState({ groupUser: 1 })
        } else {
            this.setState({ groupUser: 0 })

        }

        this.setState({ userId: decoded.oldId })
        this.setState({ premium: decoded.premium })

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

        fetch("http://167.172.110.234/api/profile", {
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
                if (data.group === 1) {
                    this.setState({ activeGroupProfile: 1 })
                    this.setState({ activeProfile: 0 });
                } else {
                    this.setState({ activeGroupProfile: 0 })
                    this.setState({ activeProfile: 1 });
                }

                this.setState({ master: data.master });
                this.setState({ requests: data.requests });
                this.setState({ groupUsers: data.groupUsers });

                this.setState({ name: data.name })
                this.setState({ expire: data.expire })
                this.setState({ expire_date: data.expire_date })
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
    async fetchFollowers() {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

        fetch("http://167.172.110.234/api/getFollower", {
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

                Object.keys(data.response).map((key, index) => {
                    newData.push(data.response[index]);
                })
                this.setState({ externalDataFollowers: newData });

            }).catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                throw error;
            }).done();
    }

    async updateProfile() {
        let password = '';

        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

        if (this.state.newPass != '' || this.state.repPass != '') {
            if (this.state.newPass != this.state.repPass) {
                alert('Паролите са различни')
            } else {
                password = this.state.newPass;
            }
        }


        await fetch('http://167.172.110.234/api/updateProfile', {
            method: 'POST',
            body: JSON.stringify({
                password: password,
                username: this.state.username
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
                this.dropDownAlertRef.alertWithType('success', '', 'Профила е актуализиран', {}, 1000);
                this.fetchData();
                if (data.login && data.login == true) {
                    AsyncStorage.clear();
                    this.props.navigation.navigate('Auth');
                }




            }
        ).catch(function (error) {
            console.log('There has been a problem with your fetchaaaaaaaaaaaaaaa operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        });
    }


    async acceptRequest(id) {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

        await fetch('http://167.172.110.234/api/acceptRequestUser', {
            method: 'POST',
            body: JSON.stringify({
                requesterId: id,
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
                this.dropDownAlertRef.alertWithType('success', '', 'Заявката е приета', {}, 1000);

                if (data.login && data.login == true) {
                    AsyncStorage.clear();
                    this.props.navigation.navigate('Auth');
                }




            }
        ).catch(function (error) {
            console.log('There has been a problem with your fetchaaaaaaaaaaaaaaa operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        });
    }
    async switchProfile(id) {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
        await fetch('http://167.172.110.234/api/switchProfile', {
            method: 'POST',
            body: JSON.stringify({
                switchTo: id,
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


                if (data.newToken) {
                    AsyncStorage.setItem('access_token', data.newToken).then(data => {
                        this.fetchData();

                    });
                }
            }
        ).catch(function (error) {
            console.log('There has been a problem with your fetchaaaaaaaaaaaaaaa operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        });
    }
    async deleteRequest(id) {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
        await fetch('http://167.172.110.234/api/deleteRequestUser', {
            method: 'POST',
            body: JSON.stringify({
                requesterId: id,
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
                this.dropDownAlertRef.alertWithType('success', '', 'Заявката е изтрита', {}, 1000);

                if (data.login && data.login == true) {
                    AsyncStorage.clear();
                    this.props.navigation.navigate('Auth');
                }

                if (data.new_token) {
                    AsyncStorage.setItem('access_token', data.new_token);
                    delete data.new_token;
                    delete data['new_token'];
                }


                await this.fetchData();
            }
        ).catch(function (error) {
            console.log('There has been a problem with your fetchaaaaaaaaaaaaaaa operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        });
    }

    async submitNewRequest() {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

        await fetch('http://167.172.110.234/api/newRequest', {
            method: 'POST',
            body: JSON.stringify({
                requestedEmail: this.state.requestJoinEmail,
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

                if (data.errors !== undefined) {
                    Object.keys(data.errors).map((key, index) => {
                        this.dropDownAlertRef.alertWithType('error', '', data.errors[key], {}, 1000);
                    })
                } else {
                    this.dropDownAlertRef.alertWithType('success', '', 'Успешно изпратена заявка', {}, 1000);
                }


                if (data.login && data.login == true) {
                    AsyncStorage.clear();
                    this.props.navigation.navigate('Auth');
                }

                if (data.new_token) {
                    AsyncStorage.setItem('access_token', data.new_token);
                    delete data.new_token;
                    delete data['new_token'];
                }


                await this.fetchData();
            }
        ).catch(function (error) {
            console.log('There has been a problem with your fetchaaaaaaaaaaaaaaa operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        });
    }
    async removeFollow(follow_id) {

        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

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
                this.fetchData();
                this.fetchFollowers();
            }
        ).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        });
    }
    async deleteUser(id) {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

        await fetch('http://167.172.110.234/api/deleteUser', {
            method: 'POST',
            body: JSON.stringify({
                userID: id,
                leaveOwn: 1
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                //Header Defination
                'Authorization': 'Bearer ' + DEMO_TOKEN
            },

        }).then(
            async response => {
                this.setState({ group: 0 })
                if (response.errors !== undefined) {
                    Object.keys(response.errors).map((key, index) => {
                        this.dropDownAlertRef.alertWithType('error', '', response.errors[key], {}, 2000);

                    })


                } else {
                    if (id == this.state.userId) {
                        this.dropDownAlertRef.alertWithType('success', '', 'Вие напуснахте групата', {}, 2000);

                    } else {
                        this.dropDownAlertRef.alertWithType('success', '', 'Успешно изтрит потребител', {}, 2000);

                    }

                }

                const data = await response.json();

                if (data.login && data.login == true) {
                    AsyncStorage.clear();
                    this.props.navigation.navigate('Auth');
                }

                if (data.newToken) {
                    console.log(data.newToken);

                    AsyncStorage.setItem('access_token', data.newToken);
                    delete data.newToken;
                    delete data['newToken'];
                }


                await this.fetchData();
            }
        ).catch(function (error) {
            console.log('There has been a problem with your fetchaaaaaaaaaaaaaaa operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        });
    }
    renderFollowers(name, description, profilePicture, userId) {
        let picture = '';
        if (profilePicture != null) {
            picture = <Image source={{ uri: "https://kulinarcho.s3.eu-central-1.amazonaws.com/profile/" + profilePicture + '?time' + (new Date()).getTime() }}
                style={{ width: 80, marginTop: 10, marginLeft: 10, height: 80, borderColor: 'silver', borderWidth: 1, borderRadius: 40, marginBottom: 5 }}
            />

        } else {
            picture = <Image source={require('../../../Image/circle-profile.png')}
                style={{ width: 80, marginTop: 10, marginLeft: 10, height: 80, borderColor: 'silver', borderWidth: 1, borderRadius: 40, marginBottom: 5 }}
            />
        }
        return (
            <TouchableOpacity onPress={() => {
                AsyncStorage.setItem('userId', userId.toString()).then(data => {
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
                }}>
                    <View style={{ flex: 2, }}>
                        {picture}
                        {/* <Image source={require('../../../Image/circle-profile.png')}

                    style={{ width: 80, marginTop: 10, marginLeft: 10, height: 80, borderColor: 'silver', borderWidth: 1, borderRadius: 40, marginBottom: 5 }}
                /> */}
                    </View>
                    <View style={{ flex: 4, marginTop: 10 }}>
                        <Text style={{ fontSize: 18 }}>{name}</Text>
                        <Text style={{ color: 'silver' }}>{description}</Text>
                    </View>
                    <View style={{ flex: 1, paddingTop: 20 }}>
                        <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                            size={30}
                            containerStyle={{}}
                            color={'green'}
                            onPress={() => {

                                Alert.alert(
                                    "Отказ от следване",
                                    "Сигурни ли сте че искате да спрете да следвате " + name + " ?",
                                    [
                                        {
                                            text: "Не",
                                            onPress: () => { console.log("Cancel Pressed") },
                                            style: "cancel"
                                        },
                                        {
                                            text: "Да", onPress: () => {
                                                this.removeFollow(userId)
                                            }
                                        }
                                    ],
                                    { cancelable: false }
                                );
                            }}
                            type='font-awesome-5'
                            name='user-times'
                            backgroundColor='silver'
                        ></Icon>
                    </View>

                </View>
            </TouchableOpacity>)
    }
    render(props) {

        if (this.state.externalData === null && this.state.externalDataFollowers === null) {
            return (
                <View style={styles.MainContainer}>
                    <View style={styles.topView}>
                        <Text>Loading....</Text>
                    </View>
                </View>
            )
        } else {

            let profileBtn = [];
            let PageView = [];
            let page1, page2, page3
            if (this.state.pageView == 1) {
                page1 = { borderColor: '#85cc47', borderBottomWidth: 1, paddingBottom: 3, marginBottom: 2, flex: 1 };
                page2 = { flex: 1 };
                page3 = { flex: 1 };
                PageView.push(<ScrollView style={{ height: 350, }}>
                    <View style={{ marginBottom: 50, borderColor: '#689F38', paddingBottom: 15, borderWidth: 1, borderRadius: 10, padding: 5, marginLeft: 5, marginRight: 5, paddingTop: 15 }}>
                        <TextInput
                            placeholder={this.state.name}
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.secondTextInput.focus(); }}
                            style={{
                                borderRadius: 15,
                                marginLeft: 9, marginRight: 9,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 7,
                                },
                                height: 50,
                                shadowOpacity: 0.41,
                                shadowRadius: 9.11,
                                marginBottom: 20,

                                elevation: 6,
                                backgroundColor: '#ffffff',
                                paddingLeft: 10
                            }}
                            onChangeText={typeTitle => this.setState({ username: typeTitle })}
                        />

                        <TextInput
                            placeholder={'Нова парола'}
                            ref={(input) => { this.secondTextInput = input; }}
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.thirdTextInput.focus(); }}
                            style={{
                                borderRadius: 15,
                                marginLeft: 9, marginRight: 9,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 7,
                                },
                                height: 50,
                                shadowOpacity: 0.41,
                                shadowRadius: 9.11,
                                marginBottom: 20,

                                elevation: 6,
                                backgroundColor: '#ffffff',
                                paddingLeft: 10
                            }}
                            onChangeText={typeTitle => this.setState({ newPass: typeTitle })}
                        />
                        <TextInput
                            placeholder={'Повтори нова парола'}
                            ref={(input) => { this.thirdTextInput = input; }}
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.updateProfile() }}
                            style={{
                                borderRadius: 15,
                                marginLeft: 9, marginRight: 9,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 7,
                                },
                                height: 50,
                                shadowOpacity: 0.41,
                                shadowRadius: 9.11,
                                marginBottom: 20,

                                elevation: 6,
                                backgroundColor: '#ffffff',
                                paddingLeft: 10
                            }}
                            onChangeText={typeTitle => this.setState({ repPass: typeTitle })}
                        />
                        <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                            this.updateProfile()
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
                                            this.updateProfile()


                                        }

                                        }
                                        type='ionicon'
                                        backgroundColor='silver'
                                        name='checkmark-outline'
                                    ></Icon>

                                </View>
                                <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                                    <Text style={{ flex: 3, marginTop: 15 }}>Запази</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{
                        marginBottom: 50, borderColor: '#689F38', borderWidth: 1, borderRadius: 10, padding: 5, marginLeft: 5, marginRight: 5,
                        paddingBottom: 15,
                        paddingTop: 15
                    }}>

                        <Text style={{ fontSize: 18, color: 'silver', textAlign: 'center', marginBottom: 6 }}>Изпрати заявка за присъединяване в група</Text>
                        <TextInput
                            placeholder={'Имейл на собственика на групата'}
                            style={{
                                borderRadius: 15,
                                marginLeft: 9, marginRight: 9,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 7,
                                },
                                height: 50,
                                shadowOpacity: 0.41,
                                shadowRadius: 9.11,
                                marginBottom: 20,

                                elevation: 6,
                                backgroundColor: '#ffffff',
                                paddingLeft: 10
                            }}
                            blurOnSubmit={false}
                            onSubmitEditing={() => { this.submitNewRequest() }}
                            defaultValue={this.state.requestJoinEmail}
                            onChangeText={typeTitle => this.setState({ requestJoinEmail: typeTitle })}
                        />
                        <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                            this.submitNewRequest()
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
                                            this.submitNewRequest()


                                        }

                                        }
                                        type='ionicon'
                                        backgroundColor='silver'
                                        name='checkmark-outline'
                                    ></Icon>

                                </View>
                                <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                                    <Text style={{ flex: 3, marginTop: 15 }}>Изпрати заявка</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>

                </ScrollView>)
            } else if (this.state.pageView === 2) {
                page2 = { borderColor: '#85cc47', borderBottomWidth: 1, paddingBottom: 3, marginBottom: 2, flex: 1 };
                page1 = { flex: 1 };
                page3 = { flex: 1 };
                let pageFoll = [];
                if (Object.keys(this.state.externalDataFollowers).length == 0) {
                    PageView.push(<Text style={{ marginLeft: 10, color: 'silver', fontSize: 16 }}>Все още нямате профили който следвате. Може да разгледате публичните профили от секцията нашите готвачи.</Text>)
                } else {

                    Object.keys(this.state.externalDataFollowers).map((key, index) => {
                        pageFoll.push(this.renderFollowers(
                            this.state.externalDataFollowers[index].name,
                            this.state.externalDataFollowers[index].description,
                            this.state.externalDataFollowers[index].profilePicture,
                            this.state.externalDataFollowers[index].id,
                        ));
                    });

                    PageView.push(<ScrollView style={{ height: 350 }}>
                        {pageFoll}
                    </ScrollView>)

                }

            } else if (this.state.pageView == 3) {
                page3 = { borderColor: '#85cc47', borderBottomWidth: 1, paddingBottom: 3, marginBottom: 2, flex: 1 };
                page2 = { flex: 1 };
                page1 = { flex: 1 };
                var persons = [];
                var activeProfile2 = [];
                var setGroupProfile = [];


                activeProfile2.push(<View style={styles.topView}>
                    <TouchableOpacity
                        style={styles.customBtnBGTop}
                        onPress={() =>
                            this.setState({ typeDisplay: 0 })

                        }
                    >
                        <Text style={styles.customBtnText}>Личен профил</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.customBtnBGTopActive}
                        onPress={() =>
                            this.setState({ typeDisplay: 1 })
                        }
                    >
                        <Text style={styles.customBtnBGTop}>Групов профил</Text>
                    </TouchableOpacity>

                </View>
                ),
                    Object.keys(this.state.groupUsers).map((key, index) => {
                        persons.push(
                            <View style={{ flex: 1, flexDirection: "row", marginBottom: 10 }}>
                                <Text style={{ flex: 9 }}>{this.state.groupUsers[key].email}</Text>
                                <TouchableOpacity style={{ flex: 3 }} onPress={() => {
                                    Alert.alert(
                                        'Изтриване на потребител',
                                        'Сигурни ли сте че искате да премахнете  ' + this.state.groupUsers[key].email + 'от групата ви?',
                                        [
                                            {
                                                text: 'Отказ',
                                                onPress: () => {
                                                    return null;
                                                },
                                            },
                                            {
                                                text: 'Изтриване',
                                                onPress: () => {
                                                    this.deleteUser(this.state.groupUsers[key].id)
                                                },
                                            }
                                        ],
                                        { cancelable: false }
                                    );


                                }} ><Text style={{ alignContent: 'flex-end' }}>Изтрий </Text></TouchableOpacity>
                            </View>
                        )
                    });
                var requests = [];
                Object.keys(this.state.requests).map((key, index) => {
                    requests.push(
                        <View style={{ flex: 1, flexDirection: "row", marginBottom: 10 }}>
                            <Text style={{ flex: 9 }}>{this.state.requests[key].email}</Text>
                            <TouchableOpacity style={{ flex: 3 }}
                                onPress={() => {
                                    Alert.alert(
                                        'Приемане на заявка',
                                        'Сигурни ли сте че искате да приемете  ' + this.state.requests[key].email + 'в групата ви?',
                                        [
                                            {
                                                text: 'Отказ',
                                                onPress: () => {
                                                    return null;
                                                },
                                            },
                                            {
                                                text: 'Приемане',
                                                onPress: () => {
                                                    this.acceptRequest(this.state.requests[key].id)
                                                },
                                            },
                                        ],
                                        { cancelable: false }
                                    );

                                }}
                            ><Text style={{ borderBottomWidth: 1, alignContent: 'flex-end' }}>Приеми</Text></TouchableOpacity>
                            <TouchableOpacity style={{ flex: 3 }}
                                onPress={() => {
                                    Alert.alert(
                                        'Изтриване на заявка',
                                        'Сигурни ли сте че искате да изтриете заявката на ' + this.state.requests[key].email + ' ?',
                                        [
                                            {
                                                text: 'Отказ',
                                                onPress: () => {
                                                    return null;
                                                },
                                            },
                                            {
                                                text: 'Изтриване',
                                                onPress: () => {
                                                    this.deleteRequest(this.state.requests[key].id)
                                                },
                                            },
                                        ],
                                        { cancelable: false }
                                    );


                                }}
                            ><Text style={{ borderBottomWidth: 1, alignContent: 'flex-end' }}>Изтрий</Text></TouchableOpacity>
                        </View>
                    )
                });
                let all = [];
                var personalFields = [];

                if (this.state.master === 1) {
                    all.push(
                        <View>
                            <View style={{
                                borderRadius: 15,
                                marginLeft: 9, marginRight: 9,

                                paddingLeft: 10
                            }}>
                                <Text style={{ flex: 3, borderBottomColor: 'silver', fontSize: 18, borderBottomWidth: 1, marginBottom: 15 }}>Получени заявки: </Text>
                                {requests}
                            </View>
                            <View style={{
                                borderRadius: 15,
                                marginLeft: 9, marginRight: 9,

                                marginBottom: 20,

                                paddingLeft: 10
                            }}>
                                <Text style={{ flex: 3, borderBottomColor: 'silver', fontSize: 18, borderBottomWidth: 1, marginBottom: 15 }}>Потребители в групата: </Text>

                                {persons}
                            </View>
                        </View>
                    )
                } else {
                    all.push(<View></View>)
                }



                personalFields.push(
                    <ScrollView style={{ height: '100%' }} contentContainerStyle={{ flexGrow: 1 }} >
                        {setGroupProfile}
                        {all}
                    </ScrollView>)
                PageView.push(
                    personalFields
                )
            }


            if (this.state.activeProfile == 0) {
                // this.dropDownAlertRef.alertWithType('success', '','Преминахте на групов профил',{}, 2000);

                profileBtn.push(<View><Text style={{ backgroundColor: 'white', color: '#4a4949', shadowColor: 'white', shadowOpacity: 0.5 }} >Личен профил</Text></View>
                );
            } else {

                profileBtn.push(<View><Text style={{ backgroundColor: 'white', color: '#77d169' }} >Групов профил</Text></View>
                );

            }
            let premiumBTN = '';
            let premiumPeriod = '';

            if (this.state.premium == 0) {
                premiumBTN = <Text style={{ flex: 1, fontSize: 18, color: 'red' }}>Безплатен профил</Text>
                premiumPeriod = <View style={{ height: 50, marginBottom: 10 }}>
                <TouchableOpacity
                    onPress={() => { this.props.navigation.navigate('payments'); }}
                    style={{
                        flex: 1, backgroundColor: '#689F38', borderColor: 'white', borderWidth: 2, height: 20,
                        alignItems: 'center', paddingTop: 3, borderRadius: 16, width: '80%',
                    }}>
                    <Text style={{ backgroundColor: '#689F38', color: 'white', marginTop: 10}} >Купи премиум  </Text>
                </TouchableOpacity>
            </View>;
            } else {
                premiumBTN = <Text style={{ flex: 1, fontSize: 18, color: 'gold' }}>Премиум профил</Text>
                premiumPeriod = <View style={{ height: 50, marginBottom: 10 }}>
                <TouchableOpacity
                    onPress={() => { this.props.navigation.navigate('payments'); }}
                    style={{
                        flex: 1, backgroundColor: '#689F38', borderColor: 'white', borderWidth: 2, height: 20,
                        alignItems: 'center', paddingTop: 3, borderRadius: 16, width: '80%',
                    }}>
                    <Text style={{ backgroundColor: '#689F38', color: 'white' }} >{this.state.expire} оставащи дни  </Text>
                    <Text style={{ backgroundColor: '#689F38', color: 'white' }} >{this.state.expire_date}</Text>
                </TouchableOpacity>
               
            </View>
            }   
            
            let leaveGroup = <Text></Text>;

            if (this.state.groupUser == 1 && this.state.premium == 1) {
                leaveGroup = <TouchableOpacity
                    onPress={() => Alert.alert(
                        "Напускане на групата",
                        "Наистина ли искате да напуснете групата",
                        [
                            {
                                text: "Напусни",
                                onPress: () => { this.deleteUser(this.state.userId) },
                                style: "cancel"
                            },
                            { text: "Остани", onPress: () => console.log("Cancel Pressed") }
                        ],
                        { cancelable: false }
                    )}
                    style={{
                        flex: 1, backgroundColor: 'white', marginTop: 10, borderColor: '#fa8484', borderWidth: 2, height: 40,
                        width: '60%', alignItems: 'center', paddingTop: 8, borderRadius: 16, marginRight: 20
                    }}>
                    <Text style={{ backgroundColor: 'white', color: '#fa8484' }} >Напусни групата</Text>
                </TouchableOpacity>
            }
            return (
                <View>
                    <View style={{}}>
                        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />

                        <View style={{ flexDirection: 'row', backgroundColor: '#689F38', }}>
                            <View style={{ flex: 1, }}>
                                <Image source={require('../../../Image/circle-profile.png')}

                                    style={{ width: 150, marginTop: 10, marginLeft: 10, height: 150 }}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <View style={{ flex: 3, }}>
                                    <Text style={{ flex: 1, fontSize: 24, color: 'white', marginTop: 20 }}>{this.state.name}</Text>
                                </View>
                                <View style={{ flex: 1, height: 20 }}>
                                    {premiumBTN}
                                </View>

                               {premiumPeriod}
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#e6e6e6', alignItems: 'center', flexDirection: 'row', paddingLeft: 10, paddingBottom: 10 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (this.state.activeProfile == 1) {
                                        if (this.state.premium == 1) {
                                            this.setState({ activeProfile: 0 });
                                            this.switchProfile(2);
                                            this.dropDownAlertRef.alertWithType('success', 'Преминахте на групов профил', 'Вече може да управлявате всичко което е в групата', {}, 2000);
                                        } else {
                                            Alert.alert(
                                                'Недостъпна функция',
                                                'Групов профил е възможен само за премиум потребителите',
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

                                    } else {
                                        this.switchProfile(1);

                                        this.dropDownAlertRef.alertWithType('success', 'Преминахте на личен профил', 'Вече може да управлявате нещата който са лично ваши', {}, 2000);

                                        this.setState({ activeProfile: 1 })
                                    }
                                }}
                                style={{
                                    flex: 1, backgroundColor: 'white', marginTop: 10, borderColor: '#77d169', borderWidth: 2, height: 40,
                                    width: '60%', alignItems: 'center', paddingTop: 8, borderRadius: 16, marginRight: 20
                                }}>
                                {profileBtn}
                            </TouchableOpacity>
                            {leaveGroup}
                        </View>
                        <View style={{ height: 50, backgroundColor: '#e6e6e6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={page1}>
                                <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                                    size={25}
                                    // containerStyle={page1}
                                    color={'green'}
                                    onPress={() => { this.setState({ pageView: 1 }) }}
                                    type='font-awesome-5'
                                    name='user'
                                    backgroundColor='silver'
                                ></Icon>
                                <Text style={{ textAlign: 'center', marginTop: -2 }} onPress={() => { this.setState({ pageView: 1 })}}> Настройки</Text>

                            </View>
                            <View style={page2}>
                                <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                                    size={30}
                                    color={'green'}
                                    onPress={() => { this.setState({ pageView: 2 }) }}
                                    type='font-awesome-5'
                                    name='users'
                                    backgroundColor='silver'
                                ></Icon>
                                <Text style={{ textAlign: 'center', marginTop: -4 }} onPress={() => { this.setState({ pageView: 2 }) }}>Последвани</Text>

                            </View>
                            <View style={page3}>
                                <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                                    size={30}
                                    color={'green'}
                                    onPress={() => { this.setState({ pageView: 3 }) }}
                                    type='font-awesome-5'
                                    name='user-cog'
                                    backgroundColor='silver'
                                ></Icon>
                                <Text style={{ textAlign: 'center', marginTop: -4 }} onPress={() => { this.setState({ pageView: 3 }) }}> Настройки група</Text>

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

                            {PageView}

                        </View>
                    </View>

                </View>
            );
        }
    }
}
//         const IconBar = () => (
//             <View>

//             </View>
//           )
//         var setPursonalProfile = [];
//         var setGroupProfile = [];
//         if(this.state.activeProfile == 0){
//             setPursonalProfile.push(
//                 <Card style={{ flex: 1, marginLeft: 0, marginRight: 0 }}>
//                             <View style={{ flex: 1, }}>

//                                                 <Button title='Превключи на личен профил' color='green' onPress={() => { 
//                                                     this.setState({activeProfile:1});
//                                                     this.setState({activeGroupProfile:0});
//                                                     this.switchProfile(1);

//                                                     }} />          

//                             </View>
//                             </Card>
//             );
//         }else{
//             setPursonalProfile.push(<Text></Text>);

//         }

//         if(this.state.typeDisplay == 0){
//             activeProfile.push(            <View style={styles.topView}>
//                 <TouchableOpacity
//                 style={styles.customBtnBGTopActive}
//                 onPress={() =>
//                     this.setState({typeDisplay:0})
//                 }
//                 >
//                 <Text style={styles.customBtnText}>Личен профил</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                 style={styles.customBtnBGTop}
//                 onPress={() =>
//                     this.setState({typeDisplay:1})

//                 }
//                 >
//                 <Text style={styles.customBtnBGTop}>Групов профил</Text>
//                 </TouchableOpacity>

//                 </View>
// )
// personalFields.push(                    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} >
// {setPursonalProfile}
//     <Card style={{ flex: 1, marginLeft: 0, marginRight: 0 }}>
//                             <View style={{ flex: 1, }}>
//                                 <Text style={{ flex: 3, borderBottomColor: 'silver', borderBottomWidth: 1, marginBottom: 15 }}>Основна информация: </Text>

//                                 <View style={{  flex: 1 }}>
//                                 <TextInput
//                   placeholder={'Име:'}
//                   style={styles.inputRow}
//                   defaultValue={this.state.name}
//                   onChangeText={typeTitle => this.setState({name:typeTitle})}
//                 />
//                  <TextInput
//                   placeholder={'Нова парола:'}
//                   style={styles.inputRow}
//                   defaultValue={this.state.pass}
//                   onChangeText={typeTitle => this.setState({pass:typeTitle})}
//                 />
//                  <TextInput
//                   placeholder={'Повтори парола:'}
//                   style={styles.inputRow}
//                   defaultValue={this.state.repPass}
//                   onChangeText={typeTitle => this.setState({repPass:typeTitle})}
//                 />

//                                 </View>
//                                 <Button title='Запази' color='green' />
//                             </View>
//                             </Card>
//                             <Card style={{ flex: 1, marginLeft: 0, marginRight: 0 }}>
//                             <View style={{ flex: 1, }}>
//                                 <Text style={{ flex: 3, borderBottomColor: 'silver', borderBottomWidth: 1, marginBottom: 15 }}>Изпрати заявка: </Text>

//                                 <View style={{  flex: 1 }}>
//                                 <TextInput
//                   placeholder={'Имейл на собственика на групата'}
//                   style={styles.inputRow}
//                   defaultValue={this.state.requestJoinEmail}
//                   onChangeText={typeTitle => this.setState({requestJoinEmail:typeTitle})}
//                 />                          
//                                                 <Button title='Изпрати' color='green' onPress={() =>
//                     this.submitNewRequest()

//                 }/>          
//                                 </View>

//                             </View>
//                             </Card>
// </ScrollView>);

//         }else{
//             activeProfile.push(            <View style={styles.topView}>
//                 <TouchableOpacity
//                 style={styles.customBtnBGTop}
//                 onPress={() =>
//                     this.setState({typeDisplay:0})

//                 }
//                 >
//                 <Text style={styles.customBtnText}>Личен профил</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                 style={styles.customBtnBGTopActive}
//                 onPress={() =>
//                     this.setState({typeDisplay:1})
//                 }
//                 >
//                 <Text style={styles.customBtnBGTop}>Групов профил</Text>
//                 </TouchableOpacity>

//                 </View>
// )
// var persons = [];

// Object.keys(this.state.groupUsers).map((key, index) => {
//     persons.push(
//         <View style={{ flex:1, flexDirection:"row", marginBottom:10}}>
//                 <Text style={{flex: 9}}>{this.state.groupUsers[key].email}</Text> 
//                 <TouchableOpacity style={{flex: 3 }} onPress={() => {
//                     Alert.alert(
//                         'Изтриване на потребител',
//                         'Сигурни ли сте че искате да премахнете  '+this.state.groupUsers[key].email+'от групата ви?',
//                         [
//                             {
//                                 text: 'Отказ',
//                                 onPress: () => {
//                                     return null;
//                                 },
//                             },
//                             {
//                                 text: 'Изтриване',
//                                 onPress: () => {
//                                     this.deleteUser(this.state.groupUsers[key].id)                            },
//                                 }
//                                 ],
//                         { cancelable: false }
//                     );


//                             }} ><Text style={{borderBottomWidth:1, alignContent: 'flex-end'}}>Изтрий </Text></TouchableOpacity>
//                 </View>
//     )
// });
// var requests = [];

// Object.keys(this.state.requests).map((key, index) => {
//     requests.push(
//         <View style={{ flex:1, flexDirection:"row", marginBottom:10}}>
//                 <Text style={{flex: 9}}>{this.state.requests[key].email}</Text> 
//                 <TouchableOpacity style={{flex: 3 }}
//                 onPress={() => {
//                     Alert.alert(
//                         'Приемане на заявка',
//                         'Сигурни ли сте че искате да приемете  '+this.state.requests[key].email+'в групата ви?',
//                         [
//                             {
//                                 text: 'Отказ',
//                                 onPress: () => {
//                                     return null;
//                                 },
//                             },
//                             {
//                                 text: 'Приемане',
//                                 onPress: () => {
//                                     this.acceptRequest(this.state.requests[key].id)
//                                 },
//                             },
//                         ],
//                         { cancelable: false }
//                     );

//                                              }}
//                 ><Text style={{borderBottomWidth:1, alignContent: 'flex-end'}}>Приеми</Text></TouchableOpacity>
//                 <TouchableOpacity style={{flex: 3 }}
//                 onPress={() => {
//                     Alert.alert(
//                         'Изтриване на заявка',
//                         'Сигурни ли сте че искате да изтриете заявката на '+this.state.requests[key].email+' ?',
//                         [
//                             {
//                                 text: 'Отказ',
//                                 onPress: () => {
//                                     return null;
//                                 },
//                             },
//                             {
//                                 text: 'Изтриване',
//                                 onPress: () => {
//                                     this.deleteRequest(this.state.requests[key].id)                                },
//                             },
//                         ],
//                         { cancelable: false }
//                     );


//                                              }}
//                 ><Text style={{borderBottomWidth:1, alignContent: 'flex-end'}}>Изтрий</Text></TouchableOpacity>
//                 </View>
//     )
// });
// let all = [];
// if(this.state.master === 1){
// all.push(
//  <View><Card style={{ flex: 1, marginLeft: 0, marginRight: 0 }}>
//  <View style={{ flex: 1, }}>
//      <Text style={{ flex: 3, borderBottomColor: 'silver', borderBottomWidth: 1, marginBottom: 15 }}>Получени заявки: </Text>
//      {requests}
//  </View>
// </Card>
// <Card style={{ flex: 1, marginLeft: 0, marginRight: 0 }}>
//  <View style={{ flex: 1, }}>
//      <Text style={{ flex: 3, borderBottomColor: 'silver', borderBottomWidth: 1, marginBottom: 15 }}>Потребители в групата: </Text>

//      {persons}
//  </View>
// </Card></View>   
// )
// }else{
//     all.push(<View></View>)
// }
// personalFields.push(
//     <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} >
//         {setGroupProfile}
//         {all
//         }
//     </ScrollView>)
//         }
//     if (this.state.externalData === null) {
//         return (
//           <View style={styles.MainContainer}>
//             <View style={styles.topView}>
//               <Text>Loading....</Text>
//             </View>
//           </View>
//         )
//       } else {
//         return (

//             <View style={styles.MainContainer}>
//                       <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />   

//                 <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }} >
//                     {activeProfile}
//                     {personalFields}

//                 </ScrollView>
//             </View>
export default ShowProfile;
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