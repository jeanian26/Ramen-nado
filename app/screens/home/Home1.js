/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, { Component } from 'react';
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  BackHandler,
  ToastAndroid,
  Alert,
} from 'react-native';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import getImgSource from '../../utils/getImgSource.js';

import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';
import LinkButton from '../../components/buttons/LinkButton';
import { Heading6, Heading4, Heading5, Paragraph } from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';

import Colors from '../../theme/colors';

import sample_data from '../../config/sample-data';
import Logo from '../../components/logo/Logo.js';

const imgHolder = require('../../assets/img/imgholder.png');
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  bannerImage: {
    width: '100%',
    height: 228,
    resizeMode: 'contain',
    borderRadius: 0,
    marginTop: -0.5,
    //backgroundColor:'#000'
  },
  categoriesContainer: {},
  category: {
    alignItems: 'center',
    width: '100%',

    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 8,
  },
  categoryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryHeading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titleText: {
    fontWeight: '700',
  },
  viewAllText: {
    color: Colors.primaryColor,
  },
  categoriesList: {
    paddingTop: 4,
    paddingRight: 16,
    paddingLeft: 5,
  },
  cardImg: { borderRadius: 4 },
  card: {
    marginLeft: 4,
    width: 110,
    height: 90,
    resizeMode: 'cover',
  },
  cardOverlay: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardTitle: {
    paddingHorizontal: 12,
    marginBottom: 5,
    fontWeight: '500',
    fontSize: 16,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    backgroundColor: Colors.primaryLightColor,
  },
  productsList: {
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  popularProductsList: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  buttonContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 52,
    width: 104,
    height: 104,
    backgroundColor: Colors.white,
  },
});

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: sample_data.categories,
      popularProducts: sample_data.popularProducts,
    };
  }
  getCategories() {
    let categories = [];
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'category/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          categories = snapshot.val();
          categories = Object.values(categories);
          this.setState({ categories: categories });
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {

    this.getCategories();
    this.getMostPopular();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction
    );


  }
  backAction = () => {
    const { navigation } = this.props;
    console.log(navigation);
    if (navigation.isFocused()) {
      Alert.alert('Hold on!', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    }
  };
  componentWillUnmount() {
    this.backHandler.remove();
  }
  getMostPopular() {
    let products = [];
    let filteredProducts = [];
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'products/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          products = snapshot.val();
          products = Object.values(products);

          for (var i = 0; i < products.length; i++) {
            if (products[i].Popular === true) {
              filteredProducts.push(products[i]);
            }
          }

          this.setState({ popularProducts: filteredProducts });
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  navigateTo = (screen, name) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen, { category: name });
  };
  navigateToProduct = (screen, name) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen, { key: name });
  };

  onPressRemove = (item) => () => {
    let { quantity } = item;
    quantity -= 1;

    const { popularProducts } = this.state;
    const index = popularProducts.indexOf(item);

    if (quantity < 0) {
      return;
    }
    popularProducts[index].quantity = quantity;

    this.setState({
      popularProducts: [...popularProducts],
    });
  };

  onPressAdd = (item) => () => {
    const { quantity } = item;
    const { popularProducts } = this.state;

    const index = popularProducts.indexOf(item);
    popularProducts[index].quantity = quantity + 1;

    this.setState({
      popularProducts: [...popularProducts],
    });
  };

  keyExtractor = (item, index) => index.toString();

  renderCategoryItem = ({ item, index }) => (
    <ImageBackground
      key={index}
      defaultSource={imgHolder}
      source={getImgSource(item.imageUri)}
      imageStyle={styles.cardImg}
      style={styles.card}>
      <View style={styles.cardOverlay}>
        <TouchableItem
          onPress={this.navigateTo('Category', item.name)}
          style={styles.cardContainer}
        // borderless
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableItem>
      </View>
    </ImageBackground>
  );

  renderPopularProductItem = ({ item, index }) => (
    <ActionProductCardHorizontal
      onPress={this.navigateToProduct('Product', item.key)}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      onCartPress={this.navigateToProduct('Product', item.key)}
      swipeoutDisabled
      key={index}
      imageUri={item.imageUri}
      title={item.name}
      description={item.description}
      price={item.price}
      quantity={item.quantity}
      label={item.label}
      cartButton={true}
    />
  );

  render() {
    const { categories, popularProducts } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
        <View style={styles.container}>
          <ScrollView>
            <View>
              <View style={{
                padding: 20,
                paddingTop: 30,
                textAlign: 'center',
                alignContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.primaryColor,
              }}>
                <View style={styles.logoContainer}>
                  <Logo logoStyle={{ borderRadius: 100 }} size={96} />
                </View>
                <Heading5 style={{
                  color: 'white',
                  fontWeight: '700',
                  paddingTop: 10,
                }}>Ramen Nado</Heading5>
                <Text style={{
                  paddingTop: 15,
                  color: 'white',
                }}>Cant pick the right Ramen for you?</Text>
                <Text style={{ color: 'white' }}>Let me help</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    onPress={this.navigateTo('CustomSearch')}
                    color={Colors.primaryColor}
                    small
                    title={'GET STARTED'.toUpperCase()}
                    titleColor={Colors.background}
                    borderRadius={100}
                  />
                </View>
              </View>
              <View >
                <View style={styles.titleContainer}>
                  <View style={styles.category}>
                    <View style={styles.categoryView}>
                      <Heading6
                        style={(styles.titleText, styles.categoryHeading)}>
                        Categories
                      </Heading6>
                      <LinkButton
                        title="View all"
                        titleStyle={
                          (styles.viewAllText,
                          {
                            textAlign: 'right',
                          })
                        }
                        onPress={this.navigateTo('Categories')}
                      />
                    </View>
                    <FlatList
                      data={categories.slice(0, 3)}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      alwaysBounceHorizontal={false}
                      keyExtractor={this.keyExtractor}
                      renderItem={this.renderCategoryItem}
                      contentContainerStyle={
                        (styles.categoriesList, { marginBottom: 10 })
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.titleContainer}>
              <Heading6 style={(styles.titleText, { paddingTop: 10 })}>
                Most Popular
              </Heading6>
            </View>
            <FlatList
              data={popularProducts}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderPopularProductItem}
              contentContainerStyle={styles.popularProductsList}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
