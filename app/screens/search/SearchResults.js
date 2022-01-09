/* eslint-disable prettier/prettier */
/**
 *
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { getAuth } from 'firebase/auth';

import { FlatList, SafeAreaView, StatusBar, StyleSheet, View, Alert, ToastAndroid } from 'react-native';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';
import { Paragraph } from '../../components/text/CustomText';

import Colors from '../../theme/colors';

import sample_data from '../../config/sample-data';
import TouchableItem from '../../components/TouchableItem';
import uuid from 'react-native-uuid';



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
    marginBottom: 20,
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
      count: 0,
      budget: 0,
      extras: [],
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
    this.getExtra();
  }

  getData() {
    const { route } = this.props;
    const { min, max, count } = route.params;
    let budget = max / count;

    this.setState({
      min: min,
      max: max,
      count: count,
      budget: budget,
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
  getExtra() {
    const dbRef = ref(getDatabase());
    let array = [];
    get(child(dbRef, 'Extra/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          array = Object.values(snapshot.val());
          this.setState({ extras: array });
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
  addToCart(item, count, name, price) {
    const { navigation } = this.props;

    Alert.alert(
      'Add to Cart',
      `Add to Cart ${name} x ${count} pcs total value of ${price}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {
            let products = [];
            const dbRef = ref(getDatabase());
            get(child(dbRef, `products/${item}`))
              .then((snapshot) => {
                if (snapshot.exists()) {
                  products = snapshot.val();
                  console.log(products);
                  const auth = getAuth();
                  const user = auth.currentUser;
                  if (products.stock <= count) {
                    let randomID = uuid.v4();
                    const db = getDatabase();
                    set(ref(db, 'cart/' + randomID), {
                      cartID: randomID,
                      sold: false,
                      userid: user.uid,
                      id: item,
                      imageUri: products.imageUri,
                      name: products.name,
                      price: price / count,
                      quantity: count,
                      extra: this.state.extras,
                    }).then(() => {
                      navigation.navigate('Cart');
                    }).catch((e) => console.log(e));
                  }
                  else {
                    ToastAndroid.showWithGravity(
                      'NO STOCK!',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );
                  }
                } else {
                  console.log('No data available');
                }
              })
              .catch((error) => {
                console.error(error);
              });
          },
        },
      ]
    );
  }


  keyExtractor = (item, index) => index.toString();

  renderProductItem = ({ item, index }) => {
    let name = `${item.name} X ${this.state.count} `;
    let price = item.price * this.state.count;
    if (item.price <= this.state.budget && item.Category !== 'Drinks') {
      return (
        <ActionProductCardHorizontal
          // onPress={this.navigateTo('Product', item.key)}
          onPress={() => this.addToCart(item.key, this.state.count, item.name, price)} s
          onPressRemove={this.onPressRemove(item)}
          onPressAdd={this.onPressAdd(item)}
          onCartPress={this.navigateTo('Cart')}
          swipeoutDisabled
          plusDisabled
          key={index}
          imageUri={item.imageUri}
          title={name}
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
    const { products, min, max, count, budget } = this.state;

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
