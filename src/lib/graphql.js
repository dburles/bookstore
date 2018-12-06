const defaultUrl = '/graphql';
const defaultRequestOptions = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
const defaultFetchUserOptions = { variables: null };
const defaultFetchOptions = { fetchMore: false };

const onMutationSubscriptions = [];
export const onMutation = callback => {
  onMutationSubscriptions.push(callback);
  return () =>
    onMutationSubscriptions.splice(
      onMutationSubscriptions.indexOf(callback),
      1,
    );
};

export const GraphQLQuery = ({
  url = defaultUrl,
  query,
  cache = false,
  requestOptions = options => options,
}) => {
  let _cache = {};
  let _variables = null;
  const _subscriptions = [];

  const emit = () => _subscriptions.forEach(subscription => subscription());

  const fetcher = (
    userOptions = defaultFetchUserOptions,
    options = defaultFetchOptions,
  ) => {
    if (userOptions.variables && !options.fetchMore) {
      _variables = userOptions.variables;
    }

    const request = new Request(url, {
      ...requestOptions(defaultRequestOptions),
      body: JSON.stringify({
        query,
        variables: options.fetchMore ? userOptions.variables : _variables,
      }),
    });

    return fetch(request)
      .then(response => response.json())
      .then(data =>
        data.errors ? Promise.resolve({ errors: data.errors }) : data,
      )
      .then(data => {
        if (cache && !options.fetchMore) {
          _cache = data;
        }
        emit();
        return data;
      })
      .catch(error => ({ error: error.message }));
  };

  return {
    ...(cache && {
      setCache: cb => {
        _cache = { data: cb(_cache.data) };
        emit();
      },
      getCache: () => _cache,
    }),
    fetch: (userOptions = defaultFetchUserOptions) => {
      if (
        cache &&
        Object.keys(_cache).length &&
        // If variables are unchanged from previous request
        JSON.stringify(userOptions.variables) === JSON.stringify(_variables)
      ) {
        return new Promise(resolve => resolve(_cache));
      }
      return fetcher(userOptions);
    },
    refetch: fetcher,
    fetchMore: (userOptions = defaultFetchUserOptions) => {
      if (!cache) {
        throw Error('Cannot call `fetchMore` without cache');
      }
      return fetcher(userOptions, { fetchMore: true });
    },
    subscribe: callback => {
      _subscriptions.push(callback);
      return () => _subscriptions.splice(_subscriptions.indexOf(callback), 1);
    },
    options: {
      url,
      query,
      cache,
      requestOptions,
    },
  };
};

export const GraphQLMutation = ({
  url = defaultUrl,
  query,
  requestOptions = options => options,
}) => {
  const fetcher = (options = defaultFetchUserOptions) => {
    const request = new Request(url, {
      ...requestOptions(defaultRequestOptions),
      body: JSON.stringify({
        query,
        variables: options.variables,
      }),
    });

    return fetch(request)
      .then(response => response.json())
      .then(data => {
        if (data.errors) {
          data.errors.forEach(e => console.error(e.message));
          return Promise.resolve({ errors: data.errors });
        }

        return data;
      })
      .then(data => {
        onMutationSubscriptions.forEach(cb => cb());
        return data;
      })
      .catch(error => ({ error: error.message }));
  };

  return {
    fetch: fetcher,
    options: {
      url,
      query,
      requestOptions,
    },
  };
};
