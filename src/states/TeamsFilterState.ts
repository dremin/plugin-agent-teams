import { Action } from '.';

const ACTION_SET_FILTER = 'AGENTTEAMS_SET_FILTER';

const initialState: string = ''

export class Actions {
  public static setFilter = (filter: string): Action => ({ 
    type: ACTION_SET_FILTER, 
    payload: filter
  });
}

export function reduce(state: string = initialState, action: Action): string {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case ACTION_SET_FILTER: {
      return action.payload;
    }

    default:
      return state;
  }
}
