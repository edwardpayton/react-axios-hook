import { DependencyList, useCallback, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import reducer, { ReducerState } from './reducer';

/**
 * TODO
 * add initial reducer type
 * add cencelled to return value
 */

// disabled eslint rule react-hooks/exhaustive-deps
// because it wants to replace useeffect deps causing errors,
// according to this link the rule will soon be updated
// to use the new eslint suggestionm api.
// (https://github.com/facebook/react/issues/15204)

export interface HookConfig extends AxiosRequestConfig {
  skip?: () => boolean;
}

export type HookReturnValue = [ReducerState<any>, () => void];

function useAxios(
  { skip = () => false, ...config }: HookConfig,
  dependencyList: DependencyList
): HookReturnValue {
  const [source, setSource] = useState(axios.CancelToken.source());
  const [retry, setRetry] = useState(false);
  const [prevDepList, setPrevDepList] = useState(dependencyList);

  const [{ data, error, loading }, dispatch] = reducer();

  const makeRequest = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    const source = axios.CancelToken.source();
    try {
      const { token } = source;
      const res = await axios({ ...config, cancelToken: token });
      dispatch({ type: 'SUCCESS', payload: res.data });
    } catch (error) {
      let payload = error;
      if (!(error instanceof Error) && error.message === 'Cancel') {
        payload = 'request cancelled';
      }
      dispatch({ type: 'ERROR', payload });
    }
  }, [config, dispatch]);

  useEffect(() => {
    if (skip()) return;
    for (let i = 0; i < prevDepList.length && i < dependencyList.length; i++) {
      if (prevDepList[i] === dependencyList[i]) {
        setPrevDepList(dependencyList);
        setSource(axios.CancelToken.source());
        break;
      }
    }
    makeRequest();
    return () => {
      source && source.cancel();
      dispatch({ type: 'ERROR', payload: 'request cancelled' });
    };
  }, [...dependencyList]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (retry === false) return;
    setRetry(false);
    makeRequest();
    return () => source && source.cancel();
  }, [retry]); // eslint-disable-line react-hooks/exhaustive-deps

  const rerun = () => setRetry(true);

  return [
    {
      data,
      error,
      loading,
    },
    rerun,
  ];
}

export default useAxios;
