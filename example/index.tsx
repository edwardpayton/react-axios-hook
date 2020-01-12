import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useAxios from '../src';

const App = () => {
  const [count, setCount] = React.useState(1);
  const [images, setImages] = React.useState<string[]>([]);

  const [skip, setSkip] = React.useState(true);
  const [{ data, error, loading }, retry] = useAxios(
    {
      skip: () => skip,
      url: `https://jsonplaceholder.typicode.com/photos/${count}`,
      method: 'get',
    },
    [skip]
  );

  window.setTimeout(() => setSkip(false), 1000);

  React.useEffect(() => {
    if (data && data.thumbnailUrl) {
      setImages([...images, data]);
      setCount(count + 1);
    }
  }, [data]);

  const axiosState = () => {
    if (!loading && !data && !error) return 'idle';
    if (loading) return 'loading';
    if (error) return JSON.stringify(error);
    if (data && Object.keys(data).length === 0) return 'no results';
    if (data && Object.keys(data).length !== 0) return 'success';
  };

  return (
    <>
      <div>
        <p>
          An image will load after a 1 second timeout, click the button to load
          another
        </p>
        <button onClick={retry} disabled={loading}>
          Load next image
        </button>
        <pre>{axiosState()}</pre>
      </div>
      <div>
        {images.map(image => (
          <img src={image['thumbnailUrl']} alt="" key={image['id']} />
        ))}
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
