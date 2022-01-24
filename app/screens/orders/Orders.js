/* eslint-disable prettier/prettier */

import React, { Component } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import OrderItem from '../../components/cards/OrderItem';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import Colors from '../../theme/colors';

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  productsContainer: {
    paddingVertical: 8,
  },
});

export default class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // orders: sample_data.orders,
      orders: [],
    };
  }
  componentDidMount() {
    //this.addData();
    this.getData();

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }
  getData() {
    let products = [];
    const auth = getAuth();
    const user = auth.currentUser;
    const dbRef = ref(getDatabase());
    get(child(dbRef, `order/${user.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          products = snapshot.val();
          products = Object.values(products);
          this.setState({ orders: products });
          console.log('Products', this.state.orders);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  navigateTo = (screen) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };
  changeDate(date) {
    if (!date) {
      return '';
    }
    date = date.slice(0, 24);
    return date;
  }

  keyExtractor = (item) => item.orderNumber.toString();

  renderItem = ({ item, index }) => (
    <OrderItem
      key={index}
      activeOpacity={0.8}
      orderNumber={item.orderNumber}
      orderDate={this.changeDate(item.orderDate)}
      orderItems={item.orderItems}
      orderStatus={item.orderStatus}
      onPress={this.navigateTo('Product', item.key)}
      timeEstimate={item.timeEstimate}
    />
  );

  render() {
    const { orders } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <FlatList
            data={orders}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            contentContainerStyle={styles.productsContainer}
          />
        </View>
      </SafeAreaView>
    );
  }
}
