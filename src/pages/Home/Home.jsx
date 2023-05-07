import { useState, useEffect } from 'react';
import { Notify } from 'notiflix';
import { Loader } from 'components/Loader/Loader';
import { MovieList } from 'components/MovieList/MovieList';
import { getTrends } from 'services/API';
import s from './Home.module.css';

function Home() {
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setIsLoading(true);
        const receivedTrends = await getTrends();
        setTrends(receivedTrends);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, []);

  useEffect(() => {
    if (error === null) return;
    Notify.failure(`some error occured ${error}`);
  }, [error]);

  return (
    <>
      <h2 className={s.title}>Trends of the week</h2>
      {isLoading && <Loader />}
      <MovieList movieList={trends} />
    </>
  );
}

export default Home;
