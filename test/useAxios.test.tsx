import {
  RenderHookResult,
  renderHook,
  act,
} from '@testing-library/react-hooks';
import axiosMock from 'jest-mock-axios';
import { AxiosRequestConfig } from 'axios';
import useAxios, { HookConfig, HookReturnValue } from '../src';
import { initialState } from '../src/reducer';

describe('useAxios', () => {
  const config: AxiosRequestConfig = {
    url: '/api',
    method: 'get',
  };

  afterEach(() => {
    axiosMock.reset();
  });

  it('it should default export a function', () => {
    expect(useAxios).toBeInstanceOf(Function);
  });

  describe('without dependencies', () => {
    let hook: RenderHookResult<HookConfig, HookReturnValue>;

    beforeEach(() => {
      hook = renderHook(() => useAxios(config, []));
    });

    it('returns the initial state', () => {
      expect(hook.result.current[0]).toEqual({
        ...initialState,
        loading: true,
      });
    });

    it('returns a successful request', async () => {
      const res = { data: true };
      await act(async () => {
        axiosMock.mockResponse(res);
        await hook.waitForNextUpdate();
      });

      expect(hook.result.current[0]).toEqual({
        ...initialState,
        data: res.data,
      });
    });

    it('returns an error on a failed request', async () => {
      const err = new Error();
      await act(async () => {
        axiosMock.mockError(err);
        await hook.waitForNextUpdate();
      });

      expect(hook.result.current[0]).toEqual({
        ...initialState,
        error: err,
      });
    });
  });

  describe('cancelation', () => {
    it('cancels on error, and returns cancelled message', async () => {
      const hook = renderHook(() => useAxios(config, []));
      await act(async () => {
        axiosMock.mockError(new axiosMock.Cancel());
      });

      expect(hook.result.current[0]).toEqual({
        ...initialState,
        error: 'request cancelled',
      });
    });
  });

  describe('with dependencies', () => {
    it('tracks dependencies', async () => {
      const foo = 'foo';
      const bar = 'bar';
      const hook = renderHook(({ config, deps }) => useAxios(config, deps), {
        initialProps: {
          config: {
            ...config,
            params: {
              test: foo,
            },
          },
          deps: [foo],
        },
      });

      expect(axiosMock.lastReqGet().config.params).toEqual({
        test: foo,
      });

      await act(async () => {
        axiosMock.mockResponse({ data: true });
        await hook.waitForNextUpdate();
      });

      hook.rerender({
        config: {
          ...config,
          params: {
            test: bar,
          },
        },
        deps: [bar],
      });

      expect(hook.result.current[0]).toEqual({
        ...initialState,
        loading: true,
        data: true,
      });

      // Don't need to repeat the test for bar
      expect(axiosMock.lastReqGet().config.params).toEqual({
        test: bar,
      });
    });
  });

  describe('with skipRequest', () => {
    it('skips the request on first render', async () => {
      const configSkip = {
        ...config,
        skip: () => true,
      };
      renderHook(() => useAxios(configSkip, []));
      expect(axiosMock.request).not.toHaveBeenCalled();
    });

    it('skips any requests when skip is true', async () => {
      const foo = 'foo';
      const bar = 'bar';
      const configSkip = {
        ...config,
        skip: () => true,
      };
      const hook = renderHook(
        ({ configSkip, deps }) => useAxios(configSkip, deps),
        {
          initialProps: {
            configSkip,
            deps: [foo],
          },
        }
      );
      expect(axiosMock.request).not.toHaveBeenCalled();

      hook.rerender({
        configSkip,
        deps: [bar],
      });
      expect(axiosMock.request).not.toHaveBeenCalled();
    });
  });

  describe('rerun', () => {
    it('reruns the request', async () => {
      const res = { data: true };
      const hook = renderHook(config => useAxios(config, []), {
        initialProps: {
          ...config,
          skip: () => true,
        },
      });
      expect(axiosMock.request).not.toHaveBeenCalled();

      act(() => hook.result.current[1]());
      await act(async () => {
        axiosMock.mockResponse(res);
        await hook.waitForNextUpdate();
      });

      expect(hook.result.current[0]).toEqual({
        ...initialState,
        data: res.data,
      });
    });
  });
});
