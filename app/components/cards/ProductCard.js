/* eslint-disable no-dupe-keys */
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
  TouchableOpacity,
  View,
} from 'react-native';
import {SwipeRow} from 'react-native-swipe-list-view';

// import utils
import getImgSource from '../../utils/getImgSource.js';

// import components
import Icon from '../icon/Icon';
import {Subtitle1, Subtitle2} from '../text/CustomText';
import TouchableItem from '../TouchableItem';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// ProductCard Config
const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';
const ITEM_WIDTH = Layout.SCREEN_WIDTH;

const CART_ICON = IOS ? 'ios-cart' : 'md-cart';
const DELETE_ICON = IOS ? 'ios-close' : 'md-close';
const RATING_ICON = IOS ? 'ios-star' : 'md-star';

const imgHolder = require('../../assets/img/imgholder.png');

// ProductCard Styles
const styles = StyleSheet.create({
  cardBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 1,
    backgroundColor: Colors.primaryColor,
  },
  deleteButtonContainer: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: ITEM_WIDTH,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  imageContainer: {
    marginRight: 20,
  },
  image: {
    width: 98,
    height: 82,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    flex: 1,
    fontWeight: '700',
    color: Colors.primaryText,
    textAlign: 'left',
  },
  firstLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  secondLine: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  thirdLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionText: {
    flex: 1,
    lineHeight: 20,
    color: Colors.secondaryText,
    textAlign: 'left',
  },
  priceText: {
    fontWeight: '700',
    fontSize: 16,
    color: Colors.primaryColor,
    textAlign: 'left',
  },
  amountButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  quantity: {
    top: -1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    borderRadius: 5,
    width: 22,
    height: 22,
    backgroundColor: Colors.primaryColor,
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
  starContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 1,
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 3,
    borderRadius: 4,
  },
  starText: {
    color: Colors.white,
  },
});

// ProductCard State
type State = {};

// ProductCard Props
type Props = {
  onPress: () => {},
  onPressRemove: () => void,
  onPressAdd: () => void,
  activeOpacity: number,
  imageUri: string,
  title: string,
  description: string,
  price: number,
  quantity: number,
  swipeoutDisabled: boolean,
  hideCart: Boolean,
  swipeoutOnPressRemove: () => {},
};

// ProductCard DeleteButton
const DeleteButton = ({onPress}) => (
  <View style={styles.deleteButtonContainer}>
    <TouchableItem onPress={onPress} style={styles.deleteButton}>
      <Icon name={DELETE_ICON} size={26} color={Colors.error} />
    </TouchableItem>
  </View>
);

// ProductCard
export default class ProductCard extends Component<Props, State> {
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

  render() {
    const {
      activeOpacity,
      onPress,
      imageUri,
      title,
      description = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      rating = 4.5,
      price = 0,
      quantity = 0,
      swipeoutDisabled,
      swipeoutOnPressRemove,
      hideCart = false,
    } = this.props;

    return (
      <SwipeRow
        disableLeftSwipe={isRTL ? true : swipeoutDisabled}
        disableRightSwipe={isRTL ? swipeoutDisabled : true}
        directionalDistanceChangeThreshold={16}
        rightOpenValue={isRTL ? 0 : -88}
        leftOpenValue={isRTL ? 88 : 0}>
        <View style={styles.cardBack}>
          <DeleteButton onPress={swipeoutOnPressRemove} />
        </View>

        {/** FIX ME:
         * extra View was added because of iOS ToucableOpacity bug
         */}
        <View style={styles.bg}>
          <TouchableItem
            onPress={onPress}
            activeOpacity={activeOpacity}
            useForeground>
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                <Image
                  defaultSource={imgHolder}
                  source={getImgSource(imageUri)}
                  style={[styles.image]}
                />
              </View>

              <View style={styles.textContainer}>
                <View style={styles.firstLine}>
                  <Subtitle1 numberOfLines={1} style={styles.title}>
                    {title}
                  </Subtitle1>
                </View>

                <View style={styles.secondLine}>
                  <Subtitle2 numberOfLines={2} style={styles.descriptionText}>
                    {description}
                  </Subtitle2>
                </View>

                <View style={styles.thirdLine}>
                  <Text style={styles.priceText}>
                    {`₱ ${price.toFixed(2)}`}
                  </Text>

                  <View style={styles.amountButtonsContainer}>
                    {hideCart === false ? (
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
              </View>
            </View>
          </TouchableItem>
        </View>
      </SwipeRow>
    );
  }
}
