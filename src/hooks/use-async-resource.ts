import { useCallback, useEffect, useState } from 'react';

type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

export function useAsyncResource<T>(loader: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const load = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setState((current) => ({ ...current, isLoading: true, error: null }));
    }
    try {
      const data = await loader();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      });
    }
  }, [loader]);

  useEffect(() => {
    let isMounted = true;

    void loader()
      .then((data) => {
        if (isMounted) {
          setState({ data, isLoading: false, error: null });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Unknown error'),
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [loader]);

  return {
    ...state,
    refresh: () => load(true),
  };
}
