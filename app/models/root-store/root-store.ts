import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const defaultStatesJSON = require("./default-states.json")

const CellStateModel = types.enumeration(["X", "O", " "])
const CellsStateModel = types.array(types.array(CellStateModel))
interface TicTacToeCellsState extends Instance<typeof CellsStateModel> {}

const defaultCellsState: TicTacToeCellsState = defaultStatesJSON.ticTacToeDefaultCellsState
const defaultPlayerState = "X"

const TicTacToeWinningCellsPattern: (0 | 1 | 2)[][][] = defaultStatesJSON.ticTacToeWinningPattern

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

const StateStore = types.model("StateStore").props({
  ticTacToeState: ticTacToeStateModel,
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
      })
    },
  }))

export interface RootStore extends Instance<typeof RootStoreModel> {}

export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
