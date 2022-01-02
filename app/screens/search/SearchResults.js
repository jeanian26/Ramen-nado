/* eslint-disable prettier/prettier */
/**
 *
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';
import {Paragraph} from '../../components/text/CustomText';

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
  instructionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    marginTop: 20,
    marginBottom:20,
    paddingHorizontal: 32,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: sample_data.search_products,
      min: 0,
      max: 0,
      count:0,
      budget:0,
    };
  }

  navigateTo = (screen, key) => () => {
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
    this.getData();
  }

  getData() {
    const { route } = this.props;
    const { min, max,count } = route.params;
    let budget = max / count;

    this.setState({
      min: min,
      max: max,
      count:count,
      budget:budget,
    });
    this.setState({});
    console.log(count);
    let products = [];
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'products/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          products = snapshot.val();
          products = Object.values(products);
          this.setState({ products: products });
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
    let name = `${item.name} X ${this.state.count} `;
    let price = item.price * this.state.count;
    if (item.price <= this.state.budget && item.Category !== 'Drinks') {
      return (
        <ActionProductCardHorizontal
          onPress={this.navigateTo('Product', item.key)}
          onPressRemove={this.onPressRemove(item)}
          onPressAdd={this.onPressAdd(item)}
          onCartPress={this.navigateTo('Cart')}
          swipeoutDisabled
          key={index}
          imageUri={item.imageUri}
          title= {name}
          description={item.description}
          price={price}
          // quantity={item.quantity}
          // discountPercentage={item.discountPercentage}
          label={item.label}
        // cartButton={false}
        />
      );
    }
  }

  render() {
    const { products,min,max,count,budget } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />
          <Paragraph style={styles.instruction}>
            You have a max budget of ₱{max} for {count} person. With an Average budget of ₱{budget} per person
          </Paragraph>

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
