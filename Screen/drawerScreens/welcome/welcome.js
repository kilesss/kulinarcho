

/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React

import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import DropdownAlert from 'react-native-dropdownalert';
import SearchableDropdown from 'react-native-searchable-dropdown';

import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableHighlight
} from "react-native";
import { Icon } from 'react-native-elements'
import { BackHandler } from 'react-native';

class welcome extends React.Component {


  constructor(props) {
    super(props);
    this.didFocus = props.navigation.addListener("didFocus", (payload) =>
      BackHandler.addEventListener("hardwareBackPress", async () => {
        let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
        let lastRoute = route.pop();
        if (lastRoute != 'feeback') {
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
    page: 0
  };
  lenght;



  async componentDidMount() {
    const { navigation } = this.props;
    this.props.navigation.setParams({ handleSave: this._saveDetails });
    this.focusListener = navigation.addListener('didFocus', async () => {
      this.fetchData();
      let route = await AsyncStorage.getItem('backRoute'); route = JSON.parse(route);
      let arrRoute = [];

      if (route === null) {
        arrRoute.push('feeback')
      } else {
        arrRoute = route
      }
      if (arrRoute[arrRoute - 1] !== 'feeback') {
        arrRoute.push('feeback')
      }

      AsyncStorage.setItem('backRoute', JSON.stringify(arrRoute));

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
    // Remove the event listener
    this.focusListener.remove();
  }




  render(props) {
    let buttons = <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>

      <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
        this.setState({ editList2: false })

        this.setModalVisible2(!modalVisible2);
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



              }

              }
              type='ionicon'
              backgroundColor='silver'
              name='close-outline'
            >Редактирай</Icon>

          </View>
          <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
            <Text style={{ flex: 3, marginTop: 15 }}>Прекрати</Text>
          </View>
        </View>
      </TouchableHighlight>

      <TouchableHighlight style={{ height: 50, flex: 1 }} onPress={() => {
        this.setState({ page: (this.state.page + 1) })

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
                this.setState({ page: (this.state.page + 1) })
              }

              }
              type='ionicon'
              backgroundColor='silver'
              name='checkmark-outline'
            ></Icon>

          </View>
          <View style={{ flex: 3, backgroundColor: 'white', height: 50, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "silver", alignItems: 'center' }}>
            <Text style={{ flex: 3, marginTop: 15 }}>Напред</Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>



    let page0 = <View style={{}}>
      <Text style={{ fontSize: 22, borderBottomWidth: 1 }}>Добре дошли в Килинарчо</Text>
      <Text style={{ fontSize: 18 }}>Кулинарчо е приложение помагащо ви да организирате по-лесно списъците си за пазар и всичко свързано с кулинарията.</Text>
      <View style={{ marginTop: 20 }}>
        <Image
          resizeMethod={'auto'} style={{
            width: '96%', height: 400,
            resizeMode: 'contain', borderRadius: 15, paddingBottom: 0, marginBottom: 10,
          }}
          source={require('../../../Image/splash.jpg')}
        />
      </View>
      {buttons}

    </View>

    let page1 = <View style={{}}>
      <Text style={{ fontSize: 18, borderBottomWidth: 1, }}>Кулинарчо позволява цялото ви семейство да споделя и вижда всичко в реално време .</Text>
      <Text style={{ fontSize: 18 }}>Това става като всеки член влезе в профила си и изпрати заявка за присъединяване към вашия профил.</Text>
      <View style={{ marginTop: 20 }}>
        <Image
          resizeMethod={'auto'} style={{
            width: '96%', height: 400,
            resizeMode: 'contain', borderRadius: 15, paddingBottom: 0, marginBottom: 10,
          }}
          source={require('../../../Image/splash.jpg')}
        />
      </View>
      {buttons}
      {/* {renderPage()} */}

    </View>

    let page2 = <View style={{}}>
      <Text style={{ fontSize: 18 }}>След като получите нова заявка за присъединяване, тя ще бъде видима в секцията нотификации.</Text>
      <View style={{ marginTop: 20 }}>
        <Image
          resizeMethod={'auto'} style={{
            width: '96%', height: 400,
            resizeMode: 'contain', borderRadius: 15, paddingBottom: 0, marginBottom: 10,
          }}
          source={require('../../../Image/splash.jpg')}
        />
      </View>
      {buttons}

    </View>

    let page3 = <View style={{}}>
      <Text style={{ fontSize: 18 }}>Можете да създавате и управлявате всичките си списъци за пазар от менюто списъци за пазар.</Text>
      <View style={{ marginTop: 20 }}>
        <Image
          resizeMethod={'auto'} style={{
            width: '96%', height: 400,
            resizeMode: 'contain', borderRadius: 15, paddingBottom: 0, marginBottom: 10,
          }}
          source={require('../../../Image/splash.jpg')}
        />
      </View>
      {buttons}
    </View>
    let page4 = <View style={{}}>
      <Text style={{ fontSize: 18 }}>След като създадете своя списък за пазар е нужно да кликнете върху него и вече можете да добавяте продукти.</Text>
      <View style={{ marginTop: 20 }}>
        <Image
          resizeMethod={'auto'} style={{
            width: '96%', height: 400,
            resizeMode: 'contain', borderRadius: 15, paddingBottom: 0, marginBottom: 10,
          }}
          source={require('../../../Image/splash.jpg')}
        />
      </View>
      {buttons}
    </View>
    let page5 = <View style={{}}>
    <Text style={{ fontSize: 18 }}>Кулинарчо дава възможността да следите сумата на своя пазар в реално време.</Text>
    <View style={{ marginTop: 20 }}>
      <Image
        resizeMethod={'auto'} style={{
          width: '96%', height: 400,
          resizeMode: 'contain', borderRadius: 15, paddingBottom: 0, marginBottom: 10,
        }}
        source={require('../../../Image/splash.jpg')}
      />
    </View>
    {buttons}
  </View>
    const renderPage = () => {
      if (this.state.page == 0) {
        return page0;
      } else if (this.state.page == 1) {
        return page1;
      } else if (this.state.page == 2) {
        return page2;
      } else if (this.state.page == 3) {
        return page3;
      } else if (this.state.page == 4) {
        return page4;
      } else if (this.state.page == 5) {
        return page5;
      }


    }

    return (
      <View style={{ width: '100%', flexDirection: 'column', backgroundColor: 'white' }}>
        <DropdownAlert ref={ref => this.dropDownAlertRef = ref} />
        <View style={{ width: "100%", marginTop: 15, }}>

          <ScrollView style={{}}>
            {renderPage()}


          </ScrollView>

        </View>
      </View>);
  }
}
export default welcome;
