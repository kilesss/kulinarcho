/**
 * Created by kilesss on 10/7/2020.
 */
/* This is an Login Registration example from https://aboutreact.com/ */
/* https://aboutreact.com/react-native-login-and-signup/ */

//Import React
import React from 'react';

//Import Navigators
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

//Import External Screens
import ShoppingList from './drawerScreens/shoppingList/ShoppingList';
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';
import NavigationDrawerHeader2 from './Components/NavigationDrawerHeader2';
import NavigationDrawerHeader3 from './Components/NavigationDrawerHeader3';
import Lists from './drawerScreens/shoppingList/Lists';
import ListEditProducts from './drawerScreens/shoppingList/ListEditProducts';
import AddShoppingListProduct from './drawerScreens/shoppingList/AddShoppingListProduct';
import CreateProduct from './drawerScreens/shoppingList/CreateProduct';
import EditProduct from './drawerScreens/shoppingList/EditProduct';
import EditShoppingListProduct from './drawerScreens/shoppingList/EditShoppingListProduct';

import ProductsSettings from './drawerScreens/shoppingList/productsSetings/ProductsSettings';
import TypesSettings from './drawerScreens/shoppingList/productsSetings/TypesSettings';
import CategoriesSettings from './drawerScreens/shoppingList/productsSetings/CategoriesSettings';
import ShoppingListArchive from './drawerScreens/shoppingList/ShoppingListArchive'
import shoppingListArchiveDetailed from './drawerScreens/shoppingList/shoppingListArchiveDetailed'

import AddRecipes from './drawerScreens/recipes/AddRecipes'
import EditRecipes from './drawerScreens/recipes/EditRecipes'
import ListRecipes from './drawerScreens/recipes/ListRecipes'
import ShowRecipe from './drawerScreens/recipes/ShowRecipe'
import AddWeekMenu from './drawerScreens/weekMenu/AddWeekMenu'
import ListWeekMenu from './drawerScreens/weekMenu/ListWeekMenu'
import ArchiveWeekMenu from './drawerScreens/weekMenu/weekMenuArchive'
import weekMenuArchiveDetailed from './drawerScreens/weekMenu/weekMenuArchiveDetailed'
import Accounts from './drawerScreens/finnances/Accounts';
import GenerateShoppingList from './drawerScreens/weekMenu/GenerateShoppingList'
import showCategory from './drawerScreens/searchRecipe/showCategory'

import searchRecipe from './drawerScreens/searchRecipe/searchRecipe'
import showPublicRecipes from './drawerScreens/showPublicRecipes/showPublicRecipes'
import Feedback from './drawerScreens/feedback/feedback'
import searchUser from './drawerScreens/searchUser/searchUser'
import payments from './drawerScreens/payments/payments'

import ShowProfile from './drawerScreens/profile/ShowProfile'
import UserProfile from './drawerScreens/userProfile/UserProfile'

//TODO ostaveno e za da stane nachalen ekran 
const FirstActivity_StackNavigator = createStackNavigator({
    First: {
        screen: Lists, 
        navigationOptions: ({ navigation }) => ({
            title: 'Списък пазар',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const ProductsSettings_StackNavigator = createStackNavigator({
    First: {
        screen: ProductsSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'Продукти',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,

            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const AddRecipes_StackNavigator = createStackNavigator({
    First: {
        screen: AddRecipes,
        navigationOptions: ({ navigation }) => ({
            title: 'Добави рецепта',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const searchUser_StackNavigator = createStackNavigator({
    First: {
        screen: searchUser,
        navigationOptions: ({ navigation }) => ({
            title: 'Нашите готвачи',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const showPublicRecipes_StackNavigator = createStackNavigator({
    First: {
        screen: showPublicRecipes,
        navigationOptions: ({ navigation }) => ({
            title: 'Преглед рецепта',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const Feedback_StackNavigator = createStackNavigator({
    First: {
        screen: Feedback,
        navigationOptions: ({ navigation }) => ({
            title: 'Обратна връзка',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const searchRecipe_StackNavigator = createStackNavigator({
    First: {
        screen: searchRecipe,
        navigationOptions: ({ navigation }) => ({
            title: 'Търси рецепта',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const showCategory_StackNavigator = createStackNavigator({
    First: {
        screen: showCategory,
        navigationOptions: ({ navigation }) => ({
            title: 'Търси рецепта',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});


const payments_StackNavigator = createStackNavigator({
    First: {
        screen: payments,
        navigationOptions: ({ navigation }) => ({
            title: 'Абонамент',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});


const ShowProfile_StackNavigator = createStackNavigator({
    First: {
        screen: ShowProfile,
        navigationOptions: ({ navigation }) => ({
            title: 'Профил',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const UserProfile_StackNavigator = createStackNavigator({
    First: {
        screen: UserProfile,
        navigationOptions: ({ navigation }) => ({
            title: 'Профил',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const AddWeekMenu_StackNavigator = createStackNavigator({
    First: {
        screen: AddWeekMenu,
        navigationOptions: ({ navigation }) => ({
            title: 'Ново седмично меню',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const ListWeekMenu_StackNavigator = createStackNavigator({
    First: {
        screen: ListWeekMenu,
        navigationOptions: ({ navigation }) => ({
            title: 'Списък седмични менюта',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const Accounts_StackNavigator = createStackNavigator({
    First: {
        screen: Accounts,
        navigationOptions: ({ navigation }) => ({
            title: 'Сметки',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const ArchiveWeekMenu_StackNavigator = createStackNavigator({
    First: {
        screen: ArchiveWeekMenu,
        navigationOptions: ({ navigation }) => ({
            title: 'Архив на седмичните менюта',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const weekMenuArchiveDetailed_StackNavigator = createStackNavigator({
    First: {
        screen: weekMenuArchiveDetailed,
        navigationOptions: ({ navigation }) => ({
            title: 'Детайли архив',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const GenerateShoppingList_StackNavigator = createStackNavigator({
    First: {
        screen: GenerateShoppingList,
        navigationOptions: ({ navigation }) => ({
            title: 'Генериране на списък за пазар',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const EditRecipes_StackNavigator = createStackNavigator({
    First: {
        screen: EditRecipes,
        navigationOptions: ({ navigation }) => ({
            title: 'Редактирай рецепта',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const ListRecipes_StackNavigator = createStackNavigator({
    First: {
        screen: ListRecipes,
        navigationOptions: ({ navigation }) => ({
            title: 'Готварска книга',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerRight: () => <NavigationDrawerHeader3 navigationProps={navigation} />,

            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const ShowRecipe_StackNavigator = createStackNavigator({
    First: {
        screen: ShowRecipe,
        navigationOptions: ({ navigation }) => ({
            title: '',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const Types_StackNavigator = createStackNavigator({
    First: {
        screen: TypesSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'Категории',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,

            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const ShoppingListArchive_StackNavigator = createStackNavigator({
    First: {
        screen: ShoppingListArchive,
        navigationOptions: ({ navigation }) => ({
            title: 'Архив',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
const shoppingListArchiveDetailed_StackNavigator = createStackNavigator({
    First: {
        screen: shoppingListArchiveDetailed,
        navigationOptions: ({ navigation }) => ({
            title: 'Архив детайли',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const Categories_StackNavigator = createStackNavigator({
    First: {
        screen: CategoriesSettings,
        navigationOptions: ({ navigation }) => ({ 
            title: 'Разфасовки',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,

            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const ShoppingLists_StackNavigator = createStackNavigator({
    First: {
        screen: Lists,
        navigationOptions: ({ navigation }) => ({
            title: 'Списък пазар',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});



const ShoppingListEditProducts_StackNavigator = createStackNavigator({
    First: {
        screen: ListEditProducts,
        navigationOptions: ({ navigation }) => ({
            title: 'Продукти в списък',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerRight: () => <NavigationDrawerHeader2 navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
                
            },
         
            headerTintColor: '#fff',
        }),
    },
});



const EditShoppingListProduct_StackNavigator = createStackNavigator({
    First: {
        screen: EditShoppingListProduct,
        navigationOptions: ({ navigation }) => ({
            title: 'Редактирай продукт',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const AddShoppingListProduct_StackNavigator = createStackNavigator({
    First: {
        screen: AddShoppingListProduct,
        navigationOptions: ({ navigation }) => ({
            title: 'Добави продукт',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});

const EditProduct_StackNavigator = createStackNavigator({
    First: {
        screen: EditProduct,
        navigationOptions: ({ navigation }) => ({
            title: 'Редактирай продукт',
            headerLeft: () => <NavigationDrawerHeader navigationProps={navigation} />,
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
 
const CreateProduct_StackNavigator = createStackNavigator({
    First: {
        screen: CreateProduct,
        navigationOptions: ({ navigation }) => ({
            title: 'Създай продукт',
            headerLeft: () => {<NavigationDrawerHeader navigationProps={navigation} />, console.log('czxczxczxczxczcx')},
            headerStyle: {
                backgroundColor: '#689F38',
            },
            headerTintColor: '#fff',
        }),
    },
});
 

const DrawerNavigatorRoutes = createDrawerNavigator(
    {
        HomeScreen: {
            screen: FirstActivity_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Активен списък',
            },
        },
        ProductsSettings: {
            screen: ProductsSettings_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Настройка продукти',
            },
        },
        AddRecipes: {
            screen: AddRecipes_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        
        searchUser: {
            screen: searchUser_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        
        showPublicRecipes: {
            screen: showPublicRecipes_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        Feedback: {
            screen: Feedback_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        searchRecipe: {
            screen: searchRecipe_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        showCategory: {
            screen: showCategory_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },

        
        payments: {
            screen: payments_StackNavigator,
            navigationOptions: {
            },
        },
        
        
        AddWeekMenu: {
            screen: AddWeekMenu_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        ListWeekMenu: {
            screen:ListWeekMenu_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        }, 
        Accounts: {
            screen:Accounts_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        }, 
        
        ArchiveWeekMenu: {
            screen:ArchiveWeekMenu_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        weekMenuArchiveDetailed: {
            screen:weekMenuArchiveDetailed_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        GenerateShoppingList: {
            screen: GenerateShoppingList_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        
        ShowProfile: {
            screen: ShowProfile_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        
        UserProfile: {
            screen: UserProfile_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        
        EditRecipes: {
            screen: EditRecipes_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Добави рецепта',
            },
        },
        ListRecipes: {
            screen: ListRecipes_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Списък рецепти',
            },
        },
        ShowRecipe: {
            screen: ShowRecipe_StackNavigator,
            navigationOptions: {
                drawerLabel: '',
            },
        },
        

        EditProduct: {
            screen:EditProduct_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Продукти в списък',
            },
        },  
        CreateProduct: {
            screen:CreateProduct_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Продукти в списък',
            },
        },   
          AddShoppingListProduct: {
            screen:AddShoppingListProduct_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Продукти в списък',
            },
        }, 
        EditShoppingListProduct: {
            screen:EditShoppingListProduct_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Продукти в списък',
            },
        },


        ShoppingListEditProducts: {
            screen: ShoppingListEditProducts_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Продукти в списък',
            },
        },
        ShoppingLists: {
            screen: ShoppingLists_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Списъци пазар',
            },
        },
        TypesSettings: {
            screen: Types_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Типове',
            },
        },
        
        ShoppingListArchive: {
            screen:ShoppingListArchive_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Типове',
            },
        },
        shoppingListArchiveDetailed: {
            screen:shoppingListArchiveDetailed_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Типове',
            },
        },
        
        CategoriesSettings: {
            screen: Categories_StackNavigator,
            navigationOptions: {
                drawerLabel: 'Категории',
            },
        },


    },
    {
        unmountInactiveRoutes: true,
        contentComponent: CustomSidebarMenu,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
    }
);
export default DrawerNavigatorRoutes;