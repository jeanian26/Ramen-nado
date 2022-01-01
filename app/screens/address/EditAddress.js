/* eslint-disable prettier/prettier */

import React, {Component} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import Button from '../../components/buttons/Button';
import {Paragraph} from '../../components/text/CustomText';
import {getAuth} from 'firebase/auth';
import {getDatabase, ref, child, get, set} from 'firebase/database';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';

import Colors from '../../theme/colors';

const PLACEHOLDER_TEXT_COLOR = 'rgba(0, 0, 0, 0.4)';
const INPUT_TEXT_COLOR = 'rgba(0, 0, 0, 0.87)';
const INPUT_BORDER_COLOR = 'rgba(0, 0, 0, 0.2)';
const INPUT_FOCUSED_BORDER_COLOR = '#000';

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  instructionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 104,
  },
  touchArea: {
    marginHorizontal: 16,
    marginBottom: 6,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(35, 47, 52, 0.12)',
    overflow: 'hidden',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  instruction: {
    marginTop: 32,
    paddingHorizontal: 32,
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  inputContainer: {
    margin: 8,
  },
  small: {
    flex: 2,
  },
  large: {
    flex: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  extraSmallButton: {
    width: '48%',
  },
});

// EditAddress
export default class EditAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addressType: 'home',
      number: '',
      numberFocused: false,
      street: '',
      streetFocused: false,
      district: '',
      districtFocused: false,
      zip: '',
      zipFocused: false,
      city: '',
      cityFocused: false,
      modalVisible: false,
      messageTitle: 'Saving address details',
      userID: '',
    };
  }

  keyboardDidHide = () => {
    this.setState({
      numberFocused: false,
      streetFocused: false,
      districtFocused: false,
      zipFocused: false,
      cityFocused: false,
    });
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  setAddressType = (type) => () => {
    this.setState({
      addressType: type,
    });
  };

  onChangeText = (key) => (text) => {
    this.setState({
      [key]: text,
    });
  };

  onFocus = (key) => () => {
    let focusedInputs = {
      numberFocused: false,
      streetFocused: false,
      districtFocused: false,
      zipFocused: false,
      cityFocused: false,
    };
    focusedInputs[key] = true;

    this.setState({
      ...focusedInputs,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  saveAddress = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const {navigation} = this.props;

    const db = getDatabase();
    set(ref(db, 'address/' + user.uid), {
      str_number: this.state.number,
      street_name: this.state.street,
      barangay: this.state.district,
      city: this.state.city,
      zipcode: this.state.zip,
    });
    navigation.navigate('Settings');
  };
  componentDidMount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const dbRef = ref(getDatabase());
    const self = this;
    get(child(dbRef, `address/${user.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const result = snapshot.val();
          self.setState({
            number: result.str_number,
            street: result.street_name,
            district: result.barangay,
            city: result.city,
            zip: result.zipcode,
          });
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  closeModal = () => {
    // for demo purpose clear timeout if user request close modal before 3s timeout
    clearTimeout(this.timeout);
    this.setState(
      {
        modalVisible: false,
      },
      () => {
        this.goBack();
      },
    );
  };

  render() {
    const {
      addressType,
      number,
      numberFocused,
      street,
      streetFocused,
      district,
      districtFocused,
      zip,
      zipFocused,
      city,
      cityFocused,
      modalVisible,
      messageTitle,
    } = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.instructionContainer}>
            <Paragraph style={styles.instruction}>
              Edit your delivery address details
            </Paragraph>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <UnderlineTextInput
                onChangeText={this.onChangeText('number')}
                onFocus={this.onFocus('numberFocused')}
                inputFocused={numberFocused}
                onSubmitEditing={this.focusOn(this.street)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="Number"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                value={number}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              />
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                onRef={(r) => {
                  this.street = r;
                }}
                onChangeText={this.onChangeText('street')}
                onFocus={this.onFocus('streetFocused')}
                inputFocused={streetFocused}
                onSubmitEditing={this.focusOn(this.district)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="Street name"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                value={street}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              />
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                onRef={(r) => {
                  this.district = r;
                }}
                onChangeText={this.onChangeText('district')}
                onFocus={this.onFocus('districtFocused')}
                inputFocused={districtFocused}
                onSubmitEditing={this.focusOn(this.zip)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="District"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                value={district}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.small]}>
                <UnderlineTextInput
                  onRef={(r) => {
                    this.zip = r;
                  }}
                  onChangeText={this.onChangeText('zip')}
                  onFocus={this.onFocus('zipFocused')}
                  inputFocused={zipFocused}
                  onSubmitEditing={this.focusOn(this.city)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  placeholder="ZIP Code"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  value={zip}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                />
              </View>

              <View style={[styles.inputContainer, styles.large]}>
                <UnderlineTextInput
                  onRef={(r) => {
                    this.city = r;
                  }}
                  onChangeText={this.onChangeText('city')}
                  onFocus={this.onFocus('cityFocused')}
                  inputFocused={cityFocused}
                  onSubmitEditing={this.saveAddress}
                  returnKeyType="done"
                  blurOnSubmit={false}
                  placeholder="City"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  value={city}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              onPress={this.saveAddress}
              disabled={false}
              small
              title={'Save'.toUpperCase()}
              buttonStyle={styles.extraSmallButton}
            />
          </View>

          <ActivityIndicatorModal
            message="Please wait . . ."
            onRequestClose={this.closeModal}
            title={messageTitle}
            visible={modalVisible}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}
