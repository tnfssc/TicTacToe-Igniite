import React, { FunctionComponent as Component, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle, View } from "react-native"
import Modal from "react-native-modal"
import { Screen, Text, Button, Wallpaper } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color, spacing, typography, timing } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
  justifyContent: "center",
}
const TICTACTOE_BUTTONS_ROW: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}
const TICTACTOE_BUTTON: ViewStyle = {
  flex: 1,
  margin: spacing[2],
  aspectRatio: 1,
  backgroundColor: color.palette.orangeDarker,
}
const TICTACTOE_BUTTON_TEXT: TextStyle = {
  fontSize: spacing[7],
}
const RESET_BUTTON: ViewStyle = {
  backgroundColor: color.palette.lighterGrey,
  margin: spacing[3],
}
const RESET_BUTTON_TEXT: TextStyle = {
  padding: spacing[4],
  color: color.palette.black,
  fontFamily: typography.primary,
  fontSize: spacing[5],
}
const MODAL_VIEW: ViewStyle = {
  backgroundColor: color.palette.black,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: spacing[3],
  padding: spacing[4],
}
const GAMEOVER_TEXT: TextStyle = {
  fontSize: spacing[5],
}
const WINNER_TEXT: TextStyle = {
  fontSize: spacing[6],
}

export const TictactoeScreen: Component = observer(function TictactoeScreen() {
  const { stateStore } = useStores()
  const [modalViewState, setModalViewState] = useState<{ winner: "X" | "O" | null | undefined }>({
    winner: null,
  })
  useEffect(() => {
    setTimeout(
      () =>
        setModalViewState(prevState => ({
          ...prevState,
          winner: stateStore?.ticTacToeState.checkWinner.winner,
        })),
      !stateStore?.ticTacToeState.checkWinner.winner &&
        !stateStore?.ticTacToeState.checkWinner.result
        ? timing.fast
        : timing.instant,
    )
  }, [stateStore?.ticTacToeState.checkWinner.winner])
  return (
    <Screen style={ROOT} preset="scroll">
      <Wallpaper />
      <Modal
        animationIn="bounceInDown"
        animationInTiming={timing.slow}
        animationOutTiming={timing.fast}
        animationOut="bounceOutUp"
        isVisible={stateStore?.ticTacToeState.gameOver}
      >
        <View style={MODAL_VIEW}>
          <Text style={GAMEOVER_TEXT}>Game Over!</Text>
          <Text style={WINNER_TEXT}>
            {modalViewState.winner ? modalViewState.winner : "No one"} wins!
          </Text>
          <Button style={RESET_BUTTON} onPress={stateStore?.ticTacToeState.resetState}>
            <Text style={RESET_BUTTON_TEXT}>Reset</Text>
          </Button>
        </View>
      </Modal>
      {stateStore?.ticTacToeState.cellsState.map((row, index) => (
        <View style={TICTACTOE_BUTTONS_ROW} key={`item-${index}`}>
          {row.map((cell, innerIndex) => (
            <Button
              onPress={() => stateStore.ticTacToeState.markClicked([index, innerIndex])}
              style={TICTACTOE_BUTTON}
              key={`item-${innerIndex}`}
            >
              <Text style={TICTACTOE_BUTTON_TEXT}>{cell}</Text>
            </Button>
          ))}
        </View>
      ))}
    </Screen>
  )
})
