/* eslint-disable prettier/prettier */

import React from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HeaderIconButton from '../components/navigation/HeaderIconButton';

import Intro from '../screens/introduction/Introduction';
import Welcome from '../screens/welcome/Welcome';
import SignUp from '../screens/signup/SignUp';
import Verify from '../screens/signup/Verify';
import PhoneVerify from '../screens/signup/phoneVerify';

import SignIn from '../screens/signin/SignIn';
import ForgotPassword from '../screens/forgotpassword/ForgotPassword';
import HomeNavigator from './HomeNavigator1';
import Product from '../screens/product/Product';
import EditCartProduct from '../screens/product/EditCartProduct';
import Categories from '../screens/categories/Categories';
import Category from '../screens/categories/Category';
import SearchResults from '../screens/search/SearchResults';
import SingleCustomerSearch from '../screens/search/SingleCustomerSearch';

import CustomSearch from '../screens/search/CustomSearch';
import Checkout from '../screens/checkout/Checkout';
import EditProfile from '../screens/profile/EditProfile';
import DeliveryAddress from '../screens/address/DeliveryAddress';
import AddAddress from '../screens/address/AddAddress';
import EditAddress from '../screens/address/EditAddress';
import PaymentMethod from '../screens/payment/PaymentMethod';
import AddCreditCard from '../screens/payment/AddCreditCard';
import Notifications from '../screens/notifications/Notifications';
import Orders from '../screens/orders/Orders';
import Colors from '../theme/colors';

const SAVE_ICON = Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark';

const Stack = createStackNavigator();

function MainNavigatorA() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardOverlayEnabled: false,
          headerStyle: {
            elevation: 1,
            shadowOpacity: 0,
          },
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: Colors.onBackground,
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            title: 'Create Account',
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{
            title: 'Sign In',
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
            title: 'Forgot Password?',
          }}
        />

        <Stack.Screen
          name="HomeNavigator"
          component={HomeNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Categories"
          component={Categories}
          options={{
            title: 'All Categories',
          }}
        />
        <Stack.Screen
          name="Category"
          component={Category}
          options={{
            title: 'Ramen',
          }}
        />
        <Stack.Screen
          name="Product"
          component={Product}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditCartProduct"
          component={EditCartProduct}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SearchResults"
          component={SearchResults}
          options={{
            title: 'Search Results',
          }}
        />
        <Stack.Screen
          name="CustomSearch"
          component={CustomSearch}
          options={{
            title: 'Custom Search',
          }}
        />
         <Stack.Screen
          name="SingleCustomerSearch"
          component={SingleCustomerSearch}
          options={{
            title: 'Custom Search',
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{
            title: 'Checkout',
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={({navigation}) => ({
            title: 'Edit Profile',
          })}
        />
        <Stack.Screen
          name="DeliveryAddress"
          component={DeliveryAddress}
          options={({navigation}) => ({
            title: 'Delivery Address',
            headerRight: () => (
              <HeaderIconButton
                onPress={() => navigation.goBack()}
                name={SAVE_ICON}
                color={Colors.primaryColor}
              />
            ),
          })}
        />
        <Stack.Screen
          name="AddAddress"
          component={AddAddress}
          options={{
            title: 'Add New Address',
          }}
        />
        <Stack.Screen
          name="EditAddress"
          component={EditAddress}
          options={{
            title: 'Edit Address',
          }}
        />
        <Stack.Screen
          name="PaymentMethod"
          component={PaymentMethod}
          options={({navigation}) => ({
            title: 'Payment Method',
            headerRight: () => (
              <HeaderIconButton
                onPress={() => navigation.goBack()}
                name={SAVE_ICON}
                color={Colors.primaryColor}
              />
            ),
          })}
        />
        <Stack.Screen
          name="AddCreditCard"
          component={AddCreditCard}
          options={{
            title: 'Add Credit Card',
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            title: 'Notifications',
          }}
        />
        <Stack.Screen
          name="Orders"
          component={Orders}
          options={{
            title: 'My Orders',
          }}
        />
        <Stack.Screen
          name="Verify"
          component={Verify}
          options={{
            title: 'Verify',
          }}
        />
        <Stack.Screen
          name="phoneVerify"
          component={PhoneVerify}
          options={{
            title: 'Phone Verify',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigatorA;
