/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app or storybook.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigation, so head over there
 * if you're interested in adding screens and navigators.
 */
import "./i18n"
import "./utils/ignore-warnings"
import React, { useState, useEffect, useRef, FunctionComponent as Component } from "react"
import { NavigationContainerRef } from "@react-navigation/native"
import { SafeAreaProvider, initialWindowSafeAreaInsets } from "react-native-safe-area-context"
import * as storage from "./utils/storage"
import {
  useBackButtonHandler,
  RootNavigator,
  canExit,
  setRootNavigation,
  useNavigationPersistence,
} from "./navigation"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import codePush, { CodePushOptions } from "react-native-code-push"

import { enableScreens } from "react-native-screens"
import { View } from "react-native"
import { Text } from "./components"
enableScreens()

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

const App: Component<{}> = () => {
  const navigationRef = useRef<NavigationContainerRef>(null)
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  setRootNavigation(navigationRef)
  useBackButtonHandler(navigationRef, canExit)
  const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY,
  )

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    const init = async () => {
      setupRootStore().then(setRootStore)
    }
    init()
  }, [])
  if (!rootStore)
    return (
      <View>
        <Text>ERROR</Text>
      </View>
    )

  return (
    <RootStoreProvider value={rootStore}>
      <SafeAreaProvider initialSafeAreaInsets={initialWindowSafeAreaInsets}>
        <RootNavigator
          ref={navigationRef}
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        />
      </SafeAreaProvider>
    </RootStoreProvider>
  )
}
export const codePushOptions: CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: codePush.InstallMode.ON_NEXT_SUSPEND,
  minimumBackgroundDuration: 120,
  updateDialog: {
    appendReleaseDescription: true,
    mandatoryContinueButtonLabel: "Update Now",
    mandatoryUpdateMessage: "This update is mandatory!",
    optionalIgnoreButtonLabel: "Remind me Later!",
    optionalInstallButtonLabel: "Update Now",
    optionalUpdateMessage: "A instant update is available. It consumes very little data (< 5MB).",
    title: "Update available",
  },
}
export default App
