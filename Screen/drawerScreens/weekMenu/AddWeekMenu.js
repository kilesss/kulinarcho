

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker'
import RBSheet from "react-native-raw-bottom-sheet";

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableHighlight
} from "react-native";
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';
import { Icon } from 'react-native-elements'
import SearchableDropdown from 'react-native-searchable-dropdown';
import { BackHandler } from 'react-native';

class AddWeekMenu extends React.Component {



  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
      BackHandler.addEventListener("hardwareBackPress", async () => {
        let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
        let lastRoute = route.pop();
        if (lastRoute != 'AddWeekMenu') {
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

  state = {

    externalData: null,
    modalVisible: '',
    endDate: '',
    beginDate: '',
    dayDifference: 0,
    title: '',
    daysCardsObj: {},
    dropdownDays: [],
    showButton: false,
    dayDropdown: 0,
    recipeDropdown: 0,
    dayDropdownIndex: 'Ден',
    recipeDropdownIndex: 'Рецепта',
    textInputArea: [],
    edit: 0,
    weekMenuID: 0,
    count: false,
    premium: 0,

  }


  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('AddWeekMenu')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] != 'AddWeekMenu') {
        arrRoute.push('AddWeekMenu')
      }
      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

      this.setState({ externalData: null }),
        this.setState({ modalVisible: '' }),
        this.setState({ endDate: '' }),
        this.setState({ beginDate: '' }),
        this.setState({ dayDifference: 0 }),
        this.setState({ title: '' }),
        this.setState({ daysCardsObj: {} }),
        this.setState({ dropdownDays: [] }),
        this.setState({ showButton: false }),
        this.setState({ weekMenuID: 0 }),
        this.setState({ dayDropdown: 0 }),
        this.setState({ recipeDropdown: 0 }),
        this.setState({ dayDropdownIndex: 'Ден' }),
        this.setState({ recipeDropdownIndex: 'Рецепта' }),
        this.setState({ textInputArea: [] }),
        this.setState({ edit: 0 }),
        await this.fetchData();
      await this.checkPremium();
     
      var DEMO_TOKEN2 = await AsyncStorage.getItem('weekMenuID');
      this.setState({ weekMenu: DEMO_TOKEN2 });
      AsyncStorage.removeItem('weekMenuID');
      if (DEMO_TOKEN2 !== null) {
        await this.fetchDataMenu(DEMO_TOKEN2);
      }

      // await this.fetchDataShoppingLists();
    });
  }
  async checkPremium() {
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch(global.MyVar+'checkPremium', {
      method: 'POST',
      body: JSON.stringify({ types: 'menu' }),
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

        this.setState({ premium: data.premium });
        this.setState({ count: data.response })

      }
    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
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

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  setAmount = (id) => {
    this.setState({ amount: id })
  }


  async fetchData() {

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');


    fetch(global.MyVar+"recipes", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + DEMO_TOKEN
      }
    }).then(response => response.json())
      .then(data => {
        this.setState({premium:data.premium})
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
        let newData = [];

        Object.keys(data).map((key, index) => {
          newData.push({ name: data[index].title, id: data[index].id });
        })

        this.setState({ externalData: newData });

      }).done();
  }


  async fetchDataMenu(id) {
    

    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    this.setState({ edit: id });
    fetch(global.MyVar+"weekMenuID?id=" + id, {
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
        this.setState({premium:data.premium})
        delete data.premium;

        Object.keys(data.weekMenu).map((key, index) => {
          // newData.push({ name: data[index].title, id: data[index].id });
          this.setState({ title: data.weekMenu[key].title })
          this.setState({ endDate: data.weekMenu[key].endDate })
          this.setState({ beginDate: data.weekMenu[key].beginDate })
        })
        this.submitEndDate(this.state.endDate);
        var daysObj = this.state.daysCardsObj;
        let textInputArea = [];
        Object.keys(data.recipes).map((key, index) => {
          if (data.recipes[index] != undefined) {
            var f = daysObj[data.recipes[index].day].recipes;

            Object.keys(this.state.externalData).map((key2, index3) => {
              if (data.recipes[index].RecipeId == this.state.externalData[index3].id) {
                f.push(this.state.externalData[index3])
              }

            })
            daysObj[data.recipes[index].day].recipes = f;

          }
        })
        this.setState({ daysCardsObj: daysObj });
        this.generateDays()
      }).done();
  }

  async submitRecipe(generate) {

    
    var DEMO_TOKEN = await AsyncStorage.getItem('access_token');
    await fetch(global.MyVar+'submitWeekMenu', {
      method: 'POST',
      body: JSON.stringify({
        endDate: this.state.endDate,
        beginDate: this.state.beginDate,
        title: this.state.title,
        save: generate,
        daysCardsObj: this.state.daysCardsObj,
        edit: this.state.edit
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
        if (data.error === undefined) {
        }
        if (generate === 1) {
          this.props.navigation.navigate('ListWeekMenu');
        } else {
          
          AsyncStorage.setItem('productsGenerate', JSON.stringify(data)).then(data => {
            this.props.navigation.navigate('GenerateShoppingList')

          });


        }

      }

    ).catch(function (error) {
      
      // ADD THIS THROW error
      throw error;
    });
  }

  submitEndDate = (date) => {
    if (this.state.beginDate != '') {
      var myDate = this.state.beginDate.split("-");
      var newDate = new Date(myDate[0], myDate[1] - 1, myDate[2]);
      var begintTime = newDate.getTime();

      var myDate2 = date.split("-");
      var newDate2 = new Date(myDate2[0], myDate2[1] - 1, myDate2[2]);
      var endTime = newDate2.getTime();
      if (endTime <= begintTime) {
        Alert.alert(
          '',
          'Крайната дата трябва да е след  началната',
          [
            {
              text: 'Добре',
              onPress: () => {
                return null;
              },
            },

          ],
          { cancelable: false }
        );
      } else {

        var date1 = new Date(this.state.beginDate);
        var date2 = new Date(date);

        // To calculate the time difference of two dates 
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates 
        this.setState({ dayDifference: Difference_In_Time / (1000 * 3600 * 24) });
        this.setState({ endDate: date });
        this.setState({ title: 'Меню: ' + this.state.beginDate + ' - ' + date })
        var ddd = []
        var dropdownDays = [];
        for (var i = 0; i <= this.state.dayDifference; i++) {
          var result = new Date(this.state.beginDate);

          result.setDate(result.getDate() + i);

          var obj = {};
          obj = {
            title: 'Ден ' + (i + 1) + ': ' + result.getFullYear() + '-' + result.getMonth() + 1 + '-' + result.getDate(),
            recipes: []
          };
          ddd.push(obj);
          dropdownDays.push({
            name: 'Ден ' + (i + 1) + ': ' + result.getFullYear() + '-' + result.getMonth() + 1 + '-' + result.getDate(),
            value: i
          });
        }
        this.setState({ dropdownDays: dropdownDays })
        this.setState({ daysCardsObj: ddd })
        this.generateDays();
      }
      this.setState({ showButton: true })
    }

  }

  setProductID = (id) => {
    Object.keys(this.state.externalData).map((key, index) => {
      if (this.state.externalData[index].id == id) {
        this.setState({ recipeDropdownIndex: this.state.externalData[index].name })
      }
    })
    // dayDropdownIndex: 0,
    // recipeDropdownIndex: 0,
    this.setState({ recipeDropdown: id })
  }
  addRecipeToObejct = () => {

    var daysObj = this.state.daysCardsObj;
    let textInputArea = [];

    Object.keys(daysObj).map((key, index) => {
      if (index == (this.state.dayDropdown)) {
        Object.keys(this.state.externalData).map((key2, index2) => {
          if (this.state.externalData[index2].id == this.state.recipeDropdown) {
            var f = daysObj[index].recipes;

            f.push(this.state.externalData[index2])
            daysObj[index].recipes = f;
          }
        })
      }

    });
    this.setState({ daysCardsObj: daysObj });
    this.generateDays();
  }
  deleteRecipe = (i, i2, id) => {
    var daysObj = this.state.daysCardsObj;
    Object.keys(daysObj[i]).map((key2, index2) => {
      if (index2 === i2) {
        delete daysObj[i].recipes[index2]
      }
    })
    daysObj[i].recipes = daysObj[i].recipes.filter(function (element) {
      return element !== undefined;
    });

    daysObj[i].recipes = daysObj[i].recipes;
    this.setState({ daysCardsObj: daysObj });
    this.generateDays();

  }
  generateDays = () => {
    var daysObj = this.state.daysCardsObj;
    let textInputArea = [];
    Object.keys(daysObj).map((key, index) => {

      let recipeFields = [];
      if (daysObj[index].recipes.length != 0) {
        Object.keys(daysObj[index].recipes).map((key2, index2) => {
          if (daysObj[index].recipes[index2] !== undefined) {
            recipeFields.push(



              <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ flex: 4, marginLeft: 10, color: 'silver', fontSize: 16 }}>{daysObj[index].recipes[index2].name}</Text>
                <Icon
                  name='delete-forever'
                  color={'red'}
                  onPress={() => {
                    this.deleteRecipe(index, index2, daysObj[index].recipes[index2].id)
                  }
                  }
                  size={30}
                  style={styles.icon} ></Icon>
              </View>);
          }
        })
      }
      let { width } = Dimensions.get('window');

      textInputArea.push(
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
              <Text
                style={{
                  marginLeft: 10,
                  flex: 1,
                  fontSize: 19,
                  fontWeight: '200',
                  // fontFamily: 'sans-serif',
                  marginBottom: 4,
                  alignSelf: 'center',
                }}>
                {daysObj[index].title}
              </Text>
              <Icon style={styles.icon}
                size={30}
                color={'silver'}
                onPress={() => {
                  let count = index + 1;
                  
                  

                  this.setState({ dayDropdown: index })
                  
                  // this.setState({modalEditTitle: 'Редактиране на списък'})
                  this.RBSheet.open();
                  this.setState({ recipeDropdownIndex: 'Рецепта' })

                }

                }
                name='add'
              >Редактирай</Icon>
            </View>
            <View style={{ flex: 1 }}>


              {recipeFields}

            </View>

          </View>
        </View>


      );

    })

    this.setState({ textInputArea: textInputArea });
    // this.setModalVisible(!modalVisible);

  }

  render(props) {
    if (this.state.externalData === null && this.state.count === false) {
      return (
        <View style={styles.MainContainer}>
         <ActivityIndicator size="large" color="#7DE24E" /> 
        </View>
      )
    } else {
      
      let Add = <AdMobBanner
        bannerSize="smartBannerLandscape"
        adUnitID={'ca-app-pub-5428132222163769/3462576946'}
        
        servePersonalizedAds={true} />;
      if (this.state.premium != 0) {
        Add = <View></View>;
      }


      var test = ''
      var test2 = ''

      const { modalVisible } = this.state;
      if (this.state.showButton !== false) {
        // test = <Card style={{ flex: 1, marginLeft: 0, marginRight: 0 }}>
        //   <Button title="Добави рецепта" onPress={() => { this.setModalVisible(true); this.setState({ dayDropdownIndex: 'Ден' }); this.setState({ recipeDropdownIndex: 'Рецепта' }) }} />
        // </Card>
        let generateButton = [];
        if (this.state.weekMenuID !== 0) {
          generateButton.push(<Text></Text>)
        } else {
          generateButton.push(<TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
            this.submitRecipe(0)
          }} underlayColor="white"
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

                    this.submitRecipe(0)

                  }

                  }
                  type='ionicon'
                  backgroundColor='silver'
                  name='reader-outline'
                ></Icon>

              </View>
              <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                <Text style={{ flex: 3, marginTop: 5, marginLeft: 5 }}>Генерирай списък</Text>
              </View>
            </View>
          </TouchableHighlight>)
        }

        test2 =
          (<View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
            <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
              this.submitRecipe(1)
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
                      this.submitRecipe(1)

                    }

                    }
                    type='ionicon'
                    backgroundColor='silver'
                    name='save-outline'
                  ></Icon>

                </View>
                <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                  <Text style={{ flex: 3, marginTop: 15 }}>Запази</Text>
                </View>
              </View>
            </TouchableHighlight>
            {generateButton}
          </View>)





      } else {
        test = <Text></Text>
        test2 = <Text></Text>

      }
      let fields = <View >
      <View style={{ flexDirection: "row", flex: 1, marginTop: 20 }}>
        <DatePicker

          style={{ flex: 1, marginLeft: 5, padding: 0 }}
          date={this.state.beginDate}
          mode="date"
          placeholder="Начална дата"
          format="YYYY-MM-DD"
          minDate={new Date()}
          confirmBtnText="Запази"
          cancelBtnText="Отказ"
          showIcon='false'
          customStyles={{
            dateIcon: {
              width: 0,
              height: 0,
            },
            dateInput: {
              borderRadius: 15,
              marginRight: 9,
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
              borderLeftColor: '#689F38', borderBottomColor: 'silver', borderTopColor: 'silver', borderRightColor: 'silver', borderLeftWidth: 4,
              paddingLeft: 10,
              marginLeft: 10,
              width: '100%'
            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={(date) => { this.setState({ beginDate: date }) }}
        />
        <DatePicker
          style={{ flex: 1, padding: 0, }}
          date={this.state.endDate}
          mode="date"
          placeholder="Крайна дата"
          format="YYYY-MM-DD"
          minDate={new Date()}
          confirmBtnText="Запази"
          cancelBtnText="Отказ"
          showIcon='false'
          customStyles={{
            dateIcon: {
              width: 0,
              height: 0,
            },
            dateInput: {
              borderRadius: 15,
              marginRight: 9,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7,
              },
              height: 50,
              shadowOpacity: 0.41,
              shadowRadius: 9.11,
              marginBottom: 20,
              borderLeftColor: '#689F38', borderBottomColor: 'silver', borderTopColor: 'silver', borderRightColor: 'silver', borderLeftWidth: 4,
              elevation: 6,
              backgroundColor: '#ffffff',
              paddingLeft: 10,
              width: '100%'

            }
            // ... You can check the source to find the other keys.
          }}
          onDateChange={(date) => { this.submitEndDate(date); }}
        />
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TextInput
          placeholder={this.state.title}
          style={{
            borderRadius: 15,
            marginRight: 9,
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
            paddingLeft: 10,
            width: '90%',
            marginTop: 15,
            marginRight: 10,
            marginLeft: 15,
            borderWidth: 1,
            borderLeftWidth: 4, borderLeftColor: '#689F38', borderBottomColor: 'silver', borderTopColor: 'silver', borderRightColor: 'silver'

          }}
          placeholder={"Заглавие"}
          defaultValue={this.state.title}
          onChangeText={title => this.setState({ title: title })}
        />
      </View>
    </View>
   
 if(this.state.premium != 1){
    if ((this.state.count == 'ok' || this.state.count < 1)) {



}else{
  fields= 
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
      marginTop: 20,
      elevation: 6,
      backgroundColor: '#ffffff',
    }}>
      <View style={{ borderBottomBottom: 1, borderBottomColor: 'silver', width: '100%' }}>
        <Text style={{ fontSize: 21, textAlign: 'center', marginBottom: 5, marginTop: 10 }}>Достигнат лимит</Text>
      </View>
     
      

      <View style={{height:150}}>
        <View style={{ flexDirection: 'row', borderBottomBottom: 1, borderBottomWidth: 1, borderBottomColor: 'silver', width: '100%', marginBottom: 20 }}>
          <Text style={{ textAlign: 'center', fontSize: 16, marginBottom:10 }}>Достигнахте лимита си на безплатно генерирани списъци. Може да увеличите лимита
           като преминете на премиум план</Text>
        </View>
        <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
              this.props.navigation.navigate('payments');
            }} underlayColor="white"
      >
        <View style={{
           flexDirection: "row",
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
              size={35}
              containerStyle={{
                backgroundColor: '#ebebeb',
                padding: 10, marginLeft: -10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, 
                paddingTop:5
              }}
              color={'gold'}
              onPress={() => {

                this.props.navigation.navigate('payments');

              }

              }
              type='ionicon'
              backgroundColor='silver'
              name='star'
            ></Icon>

          </View>
          <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
            <Text style={{ flex: 3, marginTop: 5, marginLeft: 5 , }}>Премиум</Text>
          </View>
        </View>
      </TouchableHighlight>
      </View>
      


    </View>

}
 }

      return (
        <View style={styles.MainContainer}>
          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={200}

            customStyles={{
              container: {
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                justifyContent: "center",
                alignItems: "center"
              }
            }}
          >
            <View style={{ flex: 1, marginTop: 10, width: '95%' }}>
              <View style={{ maxHeight: 200 }}>

                <SearchableDropdown
                  showNoResultDefault={'false'}

                  style={{}}
                  //On text change listner on the searchable input
                  onItemSelect={(item) => this.setProductID(item.id)}
                  //onItemSelect called after the selection from the dropdown
                  containerStyle={{ padding: 5, width: '100%' }}
                  //suggestion container style
                  textInputStyle={{
                    borderLeftWidth: 4,
                    // borderBottomWidth:4, borderBottomColor:'#689F38',

                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowRadius: 3,
                    shadowOpacity: 0.5,
                    borderRadius: 7,
                    padding: 10,
                    height: 40,
                    borderWidth: 1, borderColor: 'silver',
                    //inserted text style
                    borderBottomWidth: 1,

                    width: '100%',
                    borderLeftColor: '#689F38',
                  }}
                  itemStyle={{
                    //single dropdown item style
                    padding: 10,
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                    width: '100%',
                    borderLeftColor: '#689F38',

                  }}
                  itemTextStyle={{
                    //text style of a single dropdown item
                    color: '#222',
                  }}
                  itemsContainerStyle={{
                    //items container style you can pass maxHeight
                    //to restrict the items dropdown hieght
                    maxHeight: '100%',
                    paddingBottom: 0,
                    marginBottom: 0
                  }}
                  items={this.state.externalData}
                  //mapping of item array
                  // defaultIndex={this.state.recip eDropdownIndex}
                  //default selected item index
                  placeholder={this.state.recipeDropdownIndex}
                  //place holder for the search input
                  resetValue={false}
                  //reset textInput Value with true and false state
                  underlineColorAndroid="transparent"
                //To remove the underline from the android input
                />
              </View>


              <View style={styles.modalBtn}>
              <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
 this.RBSheet.close();
 this.addRecipeToObejct();
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
                      this.RBSheet.close();
                      this.addRecipeToObejct();
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
            <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
                    this.RBSheet.close();
                  }} underlayColor="white"
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
                    color={'red'}
                    onPress={() => {
                      this.RBSheet.close();
                    }

                    }
                    type='ionicon'
                    backgroundColor='silver'
                    name='close-outline'
                  >Редактирай</Icon>

                </View>
                <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
                  <Text style={{ flex: 3, marginTop: 15 }}>Откажи</Text>
                </View>
              </View>
            </TouchableHighlight>
                
              </View>
            </View>
          </RBSheet>
          <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }} >
          <View style={styles.container}>
        
        {fields}

        {this.state.textInputArea.map((value, index) => {
          return value
        })}
      </View>

            {test2}
          </ScrollView>
          {Add}

        </View>
      );

    }
  }
};
export default AddWeekMenu;
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
    marginBottom: 20,

    width: '100%',
    height: '50%'
  },
  container: {
    width: '100%',
    marginTop: 20,
    flex: 1,
    marginBottom: 20
  },
  inputRow: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'silver',
    flex: 1,
    borderBottomWidth: 1,
    marginTop: 10,
    marginTop: 15,
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
    maxHeight: 350,

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