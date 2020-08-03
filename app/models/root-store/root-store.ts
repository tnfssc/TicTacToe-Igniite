import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import CodePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';

export const defaultStatesJSON = require('./default-states.json');

const CellStateModel = types.enumeration(['X', 'O', ' ']);
const CellsStateModel = types.array(types.array(CellStateModel));
export interface TicTacToeCellsState extends Instance<typeof CellsStateModel> {}

const defaultCellsState: TicTacToeCellsState = defaultStatesJSON.ticTacToeDefaultCellsState;
const defaultPlayerState = 'X';

const TicTacToeWinningCellsPattern: (0 | 1 | 2)[][][] = defaultStatesJSON.ticTacToeWinningPattern;

const ticTacToeStateModel = types
  .model({
    currentPlayer: types.optional(types.enumeration(['X', 'O']), defaultPlayerState),
    cellsState: types.optional(CellsStateModel, defaultCellsState)
  })
  .views(self => ({
    get checkWinner(): { result: boolean; winner: 'X' | 'O' | null } {
      let result = false;
      let winner: 'X' | 'O' | null = null;
      TicTacToeWinningCellsPattern.forEach(win => {
        let won = true;
        let referenceCellVal: 'X' | 'O' | ' ' = self.cellsState[win[0][0]][win[0][1]];
        if (referenceCellVal === ' ') return;
        // @ts-ignore
        win.forEach(([x, y]) => {
          if (self.cellsState[x][y] !== referenceCellVal) return (won = false);
          referenceCellVal = self.cellsState[x][y];
        });
        if (won) {
          winner = referenceCellVal;
          result = true;
        }
      });
      return { result, winner };
    },
    get checkAllCellsFull(): boolean {
      let result = true;
      self.cellsState.forEach(row => row.forEach(cell => (cell === ' ' ? (result = false) : result)));
      return result;
    },
    get gameOver(): boolean {
      return !!(this.checkAllCellsFull || this.checkWinner.winner);
    }
  }))
  .actions(self => ({
    changePlayer: () => (self.currentPlayer = self.currentPlayer === 'X' ? 'O' : 'X'),
    resetState: () => {
      self.cellsState = defaultCellsState;
      self.currentPlayer = defaultPlayerState;
    }
  }))
  .actions(self => ({
    markClicked: ([x, y]: [number, number]) => {
      if (self.cellsState[x][y] !== ' ' || self.gameOver) return;
      self.cellsState[x][y] = self.currentPlayer;
      self.changePlayer();
    }
  }));

const rootModalViewModel = types.model({
  mandatory: types.boolean,
  size: types.number,
  appVersion: types.string,
  description: types.string,
  valid: types.boolean,
  progress: types.number
});
const rootModalModel = types
  .model({
    open: types.boolean,
    view: rootModalViewModel
  })
  .actions(self => ({
    hide: () => (self.open = false),
    show: () => (self.open = true),
    configure: (view: IRootModalViewModel) => (self.view = { ...view }),
    setProgress: ({ receivedBytes, totalBytes }): number =>
      (self.view.progress = Math.round((receivedBytes / totalBytes) * 100))
  }));

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IRootModalModel extends Instance<typeof rootModalModel> {}
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IRootModalViewModel extends Instance<typeof rootModalViewModel> {}

const StateStore = types.model('StateStore').props({
  ticTacToeState: ticTacToeStateModel,
  rootModal: rootModalModel
});

export const RootStoreModel = types
  .model('RootStore')
  .props({
    stateStore: types.maybe(StateStore)
  })
  .actions(self => ({
    afterCreate: () => {
      self.stateStore = StateStore.create({
        ticTacToeState: ticTacToeStateModel.create(),
        rootModal: rootModalModel.create(defaultStatesJSON.rootModelDefaultState)
      });
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      CodePush.notifyAppReady().then(() => {});
      CodePush.checkForUpdate()
        .then(update => {
          if (!update) return SplashScreen.hide();
          // update = { appVersion: null, description: null, isMandatory: null, packageSize: null }
          const { appVersion, description, isMandatory, packageSize } = update;
          // eslint-disable-next-line no-unused-expressions
          self.stateStore?.rootModal.configure({
            appVersion: appVersion || '',
            description: description || '',
            mandatory: isMandatory || false,
            size: packageSize || NaN,
            valid: true,
            progress: 0
          });
          // eslint-disable-next-line no-unused-expressions
          self.stateStore?.rootModal.show();
        })
        .catch(error => console.log(error));
    }
  }))
  .actions(self => ({
    updateApplication: () => {
      CodePush.checkForUpdate().then(update => {
        if (!update) {
          SplashScreen.hide();
          // eslint-disable-next-line no-unused-expressions
          self.stateStore?.rootModal.hide();
          return;
        }
        update
          .download(progress => self.stateStore?.rootModal.setProgress(progress))
          .then(bundle => {
            CodePush.allowRestart();
            bundle.install(CodePush.InstallMode.IMMEDIATE).then(() => {
              // eslint-disable-next-line no-unused-expressions
              self.stateStore?.rootModal.hide();
              //  SplashScreen.hide()
            });
          });
      });
    },
    remindMeLater: () => {
      // eslint-disable-next-line
      self.stateStore?.rootModal.hide();
      SplashScreen.hide();
    }
  }));

export interface RootStore extends Instance<typeof RootStoreModel> {}

export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
