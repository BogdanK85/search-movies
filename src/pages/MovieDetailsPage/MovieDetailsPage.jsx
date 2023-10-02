import { MovieDetailsStyle } from './MovieDetailsPage.styled';
import NoPoster from '../../images/no-poster-available.png';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { getMoviesDetailsById } from 'Api/API';

const MovieDetailsPage = () => {
  const location = useLocation();
  const { moviesId } = useParams();
  const [moviesInfo, setMoviesInfo] = useState({});
  const backLink = location.state?.from ?? '/';
  // const saerchQuery = location.state?.saerchQuery ?? '';
  // const navigate = useNavigate();
  // const refLocation = useRef(location.state ?? '/');

  useEffect(() => {
    try {
      const fetchMoviesDetails = async () => {
        const movieDetails = await getMoviesDetailsById(moviesId);
        setMoviesInfo(movieDetails);
      };
      fetchMoviesDetails();
    } catch (error) {
      console.log(error.message);
    }
  }, [moviesId]);

  const date = new Date(moviesInfo.release_date);
  const year = date.getFullYear();
  const score = Math.round(moviesInfo.vote_average * 10);
  const overview = moviesInfo.overview;
  const genres = moviesInfo.genres;

  // const handleReturnBack = () => {
  //   navigate(refLocation.current);
  // };

  return (
    <>
      <MovieDetailsStyle>
        <Link className="back-link" to={backLink}>
          Return back
        </Link>
        <div className="main-content">
          <img
            className="main-img"
            width={180}
            src={
              moviesInfo.poster_path
                ? `https://image.tmdb.org/t/p/w500/${moviesInfo.poster_path}`
                : NoPoster
            }
            alt={moviesInfo.title}
          />
          <div className="main-description">
            <div>
              <h2 className="card-title">
                {moviesInfo.title} ({year})
              </h2>
              <p className="card-score">User score {score} %</p>
              <h3 className="card-overview">Overview:</h3>
              <p className="text-overview">{overview}</p>
              <h3 className="genres-title"> Genres:</h3>
              {genres &&
                genres.map(genre => <span key={genre.id}>{genre.name}</span>)}
            </div>
            <div>
              <h3 className="information-title">Additional Information</h3>
              <ul>
                <li>
                  <Link
                    className="info-link"
                    to="cast"
                    // to={`cast?searchQuery=${searchQuery}`}
                    state={{ from: backLink }}
                  >
                    Casts
                  </Link>
                </li>
                <li>
                  <Link
                    className="info-link last-link"
                    to="review"
                    // to={`review?searchQuery=${searchQuery}`}
                    state={{ from: backLink }}
                  >
                    Reviews
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </MovieDetailsStyle>
      <Suspense fallback={<div>Loading subpage...</div>}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default MovieDetailsPage;
