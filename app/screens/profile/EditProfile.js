/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */

import React, { Component } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary } from 'react-native-image-picker';
import { passAuth } from '../../config/firebase';
import { onAuthStateChanged, getAuth, updateProfile } from 'firebase/auth';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as refData, child, get, set, update } from 'firebase/database';

import Avatar from '../../components/avatar/Avatar';
import Icon from '../../components/icon/Icon';
import { Subtitle2 } from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import Button from '../../components/buttons/Button';

import Colors from '../../theme/colors';

const AVATAR_SIZE = 150;
const IOS = Platform.OS === 'ios';
const CAMERA_ICON = IOS ? 'ios-camera' : 'md-camera';
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  avatarSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  whiteCircle: {
    marginTop: -18,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  cameraButtonContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryColor,
    overflow: 'hidden',
  },
  cameraButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 34,
    height: 34,
  },
  editForm: {
    paddingHorizontal: 20,
  },
  overline: {
    color: Colors.primaryColor,
    textAlign: 'left',
  },
  inputContainerStyle: {
    marginTop: 0,
    marginBottom: 17,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonContainer: {
    paddingTop: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// EditProfile
export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      nameFocused: false,
      number: '',
      emailFocused: false,
      phone: '',
      phoneFocused: false,
      imagePickerVisible: false,
      imagePath: null,
      // uri: require('../../assets/img/profile.jpg'),
      uri: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
      uid: '',
    };
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  saveProfile() {
    const { navigation } = this.props;

    const db = getDatabase();
    const updates = {};
    updates[`accounts/${this.state.uid}/email`] = this.state.email;
    updates[`accounts/${this.state.uid}/name`] = this.state.name;
    updates[`accounts/${this.state.uid}/phone`] = this.state.phone;
    update(refData(db), updates).then(() => {
      ToastAndroid.showWithGravity(
        'SUCCESS UPDATING THE PROFILE',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      navigation.navigate('Settings');
    }).catch((e) => {
      console.log(e);
    });
  }

  nameChange = (text) => {
    this.setState({
      name: text,
    });
  };

  nameFocus = () => {
    this.setState({
      nameFocused: true,
      emailFocused: false,
      phoneFocused: false,
    });
  };

  emailChange = (text) => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      nameFocused: false,
      emailFocused: true,
      phoneFocused: false,
    });
  };

  phoneChange = (text) => {
    this.setState({
      phone: text,
    });
  };

  phoneFocus = () => {
    this.setState({
      nameFocused: false,
      emailFocused: false,
      phoneFocused: true,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };
  chooseImage = async () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    /** @type {any} */
    const metadata = {
      contentType: 'image/jpg',
    };
    const self = this;

    launchImageLibrary(options, (res) => {
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
        alert(res.customButton);
      } else {
        const uri = res.assets[0].uri;
        this.uploadImage(uri);
        self.setState({
          uri: uri,
        });
        //console.log(blob);
        //uploadBytes(storageRef, blob, metadata).then((snapshot) => {
        //  console.log('Uploaded a blob or file!', snapshot);
        //});
      }
    });
  };
  componentDidMount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user !== null) {
      user.providerData.forEach((profile) => {
        // this.setState({name: profile.displayName});
        this.setState({ email: profile.email });
      });
      this.setState({ uid: user.uid });
      const dbRef = refData(getDatabase());
      get(child(dbRef, `accounts/${user.uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            this.setState({ name: result.name, phone: result.phone });
          } else {
            console.log('No data available');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }


    const storage = getStorage();
    getDownloadURL(ref(storage, `profile_images/${user.uid}.jpg`))
      .then((url) => {
        this.setState({ uri: url });
        global.USERID = user.id;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const auth = getAuth();
    const user = auth.currentUser;
    const filename = user.uid + '.jpg';
    const storage = getStorage();
    const metadata = {
      contentType: 'image/jpg',
    };
    const storageRef = ref(storage, `/profile_images/${filename}`);
    uploadBytes(storageRef, blob, metadata).then((snapshot) => {
      console.log('Uploaded a blob or file!', snapshot);
    }).catch((e) => console.log(e));
  };

  render() {
    const { name, nameFocused, email, emailFocused, phone, phoneFocused } =
      this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <KeyboardAwareScrollView enableOnAndroid>
          <View style={styles.avatarSection}>
            <Avatar imageUri={this.state.uri} rounded size={AVATAR_SIZE} />

            <View style={styles.whiteCircle}>
              <View style={styles.cameraButtonContainer}>
                <TouchableItem onPress={() => this.chooseImage()}>
                  <View style={styles.cameraButton}>
                    <Icon
                      name={CAMERA_ICON}
                      size={16}
                      color={Colors.onPrimaryColor}
                    />
                  </View>
                </TouchableItem>
              </View>
            </View>
          </View>

          <View style={styles.editForm}>
            <Subtitle2 style={styles.overline}>Name</Subtitle2>
            <UnderlineTextInput
              onRef={(r) => {
                this.name = r;
              }}
              value={name}
              onChangeText={this.nameChange}
              onFocus={this.nameFocus}
              inputFocused={nameFocused}
              onSubmitEditing={this.focusOn(this.email)}
              returnKeyType="next"
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputContainerStyle={styles.inputContainerStyle}
            />

            <Subtitle2 style={styles.overline}>Phone Number</Subtitle2>
            <UnderlineTextInput
              onRef={(r) => {
                this.phone = r;
              }}
              value={phone}
              onChangeText={this.phoneChange}
              onFocus={this.phoneFocus}
              inputFocused={phoneFocused}
              onSubmitEditing={this.focusOn(this.phone)}
              returnKeyType="next"
              keyboardType="Phone Number"
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputContainerStyle={styles.inputContainerStyle}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => {
                this.saveProfile();
              }}
              color={Colors.primaryColor}
              small
              title={'SAVE PROFILE'.toUpperCase()}
              titleColor={Colors.background}
              borderRadius={100}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}
