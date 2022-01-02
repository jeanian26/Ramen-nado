/* eslint-disable prettier/prettier */

import React, { Component, Fragment } from 'react';
import {
  FlatList,
  I18nManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import remove from 'lodash/remove';
import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';
import EmptyState from '../../components/emptystate/EmptyState';
import { Heading6, SmallText } from '../../components/text/CustomText';
import Colors from '../../theme/colors';
import sample_data from '../../config/sample-data';
import { onAuthStateChanged, getAuth, updateProfile } from 'firebase/auth';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import { cos } from 'react-native-reanimated';

const isRTL = I18nManager.isRTL;
const EMPTY_STATE_ICON = 'star-outline';

// Favorites Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 24,
    fontWeight: '700',
    textAlign: 'left',
  },
  productList: {
    paddingHorizontal: 12,
  },
  bottomTextInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 28,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f1f1f1',
  },
});

export default class Favorites extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
    };
  }

  navigateTo = (screen, key) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
    navigation.navigate(screen, {
      key: key,
    });
  };

  swipeoutOnPressRemove = (item) => () => {
    let { products } = this.state;
    const index = products.indexOf(item);

    products = remove(products, (n) => products.indexOf(n) !== index);

    this.setState({
      products,
    });
  };

  componentDidMount = () => {
    this.getData();

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  };

  getData() {
    this.setState({products:[]});
    const auth = getAuth();
    const user = auth.currentUser;
    let products = [];
    const dbRef = ref(getDatabase());
    console.log(user.uid);
    get(child(dbRef, `favorite/${user.uid}`))
      .then((snapshot) => {

        if (snapshot.exists()) {
          products = snapshot.val();
          console.log(products);
          Object.entries(products).forEach(([key, value]) => {
            console.log(key);
            this.getProductDetails(key);
          });

        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getProductDetails(item, arrayProduct) {
    // console.log(this.state.products);
    const dbRef = ref(getDatabase());
    get(child(dbRef, `products/${item}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          let result = snapshot.val();
          result.id = result.key;
          console.log(result);
          this.setState({ products: [...this.state.products, result] });
          // this.setState({products:arrayProduct});
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }

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

  onPressAdd = (item) => () => {
    const { quantity } = item;
    const { products } = this.state;

    const index = products.indexOf(item);
    products[index].quantity = quantity + 1;

    this.setState({
      products: [...products],
    });
  };

  keyExtractor = (item) => item.id.toString();

  renderProductItem = ({ item }) => (
    <ActionProductCardHorizontal
      key={item.id}
      onPress={this.navigateTo('Product',item.id)}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      swipeoutDisabled={true}
      swipeoutOnPressRemove={this.swipeoutOnPressRemove(item)}
      cartButton={true}
    />
  );

  render() {
    const { products } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.titleContainer}>
          <Heading6 style={styles.titleText}>Favorites</Heading6>
        </View>

        {products.length === 0 ? (
          <EmptyState title="Your Favorites List is Empty" message="" />
        ) : (
          <Fragment>
            <FlatList
              data={products}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderProductItem}
              contentContainerStyle={styles.productList}
            />

            {/* <View style={styles.bottomTextInfo}>
              <View style={styles.info}>
                <SmallText>
                  {`Swipe ${isRTL ? 'right' : 'left'} to remove items`}
                </SmallText>
              </View>
            </View> */}
          </Fragment>
        )}
      </SafeAreaView>
    );
  }
}
