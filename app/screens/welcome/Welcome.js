/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */

import React, {Component} from 'react';
import {ImageBackground, StatusBar, StyleSheet, View} from 'react-native';
import {passAuth} from '../../config/firebase';
import {onAuthStateChanged} from 'firebase/auth';

import Button from '../../components/buttons/Button';
import {Heading5, Paragraph} from '../../components/text/CustomText';
import LinkButton from '../../components/buttons/LinkButton';
import Logo from '../../components/logo/Logo';
import SafeAreaView from '../../components/SafeAreaView';

import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

const headerImg = {
  uri: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
  },
  headerImg: {
    height: Layout.SCREEN_HEIGHT * 0.48,
    backgroundColor: Colors.primaryColor,
    opacity: 0.8,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  headerText: {
    fontWeight: '700',
    color: Colors.white,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  footer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
    borderRadius: 52,
    width: 104,
    height: 104,
    backgroundColor: Colors.white,
  },
  center: {
    alignItems: 'center',
  },
  buttonsGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  customButton: {
    width: '90%',
    borderRadius: 50,
  },
  hspace16: {
    width: 16,
  },
  linkButtonText: {
    color: Colors.onSurface,
  },
});

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  componentDidMount = async () => {
    // const {navigation} = this.props;
    // onAuthStateChanged(passAuth(), (user) => {
    //   if (user) {
    //     console.log(user);
    //     navigation.navigate('HomeNavigator');
    //   } else {
    //     console.log('no user logged in');
    //   }
    // });
  };

  render() {
    return (
      <SafeAreaView forceInset={{top: 'never'}} style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.primaryColor}
          barStyle="light-content"
        />

        <View style={{position: 'relative'}}>
          <ImageBackground
            source={headerImg}
            style={styles.headerImg}></ImageBackground>
        </View>

        <View style={styles.footer}>
          <View style={styles.logoContainer}>
            <Logo logoStyle={{borderRadius: 100}} size={96} />
          </View>

          <View style={styles.center}>
            <Paragraph>Find your Favorite Ramen online.</Paragraph>
            <Paragraph>Try different flavours. Enjoy!</Paragraph>
          </View>

          <View style={styles.center}>
            <View style={styles.buttonsGroup}>
              <Button
                buttonStyle={styles.customButton}
                onPress={this.navigateTo('SignIn')}
                title={'Sign in'.toUpperCase()}
              />
            </View>
            <View style={styles.buttonsGroup}>
              <Button
                buttonStyle={styles.customButton}
                onPress={this.navigateTo('SignUp')}
                title={'Sign up'.toUpperCase()}
                outlined
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
