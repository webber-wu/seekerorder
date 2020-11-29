import * as types from '../types';

const initialState = {
  isInitial: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.INITIALS:
      return {
        ...state,
        isInitial: action.initial,
      };

    case types.SET__UI:
      return {
        isInitial: false,
      };

    default:
      return state;
  }
};
