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
import Button from '../../components/buttons/Button';

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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  extraSmallButton: {
    width: '48%',
  },
  resetbtn: {
    width: '48%',
    backgroundColor: 'blue',
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
      retries: 0,
      resultRandom: [],
      reset: 0,
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
      budget: Math.round(budget),
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
          this.generateArray(products);
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
          // this.generateArray();
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
  addToCart() {
    const { navigation } = this.props;
    const { resultRandom } = this.state;
    Alert.alert(
      'Add to Cart',
      'Add all items to Cart?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {
            const auth = getAuth();
            const db = getDatabase();
            const user = auth.currentUser;
            for (let item in resultRandom) {
              let randomID = uuid.v4();
              let product = resultRandom[item];
              console.log(resultRandom[item].stock);
              set(ref(db, 'cart/' + randomID), {
                cartID: randomID,
                sold: false,
                userid: user.uid,
                id: product.key,
                imageUri: product.imageUri,
                name: product.name,
                price: product.price,
                quantity: 1,
                extra: this.state.extras,
              }).then(() => {
                navigation.navigate('Cart');
              }).catch((e) => console.log(e));
            }

          },
        },
      ]
    );
  }


  keyExtractor = (item, index) => index.toString();

  renderProductItem = ({ item, index }) => {

    return (
      <ActionProductCardHorizontal

        onCartPress={this.navigateTo('Cart')}
        swipeoutDisabled
        plusDisabled
        key={index}
        imageUri={item.imageUri}
        title={item.name}
        description={item.description}
        price={item.price}

        label={item.label}
      />
    );
    // }
  }
  test(ProductArray, min, max, count, budget) {
    if (!ProductArray) {
      console.log(ProductArray);
      console.log('not good 0');
      return false;
    }
    let total = 0;
    for (let index in ProductArray) {
      total = total + ProductArray[index].price;
    }
    if (total <= max && total >= min) {
      console.log('found', ProductArray);
      return ProductArray;
    } else {
      console.log('not good Error');
      return false;
    }
  }
  generateArray(products) {
    let resultRandom = this.state.resultRandom;
    if (resultRandom.length > 0) {
      return;
    }
    const { min, max, count, budget } = this.state;
    let newProductArray = [];
    for (let index in products) {
      let item = products[index];
      if (item.Category !== 'Drinks' && item.stock !== 0) {
        newProductArray.push(products[index]);
      }
    }

    for (let i = 0; i <= 1000; i++) {
      let Sorted = newProductArray;
      Sorted.sort(() => Math.random() - 0.5);
      var testArray = Sorted.slice();
      testArray.splice(-(Sorted.length - count));
      let randomItems = this.test(testArray, min, max, count, budget);
      if (randomItems !== false) {
        console.log(randomItems);
        console.log('=======================================BREAK===============================');
        console.log('found success index', i);
        this.setState({ resultRandom: randomItems });
        break;
      }
      else if (i === 1000) {
        alert('We cant find products for your budget \nChange your maximum budget or Number of Orders');
      }
    }

  }
  Reset() {
    this.setState({ resultRandom: [] });
    this.getData();
    // this.generateArray(this.state.products);
  }

  render() {
    const { resultRandom, min, max, count, budget, reset } = this.state;
    // this.setState({resultRandom:randomItems});

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />
        <Paragraph style={styles.instruction}>
          You have a max budget of ₱{max} for {count} person. With an Average budget of ₱{budget} per person
        </Paragraph>
        <View style={styles.buttonsContainer}>
          <Button
            onPress={() => { this.Reset(); }}
            disabled={false}
            small
            title={'Reset'.toUpperCase()}
            buttonStyle={styles.extraSmallButton}
          /><Button
            onPress={() => this.addToCart()}
            disabled={false}
            small
            title={'Add to Cart'.toUpperCase()}
            buttonStyle={styles.resetbtn}
          />
        </View>


        <FlatList
          key={reset}
          data={resultRandom}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderProductItem}
          contentContainerStyle={styles.productList}
        />
      </SafeAreaView>
    );
  }
}
