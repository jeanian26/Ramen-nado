/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */
/**
 *
 *
 * @format
 * @flow
 */

// import dependencies
import React, { Component } from 'react';
import { Keyboard, ScrollView, StatusBar, StyleSheet, View, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

// import components
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal';
import Button from '../../components/buttons/Button';
import GradientContainer from '../../components/gradientcontainer/GradientContainer';
import { Paragraph } from '../../components/text/CustomText';
import SafeAreaView from '../../components/SafeAreaView';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import { sendPasswordResetEmail } from 'firebase/auth';
import { passAuth } from '../../config/firebase';
import { getDatabase, ref, update } from 'firebase/database';


// import colors
import Colors from '../../theme/colors';

// ForgotPassword Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(255, 255, 255, 0.7)';
const INPUT_TEXT_COLOR = '#fff';
const INPUT_BORDER_COLOR = 'rgba(255, 255, 255, 0.4)';
const INPUT_FOCUSED_BORDER_COLOR = '#fff';

// ForgotPassword Styles
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    contentContainerStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 64,
        paddingHorizontal: 24,
    },
    instructionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primaryColor,
    },
    instruction: {
        marginTop: 32,
        paddingHorizontal: 16,
        fontSize: 14,
        color: Colors.onPrimaryColor,
        textAlign: 'center',
    },
    inputContainer: {
        paddingTop: 16,
    },
    inputStyle: {
        textAlign: 'center',
    },
    buttonContainer: {
        paddingTop: 22,
    },
});

export default class Verify extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            emailFocused: false,
            modalVisible: false,
            status: 'Send Email',
            code: 0,
            ID: '',
        };
    }

    componentDidMount = () => {
        const { route } = this.props;
        const { userID } = route.params;

        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this.keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this.keyboardDidHide,
        );
    };

    // avoid memory leak
    componentWillUnmount = () => {
        clearTimeout(this.timeout);
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    };

    keyboardDidShow = () => {
        this.setState({
            emailFocused: true,
        });
    };

    keyboardDidHide = () => {
        this.setState({
            emailFocused: false,
        });
    };

    emailChange = (text) => {
        const { navigation } = this.props;
        console.log(this.state.code);
        if (text.length === 6) {
            if (text == this.state.code) {
                this.updateStatus();
            } else {
                this.setState({ email: '' });
                alert('Failed to verify');

                return;
            }
        }
        this.setState({
            email: text,
        });
    };
    updateStatus() {
        const { navigation } = this.props;
        let userID = this.state.ID;
        const db = getDatabase();
        const updates = {};
        updates[`accounts/${userID}/emailVerified`] = true;
        update(ref(db), updates).then(() => {
            alert('Succesfully Verified');
            navigation.navigate('phoneVerify',{userID:userID});
        }).catch((e) =>{console.log(e);});

    }

    navigateTo = (screen) => {
        const { navigation } = this.props;
        navigation.navigate(screen);
    };
    onClick(status) {
        const { route } = this.props;
        const { userID } = route.params;
        this.setState({ ID: userID });
        let url = 'https://ramenadmin.pythonanywhere.com';
        if (status === 'Send Email') {
            fetch(`${url}/verify/${userID}`,)
                .then(response => response.text())
                .then((result) => {
                    let data = JSON.parse(result);
                    let finalData = JSON.parse(data);
                    console.log(finalData.code);
                    ToastAndroid.showWithGravity(
                        'SENT EMAIL',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                    );
                    this.setState({ code: finalData.code });
                })
                .catch(error => console.log('error', error));
        }
    }


    render() {
        const { emailFocused, modalVisible, status, email } = this.state;

        return (
            <GradientContainer>
                <SafeAreaView
                    forceInset={{ top: 'never' }}
                    style={styles.screenContainer}>
                    <StatusBar
                        backgroundColor={Colors.primaryColor}
                        barStyle="light-content"
                    />

                    <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                        <View style={styles.instructionContainer}>
                            <View style={styles.iconContainer}>
                                <Icon
                                    name="lock-outline"
                                    size={36}
                                    color={Colors.primaryColor}
                                />
                            </View>
                            <Paragraph style={styles.instruction}>
                                Click on Send Email. And enter the 6 digit Code that will be sent to your Email Address
                            </Paragraph>
                        </View>

                        <View style={styles.inputContainer}>
                            <UnderlineTextInput
                                onChangeText={this.emailChange}
                                inputFocused={emailFocused}
                                onSubmitEditing={this.resetPassword}
                                returnKeyType="done"
                                blurOnSubmit={false}
                                keyboardType="email-address"
                                placeholder="6 Digit Code"
                                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                                inputTextColor={INPUT_TEXT_COLOR}
                                borderColor={INPUT_BORDER_COLOR}
                                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                                inputStyle={styles.inputStyle}
                                value={email}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                onPress={() => this.onClick(status)}
                                color={Colors.surface}
                                small
                                title={status.toUpperCase()}
                                titleColor={Colors.primaryColor}
                                borderRadius={100}
                            />
                        </View>
                        <ActivityIndicatorModal
                            statusBarColor={Colors.primaryColor}
                            message="Please wait . . ."
                            onRequestClose={this.closeModal}
                            title="Sending instructions"
                            visible={modalVisible}
                        />
                    </ScrollView>
                </SafeAreaView>
            </GradientContainer>
        );
    }
}
