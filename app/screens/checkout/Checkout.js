/* eslint-disable prettier/prettier */
/**
 *
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from 'react';
import {
  I18nManager,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Linking,
  AppState,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Swiper from 'react-native-swiper';

// import components
import Button from '../../components/buttons/Button';
import CreditCard from '../../components/creditcard/CreditCard';
import InfoModal from '../../components/modals/InfoModal';
import LinkButton from '../../components/buttons/LinkButton';
import { Caption, Subtitle1, Subtitle2 } from '../../components/text/CustomText';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, child, get, set, update } from 'firebase/database';
import TouchableItem from '../../components/TouchableItem';
import uuid from 'react-native-uuid';

// import colors
import Colors from '../../theme/colors';

// Checkout Config
const isRTL = I18nManager.isRTL;
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;
const CHECKMARK_ICON =
  Platform.OS === 'ios'
    ? 'ios-checkmark-circle-outline'
    : 'md-checkmark-circle-outline';

// Checkout Styles
const styles = StyleSheet.create({
  pt16: { paddingTop: 16 },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Colors.background,
    elevation: 1,
    ...Platform.select({
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#a7a7aa',
      },
    }),
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  stepContainer: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomActiveBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryColor,
    paddingBottom: 12,
  },
  stepText: {
    color: Colors.primaryColor,
  },
  activeStepText: {
    color: Colors.primaryColor,
    fontWeight: 'bold',
  },
  line: {
    width: 48,
    height: 1,
    backgroundColor: Colors.primaryColor,
  },
  activeLine: {
    backgroundColor: Colors.primaryColor,
    opacity: 0.9,
  },
  swiperContainer: {
    flex: 1,
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  form: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  overline: {
    color: Colors.primaryColor,
    textAlign: 'left',
    paddingTop:15,
    paddingBottom:0,
  },
  inputContainerStyle: {
    marginTop: 0,
    marginBottom: 23,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  actionButton: {
    color: Colors.accentColor,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 16,
    paddingHorizontal: 25,
    paddingBottom: 24,
    backgroundColor: Colors.background,
  },
  linkButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  linkButton: {
    color: Colors.black,
  },
  orderInfo: {
    paddingVertical: 8,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 24,
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
});

// Checkout
export default class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      address: '',
      city: '',
      zip: '',
      addressFocused: false,
      cityFocused: false,
      zipFocused: false,
      infoModalVisible: false,
      paypal: false,
      cod: true,
      products: [],
      total: 0.0,
      fullAddress: '',
      access_token: '',
      paypalData: {},
      paypalStatus: 'Pay on Paypal',
      appState: AppState.currentState,
      // PAYPAL_API_ENDPOINT: 'https://api-m.sandox.paypal.com',
      // AUTH: 'Basic QVlvZXU1RlZFckQweGhrYU8yR0JtTUtVWmFQMnVSRFNPdGhvc3hWNlR4NE5TeTJ1YWpwd3JwU01XZmlXd0Viam04T1NGWmRoVF93SUFzTkw6RUNuNWlVU2dBUERwVmliVnp4M1otQmZzRV94R2FjSDdaMVQwQlR5QkxvZDNrZmphZDFYWUhvbl9wS3BYRlJwVHJOVGtnQ09hUXkzd3g3ekc=',

      PAYPAL_API_ENDPOINT: 'https://api-m.paypal.com',
      AUTH: 'Basic QVlkOVd5OHZ6cEJXdEwxWEFxX3RHS3QzRXViOHI4dm53SXlJVkY0Qkh5RHhhY0lGWVlPQ21JYlFNSWFsQ2VtdE8xa2g4aVhHenRGcWVNZVU6RUl0N0VNZFowZ3JzN24tdHlBOEN1WU0wX3hzcGNNbnVEU09FaTVmV1I0aVJxYWlBTVBDdlNZY1J1cjB0ZjVodndCNnZ4WGZuN1R5UkdtLUI=',

    };
  }

  navigateTo = (screen) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  clearInputs = () => {
    this.address.clear();
    this.city.clear();
    this.zip.clear();
  };

  addressChange = (text) => {
    this.setState({
      address: text,
    });
  };

  addressFocus = () => {
    this.setState({
      addressFocused: true,
      cityFocused: false,
      zipFocused: false,
    });
  };

  cityChange = (text) => {
    this.setState({
      city: text,
    });
  };

  cityFocus = () => {
    this.setState({
      addressFocused: false,
      cityFocused: true,
      zipFocused: false,
    });
  };

  zipChange = (text) => {
    this.setState({
      zip: text,
    });
  };

  zipFocus = () => {
    this.setState({
      addressFocused: false,
      cityFocused: false,
      zipFocused: true,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  onIndexChanged = (index) => {
    let activeIndex;
    if (isRTL) {
      activeIndex = 2 - index; // 2 = 3 steps - 1
    } else {
      activeIndex = index;
    }
    this.setState({
      activeIndex: activeIndex,
    });
  };

  nextStep = () => {
    this.swiper.scrollBy(1, true);
  };

  previousStep = () => {
    this.swiper.scrollBy(-1, true);
  };
  fetchPaypalAccessToken() {
    let PAYPAL_API_ENDPOINT = this.state.PAYPAL_API_ENDPOINT;
    var myHeaders = new Headers();
    myHeaders.append('Accept-Language', 'en_US');
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    // live
    myHeaders.append('Authorization', this.state.AUTH);
    // sandbox
    //  myHeaders.append('Authorization', 'Basic QVlvZXU1RlZFckQweGhrYU8yR0JtTUtVWmFQMnVSRFNPdGhvc3hWNlR4NE5TeTJ1YWpwd3JwU01XZmlXd0Viam04T1NGWmRoVF93SUFzTkw6RUNuNWlVU2dBUERwVmliVnp4M1otQmZzRV94R2FjSDdaMVQwQlR5QkxvZDNrZmphZDFYWUhvbl9wS3BYRlJwVHJOVGtnQ09hUXkzd3g3ekc=');

    var urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      // body: urlencoded,
      redirect: 'follow',
    };

    fetch(`${PAYPAL_API_ENDPOINT}/v1/oauth2/token?grant_type=client_credentials`, requestOptions)
      .then(response => response.text())
      .then((result) => {
        console.log(JSON.parse(result));
        let access_token = JSON.parse(result).access_token;
        this.setState({ access_token: access_token });

      })
      .catch(error => console.log('error', error));

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    // live
    myHeaders.append('Authorization', this.state.AUTH);
    // sandbox
    // myHeaders.append('Authorization', 'Basic QVlvZXU1RlZFckQweGhrYU8yR0JtTUtVWmFQMnVSRFNPdGhvc3hWNlR4NE5TeTJ1YWpwd3JwU01XZmlXd0Viam04T1NGWmRoVF93SUFzTkw6RUNuNWlVU2dBUERwVmliVnp4M1otQmZzRV94R2FjSDdaMVQwQlR5QkxvZDNrZmphZDFYWUhvbl9wS3BYRlJwVHJOVGtnQ09hUXkzd3g3ekc=');

    var raw = JSON.stringify({
      'intent': 'CAPTURE',
      'application_context': {
        'return_url': 'https://ramen-nado-86f76.web.app/paypal/Success',
        'cancel_url': 'https://ramen-nado-86f76.web.app/paypal/Failed',
      },
      'purchase_units': [
        {
          'reference_id': 'test',
          'amount': {
            'currency_code': 'PHP',
            'value': this.state.total,
          },
        },
      ],
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${PAYPAL_API_ENDPOINT}/v2/checkout/orders`, requestOptions)
      .then(response => response.text())
      .then((result) => {


        let data = JSON.parse(result);
        this.setState({ paypalData: data });
        Linking.openURL(data.links[1].href)
          .catch(err => {
            console.error('Failed opening page because: ', err);
            alert('Failed to open page');
          });



      })
      .catch(error => console.log('error', error));
  }

  confirmOrder() {
    const db = getDatabase();
    let randomID = Date.now();
    let orderPayment;
    if (this.state.cod === true) {
      orderPayment = 'COD';
    }
    else {
      orderPayment = 'Paypal';

    }

    const auth = getAuth();
    const user = auth.currentUser;
    set(ref(db, `order/${user.uid}/${randomID}`), {
      orderNumber: randomID,
      orderStatus: 'pending',
      orderDate: new Date(Date.now()).toString(),
      orderItems: this.state.products,
      orderPayment: orderPayment,
      orderAddress: this.state.fullAddress,
      orderUserId: user.uid,
    }).then(() => {
      this.updateStocks();
      this.showInfoModal(true);
      this.deleteCart();
    }).catch((error) => {
      console.log(error);
    });
  }
  updateStocks() {
    let products = this.state.products;
    for (let item in products) {
      console.log('Product ID', products[item].id);
      console.log('Quantity', products[item].quantity);
      //Get the current Stocks Count
      const auth = getAuth();
      const user = auth.currentUser;
      const dbRef = ref(getDatabase());
      get(child(dbRef, `products/${products[item].id}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const result = snapshot.val();
            const stock = result.stock;
            const db = getDatabase();
            const updates = {};
            updates[`products/${products[item].id}/stock`] = stock - products[item].quantity;
            update(ref(db), updates);

          } else {
            console.log('No data available');
          }
        })
        .catch((error) => {
          console.error(error);
        });

    }
  }

  deleteCart() {
    const db = getDatabase();

    let products = this.state.products;
    for (let i = 0; i < products.length; i++) {
      set(ref(db, `cart/${products[i].cartID}`), {

      }).then(() => {
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  showInfoModal(value) {
    this.setState({
      infoModalVisible: value,
    });
  }

  closeInfoModal = (value) => () => {
    const { navigation } = this.props;
    this.setState(
      {
        infoModalVisible: value,
      },
      () => {
        this.goBack();
      },
    );
    navigation.navigate('orders');
  };
  getAddress() {
    const auth = getAuth();
    const user = auth.currentUser;
    const dbRef = ref(getDatabase());
    get(child(dbRef, `address/${user.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const result = snapshot.val();
          this.setState({
            address: result.str_number + ' ' + result.barangay,
            city: result.city,
            zip: result.zipcode,
            fullAddress: result,
          });
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getCart() {
    const dbRef = ref(getDatabase());
    let array = [];
    let newArray = [];
    const auth = getAuth();
    const user = auth.currentUser;
    let total = 0;
    get(child(dbRef, 'cart/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          array = Object.values(snapshot.val());
          for (var i = 0; i < array.length; i++) {
            if (array[i].userid === user.uid) {
              total = total + (array[i].price * array[i].quantity);
              newArray.push(array[i]);
            } else {
            }
          }
          this.setState({ total: total, products: newArray });
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }



  setPaymentOption(option) {
    if (option === 'COD') {
      this.setState({ cod: !this.state.cod, paypal: !this.state.paypal });
    } else {
      this.setState({ paypal: !this.state.paypal, cod: !this.state.cod });
    }

  }
  componentDidMount() {
    this.getAddress();
    this.getCart();
    // this.fetchPaypalAccessToken();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.getAddress();
        this.cart();
      }
    );

    this.appStateSubscription = AppState.addEventListener(
      'change',
      nextAppState => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          //Check if Paypal is paid when alt tab
          this.checkPaypal();
          console.log('App has come to the foreground!');
        }
        this.setState({ appState: nextAppState });
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription();
  }
  checkPaypal() {
    let PAYPAL_API_ENDPOINT = this.state.PAYPAL_API_ENDPOINT;
    console.log('TOKEN', this.state.access_token);
    console.log('ID', this.state.paypalData.id);
    let access_token = this.state.access_token;
    let orderID = this.state.paypalData.id;
    // var myHeaders = new Headers();
    fetch(`${PAYPAL_API_ENDPOINT}/v2/checkout/orders/${orderID}/capture`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'Paypal-Request-Id': '7b92603e-77ed-4896-8e78-5dea2050476a',
      },
      method: 'POST',
    })
      .then(response => response.text())
      .then((result) => {
        let data = JSON.parse(result);
        console.log(data);
        if (data.status === 'COMPLETED') {
          this.setState({ paypalStatus: data.status });
          this.confirmOrder();
        }
      })
      .catch(error => console.log('error', error));
  }

  checkifPayedInPaypal() {
    if (this.state.paypalStatus === 'Pay on Paypal' && this.state.paypal === true) {
      return true;
    } else {
      return false;
    }
  }



  render() {
    const {
      activeIndex,
      address,
      addressFocused,
      city,
      cityFocused,
      zip,
      zipFocused,
      infoModalVisible,
      paypal,
      cod,
      paypalStatus,
    } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <View style={styles.headerContainer} />

          <View style={styles.swiperContainer}>
            <Swiper
              ref={(r) => {
                this.swiper = r;
              }}
              index={isRTL ? 2 : 0}
              onIndexChanged={this.onIndexChanged}
              loop={false}
              showsPagination={false}
            // scrollEnabled={false}
            >
              {/* STEP 1 */}
              <KeyboardAwareScrollView
                contentContainerStyle={styles.formContainer}
                enableOnAndroid>
                <View style={styles.form}>
                  <Subtitle2 style={styles.overline}>Address</Subtitle2>
                  <UnderlineTextInput
                    onRef={(r) => {
                      this.address = r;
                    }}
                    value={address}
                    onChangeText={this.addressChange}
                    onFocus={this.addressFocus}
                    inputFocused={addressFocused}
                    onSubmitEditing={this.focusOn(this.city)}
                    returnKeyType="next"
                    focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                    inputContainerStyle={styles.inputContainerStyle}
                  />

                  <Subtitle2 style={styles.overline}>City</Subtitle2>
                  <UnderlineTextInput
                    onRef={(r) => {
                      this.city = r;
                    }}
                    value={city}
                    onChangeText={this.cityChange}
                    onFocus={this.cityFocus}
                    inputFocused={cityFocused}
                    onSubmitEditing={this.focusOn(this.zip)}
                    returnKeyType="next"
                    focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                    inputContainerStyle={styles.inputContainerStyle}
                  />

                  <Subtitle2 style={styles.overline}>ZIP Code</Subtitle2>
                  <UnderlineTextInput
                    onRef={(r) => {
                      this.zip = r;
                    }}
                    value={zip}
                    onChangeText={this.zipChange}
                    onFocus={this.zipFocus}
                    inputFocused={zipFocused}
                    focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                    inputContainerStyle={styles.inputContainerStyle}
                  />

                  <View>
                    <LinkButton
                      onPress={this.clearInputs}
                      title="Clear"
                      titleStyle={styles.actionButton}
                    />
                  </View>
                </View>
              </KeyboardAwareScrollView>
              <KeyboardAwareScrollView>
                <View style={styles.form}>
                  <Subtitle2 style={styles.overline}>
                    Delivery Address
                  </Subtitle2>
                  <Subtitle1
                    style={
                      styles.orderInfo
                    }>{`${address}, ${city}, ${zip}`}</Subtitle1>

                  <Subtitle2 style={[styles.overline, styles.pt16]}>
                    Payment Method
                  </Subtitle2>
                  <TouchableItem
                    onPress={() => (this.setPaymentOption('COD'))}
                  >
                    <View style={styles.dishContainer}>
                      <View style={styles.indicator}>
                        <View>
                          {cod ? (
                            <ImageBackground source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZILrdYmnUo8tt46-C3JywEyy37j2mvcFsIw&usqp=CAU' }} style={styles.filledIndicator} />
                          ) : (
                            <View style={styles.emptyIndicator} />
                          )}
                        </View>

                        <Text style={styles.dishName}>COD</Text>
                      </View>

                    </View>
                  </TouchableItem>
                  <TouchableItem
                    onPress={() => { this.setPaymentOption('Paypal'); }}
                  >
                    <View style={styles.dishContainer}>
                      <View style={styles.indicator}>
                        <View>
                          {paypal ? (
                            <ImageBackground source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZILrdYmnUo8tt46-C3JywEyy37j2mvcFsIw&usqp=CAU' }} style={styles.filledIndicator} />
                          ) : (
                            <View style={styles.emptyIndicator} />
                          )}
                        </View>

                        <Text style={styles.dishName}>Paypal</Text>
                      </View>

                    </View>
                  </TouchableItem>

                  <Subtitle2 style={[styles.overline, styles.pt16]}>
                    Your Order
                  </Subtitle2>
                  <View style={styles.row}>
                    <Subtitle1 style={styles.orderInfo}>Total amount</Subtitle1>
                    <Subtitle1 style={styles.amount}>₱ {this.state.total}.00</Subtitle1>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </Swiper>

            <View style={styles.buttonContainer}>
              {paypal === true && paypalStatus === 'Pay on Paypal' && (
                <Button
                  disabled={!this.checkifPayedInPaypal}
                  onPress={() => this.fetchPaypalAccessToken()}
                  title={paypalStatus}
                />
              )}


            </View>

            <View style={styles.buttonContainer}>
              {activeIndex < 1 && (
                <Button
                  onPress={isRTL ? this.previousStep : this.nextStep}
                  title="Next"
                />
              )}

              {activeIndex === 1 && (


                <Button
                  disabled={this.checkifPayedInPaypal()}
                  onPress={() => this.confirmOrder()}
                  title="Place Order"
                />
              )}

              {activeIndex === 0 && (
                <View style={styles.linkButtonContainer}>
                  <LinkButton
                    onPress={this.goBack}
                    title="Cancel"
                    titleStyle={styles.linkButton}
                  />
                </View>
              )}

              {activeIndex > 0 && (
                <View style={styles.linkButtonContainer}>
                  <LinkButton
                    onPress={isRTL ? this.nextStep : this.previousStep}
                    title="Back"
                    titleStyle={styles.linkButton}
                  />
                </View>
              )}
            </View>
          </View>

          <InfoModal
            iconName={CHECKMARK_ICON}
            iconColor={Colors.primaryColor}
            title={'Success!'.toUpperCase()}
            message="Order placed successfully. For more details check your orders."
            buttonTitle="Back to shopping"
            onButtonPress={this.closeInfoModal(false)}
            onRequestClose={this.closeInfoModal(false)}
            visible={infoModalVisible}
          />
        </View>
      </SafeAreaView>
    );
  }
}
