import { AppState as FlexAppState } from '@twilio/flex-ui';
import { combineReducers, Action as ReduxAction } from 'redux';

import { reduce as TeamsFilterReducer } from './TeamsFilterState';
import { WorkerMapState, reduce as WorkerMapReducer } from './WorkerMapState';

// Register your redux store under a unique namespace
export const namespace = 'agentTeams';

// Extend this payload to be of type that your ReduxAction is
export interface Action extends ReduxAction {
  payload?: any;
}

// Register all component states under the namespace
export interface AppState {
  flex: FlexAppState;
  agentTeams: {
    workerMap: WorkerMapState,
    teamsFilter: string
  };
}

// Combine the reducers
export default combineReducers({
  workerMap: WorkerMapReducer,
  teamsFilter: TeamsFilterReducer,
});
