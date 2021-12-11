/* eslint-disable prettier/prettier */
/**
 *
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';

import Colors from '../../theme/colors';

import sample_data from '../../config/sample-data';
import TouchableItem from '../../components/TouchableItem';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  productList: {
    padding: 12,
  },
});

export default class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: sample_data.search_products,
      min:0,
      max:0,
    };
  }

  navigateTo = (screen,key) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen, {
      key: key,
    });
  };

  onPressRemove = (item) => () => {
    let { quantity } = item;
    quantity -= 1;

    const { products } = this.state;
    const index = products.indexOf(item);

    if (quantity < 0) {
      return;
    }
    products[index].quantity = quantity;

    this.setState({
      products: [...products],
    });
  };

  componentDidMount() {
    const { route } = this.props;
    const { min, max } = route.params;
    console.log('Min', min);
    console.log('Max', max);
    this.setState({
      min:min,
      max:max,
    });
    this.getData();
  }

  getData() {
    let products = [];
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'products/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          products = snapshot.val();
          console.log(typeof products);
          products = Object.values(products);
          console.log('converted', products);
          this.setState({ products: products });
          console.log('Products', this.state.products);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }


  onPressAdd = (item) => () => {
    const { quantity } = item;
    const { products } = this.state;

    const index = products.indexOf(item);
    products[index].quantity = quantity + 1;

    this.setState({
      products: [...products],
    });
  };

  keyExtractor = (item, index) => index.toString();

  renderProductItem = ({ item, index }) => {
    console.log(this.state.min);
    if (item.price >= this.state.min) {
      return (
        <ActionProductCardHorizontal
          onPress={this.navigateTo('Product', item.key)}
          onPressRemove={this.onPressRemove(item)}
          onPressAdd={this.onPressAdd(item)}
          onCartPress={this.navigateTo('Cart')}
          swipeoutDisabled
          key={index}
          imageUri={item.imageUri}
          title={item.name}
          description={item.description}
          price={item.price}
          // quantity={item.quantity}
          // discountPercentage={item.discountPercentage}
          label={item.label}
          // cartButton={false}
        />
      );
    }
  }

  render() {
    const { products } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <FlatList
          data={products}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderProductItem}
          contentContainerStyle={styles.productList}
        />
      </SafeAreaView>
    );
  }
}
