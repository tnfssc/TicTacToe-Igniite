/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your PrimaryNavigator) which the user
 * will use once logged in.
 */
import React, { FunctionComponent as Component } from "react"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"

import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { PrimaryNavigator } from "./primary-navigator"
import { color, timing, spacing } from "../theme"
import { useStores } from "../models"
import ReactNativeModal from "react-native-modal"
import { ViewStyle, View } from "react-native"
import { Text, Button } from "../components"
import { observer } from "mobx-react-lite"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * We recommend using MobX-State-Tree store(s) to handle state rather than navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type RootParamList = {
  primaryStack: undefined
}

const Stack = createNativeStackNavigator<RootParamList>()

const RootStack: Component = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        stackAnimation: "default",
        stackPresentation: "modal",
        headerTintColor: color.palette.black,
      }}
    >
      <Stack.Screen
        name="primaryStack"
        component={PrimaryNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

const MODAL_VIEW: ViewStyle = {
  backgroundColor: color.palette.black,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: spacing[3],
  padding: spacing[4],
}

const RootModal: Component = observer(() => {
  const rootStore = useStores()
  const { stateStore } = rootStore
  if (!stateStore) return null
  const { rootModal } = stateStore

  return (
    <ReactNativeModal
      isVisible={rootModal.open && rootModal.view.valid}
      animationIn="bounceInDown"
      animationInTiming={timing.slow}
      animationOutTiming={timing.fast}
      animationOut="bounceOutUp"
    >
      <View style={MODAL_VIEW}>
        <Text>{rootModal.view.appVersion}</Text>
        {!rootModal.view.mandatory ? (
          <Button onPress={rootStore.remindMeLater}>
            <Text>[X]</Text>
          </Button>
        ) : (
          <></>
        )}
        <Text>Update available</Text>
        {rootModal.view.description.length ? <Text>Description: {}</Text> : <></>}
        <Text>Size: {Math.round(rootModal.view.size / 1000) / 1000} MB</Text>
        <Text>Version: {rootModal.view.appVersion}</Text>
        <Button onPress={rootStore.updateApplication}>
          <Text>Update Now</Text>
        </Button>
        <View
          style={{ width: "100%", flexDirection: "row", height: 16, justifyContent: "flex-start" }}
        >
          <View
            style={{
              width: `${rootModal.view.progress}%`,
              backgroundColor: color.palette.orangeDarker,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{`${rootModal.view.progress}%`}</Text>
          </View>
        </View>
      </View>
    </ReactNativeModal>
  )
})

export const RootNavigator: Component = React.forwardRef<
  NavigationContainerRef,
  Partial<React.ComponentProps<typeof NavigationContainer>>
>((props, ref) => {
  return (
    <NavigationContainer {...props} ref={ref}>
      <RootModal />
      <RootStack />
    </NavigationContainer>
  )
})

RootNavigator.displayName = "RootNavigator"
