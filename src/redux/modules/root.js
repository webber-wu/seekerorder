import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';

import ui from '../reducer/uiReducer';
import { pingEpic } from '../epics/uiEpics';

export const rootEpic = combineEpics(pingEpic);

export const rootReducer = combineReducers({
  ui,
});
