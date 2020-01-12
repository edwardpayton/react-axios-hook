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

function useAxios(
  { skip = () => false, ...config }: HookConfig,
  dependencyList: DependencyList
): [ReducerState<any>, () => void] {
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
      dispatch({ type: 'ERROR', payload: error });
    }
  }, [config, dispatch]);

  useEffect(() => {
    if (skip()) return dispatch({ type: 'IDLE' });
    for (let i = 0; i < prevDepList.length && i < dependencyList.length; i++) {
      if (prevDepList[i] === dependencyList[i]) {
        setPrevDepList(dependencyList);
        setSource(axios.CancelToken.source());
        break;
      }
    }
    makeRequest();
    return () => {
      source && source.cancel('request cancelled');
    };
  }, [...dependencyList]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (retry === false) return;
    setRetry(false);
    dispatch({ type: 'IDLE' });
    makeRequest();
    return () => {
      source && source.cancel('request cancelled');
    };
  }, [retry]); // eslint-disable-line react-hooks/exhaustive-deps

  return [
    {
      data,
      error,
      loading,
    },
    () => setRetry(true),
  ];
}

export default useAxios;
