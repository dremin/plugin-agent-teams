import { Action } from '.';
import { Worker } from "types/sync/LiveQuery";

const ACTION_INIT_WORKERS = 'AGENTTEAMS_INIT_WORKERS';
const ACTION_UPDATE_WORKER = 'AGENTTEAMS_UPDATE_WORKER';
const ACTION_REMOVE_WORKER = 'AGENTTEAMS_REMOVE_WORKER';

export interface WorkerMapState {
  [key: string]: Worker
}

const initialState: WorkerMapState = {
};

export class Actions {
  public static initWorkers = (workerState: WorkerMapState): Action => ({ 
    type: ACTION_INIT_WORKERS, 
    payload: workerState
  });
  public static updateWorker = (workerState: WorkerMapState): Action => ({ 
    type: ACTION_UPDATE_WORKER, 
    payload: workerState
  });
  public static removeWorker = (workerSid: string): Action => ({ 
    type: ACTION_REMOVE_WORKER, 
    payload: workerSid
  });
}

export function reduce(state: WorkerMapState = initialState, action: Action): WorkerMapState {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case ACTION_INIT_WORKERS: {
      return {
        ...action.payload
      };
    }
    case ACTION_UPDATE_WORKER: {
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };
    }
    case ACTION_REMOVE_WORKER: {
      delete state[action.payload]
      
      return {
        ...state
      };
    }

    default:
      return state;
  }
}
