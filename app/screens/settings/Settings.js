/* eslint-disable prettier/prettier */

import React, {Component} from 'react';
import {
  Alert,
  I18nManager,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import {color} from 'react-native-reanimated';
import {getAuth} from 'firebase/auth';
import {getStorage, ref, getDownloadURL} from 'firebase/storage';
import {getDatabase, ref as refData, child, get, set} from 'firebase/database';
import Avatar from '../../components/avatar/Avatar';
import Divider from '../../components/divider/Divider';
import Icon from '../../components/icon/Icon';
import {Subtitle1, Subtitle2} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';

import Colors from '../../theme/colors';
import {passAuth} from '../../config/firebase';
import {signOut} from 'firebase/auth';

const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';
const DIVIDER_MARGIN_LEFT = 15;
const ARROW_ICON = 'ios-arrow-forward';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    paddingBottom: 16,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingLeft: 16,
    fontWeight: '700',
    textAlign: 'left',
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileContainer: {
    paddingBottom: 15,
  },
  profileCenter: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profileInfo: {
    paddingLeft: 16,
  },
  name: {
    fontWeight: '500',
    textAlign: 'left',
    color: Colors.white,
  },
  email: {
    paddingVertical: 2,
    color: Colors.white,
  },
  mediumText: {
    fontWeight: '500',
  },
  setting: {
    height: 56,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    width: 28,
    height: 28,
  },
  extraDataContainer: {
    top: -8,
    marginLeft: DIVIDER_MARGIN_LEFT,
    paddingBottom: 8,
  },
  extraData: {
    textAlign: 'left',
  },
  logout: {color: Colors.primaryText},
});

type Props = {
  icon: string,
  title: String,
  onPress: () => {},
  extraData: React.Node,
};

const Setting = ({icon, title, onPress, extraData}: Props) => (
  <TouchableItem onPress={onPress}>
    <View>
      <View style={[styles.row, styles.setting]}>
        <View style={styles.leftSide}>
          {icon !== undefined && (
            <View style={styles.iconContainer}>
              <Icon name={icon} size={24} color={Colors.primaryColor} />
            </View>
          )}
          <Subtitle1 style={styles.mediumText}>{title}</Subtitle1>
        </View>

        <View style={isRTL && {transform: [{scaleX: -1}]}}>
          <Icon name={ARROW_ICON} size={16} color="rgba(0, 0, 0, 0.16)" />
        </View>
      </View>

      {extraData ? (
        <View style={styles.extraDataContainer}>{extraData}</View>
      ) : (
        <View />
      )}
    </View>
  </TouchableItem>
);

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationsOn: true,
      name: 'Name',
      email: 'test',
      // imageUri: require('../../assets/img/profile.jpg'),
      imageUri:
        'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
      number: '',
      street: '',
      district: '',
      city: '',
      country: 'Philippines',
    };
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  toggleNotifications = (value) => {
    this.setState({
      notificationsOn: value,
    });
  };

  loadProfile = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const self = this;
    if (user !== null) {
      user.providerData.forEach((profile) => {
        // this.setState({name: profile.displayName});
        this.setState({email: profile.email});
      });

      this.setState({uid:user.uid});
      const dbRef = refData(getDatabase());
      get(child(dbRef, `accounts/${user.uid}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let result = snapshot.val();
            this.setState({ name: result.name});
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
        self.setState({imageUri: url});
      })
      .catch((error) => {
        // Handle any errors
      });
    const dbRef = refData(getDatabase());
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
  componentDidMount = () => {
    this.loadProfile();

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.loadProfile();
    });
  };

  logout = () => {
    const {navigation} = this.props;
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            signOut(passAuth())
              .then(() => {
                navigation.navigate('Welcome');
              })
              .catch((error) => {
                console.log(error);
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  render() {
    const {notificationsOn} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.primaryColor}
          barStyle="dark-content"
        />

        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <TouchableItem useForeground onPress={this.navigateTo('EditProfile')}>
            <View
              style={
                ([styles.row, styles.profileContainer],
                {backgroundColor: Colors.primaryColor})
              }>
              <View style={styles.profileCenter}>
                <Avatar imageUri={this.state.imageUri} rounded size={120} />
                <View style={styles.profileCenter}>
                  <Subtitle1 style={styles.name}>{this.state.name}</Subtitle1>
                  <Subtitle2 style={styles.email}>{this.state.email}</Subtitle2>
                </View>
              </View>
            </View>
          </TouchableItem>

          <Divider />

          {/* <TouchableItem onPress={this.navigateTo('Notifications')}>
            <View style={[styles.row, styles.setting]}>
              <View style={styles.leftSide}>
                <Subtitle1 style={styles.mediumText}>Notifications</Subtitle1>
              </View>

              <View>
                <Switch
                  trackColor={{
                    true: IOS && Colors.primaryColor,
                  }}
                  thumbColor={IOS ? Colors.onPrimaryColor : Colors.primaryColor}
                  onValueChange={this.toggleNotifications}
                  value={notificationsOn}
                />
              </View>
            </View>
          </TouchableItem>
          <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} /> */}

          <Setting
            onPress={this.navigateTo('EditAddress')}
            title="Delivery Address"
            extraData={
              <View>
                <Subtitle2 style={styles.extraData}>
                  {this.state.number + ' ' + this.state.street}
                </Subtitle2>
                <Subtitle2 style={styles.extraData}>
                  {this.state.district +
                    ' ' +
                    this.state.city +
                    ' ' +
                    this.state.country}
                </Subtitle2>
              </View>
            }
          />
          <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />

          {/* <Setting
            onPress={this.navigateTo('PaymentMethod')}
            title="Payment Method"
            extraData={
              <View>
                <Subtitle2 style={styles.extraData}>Visa MasterCard</Subtitle2>
                <Subtitle2 style={styles.extraData}>
                  xxxx xxxx xxxx 7654
                </Subtitle2>
              </View>
            }
          />
          <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} /> */}

          <Setting onPress={this.navigateTo('Orders')} title="My Orders" />
          <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />

          <TouchableItem onPress={this.logout}>
            <View style={[styles.row, styles.setting]}>
              <View style={styles.leftSide}>
                <Subtitle1 style={[styles.logout, styles.mediumText]}>
                  Logout
                </Subtitle1>
              </View>
            </View>
          </TouchableItem>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
