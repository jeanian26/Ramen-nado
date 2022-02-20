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
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SwipeRow} from 'react-native-swipe-list-view';

// import utils
import getImgSource from '../../utils/getImgSource.js';

// import components
import Icon from '../icon/Icon';
import TouchableItem from '../TouchableItem';

// import colors
import Colors from '../../theme/colors';

//import star rating
import StarRating from '../starrating/StarRating';

// ActionProductCardHorizontal Config
const imgHolder = require('../../assets/img/imgholder.png');

const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';
const MINUS_ICON = IOS ? 'ios-remove' : 'md-remove';
const TRASH_ICON = IOS ? 'ios-trash' : 'md-trash';
const PLUS_ICON = IOS ? 'ios-add' : 'md-add';
const CART_ICON = IOS ? 'ios-cart' : 'md-cart';
const DELETE_ICON = IOS ? 'ios-close' : 'md-close';
const RATING_ICON = IOS ? 'ios-star' : 'md-star';

// ActionProductCardHorizontal Styles
const styles = StyleSheet.create({
  swipeRow: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 1,
    borderRadius: 4,
    backgroundColor: Colors.primaryColor,
  },
  deleteButtonContainer: {
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
    width: 88,
    overflow: 'hidden',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    backgroundColor: Colors.background,
  },
  container: {
    margin: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Colors.surface,
  },
  productImg: {
    width: 110,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginTop: 7,
    marginBottom: 7,
    marginLeft: 7,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  title: {
    flex: 1,
    fontWeight: '500',
    fontSize: 16,
    color: Colors.primaryText,
    letterSpacing: 0.15,
    textAlign: 'left',
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  oldPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8e8e8e',
  },
  hr: {
    position: 'absolute',
    top: 10,
    width: '82%',
    height: 1,
    backgroundColor: '#8e8e8e',
  },
  price: {
    fontWeight: '700',
    fontSize: 18,
    color: Colors.primaryColor,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  quantity: {
    top: -1,
    paddingHorizontal: 20,
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    width: 22,
    height: 22,
    borderRadius: 5,
    //backgroundColor: Colors.secondaryColor,
  },
  cartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: Colors.primaryColor,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  newLabelContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: Colors.primaryColor,
  },
  label: {
    fontSize: 12,
    color: Colors.onPrimaryColor,
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  starContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  starText: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    color: Colors.white,
  },
});

// ActionProductCardHorizontal DeleteButton
const DeleteButton = ({onPress}) => (
  <View style={styles.deleteButtonContainer}>
    <TouchableItem onPress={onPress} style={styles.deleteButton}>
      <Icon name={DELETE_ICON} size={26} color={Colors.white} />
    </TouchableItem>
  </View>
);

// ActionProductCardHorizontal State
type State = {};

// ActionProductCardHorizontal Props
type Props = {
  onPress: () => {},
  onPressRemove: () => void,
  onPressAdd: () => void,
  activeOpacity: number,
  imageUri: string,
  title: string,
  price: number,
  quantity: number,
  rating: number,
  starRating: Boolean,
  discountPercentage: number,
  swipeoutDisabled: boolean,
  plusDisabled: Boolean,
  swipeoutOnPressRemove: () => {},
  label: 'new',
  showTrash: boolean,
  hideCartIcon: false,
  cartButton: false,
  plusMinusIcon: false,
};

// ActionProductCardHorizontal
export default class ActionProductCardHorizontal extends Component<
  Props,
  State,
> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onCartPress = () => {
    const {onCartPress = () => {}} = this.props;
    onCartPress();
  };
  onPressAdd = () => {
    const {onPressAdd = () => {}} = this.props;
    onPressAdd();
  };

  onPressRemove = () => {
    const {onPressRemove = () => {}} = this.props;
    onPressRemove();
  };

  renderLabel = (label) => {
    if (label === 'new') {
      return (
        <View style={styles.newLabelContainer}>
          <Text style={styles.label}>NEW</Text>
        </View>
      );
    }

    return <View />;
  };

  render() {
    let {
      activeOpacity,
      onPress,
      imageUri,
      title,
      price = 0,
      quantity = 0,
      rating = 4.5,
      starRating = false,
      discountPercentage,
      swipeoutDisabled,
      plusDisabled,
      swipeoutOnPressRemove,
      label,
      showTrash,
      hideCartIcon,
      cartButton,
      plusMinusIcon,
    } = this.props;

    if (!hideCartIcon && !cartButton && !plusMinusIcon) {
      plusMinusIcon = true;
    }
    return (
      <View style={styles.container}>
        <SwipeRow
          disableLeftSwipe={isRTL ? true : swipeoutDisabled}
          disableRightSwipe={isRTL ? swipeoutDisabled : true}
          directionalDistanceChangeThreshold={16}
          rightOpenValue={isRTL ? 0 : -88}
          leftOpenValue={isRTL ? 88 : 0}
          style={styles.swipeRow}>
          <View style={styles.cardBack}>
            <DeleteButton onPress={swipeoutOnPressRemove} />
          </View>

          <View style={styles.bg}>
            <TouchableItem
              activeOpacity={activeOpacity}
              onPress={onPress}
              useForeground>
              <View style={styles.innerContainer}>
                <Image
                  defaultSource={imgHolder}
                  source={getImgSource(imageUri)}
                  style={styles.productImg}
                />

                <View style={styles.productInfo}>
                  <View style={styles.productDetails}>
                    <Text numberOfLines={2} style={styles.title}>
                      {title}
                    </Text>
                    {discountPercentage ? (
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                          {`₱ ${(
                            ((100 - discountPercentage) / 100) *
                            price
                          ).toFixed(2)}`}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                          {`₱ ${price.toFixed(2)}`}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.viewContainer}>
                    <View style={styles.starContainer} />
                    {!hideCartIcon && plusMinusIcon ? (
                      <View style={styles.actionContainer}>
                        {quantity > 0 && (
                          <View style={styles.actions}>
                            <TouchableItem
                              onPress={this.onPressRemove}
                              borderless>
                              <View
                                style={
                                  (styles.iconContainer,
                                  {
                                    backgroundColor:
                                      quantity == 1 && showTrash
                                        ? Colors.white
                                        : Colors.secondaryColor,
                                  })
                                }>
                                <Icon
                                  name={
                                    quantity == 1 && showTrash
                                      ? TRASH_ICON
                                      : MINUS_ICON
                                  }
                                  size={20}
                                  color={
                                    quantity == 1 && showTrash
                                      ? Colors.secondaryColor
                                      : Colors.onPrimaryColor
                                  }
                                />
                              </View>
                            </TouchableItem>

                            <Text style={styles.quantity}>{quantity}</Text>
                          </View>
                        )}
                        {!plusDisabled ? (<TouchableItem onPress={this.onPressAdd} borderless>
                          <View
                            style={
                              (styles.iconContainer,
                              {backgroundColor: Colors.secondaryColor})
                            }>
                            <Icon
                              name={PLUS_ICON}
                              size={20}
                              color={Colors.onPrimaryColor}
                            />
                          </View>
                        </TouchableItem>) : null}
                      </View>
                    ) : null}
                    {!hideCartIcon && cartButton ? (
                      <View style={styles.actionContainer}>
                        <TouchableItem onPress={this.onCartPress} borderless>
                          <View style={styles.cartContainer}>
                            <Icon
                              name={CART_ICON}
                              size={22}
                              color={Colors.onPrimaryColor}
                            />
                          </View>
                        </TouchableItem>
                      </View>
                    ) : null}
                  </View>
                </View>

                {this.renderLabel(label)}
              </View>
            </TouchableItem>
          </View>
        </SwipeRow>
      </View>
    );
  }
}
