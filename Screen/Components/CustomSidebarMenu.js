
import React, { Component } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text, Alert, TouchableHighlight, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'

const SECTIONS = [
    // {
    //         navOptionName: 'Начало',
    //         screenToNavigate: 'ShoppingList',
    //     },

    {

        title: 'Списък пазар',
        content:
            [
                {
                    navOptionName: 'Списъци пазар',
                    screenToNavigate: 'ShoppingLists',
                },
                {
                    navOptionName: 'Продукти/Категории',
                    screenToNavigate: 'ProductsSettings',
                },
                {
                    navOptionName: 'Архив',
                    screenToNavigate: 'ShoppingListArchive',
                },

            ],
    },
    {
        navOptionName: 'Търси рецепта',
        screenToNavigate: 'searchRecipe',
    },
    {
        navOptionName: 'Нашите готвачи',
        screenToNavigate: 'searchUser',
    },

    {
        title: 'Рецепти',
        content:
            [
                {
                    navOptionName: 'Добави рецепта',
                    screenToNavigate: 'AddRecipes',
                },
                {
                    navOptionName: 'Готварска книга',
                    screenToNavigate: 'ListRecipes',
                },
              
            ],
    },

    {
        title: 'Седмично меню',
        content:
            [
                {
                    navOptionName: 'Ново седмично меню',
                    screenToNavigate: 'AddWeekMenu',
                },
                {
                    navOptionName: 'Списък Седмични менюта',
                    screenToNavigate: 'ListWeekMenu',
                },
                {
                    navOptionName: 'Архив',
                    screenToNavigate: 'ArchiveWeekMenu',
                },


            ],
    },
    // {
    //     title: 'Финанси',
    //     content:
    //         [
    //             {
    //                 navOptionName: 'Приход/Разход',
    //                 screenToNavigate: 'AddRecipes',
    //             },
    //             {
    //                 navOptionName: 'Сметки',
    //                 screenToNavigate: 'Accounts',
    //             },
    //             {
    //                 navOptionName: 'Портфейли',
    //                 screenToNavigate: 'ListRecipes',
    //             },
    //             {
    //                 navOptionName: 'Кредити',
    //                 screenToNavigate: 'ListRecipes',
    //             },
    //             {
    //                 navOptionName: 'Кредити',
    //                 screenToNavigate: 'ListRecipes',
    //             },

    //             {
    //                 navOptionName: 'Режиини',
    //                 screenToNavigate: 'ListRecipes',
    //             },

    //         ],
    // },
    {
        navOptionName: 'Обратна връзка',
        screenToNavigate: 'Feedback',
    },

    {
        navOptionName: 'Logout',
        screenToNavigate: 'logout',
    },

];

class CustomSidebarMenu extends Component {
    state = {
        activeSections: [],
    };
    _renderSectionPirmarymenu = section => {
        return (
            <View>
            </View>
        );

    }
    _renderSectionTitle = section => {
        return (
            <View style={{ backgroundColor: 'blue' }}>
            </View>
        );
    };

    _renderHeader = section => {
        if (section.navOptionName) {
            return (<View style={styles2.header}>
                <View
                    style={{

                        color: 'white',
                        backgroundColor:
                            global.currentScreenIndex === section.screenToNavigate
                                ? '#689F38'
                                : '#689F38',
                    }}
                    onStartShouldSetResponder={() =>
                        this.handleClick(1, section.screenToNavigate)
                    }>
                    <Text style={styles2.headerText}>
                        {section.navOptionName}
                    </Text>
                </View>

            </View>)
        } else {
            return (
                <View style={{ ...styles2.header, flexDirection: 'row' }}>
                    <Text style={styles2.headerText}>{section.title}</Text>
                    <View style={{}}>
                        <Icon
                            color={'white'}
                            type='ionicon'
                            name='chevron-down-outline'
                        ></Icon>
                    </View>

                </View>
            );
        };
    }
    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    handleClick = (index, screenToNavigate) => {
        let _menu = null;


        if (screenToNavigate == 'logout') {
            this.props.navigation.toggleDrawer();
            Alert.alert(
                'Logout',
                'Are you sure? You want to logout?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {
                            return null;
                        },
                    },
                    {
                        text: 'Confirm',
                        onPress: () => {
                            AsyncStorage.clear();
                            this.props.navigation.navigate('Auth');
                        },
                    },
                ],
                { cancelable: false }
            );
        } else {
            this.props.navigation.toggleDrawer();
            global.currentScreenIndex = screenToNavigate;
            this.props.navigation.navigate(screenToNavigate);
        }
    };
    _renderContent = section => {
        if (section.navOptionName) {


        } else {
            let items = section.content;

            return (
                <View style={styles2.content}>
                    {items.map((item, key) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                marginLeft: 20,
                                padding: 20,
                                color: 'white',
                                backgroundColor:
                                    global.currentScreenIndex === item.screenToNavigate
                                        ? '#689F38'
                                        : '#689F38',
                            }}
                            key={key}
                        >
                            <TouchableOpacity onPress={() => {
                                this.handleClick(key, item.screenToNavigate)
                            }}>
                                <Text style={{ fontSize: 15, color: 'white' }}>
                                    {item.navOptionName}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            );
        }
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    render() {
        

        return (
            <View style={stylesSidebar.sideMenuContainer}>
                <View style={stylesSidebar.profileHeader}>

                    <TouchableHighlight
                        style={{}}
                        onPress={() => {
                            this.props.navigation.navigate('ShowProfile');

                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../Image/circle-cropped.png')}

                                style={{ width: 60, height: 60 }}
                            />
                            <Text style={stylesSidebar.profileHeaderText}>Профил</Text>
                        </View>

                    </TouchableHighlight>
                </View>
                <View style={stylesSidebar.profileHeaderLine} />
                <View style={{ width: '100%', flex: 1 }}>
                    <ScrollView style={styles2.scrollView} contentContainerStyle={{ flexGrow: 1 }} >

                        <Accordion
                            sections={SECTIONS}
                            activeSections={this.state.activeSections}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                            onChange={this._updateSections}
                        />
                    </ScrollView>
                </View>
            </View>


        );
    }
}


const stylesSidebar = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#689F38',
        paddingTop: 40,
        color: 'white',
    },
    profileHeader: {
        flexDirection: 'row',
        backgroundColor: '#689F38',
        padding: 15,
        paddingBottom: 0,
        textAlign: 'center',
    },
    profileHeaderPicCircle: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        color: 'white',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileHeaderText: {
        marginTop: 20,
        marginLeft: 10,
        fontSize: 18,
        color: 'white',
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    profileHeaderLine: {
        height: 1,
        marginHorizontal: 20,
        backgroundColor: '#e2e2e2',
        marginTop: 15,
        marginBottom: 10,
    },
});
export default CustomSidebarMenu;
const styles2 = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        flex: 1,
        fontSize: 22,
        fontWeight: 'bold',
    },
    header: {
        backgroundColor: '#689F38',
        padding: 20,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',

    },
    separator: {
        height: 0.5,
        backgroundColor: '#689F38',
        width: '95%',
        marginLeft: 16,
        marginRight: 16,
    },
    text: {
        fontSize: 16,
        color: '#606070',
        padding: 10,
    },
    content: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#689F38',
    },
    scrollView: {
        flex: 1,
        marginBottom: 60,

        width: '100%',
        height: '50%'
    },
});
