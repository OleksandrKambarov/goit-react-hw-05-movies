import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, Link, Route, Routes, useLocation } from 'react-router-dom';
import { BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { Notify } from 'notiflix';
import { Loader } from 'components/Loader/Loader';
import { getMovieDetails } from 'services/API';
import s from './MovieDetails.module.css';

const Cast = lazy(() => import('pages/Cast/Cast'));
const Reviews = lazy(() => import('pages/Reviews/Reviews'));

function MovieDetails() {
  const [movieInfo, setMovieInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { movieId } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (!movieId) return;
    const fetchMovieDetails = async id => {
      try {
        setIsLoading(true);
        const receivedTrends = await getMovieDetails(id);
        setMovieInfo(receivedTrends);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetails(movieId);
  }, [movieId]);

  useEffect(() => {
    if (error === null) return;
    Notify.failure(`some error occured ${error}`);
  }, [error]);

  return (
    <div className={s.wrapper}>
      <Link className={s.goBack} to={location?.state?.from ?? '/'}>
        <BsFillArrowLeftSquareFill size="30px" />
      </Link>
      {isLoading && <Loader />}
      {movieInfo !== null && (
        <div className={s.box}>
          <img
            className={s.img}
            src={
              movieInfo?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieInfo?.poster_path}`
                : 'https://cdn4.iconfinder.com/data/icons/ui-beast-4/32/Ui-12-512.png'
            }
            alt={movieInfo.title}
          />
          <div className={s.info}>
            <h1 className={s.title}>
              {movieInfo.title} ({movieInfo?.release_date.slice(0, 4)})
            </h1>
            <p>User Score: {movieInfo?.vote_average}</p>
            <h2>Overview</h2>
            <p className={s.overview}>{movieInfo.overview}</p>
            <h2>Genres</h2>
            <ul className={s.genre}>
              {movieInfo?.genres?.map(({ id, name }) => {
                return (
                  <li key={id} className={s.genreItem}>
                    {name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
      <div className={s.moreInfo}>
        <Link
          state={{ from: location?.state?.from ?? '/' }}
          className={s.moreInfoLink}
          to="reviews"
        >
          Reviews
        </Link>
        <Link
          state={{ from: location?.state?.from ?? '/' }}
          className={s.moreInfoLink}
          to="cast"
        >
          Cast
        </Link>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="cast" element={<Cast />} />
            <Route path="reviews" element={<Reviews />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default MovieDetails;
