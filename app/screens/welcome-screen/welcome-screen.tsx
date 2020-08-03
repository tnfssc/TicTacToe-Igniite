import React, { FunctionComponent as Component } from 'react';
import { View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { Button, Screen, Text, Wallpaper } from '../../components';
import { color, spacing } from '../../theme';
const bowserLogo = require('./bowser.png');

const FULL: ViewStyle = { flex: 1 };
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4]
};
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: 'Montserrat'
};
const BOLD: TextStyle = { fontWeight: 'bold' };
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  marginVertical: 32,
  fontSize: 28,
  lineHeight: 38,
  textAlign: 'center'
};
const BOWSER: ImageStyle = {
  alignSelf: 'center',
  marginVertical: spacing[5],
  maxWidth: '100%'
};
const CONTENT: TextStyle = {
  ...TEXT,
  color: '#BAB6C8',
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5]
};
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: '#5D2555'
};
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2
};
const FOOTER: ViewStyle = { backgroundColor: '#20162D' };
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4]
};

export const WelcomeScreen: Component = observer(function WelcomeScreen() {
  const navigation = useNavigation();
  const ticTacToeScreen = () => navigation.navigate('tictactoe');

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Text style={TITLE} preset="header" text="TicTacToe" />
        <Image source={bowserLogo} style={BOWSER} />
        <Text style={CONTENT}>This app is made using React Native and Ignite CLI.</Text>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button style={CONTINUE} textStyle={CONTINUE_TEXT} text="Play TicTacToe" onPress={ticTacToeScreen} />
        </View>
      </SafeAreaView>
    </View>
  );
});
