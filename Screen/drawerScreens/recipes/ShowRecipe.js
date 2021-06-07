

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
  View, TouchableHighlight,

  Text, ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { BackHandler } from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';

import { Icon } from 'react-native-elements'
import YoutubePlayer from "react-native-youtube-iframe";
import { BottomSheet } from 'react-native-btr';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import ImageView from 'react-native-image-view';

class ShowRecipe extends React.Component {

  state = {
    externalData: null,
    premium: 0,
    checkCamera: false,
    image64: '',
    image: '',
    gallery: null,
    galleryShow: false
  }


  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('ShowRecipe')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'ShowRecipe') {
        arrRoute.push('ShowRecipe')
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
      BackHandler.addEventListener("hardwareBackPress", async () => {
        let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
        let lastRoute = route.pop();
        if (lastRoute != 'ShowRecipe') {
          route.push(lastRoute);
        }
        let goRoute = route.pop();
        
        
        if (goRoute != undefined) {
          AsyncStorage.setItem('backRoute', JSON.stringify(route));
          this.props.navigation.navigate(goRoute);
        }
      })
    );

  }

  async pickImage() {
    this.setState({ checkCamera: true })
  };

  async launchGalery() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.width > 640) {
      let prop = result.width / 640;
      const manipResult = await ImageManipulator.manipulateAsync(
        result.localUri || result.uri,
        [{ resize: { width: result.width / prop, height: result.height / prop } }],
        { format: 'jpeg' }
      );
      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: 'base64' });
      this.setState({ image64: base64 })

    } else {
      const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
      this.setState({ image64: base64 })
    }

    this.setState({ checkCamera: false })

    if (!result.cancelled) {
      this.setImage(result.uri);
      this.uploadImage();
    }
  }
  async launchCamera() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (result.width > 640) {
      let prop = result.width / 640;
      const manipResult = await ImageManipulator.manipulateAsync(
        result.localUri || result.uri,
        [{ resize: { width: result.width / prop, height: result.height / prop } }],
        { format: 'jpeg' }
      );
      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: 'base64' });
      this.setState({ image64: base64 })

    } else {
      const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
      this.setState({ image64: base64 })
    }
    this.setState({ checkCamera: false })
    if (!result.cancelled) {
      this.setImage(result.uri);
      this.uploadImage();
    }

  }
  async setImage(img) {

    this.setState({ image: img })
  }

  async uploadImage() {
    let DEMO_TOKEN2 = await AsyncStorage.getItem('recipeId');


    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');

    console.log(JSON.stringify({
      recipeId: DEMO_TOKEN2,
      photo: this.state.image64
    }))
    fetch("https://kulinarcho.com/api/uploadImageGallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        //Header Defination
        'Authorization': 'Bearer ' + DEMO_TOKEN
      },
      body: JSON.stringify({
        recipeId: DEMO_TOKEN2,
        photo: this.state.image64,
        approved: 1,
      }),
    }).then(response => response.json())
      .then(data => {
        if (data.response == 'ok') {
          this.dropDownAlertRef.alertWithType('success', 'Снимката е качена', "Вашата снимка е качена и добавена към галерията ", {}, 3000);

        } else {
          this.dropDownAlertRef.alertWithType('error', '', "Нещо се обърка. Нашия екип се грижи за отстраняване на проблема", {}, 2000);

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

      }).catch(function (error) {
        
        // ADD THIS THROW error
        throw error;
      }).done();
  }

  async fetchData(showGallery = false) {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    let DEMO_TOKEN2 = await AsyncStorage.getItem('recipeId');
    fetch("https://kulinarcho.com/api/showRecipe?id=" + DEMO_TOKEN2, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then(response => response.json())
      .then(data => {
        if (data.response !== '') {
          this.setState({ externalData: data });
        } else {
          this.props.navigation.navigate('ListRecipes', { name: 'kuyr' });

        }        this.state.premium = data.premium;
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
 
        if (data.gallery && data.gallery.length) {
          let gall = [];

          Object.keys(data.gallery).map((key, index) => {
            
            gall.push({
              source: {
                uri: 'https://kulinarcho.s3.eu-central-1.amazonaws.com/recipes/' + data.gallery[index].image,
              },
              width: 806,
              height: 720,
              title: 'kulinarcho',

            })
          });

          this.setState({ gallery: gall })
        }
        if (showGallery == true) {
          this.setState({ galleryShow: true })
        } else {
          this.setState({ galleryShow: false })

        }
      

      }).catch(function (error) {
        
        // ADD THIS THROW error
        throw error;
      }).done();
  }

  async setPublic(id) {

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch('https://kulinarcho.com/api/setPublicRecipe', {
      method: 'POST',
      body: JSON.stringify({
        recipe_id: id,
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



      }

    ).catch(function (error) {
      
      
      // ADD THIS THROW error
      throw error;
    });
  }
  render(props) {

    if (this.state.externalData === null) {
      return (
        <View style={styles.MainContainer}>
          <ActivityIndicator size="large" color="#7DE24E" />
        </View>
      )
    } else {
      
      let Add = <AdMobBanner
        bannerSize="smartBannerLandscape"
        adUnitID={'ca-app-pub-5428132222163769/4402261700'}
        
        servePersonalizedAds={true} />;
      if (this.state.premium != 0) {
        Add = <View></View>;
      }

      const renderItemProducts = () => {
        let finnal = [];
        let data = this.state.externalData.recipe_products;
        Object.keys(data).map((key, index) => {
          let hint = '';
          if (data[index].hint != null && data[index].hint != '') {
            hint = "(" + data[index].hint + ")"
          }
          finnal.push(
            <Text style={{
              // borderLeftWidth: 4, borderLeftColor: '#689F38',
              // borderRadius: 15,
              marginLeft: 9, marginRight: 9,
              // shadowColor: "#000",
              // shadowOffset: {
              //     width: 0,
              //     height: 7,
              // },
              // shadowOpacity: 0.41,
              // shadowRadius: 9.11,
              // marginBottom: 20,
              // height: 45,
              // marginTop: 10,
              paddingTop: 10,
              // elevation: 6,
              // backgroundColor: '#ffffff',
              paddingLeft: 10
            }}>{data[index].productName}:{hint} {data[index].volume}{data[index].unitsName}</Text>
          )
        })
        return finnal;


      };

      const renderItemSteps = () => {
        let finnal = [];
        let data = this.state.externalData.recipe_steps;
        Object.keys(data).map((key, index) => {
          

          if (data[key] !== undefined) {
            finnal.push(
              <Text style={{
                // borderLeftWidth: 4, borderLeftColor: '#689F38',
                // borderRadius: 15,
                marginLeft: 9, marginRight: 9,
                // shadowColor: "#000",
                // shadowOffset: {
                //     width: 0,
                //     height: 7,
                // },
                // shadowOpacity: 0.41,
                // shadowRadius: 9.11,
                // marginBottom: 20,
                // marginTop: 10,
                paddingTop: 10,
                // elevation: 6,
                // backgroundColor: '#ffffff',
                paddingLeft: 10
              }}><Text style={{ fontWeight: 'bold' }}>{data[key].stepId}. </Text>{data[key].step}</Text>
            )
          }
        })
        return finnal;


      };
      let publicRec = <Text style={{
        paddingBottom: 5, marginRight: 10, marginBottom: 10, marginTop: 5, alignSelf: 'flex-end',
        height: 25, width: 200, flexDirection: 'row'
      }}></Text>
      if (this.state.externalData.recipe.public == 0 && (this.state.externalData.recipe.old_owner == null || this.state.externalData.recipe.old_owner == 0)) {
        publicRec = <TouchableOpacity
          style={{
            paddingBottom: 5, marginRight: 10, marginBottom: 10, marginTop: 5, borderBottomWidth: 1, alignSelf: 'flex-end', textAlign: 'right',
            height: 25, width: 140, flexDirection: 'row'
          }}
          onPress={() => {
            Alert.alert(
              '',
              "Моля уверете се че всички полета на рецептата са попълнени , включително и времената за приготвяне на отделните етапи." +
              "След като направите рецептата публична наш служител ще я прегледа и удобри.",
              [
                {
                  text: "Отказ",
                  onPress: () => {  },
                  style: "cancel"
                },
                {
                  text: "Публикувай", onPress: () => {
                    this.setPublic(this.state.externalData.recipe.id)
                  }
                }
              ],
              { cancelable: false }
            );
          }

          }
        >
          <Text>Направи публична</Text>
        </TouchableOpacity>
      } else if (this.state.externalData.recipe.public == 2) {
        publicRec = <Text style={{
          paddingBottom: 5, marginRight: 10, marginBottom: 10, marginTop: 5, alignSelf: 'flex-end',
          height: 25, width: 160, flexDirection: 'row', color: 'blue'
        }}>В процес на одобрение</Text>
      }
      let photo = '';

      if (this.state.externalData.recipe.youtube != null) {
        photo = <YoutubePlayer
          height={300}
          play={true}
          videoId={this.state.externalData.recipe.youtube.split('?v=')[1]}
        />
      } else {



        if (this.state.externalData.recipe.photo != null) {
          photo = <Image source={{ uri: 'https://kulinarcho.s3.eu-central-1.amazonaws.com/recipes/' + this.state.externalData.recipe.photo + '?time' + (new Date()).getTime() }} resizeMethod={'auto'} style={{
            flex: 1,
            aspectRatio: 0.9, width: '96%',
            resizeMode: 'contain', borderRadius: 15, paddingBottom: 0, marginBottom: 10,
          }} />
        } else {
          photo = <Image
            source={require('../../../Image/rsz_plate.png')}
            resizeMethod={'resize'} style={{
              flex: 1,
              width: '96%', height: 300,
              borderRadius: 15, paddingBottom: 0, marginBottom: 10,
            }} />
        }
      }
      let galler = <View></View>
      let showGallery = <View></View>
      let category = '';
      if(this.state.externalData.recipe.categories  == 1){
        category = 'Салати';
      }else if(this.state.externalData.recipe.categories  == 2){
        category = 'Супи';
      }else if(this.state.externalData.recipe.categories  == 3){
        category = 'Предястия';
      }else if(this.state.externalData.recipe.categories  == 4){
        category = 'Сосове';
      }else if(this.state.externalData.recipe.categories  == 5){
        category = 'Ястия с месо';
      }else if(this.state.externalData.recipe.categories  == 6){
        category = 'Ястия без месо';
      }else if(this.state.externalData.recipe.categories  == 7){
        category = 'Тестени';
      }else if(this.state.externalData.recipe.categories  == 8){
        category = 'Десерти';
      }else if(this.state.externalData.recipe.categories  == 9){
        category = 'Риба';
      }else if(this.state.externalData.recipe.categories  == 10){
        category = 'Напитки';
      }else if(this.state.externalData.recipe.categories  == 11){
        category = 'Зимнина';
      }else if(this.state.externalData.recipe.categories  == 12){
        category = 'Бебешки и детски храни';
      }else if(this.state.externalData.recipe.categories  == 13){
        category = 'Други';
      }
      if (this.state.gallery != null) {
        showGallery = <TouchableHighlight style={{ height: 50, flex: 1, marginTop: 15 }} onPress={() => {
          this.fetchData(true)
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
            <View style={{
              backgroundColor: 'silver', height: 50, paddingBottom: 4, borderTopWidth: 1, borderBottomWidth: 1,
              borderColor: "silver",
            }}>
              <Icon style={{ flex: 1, marginRight: 15, height: 50, borderRightWidth: 1, borderColor: 'silver' }}
                size={30}
                containerStyle={{
                  backgroundColor: 'silver',
                  padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10
                }}
                color={'green'}
                onPress={() => {
                  this.fetchData(true)
                }}
                type='ionicon'
                backgroundColor='silver'
                name='images-outline'
              ></Icon>

            </View>
            <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
              <Text style={{ flex: 3, marginTop: 15 }}>Галерия</Text>
            </View>
          </View>
        </TouchableHighlight>
        galler = <ImageView
          images={this.state.gallery}
          imageIndex={0}
          isVisible={this.state.galleryShow}
          onClose={() => this.setState({ galleryShow: false })}

          renderFooter={(currentImage) => (<View><Text>My footer</Text></View>)}
        />
      }

      return (

        <View style={styles.MainContainer}>
          <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
          <BottomSheet
            animationType="slide"
            transparent={true}
            visible={this.state.checkCamera}
            onBackdropPress={() => {
              this.setState({ checkCamera: false })
            }}
            onRequestClose={() => {
              this.setState({ checkCamera: false })
            }}
          >

            <View style={{
              backgroundColor: '#fff',
              width: '100%',
              height: 120,
              justifyContent: 'center',
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
            }}>
              <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

                <TouchableOpacity onPress={() => {
                  this.launchCamera()

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
                        this.launchCamera()


                      }

                      }
                      type='ionicon'
                      backgroundColor='silver'
                      name='camera-outline'
                    >Редактирай</Icon>
                    <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Камера</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 15 }}>

                <TouchableOpacity onPress={() => {
                  this.launchGalery()

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
                        this.launchGalery()
                      }

                      }
                      type='ionicon'
                      name='images-outline'
                    >Редактирай</Icon>
                    <Text style={{ marginTop: 5, fontSize: 18, marginLeft: 10, fontWeight: 'bold' }}>Галерия</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </BottomSheet>
          <View style={{}}>

            {publicRec}

          </View>
          <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }} >
            <Text style={{
              marginLeft: 9, marginRight: 9,
              height: 45,
              alignItems: 'center',
              textAlign: 'center',
              marginTop: 10,
              paddingLeft: 10, fontSize: 20
            }}>{this.state.externalData.recipe.title} </Text>

<Text style={{
              // borderLeftWidth: 4, borderLeftColor: '#689F38',
              // borderRadius: 15,
              textAlign: 'center',
              // shadowColor: "#000",
              // shadowOffset: {
              //     width: 0,
              //     height: 7,
              // },
              // shadowOpacity: 0.41,
              // shadowRadius: 9.11,
              // marginBottom: 20,
             fontSize:18,
              // elevation: 6,
              // backgroundColor: '#ffffff',
              paddingLeft: 10,
              backgroundColor: '#689F38',
              marginBottom:10
            }}>{category}</Text>
            <View style={{
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
              paddingBottom: 10,
              elevation: 6,
              backgroundColor: '#ffffff',
              paddingLeft: 10,
              paddingRight: 10
            }}>
              {photo}
              <Icon
                containerStyle={{
                  backgroundColor: 'white', width: 40, height: 40,
                  marginTop: -50, marginLeft: 10, borderRadius: 40, alignContent: 'center', paddingBottom: 5, paddingLeft: 1
                }}
                color={'green'}
                type='ionicon'
                size={40}

                onPress={() => {
                  this.setState({ checkCamera: true })
                }}


                name='add-outline'
              ></Icon>

            </View>
            {showGallery}
            {galler}
            <Text style={{
              // borderLeftWidth: 4, borderLeftColor: '#689F38',
              // borderRadius: 15,
              marginLeft: 9, marginRight: 9,
              // shadowColor: "#000",
              // shadowOffset: {
              //     width: 0,
              //     height: 7,
              // },
              // shadowOpacity: 0.41,
              // shadowRadius: 9.11,
              // marginBottom: 20,
              height: 45,
              paddingTop: 10,
              // elevation: 6,
              // backgroundColor: '#ffffff',
              paddingLeft: 10
            }}>Порции: {this.state.externalData.recipe.portion} </Text>
            <View style={{
              // flexDirection: 'column',
              // borderLeftWidth: 4, borderLeftColor: '#689F38',
              // borderRadius: 15,
              marginLeft: 9, marginRight: 9,
              // shadowColor: "#000",
              // shadowOffset: {
              //     width: 0,
              //     height: 7,
              // },
              // shadowOpacity: 0.41,
              // shadowRadius: 9.11,
              marginBottom: 20,
              // height: 80,
              paddingTop: 10,
              marginTop: 10,
              // elevation: 6,
              // backgroundColor: '#ffffff',
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
          {Add}
        </View>
      );
    }
  }
};
export default ShowRecipe;
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