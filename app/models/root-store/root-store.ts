import { Instance, SnapshotOut, types } from "mobx-state-tree"
import CodePush from "react-native-code-push"

export const defaultStatesJSON = require("./default-states.json")

const CellStateModel = types.enumeration(["X", "O", " "])
const CellsStateModel = types.array(types.array(CellStateModel))
export interface TicTacToeCellsState extends Instance<typeof CellsStateModel> {}

const defaultCellsState: TicTacToeCellsState = defaultStatesJSON.ticTacToeDefaultCellsState
const defaultPlayerState = "X"

const TicTacToeWinningCellsPattern: (0 | 1 | 2)[][][] = defaultStatesJSON.ticTacToeWinningPattern
import SplashScreen from "react-native-splash-screen"

const ticTacToeStateModel = types
  .model({
    currentPlayer: types.optional(types.enumeration(["X", "O"]), defaultPlayerState),
    cellsState: types.optional(CellsStateModel, defaultCellsState),
  })
  .views(self => ({
    get checkWinner(): { result: boolean; winner: "X" | "O" | null } {
      var result: boolean = false
      var winner: "X" | "O" | null = null
      TicTacToeWinningCellsPattern.forEach(win => {
        var won: boolean = true
        var referenceCellVal: "X" | "O" | " " = self.cellsState[win[0][0]][win[0][1]]
        if (referenceCellVal === " ") return
        win.forEach(([x, y]) => {
          if (self.cellsState[x][y] !== referenceCellVal) return (won = false)
          referenceCellVal = self.cellsState[x][y]
          return
        })
        if (won) {
          winner = referenceCellVal
          return (result = true)
        }
        return
      })
      return { result, winner }
    },
    get checkAllCellsFull(): boolean {
      var result: boolean = true
      self.cellsState.forEach(row =>
        row.forEach(cell => (cell === " " ? (result = false) : result)),
      )
      return result
    },
    get gameOver(): boolean {
      if (this.checkAllCellsFull || this.checkWinner.winner) return true
      return false
    },
  }))
  .actions(self => ({
    changePlayer: () => (self.currentPlayer = self.currentPlayer === "X" ? "O" : "X"),
    resetState: () => {
      self.cellsState = defaultCellsState
      self.currentPlayer = defaultPlayerState
    },
  }))
  .actions(self => ({
    markClicked: ([x, y]: [number, number]) => {
      if (self.cellsState[x][y] !== " " || self.gameOver) return
      self.cellsState[x][y] = self.currentPlayer
      self.changePlayer()
    },
  }))

const rootModalViewModel = types.model({
  mandatory: types.boolean,
  size: types.number,
  appVersion: types.string,
  description: types.string,
  valid: types.boolean,
  progress: types.number,
})
const rootModalModel = types
  .model({
    open: types.boolean,
    view: rootModalViewModel,
  })
  .actions(self => ({
    hide: () => (self.open = false),
    show: () => (self.open = true),
    configure: (view: IRootModalViewModel) => (self.view = { ...view }),
    setProgress: ({ receivedBytes, totalBytes }): number =>
      (self.view.progress = Math.round((receivedBytes / totalBytes) * 100)),
  }))

export interface IRootModalModel extends Instance<typeof rootModalModel> {}
export interface IRootModalViewModel extends Instance<typeof rootModalViewModel> {}

const StateStore = types.model("StateStore").props({
  ticTacToeState: ticTacToeStateModel,
  rootModal: rootModalModel,
})

export const RootStoreModel = types
  .model("RootStore")
  .props({
    stateStore: types.maybe(StateStore),
  })
  .actions(self => ({
    afterCreate: () => {
      self.stateStore = StateStore.create({
        ticTacToeState: ticTacToeStateModel.create(),
        rootModal: rootModalModel.create(defaultStatesJSON.rootModelDefaultState),
      })
      CodePush.notifyAppReady()
      CodePush.checkForUpdate()
        .then(update => {
          if (!update) return SplashScreen.hide()
          //update = { appVersion: null, description: null, isMandatory: null, packageSize: null }
          const { appVersion, description, isMandatory, packageSize } = update
          self.stateStore?.rootModal.configure({
            appVersion: appVersion ? appVersion : "",
            description: description ? description : "",
            mandatory: isMandatory ? isMandatory : false,
            size: packageSize ? packageSize : NaN,
            valid: true,
            progress: 0,
          })
          self.stateStore?.rootModal.show()
        })
        .catch(error => console.log(error))
    },
  }))
  .actions(self => ({
    updateApplication: () => {
      CodePush.checkForUpdate().then(update => {
        if (!update) {
          SplashScreen.hide()
          self.stateStore?.rootModal.hide()
          return
        }
        update
          .download(progress => self.stateStore?.rootModal.setProgress(progress))
          .then(bundle => {
            CodePush.allowRestart()
            bundle.install(CodePush.InstallMode.IMMEDIATE).then(() => {
              self.stateStore?.rootModal.hide()
              //  SplashScreen.hide()
            })
          })
      })
    },
    remindMeLater: () => {
      self.stateStore?.rootModal.hide()
      SplashScreen.hide()
    },
  }))

export interface RootStore extends Instance<typeof RootStoreModel> {}

export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
