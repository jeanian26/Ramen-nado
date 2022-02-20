/* eslint-disable prettier/prettier */
/**
 *
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
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
} from 'react-native';

// import utils
import getImgSource from '../../utils/getImgSource.js';

// import components
import ActionProductCard from '../../components/cards/ActionProductCard';
import ActionProductCardHorizontal from '../../components/cards/ActionProductCardHorizontal';
import LinkButton from '../../components/buttons/LinkButton';
import {Heading6} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';

// import colors
import Colors from '../../theme/colors';

//import sample data
import sample_data from '../../config/sample-data';

// Home Config
const imgHolder = require('../../assets/img/imgholder.png');

// Home Styles
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
  categoriesContainer: {
    paddingBottom: 16,
  },
  category: {
    //position: 'absolute',
    bottom: -10,
    alignItems: 'center',
    width: '100%',
    //marginHorizontal: 17,
    backgroundColor: '#fff',
    //borderWidth: 3,
    //borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 8,
  },
  categoryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 15,
  },
  categoryHeading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontWeight: '700',
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
  cardImg: {borderRadius: 4},
  card: {
    marginLeft: 5,
    width: 120,
    height: 110,
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
    textShadowOffset: {width: -1, height: 1},
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
});

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: sample_data.products,
      categories: sample_data.categories,
      popularProducts: sample_data.popularProducts,
    };
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  onPressRemove = (item) => () => {
    let {quantity} = item;
    quantity -= 1;

    const {popularProducts} = this.state;
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
    const {quantity} = item;
    const {popularProducts} = this.state;

    const index = popularProducts.indexOf(item);
    popularProducts[index].quantity = quantity + 1;

    this.setState({
      popularProducts: [...popularProducts],
    });
  };

  keyExtractor = (item, index) => index.toString();

  renderCategoryItem = ({item, index}) => (
    <ImageBackground
      key={index}
      defaultSource={imgHolder}
      source={getImgSource(item.imageUri)}
      imageStyle={styles.cardImg}
      style={styles.card}>
      <View style={styles.cardOverlay}>
        <TouchableItem
          onPress={this.navigateTo('Category')}
          style={styles.cardContainer}
          // borderless
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
        </TouchableItem>
      </View>
    </ImageBackground>
  );

  renderProductItem = ({item, index}) => (
    <ActionProductCard
      onPress={this.navigateTo('Product')}
      key={index}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      rating={item.rating}
      discountPercentage={item.discountPercentage}
      label={item.label}
    />
  );

  renderPopularProductItem = ({item, index}) => (
    <ActionProductCardHorizontal
      onPress={this.navigateTo('Product')}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      onCartPress={this.navigateTo('Cart')}
      swipeoutDisabled
      key={index}
      imageUri={item.imageUri}
      title={item.name}
      description={item.description}
      rating={item.rating}
      starRating={true}
      price={item.price}
      quantity={item.quantity}
      discountPercentage={item.discountPercentage}
      label={item.label}
      cartButton={true}
    />
  );

  render() {
    const {categories, products, popularProducts} = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
        <View style={styles.container}>
          <ScrollView>
            <View>
              <Image
                key={'image'}
                //defaultSource={imgHolder}
                source={require('../../assets/img/home-banner.png')}
                style={styles.bannerImage}
              />
            </View>
            <View style={styles.categoriesContainer}>
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
                      (styles.categoriesList, {marginBottom: 10})
                    }
                  />
                </View>
              </View>
            </View>
            <View style={styles.titleContainer}>
              <Heading6 style={styles.titleText}>Most Popular</Heading6>
              <LinkButton
                title="View all"
                titleStyle={styles.viewAllText}
                onPress={this.navigateTo('SearchResults')}
              />
            </View>
            <FlatList
              data={popularProducts}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderPopularProductItem}
              contentContainerStyle={styles.popularProductsList}
            />
            <View style={styles.titleContainer}>
              <Heading6 style={styles.titleText}>Special Offers</Heading6>
            </View>
            <FlatList
              data={products}
              horizontal
              showsHorizontalScrollIndicator={false}
              alwaysBounceHorizontal={false}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderProductItem}
              contentContainerStyle={styles.productsList}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
