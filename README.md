<p style="float: left; margin-bottom: 50px">
<a href="https://www.npmjs.com/package/@ejp/react-hook-axios">
<img src="https://badgen.net/npm/v/@ejp/react-hook-axios" /> 
</a>
<a href="https://www.npmjs.com/package/@ejp/react-hook-axios">
<img src="https://badgen.net/npm/license/@ejp/react-hook-axios" /> 
</a>
<a href="https://www.npmjs.com/package/@ejp/react-hook-axios">
<img src="https://badgen.net/npm/types/@ejp/react-hook-axios"/>
</a>
<a href="https://packagephobia.now.sh/result?p=@ejp/react-hook-axios">
<img src="https://badgen.net/packagephobia/install/@ejp/react-hook-axios" /> 
</a>
<a href="https://circleci.com/gh/edwardpayton/react-axios-hook">
<img src="https://badgen.net/circleci/github/edwardpayton/react-axios-hook"/> 
</a>
<a href="https://app.codacy.com/manual/edwardjpayton/react-axios-hook/dashboard">
 <img src="https://api.codacy.com/project/badge/Grade/8905c0bbc57f4635bf209e77e62ec14f?isInternal=true" />
</a>
<a href="#">
<img src="https://badgen.net/dependabot/edwardpayton/react-axios-hook/?icon=dependabot"/>
</a>
</p>

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
