/* eslint-disable prettier/prettier */

import React, {Component, Fragment} from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {getAuth} from 'firebase/auth';
import getImgSource from '../../utils/getImgSource.js';
import {getDatabase, ref, child, get, set} from 'firebase/database';

import Button from '../../components/buttons/Button';
import {Caption, Heading5, SmallText} from '../../components/text/CustomText';
import GradientContainer from '../../components/gradientcontainer/GradientContainer';
import Icon from '../../components/icon/Icon';
import TouchableItem from '../../components/TouchableItem';

import Colors from '../../theme/colors';
import uuid from 'react-native-uuid';
import sample_data from '../../config/sample-data';

const IOS = Platform.OS === 'ios';
const FAVORITE_ICON = IOS ? 'ios-heart' : 'md-heart';
const CLOSE_ICON = IOS ? 'ios-close' : 'md-close';
const imgHolder = require('../../assets/img/imgholder.png');

const styles = StyleSheet.create({
  topArea: {flex: 0, backgroundColor: Colors.primaryColor},
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    width: '100%',
    height: 236,
  },
  productImg: {
    width: '100%',
    height: 236,
    resizeMode: 'cover',
  },
  bottomOverlay: {flex: 1},
  topButton: {
    position: 'absolute',
    top: 16,
    borderRadius: 18,
    backgroundColor: Colors.background,
  },
  left: {left: 16},
  right: {right: 16},
  buttonIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
  },
  favorite: {
    backgroundColor: Colors.secondaryColor,
  },
  productDescription: {
    marginTop: -22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
  },
  productTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 10,
  },
  productTitle: {
    fontWeight: '700',
    width: '80%',
  },
  priceText: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.black,
  },
  shortDescription: {
    paddingVertical: 8,
    textAlign: 'left',
  },
  caption: {
    padding: 16,
    fontWeight: '700',
    textAlign: 'left',
  },
  dishContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    height: 56,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emptyIndicator: {
    marginRight: 24,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.background,
  },
  filledIndicator: {
    marginRight: 24,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primaryColor,
  },
  dishName: {
    top: -1,
    lineHeight: 22,
  },
  dishPrice: {
    color: Colors.secondaryText,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  quantity: {
    top: -1,
    paddingHorizontal: 18,
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: Colors.primaryColor,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    width: '100%',
    padding: 16,
    backgroundColor: '#efefef',
  },
  bottomArea: {flex: 0, backgroundColor: '#efefef'},
  starContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 4,
  },
  starText: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    color: Colors.white,
  },
  categoryStarContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  categoryText: {
    color: Colors.primaryColor,
  },
});

export default class EditCartProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      extras: [],
      favorite: false,
      total: '',
    };
  }

  async getData() {
    const {route} = this.props;
    const {key} = route.params;
    let productID;
    const dbRef = ref(getDatabase());
    get(child(dbRef, `cart/${key}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          productID = snapshot.val().id;

          this.setState({total: snapshot.val().price});
          let products = [];
          get(child(dbRef, `products/${productID}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                products = snapshot.val();
                this.setState({product: products});
              } else {
                console.log('No data available');
              }
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getExtra() {
    const {route} = this.props;
    const {key} = route.params;
    const dbRef = ref(getDatabase());
    let array = [];
    get(child(dbRef, 'cart/' + key + '/extra'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          array = Object.values(snapshot.val());
          this.setState({extras: array});
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  componentDidMount() {
    this.getData();
    this.getExtra();
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onPressAddToFavorites = () => {
    const {favorite} = this.state;

    this.setState({
      favorite: !favorite,
    });
  };

  setExtraDish = (item) => () => {
    const {product, extras} = this.state;
    const index = extras.indexOf(item);
    const picked = extras[index].picked;

    if (picked) {
      this.state.total -= item.price;
    } else {
      this.state.total += item.price;
    }
    extras[index].picked = !picked;
    this.setState({
      product,
      extras: [...extras],
    });
  };
  addToCart = () => {
    const {navigation} = this.props;
    const auth = getAuth();
    const user = auth.currentUser;
    const {route} = this.props;
    const {key} = route.params;
    const db = getDatabase();
    set(ref(db, 'cart/' + key), {
      cartID: key,
      sold: false,
      userid: user.uid,
      id: this.state.product.key,
      imageUri: this.state.product.imageUri,
      name: this.state.product.name,
      price: this.state.total,
      quantity: 1,
      extra: this.state.extras,
    }).then(() => {
      navigation.navigate('Cart');
    });
  };

  render() {
    const {product, favorite, extras} = this.state;
    const {price, description} = product;
    let loopExtras;
    if (product.extra === true) {
      loopExtras = (
        <View>
          <Caption style={styles.caption}>CHOOSE EXTRAS</Caption>
          {extras.map((item, index) => (
            <TouchableItem
              key={index.toString()}
              onPress={this.setExtraDish(item)}
              useForeground>
              <View style={styles.dishContainer}>
                <View style={styles.indicator}>
                  <View>
                    {item.picked ? (
                      <View style={styles.filledIndicator} />
                    ) : (
                      <View style={styles.emptyIndicator} />
                    )}
                  </View>

                  <Text style={styles.dishName}>{item.name}</Text>
                </View>

                <Text style={styles.dishPrice}>+ {item.price}</Text>
              </View>
            </TouchableItem>
          ))}
        </View>
      );
    }

    return (
      <Fragment>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="light-content"
        />
        <SafeAreaView style={styles.topArea} />
        <View style={styles.screenContainer}>
          <ScrollView>
            <View style={styles.header}>
              <ImageBackground
                defaultSource={imgHolder}
                source={getImgSource(product.imageUri)}
                style={styles.productImg}>
                <GradientContainer
                  colors={[Colors.primaryLightColor, 'transparent']}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0.6}}
                  containerStyle={styles.bottomOverlay}
                />
              </ImageBackground>

              <View style={[styles.topButton, styles.left]}>
                <TouchableItem onPress={this.goBack} borderless>
                  <View style={styles.buttonIconContainer}>
                    <Icon
                      name={CLOSE_ICON}
                      size={IOS ? 24 : 22}
                      color={Colors.secondaryText}
                    />
                  </View>
                </TouchableItem>
              </View>

              <View
                style={[
                  styles.topButton,
                  styles.right,
                  favorite && styles.favorite,
                ]}>
                <TouchableItem onPress={this.onPressAddToFavorites} borderless>
                  <View style={styles.buttonIconContainer}>
                    <Icon
                      name={FAVORITE_ICON}
                      size={IOS ? 18 : 20}
                      color={
                        favorite
                          ? Colors.onSecondaryColor
                          : Colors.secondaryText
                      }
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>

            <View style={styles.productDescription}>
              <View style={styles.productTitleContainer}>
                <Heading5 style={styles.productTitle}>{product.name}</Heading5>
                <Text style={styles.priceText}>{`₱ ${price}`}</Text>
              </View>

              <SmallText style={styles.shortDescription}>
                {description}
              </SmallText>
            </View>

            {loopExtras}
          </ScrollView>

          <View style={styles.bottomButtonsContainer}>
            <Button
              onPress={() => {
                this.addToCart();
              }}
              title={`Save  ₱${this.state.total}`}
              titleColor={Colors.onPrimaryColor}
              height={44}
              color={Colors.primaryColor}
              rounded
            />
          </View>
        </View>
        <SafeAreaView style={styles.bottomArea} />
      </Fragment>
    );
  }
}
