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
      number: '1',
      numberFocused: false,
      street: '2',
      streetFocused: false,
      district: '3',
      districtFocused: false,
      zip: '4',
      zipFocused: false,
      city: '5',
      cityFocused: false,
      modalVisible: false,
      messageTitle: 'Saving address details',
      userID: '',
      min:'0',
      max:'100',
      count:'1',
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
      [key]: text.replace(/[^0-9]/g, ''),
    });
  };
  navigateTo = (screen) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen, {min:this.state.min, max:this.state.max, count:this.state.count});
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

  componentDidMount = async () => {

  };



  render() {
    const {
      modalVisible,
      messageTitle,
      min,
      max,
      count,
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
              Input your price range
            </Paragraph>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <UnderlineTextInput
                onChangeText={this.onChangeText('min')}
                onFocus={this.onFocus('numberFocused')}
                onSubmitEditing={this.focusOn(this.street)}
                returnKeyType="next"
                placeholder="Minimum Budget"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                value={min}
              />
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                onRef={(r) => {
                  this.street = r;
                }}
                value={(max)}
                onChangeText={this.onChangeText('max')}
                onFocus={this.onFocus('streetFocused')}
                onSubmitEditing={this.focusOn(this.district)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="Maximum Budget"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              />
            </View>
            <View style={styles.inputContainer}>
              <UnderlineTextInput
                onRef={(r) => {
                  this.zip = r;
                }}
                value={(count)}
                onChangeText={this.onChangeText('count')}
                onFocus={this.onFocus('streetFocused')}
                onSubmitEditing={this.focusOn(this.district)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder="Number of People"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              />
            </View>


            <View style={styles.inputContainer} />

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.small]} />
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              onPress={this.navigateTo('SearchResults')}
              disabled={false}
              small
              title={'Search'.toUpperCase()}
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
