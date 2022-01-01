/* eslint-disable prettier/prettier */
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Divider from '../../components/divider/Divider';
import ProductCard from '../../components/cards/ProductCard';
import Colors from '../../theme/colors';
import sample_data from '../../config/sample-data';
import {getDatabase, ref, child, get, set} from 'firebase/database';
const styles = StyleSheet.create({
  topArea: {flex: 0, backgroundColor: Colors.primaryColor},
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  productList: {
    paddingVertical: 8,
  },
});

export default class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
    };
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };
  componentDidMount() {
    this.getData();
  }
  getData() {
    const {route} = this.props;
    const {category} = route.params;
    this.props.navigation.setOptions({
      title: category,
    });
    let products = [];
    let filteredProducts = [];
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'products/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          products = snapshot.val();
          products = Object.values(products);

          for (var i = 0; i < products.length; i++) {
            if (products[i].Category === category) {
              filteredProducts.push(products[i]);
            }
          }

          this.setState({products: filteredProducts});
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  navigateTo = (screen, key) => () => {
    const {navigation} = this.props;

    navigation.navigate(screen, {
      key: key,
    });
  };

  onPressRemove = (item) => () => {
    let {quantity} = item;
    quantity -= 1;

    const {products} = this.state;
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
    const {quantity} = item;
    const {products} = this.state;

    const index = products.indexOf(item);
    products[index].quantity = quantity + 1;

    this.setState({
      products: [...products],
    });
  };

  keyExtractor = (item, index) => index.toString();

  renderProductItem = ({item, index}) => (
    <ProductCard
      key={index}
      onPress={this.navigateTo('Product', item.key)}
      onCartPress={this.navigateTo('Product', item.key)}
      activeOpacity={0.7}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      quantity={item.quantity}
      rating={item.rating}
      description={item.description}
      swipeoutDisabled
    />
  );

  renderSeparator = () => <Divider type="inset" marginLeft={0} />;

  render() {
    const {products} = this.state;

    return (
      <Fragment>
        <SafeAreaView style={styles.topArea} />
        <SafeAreaView style={styles.container}>
          <StatusBar
            backgroundColor={Colors.primaryColor}
            barStyle="light-content"
          />

          <FlatList
            data={products}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderProductItem}
            ItemSeparatorComponent={this.renderSeparator}
            contentContainerStyle={styles.productList}
          />
        </SafeAreaView>
      </Fragment>
    );
  }
}
