/* eslint-disable prettier/prettier */

import React, { Component } from 'react';
import {
  FlatList,
  I18nManager,
  Keyboard,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Divider from '../../components/divider/Divider';
import { Heading6 } from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';
import SafeAreaView from '../../components/SafeAreaView';
import SimpleProductCard from '../../components/cards/SimpleProductCard';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import uuid from 'react-native-uuid';
import Colors from '../../theme/colors';

const isRTL = I18nManager.isRTL;
const SEARCH_ICON = 'magnify';

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 8,
    fontWeight: '700',
    textAlign: 'left',
  },
  inputContainer: {
    marginHorizontal: 16,
    paddingBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    paddingLeft: 8,
    paddingRight: 51,
    height: 46,
    fontSize: 16,
    textAlignVertical: 'center',
    textAlign: isRTL ? 'right' : 'left',
  },
  searchButtonContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 4,
    backgroundColor: Colors.primaryColor,
    overflow: 'hidden',
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 38,
  },
  filtersList: {
    paddingVertical: 8,
    paddingRight: isRTL ? 0 : 16,
    paddingLeft: isRTL ? 16 : 0,
  },
  filterItemContainer: {
    marginRight: isRTL ? 16 : 0,
    marginLeft: isRTL ? 0 : 16,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(35, 47, 52, 0.08)',
    overflow: 'hidden',
  },
  filterItem: { flex: 1, justifyContent: 'center' },
  filterName: {
    top: -1,
    fontWeight: '700',
    color: 'rgb(35, 47, 52)',
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
  },
});

export default class SingleCustomerSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //products: sample_data.offers,
      products: [],
      search: '',
    };
  }
  componentDidMount = () => {
    //this.addData();
    this.getData();

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  };
  getData() {
    const {route} = this.props;
    const {item} = route.params;
    this.setState({products:item});
    // const dbRef = ref(getDatabase());
    // get(child(dbRef, 'products/'))
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       products = snapshot.val();
    //       products = Object.values(products);
    //       this.setState({ products: products });
    //     } else {
    //       console.log('No data available');
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }
  keyExtractor = (item, index) => index.toString();
  renderProductItem = ({ item, index }) => (
    <SimpleProductCard
      key={index}
      activeOpacity={0.7}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      rating={item.rating}
      description={item.description}
      stock={item.stock}
    />
  );
  renderSeparator = () => <Divider />;
  render() {
    const { products } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />
        <FlatList
          data={products}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderProductItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </SafeAreaView>
    );
  }
}
