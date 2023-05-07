import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Notify } from 'notiflix';
import { Loader } from 'components/Loader/Loader';
import { getCast } from 'services/API';
import s from './Cast.module.css';

function Cast() {
  const [movieCast, setMovieCast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { movieId } = useParams();

  useEffect(() => {
    if (!movieId) return;
    const fetchCast = async id => {
      try {
        setIsLoading(true);
        const receivedTrends = await getCast(id);
        setMovieCast(receivedTrends);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCast(movieId);
  }, [movieId]);

  useEffect(() => {
    if (error === null) return;
    Notify.failure(`some error occured ${error}`);
  }, [error]);

  return (
    <>
      {isLoading && <Loader />}
      <ul className={s.list}>
        {Array.isArray(movieCast) &&
          movieCast?.map(({ id, name, profile_path }) => {
            return (
              <li key={id} className={s.item}>
                <img
                  className={s.img}
                  src={
                    profile_path
                      ? `https://image.tmdb.org/t/p/w500${profile_path}`
                      : 'https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png'
                  }
                  alt={name}
                />
                <h4 className={s.name}>{name}</h4>
              </li>
            );
          })}
      </ul>
    </>
  );
}

export default Cast;
