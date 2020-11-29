import { delay, mapTo } from 'rxjs/operators';
import * as types from '../types';

export const pingEpic = (action$) =>
  action$.ofType(types.INITIALS).pipe(delay(3000), mapTo({ type: 'SET__UI' }));

export const testEpic = (action$) =>
  action$.ofType(types.SET__UI).pipe(mapTo({ type: 'TEST' }));
