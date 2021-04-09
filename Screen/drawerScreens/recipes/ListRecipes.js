

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React
import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet } from 'react-native';

import DropdownAlert from 'react-native-dropdownalert';
import RBSheet from "react-native-raw-bottom-sheet";
import RBSheet2 from "react-native-raw-bottom-sheet";
import ImageModal from 'react-native-image-modal';
import jwt_decode from "jwt-decode";

import { BackHandler } from 'react-native';

import {
    Dimensions,
    SafeAreaView,
    FlatList,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableHighlight
} from "react-native";
import { Icon } from 'react-native-elements'

class ListRecipes extends React.Component {

    state = {
        externalData: null,
        recipeId: '',
        recipeName: '',
        userId: 0,
        groupId: 0
    }


    async componentDidMount() {
        const { navigation } = this.props;
        this.props.navigation.setParams({ handleSave: this._saveDetails });
        this.focusListener = navigation.addListener('didFocus', async () => {
            let route = await AsyncStorage.getItem('backRoute'); route= JSON.parse(route);
            let arrRoute = [];
      
            if (route === null) {
              arrRoute.push('ListRecipes')
            } else {
              arrRoute = route
            }
            if (arrRoute[arrRoute - 1] != 'ListRecipes') {
              arrRoute.push('ListRecipes')
            }
            AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

                  await this.fetchData();

        });
    }


    _saveDetails = (prop) => {
        if (prop === 'newItem') {
            this.props.navigation.navigate('AddRecipes', { user: 'asdasdsdasd' });

        } else {
            this.setState({
                sort: prop,
            });
            this.fetchData();

        }

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
          if(lastRoute != 'ListRecipes'){
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

    async deleteRecipe(id) {


        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

        await fetch('http://167.172.110.234/api/recipesDelete', {
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


                this.fetchData();
            }
        ).catch(function (error) {
            console.log('There has been a problem with your fetchaaaaaaaaaaaaaaa operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        });
    }
    async fetchData() {
        var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

        var decoded = jwt_decode(DEMO_TOKEN);
        this.setState({ userId: decoded.oldId })

        fetch("http://167.172.110.234/api/recipes", {
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


            const { modalVisible3 } = this.state;

            var cat = '';

            const Card = ({ item }) => {
                let publicRec = '';
                let publicRecColor = ''
                if(item.public == 1){
                    publicRec = 'Публична рецепта'
                    publicRecColor = 'green';
                }else if(item.public == 2){
                    publicRec = 'В процес на одобрение'
                    publicRecColor="blue"
                }
                console.log(item);
                let { width } = Dimensions.get('window');
                let fields = [];
                if (this.state.sort == 'typeAsc' || this.state.sort == 'typeDesc') {
                    if (cat !== item.type) {
                        cat = item.type;
                        fields.push(<Text style={{ marginLeft: 30, marginTop: 20 }}>{cat}</Text>);
                    }
                }

                var buyedDesign = 'none';
                var buyedColor = '#689F38';

                if (item.status === 1) {
                    buyedDesign = 'line-through'
                    buyedColor = 'silver';
                }
                let categoryColor = 'silver';
                var img = ''
                if (item.photo !== null) {
                    img = 'https://kulinarcho.s3.eu-central-1.amazonaws.com/recipes/' + item.photo;
                } else {
                    img = 'https://s.clipartkey.com/mpngs/s/35-354348_cook-clipart-food-recipe-recipe-clipart.png'
                }
                return (
                    <View>
                        {fields}

                        <View
                            elevation={5}
                            style={{
                                borderLeftWidth: 4, borderLeftColor: buyedColor,
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
                                    <TouchableOpacity style={{
                                        width: '100%',
                                        paddingLeft: 9,
                                        flex: 2,
                                        flexDirection: 'column',

                                    }} onPress={() => {

                                        AsyncStorage.setItem('recipeId', item.id.toString()).then(data => {
                                            this.props.navigation.navigate('ShowRecipe', { name: 'kuyr' });

                                        });
                                    }}>


                                        <Text
                                            style={{
                                                marginLeft: 20,
                                                flex: 1,
                                                fontSize: 19,
                                                fontWeight: '200',
                                                // fontFamily: 'sans-serif',
                                                marginBottom: 4,
                                                textDecorationLine: buyedDesign
                                            }}>
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>

                                    <Icon style={styles.icon}
                                        size={30}
                                        color={'silver'}
                                        onPress={() => {
                                            // this.setState({modalEditTitle: 'Редактиране на списък'})
                                            this.setState({ 'recipeId': item.id });
                                            this.setState({ 'recipeName': item.title });
                                            this.setState({ 'groupId': item.user_id });
                                            this.RBSheet2.open();
                                            // this.RBSheet.open()

                                        }

                                        }
                                        type='font-awesome-5'

                                        name='pencil-alt'                                    >Редактирай</Icon>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <ImageModal
                                        borderRadius={60}
                                        resizeMode="cover"
                                        imageBackgroundColor="#ffffff"
                                        source={{ uri: img + '?time' + (new Date()).getTime() }}
                                        style={{
                                            marginTop: 15,
                                            width: 60,
                                            height: 60,
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
                                            this.props.navigation.navigate('ShowRecipe', { name: 'kuyr' });

                                        });
                                    }}>


<Text style={{
                                            alignItems: 'flex-end', marginLeft:15, color: publicRecColor, textDecorationLine: buyedDesign
                                        }}>
                                           {publicRec}
                                        </Text>
                                        <Text
                                            style={{
                                                width: '100%',
                                                // flex: 1,
                                                fontSize: 16,
                                                fontWeight: '200',
                                                // fontFamily: 'sans-serif',
                                                marginBottom: 4,
                                                color: '#808080',
                                                textDecorationLine: buyedDesign

                                            }}>
                                            {item.description}
                                        </Text>

                                        <Text style={{
                                            alignItems: 'flex-end', marginLeft:15, color: categoryColor, textDecorationLine: buyedDesign
                                        }}>
                                           Автор: {item.name}
                                        </Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>
                    </View>
                );
            };

            return (
                <View style={styles.MainContainer}>
                    <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
                    <RBSheet
                        ref={ref => {
                            this.RBSheet = ref;
                        }}
                        height={200}
                        customStyles={{
                            wrapper: {
                                backgroundColor: "transparent"
                            },
                            container: {
                                borderTopRightRadius: 15,
                                borderTopLeftRadius: 15,
                                justifyContent: "center",
                                alignItems: "center"
                            }
                        }}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.titlem}>{this.state.modalEditTitle}</Text>
                            <View style={styles.dividerm}></View>
                        </View>
                        <View style={{
                            marginTop: 0,
                            flexDirection: "row",
                        }}>

                            <Text style={{
                                marginLeft: 5,
                                marginTop: 15,
                                width: '45%'
                            }}>Количество</Text>
                            <Text style={{
                                marginLeft: 5,
                                marginRight: 5,

                                marginTop: 15,
                                width: '40%'
                            }}>Цена</Text>
                        </View>
                        <View style={{
                            marginTop: 0,
                            flexDirection: "row",
                            marginBottom: 20
                        }}>
                            <TextInput
                                placeholder={'Количество'}
                                style={styles.inputRow}
                                defaultValue={this.state.amount}
                                onChangeText={typeTitle => this.setAmount(typeTitle)}
                            />
                            <TextInput
                                placeholder={"Цена"}
                                style={styles.inputRow2}
                                defaultValue={this.state.price}
                                onChangeText={typeTitle => this.setPrice(typeTitle)}
                            />
                        </View>

                        <View style={styles.modalBtn}>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#00cf0e" }}
                                onPress={() => {
                                    this.RBSheet.close()
                                    this.submitEditType();
                                }}
                            >
                                <Text style={styles.textStyle}>Запази</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#f00000" }}
                                onPress={() => {
                                    this.RBSheet.close()
                                }}
                            >
                                <Text style={styles.textStyle}>Откажи</Text>
                            </TouchableHighlight>
                        </View>


                    </RBSheet>

                    <RBSheet2
                        ref={ref => {
                            this.RBSheet2 = ref;
                        }}
                        height={140}
                        customStyles={{
                            container: {
                                borderTopRightRadius: 15,
                                borderTopLeftRadius: 15,
                            }
                        }}
                    >

                        <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

                            <TouchableOpacity onPress={() => {
                                if (this.state.userId != this.state.groupId) {
                                    this.RBSheet2.close();

                                    alert('Не може да редактирате рецепта която не е ваша.');

                                } else {

                                    AsyncStorage.setItem('recipeId', this.state.recipeId.toString()).then(data => {
                                        this.props.navigation.navigate('EditRecipes', { name: 'kuyr' });
                                    });
                                }

                            }
                            }>
                                <View style={{ flexDirection: 'row' }}>

                                    <Icon style={styles.icon}
                                        containerStyle={{
                                            backgroundColor: '#ebebeb',
                                            borderRadius: 20,
                                            padding: 5
                                        }}
                                        size={25}
                                        color={'black'}

                                        onPress={() => {
                                            if (this.state.userId != this.state.groupId) {
                                                this.RBSheet2.close();

                                                alert('Не може да редактирате рецепта която не е ваша.');

                                            } else {
                                                AsyncStorage.setItem('recipeId', this.state.recipeId.toString()).then(data => {
                                                    this.props.navigation.navigate('EditRecipes', { name: 'kuyr' });

                                                });
                                            }

                                        }

                                        }
                                        type='font-awesome-5'

                                        name='pencil-alt'
                                    >Редактирай</Icon>
                                    <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Редактирай рецептата</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => {
                            this.RBSheet2.close();

                            if (this.state.userId != this.state.groupId) {
                                alert('Не може да  изтривате рецепта която не е ваша.');

                            } else {
                                this.deleteRecipe(this.state.recipeId);

                            }

                        }
                        }>
                            <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

                                <Icon
                                    containerStyle={{
                                        backgroundColor: '#ebebeb',
                                        borderRadius: 20,
                                        padding: 5
                                    }}
                                    size={25}
                                    color={'silver'}
                                    name='trash-outline'
                                    color={'black'}
                                    type='ionicon'

                                    onPress={() => {
                                        this.RBSheet2.close();
                                        if (this.state.userId != this.state.groupId) {
                                            alert('Не може да  изтривате рецепта която не е ваша.');

                                        } else {
                                            this.deleteRecipe(this.state.recipeId);
                                        }
                                    }
                                    }
                                    size={25}
                                    style={styles.icon} ></Icon><Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Изтрий рецептата</Text>
                            </View>
                        </TouchableOpacity>



                    </RBSheet2>
                    <SafeAreaView >
                        <FlatList
                            contentContainerStyle={{ paddingBottom: 70 }}

                            data={this.state.externalData}
                            renderItem={data => {

                                return (

                                    <Card item={data.item} />
                                );
                            }}
                            keyExtractor={item => item.id}
                        />
                    </SafeAreaView >

                    {/* <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible3}
            onRequestClose={() => {
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={styles.titlem}>Изтриване на продукт</Text>
                  <View style={styles.dividerm}></View>
                </View>
                <Text style={{
                  justifyContent: "center",
                  alignItems: "center", marginLeft: 20
                }}>Сигурни ли сте че искате да изтриете продукта
                                     <Text style={{ fontStyle: "italic", fontWeight: "bold" }}>{this.state.deleteType}</Text></Text>
                <View style={styles.modalBtn}>
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#00cf0e" }}
                    onPress={() => {
                      this.submitDeleteType();
                      this.setModalVisible3(!modalVisible3);
                    }}
                  >
                    <Text style={styles.textStyle}>Да</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#f00000" }}
                    onPress={() => {
                      this.setModalVisible3(!modalVisible3);
                    }}
                  >
                    <Text style={styles.textStyle}>Не</Text>
                  </TouchableHighlight>
                </View>

              </View>
            </View>
          </Modal> */}

                </View>
            );
        }
    }
};
export default ListRecipes;
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        flex: 2,
        width: 200,
        height: 30,
        padding: 0
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

        marginBottom: 10,
        marginTop: 15,
        width: 200
    },

    titlem: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#000",
        alignSelf: 'stretch',
        margin: 0,
        padding: 0,

    },
    inputRow: {
        borderBottomWidth: 1,
        marginBottom: 10,
        marginLeft: 5,
        marginTop: 5,
        width: '45%'
    },
    inputRow2: {
        borderBottomWidth: 1,
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,

        marginTop: 5,
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
    dividerm: {
        width: "100%",
        borderBottomWidth: 1,
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
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    activeButton: {
        width: 100,
        paddingRight: 5,
        paddingLeft: 5,
        justifyContent: 'space-between',
        marginRight: 2,
        marginLeft: 2,

    },
    customBtnBG: {
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
        color: '#adadad',
        width: 100,
        paddingRight: 5,
        paddingLeft: 5
    },
    customBtnTextActive: {
        color: 'black',
        width: 100,
        paddingRight: 5,
        paddingLeft: 5
    },
    buttoncontainer: {
        flex: 1,
        justifyContent: 'space-between'
    },
    bottomView: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',

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
        // height: '100%',
        // marginTop: 5,
        // marginBottom: 5,
        // flex: 1,
        // paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },
    topView: {
        width: '100%',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        flexDirection: 'row',

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

    item: {
        marginVertical: 3,

        flex: 3,
        flexDirection: 'row',
        paddingTop: 2,
        paddingBottom: 2

    },
    title: {
        paddingLeft: 9,
        fontSize: 16,
        flex: 1,

    },
    icon: {
        height: 30,
        width: 30,
        flex: 1
    },
    container: {


    },

});
