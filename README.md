# TicTacToe

[![CircleCI](https://circleci.com/gh/infinitered/ignite-bowser.svg?style=svg)](https://circleci.com/gh/infinitered/ignite-bowser)

## The latest and greatest boilerplate for Infinite Red opinions

This is the boilerplate that [Infinite Red](https://infinite.red) uses as a way to test bleeding-edge changes to our React Native stack.

Currently includes:

- React Native
- React Navigation
- MobX State Tree
- TypeScript
- And more!

## Quick Start

The Ignite Bowser boilerplate project's structure will look similar to this:

```
ignite-project
├── app
│   ├── components
│   ├── i18n
│   ├── utils
│   ├── models
│   ├── navigation
│   ├── screens
│   ├── services
│   ├── theme
│   ├── app.tsx
├── storybook
│   ├── views
│   ├── index.ts
│   ├── storybook-registry.ts
│   ├── storybook.ts
├── test
│   ├── __snapshots__
│   ├── storyshots.test.ts.snap
│   ├── mock-i18n.ts
│   ├── mock-reactotron.ts
│   ├── setup.ts
│   ├── storyshots.test.ts
├── README.md
├── android
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── keystores
│   └── settings.gradle
├── ignite
│   ├── ignite.json
│   └── plugins
├── index.js
├── ios
│   ├── IgniteProject
│   ├── IgniteProject-tvOS
│   ├── IgniteProject-tvOSTests
│   ├── IgniteProject.xcodeproj
│   └── IgniteProjectTests
├── .env
└── package.json

```

### ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the src directory looks similar to the following:

```
app
│── components
│── i18n
├── models
├── navigation
├── screens
├── services
├── theme
├── utils
└── app.tsx
```

**components**
This is where your React components will live. Each component will have a directory containing the `.tsx` file, along with a story file, and optionally `.presets`, and `.props` files for larger components. The app will come with some commonly used components like Button.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigation**
This is where your `react-navigation` navigators will live.

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truely shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application. This is also where you will specify whether you want to run the app in storybook mode.

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find generators, plugins and examples to help you get started with React Native.

### ./storybook directory

This is where your stories will be registered and where the Storybook configs will live

### ./test directory

This directory will hold your Jest configs and mocks, as well as your [storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) test file. This is a file that contains the snapshots of all your component storybooks.

## Running Storybook

From the command line in your generated app's root directory, enter `yarn run storybook`
This starts up the storybook server.

In `index.js`, change `SHOW_STORYBOOK` to `true` and reload the app.

For Visual Studio Code users, there is a handy extension that makes it easy to load Storybook use cases into a running emulator via tapping on items in the editor sidebar. Install the `React Native Storybook` extension by `Orta`, hit `cmd + shift + P` and select "Reconnect Storybook to VSCode". Expand the STORYBOOK section in the sidebar to see all use cases for components that have `.story.tsx` files in their directories.

## Previous Boilerplates

- [2017 aka Andross](https://github.com/infinitered/ignite-andross)
- [2016 aka Ignite 1.0](https://github.com/infinitered/ignite-ir-boilerplate-2016)

## Premium Support

[Ignite CLI](https://infinite.red/ignite), [Ignite Andross](https://github.com/infinitered/ignite-andross), and [Ignite Bowser](https://github.com/infinitered/ignite-bowser), as open source projects, are free to use and always will be. [Infinite Red](https://infinite.red/) offers premium Ignite support and general mobile app design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch with us for more details.
### Codepush

#### Install code-push CLI

```
npm i -g code-push-cli
# or
yarn global add code-push-cli
```

#### First time? Register & Setup!

* `code-push login`
* Create an account
* Log in with the newly created account
* Paste the token into your terminal
* Create the apps:
    * `code-push app add MY_APP-Android android react-native`
    * `code-push app add MY_APP-iOS ios react-native`
* `react-native link react-native-code-push` and paste the API key when it asks you

#### Logging in

```
code-push login
# enter your credentials
```

#### Verify you have access to the apps

```
code-push app list
```

You should see:

```
┌───────────────────────────────────┬─────────────────────┐
│ Name                              │ Deployments         │
├───────────────────────────────────┼─────────────────────┤
│ MY_APP-Android                    │ Production, Staging │
├───────────────────────────────────┼─────────────────────┤
│ MY_APP-iOS                        │ Production, Staging │
└───────────────────────────────────┴─────────────────────┘
```

#### How to release for everyone

```
code-push release-react MY_APP-iOS ios
code-push release-react MY_APP-Android android
```

#### How to release for only one specific version

```
code-push release-react MY_APP-iOS ios --targetBinaryVersion "~1.1.0"
code-push release-react MY_APP-Android android --targetBinaryVersion "~1.1.0"
```

#### How to release for Staging/Production

```
code-push release-react MY_APP-iOS ios --targetBinaryVersion "~1.1.0"
code-push release-react MY_APP-Android android --targetBinaryVersion "~1.1.0"

# Release the latest Staging bundle to Production
code-push promote MY_APP-iOS Staging Production
code-push promote MY_APP-Android Staging Production
```

More possibilities on the [react-native-code-push repo](https://github.com/microsoft/react-native-code-push#releasing-updates)

#### Code sign for better security

Code Signing: https://github.com/Microsoft/react-native-code-push/blob/master/docs/setup-ios.md

