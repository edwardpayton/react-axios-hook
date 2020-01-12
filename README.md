# React Hook Axios

`yarn add @ejp/react-hook-axios`

A small utility hook to use Axios in your React components, with a simple and familiar API.

## USAGE

See the small app in `/example` for a demo.

```javascript

import useAxios from '@ejp/react-hook-axios';

...
const [{ data, error, loading }, retry] = useAxios(
  {
    url: 'https://my.api',
    method: 'get',
  },
  []
);

// TODO

```

Project was bootstraped with the excellent [TSDX](https://github.com/jaredpalmer/tsdx) framework.
