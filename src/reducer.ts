import { useReducer } from 'react';

export interface ReducerState<T = any> {
  data: T | undefined;
  loading: boolean;
  error: Error | string | undefined;
}

export type ReducerAction<T = any> =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: Error | string };

export const initialState = {
  data: undefined,
  error: undefined,
  loading: false,
};

function reducer<T = any>(
  state: ReducerState<T>,
  action: ReducerAction<T>
): ReducerState<T> {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        error: undefined,
        loading: true,
      };
    case 'SUCCESS':
      return {
        ...state,
        data: action.payload,
        error: undefined,
        loading: false,
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return {
        ...state,
      };
  }
}

export default () => useReducer(reducer, initialState);
