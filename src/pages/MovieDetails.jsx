import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useLanguage } from "../context/LanguageContext";
import MovieCard from "../components/MovieCard";
import { FaHeart } from "react-icons/fa";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieDetails = ({ type }) => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { t, language } = useLanguage();

  const isFavorite = isInWishlist(id, type);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Toggle favorite in details:", id, type, isFavorite);  

    if (isFavorite) {
      removeFromWishlist(id, type);
    } else if (movieDetails) {
       const item = {
        id: id,
        posterPath: movieDetails.poster_path,
        title: type === "movie" ? movieDetails.title : movieDetails.name,
        releaseDate:
          type === "movie"
            ? movieDetails.release_date
            : movieDetails.first_air_date,
        rating: movieDetails.vote_average,
        type: type,
      };
      console.log("Adding to wishlist:", item); 
      addToWishlist(item);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [detailsResponse, recommendationsResponse] = await Promise.all([
          axios.get(
            `${API_URL}/${type}/${id}?api_key=${API_KEY}&language=${language}`
          ),
          axios.get(
            `${API_URL}/${type}/${id}/recommendations?api_key=${API_KEY}&language=${language}`
          ),
        ]);

        setMovieDetails(detailsResponse.data);
        setRecommendations(recommendationsResponse.data.results);
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError(err.message || "Failed to fetch movie data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [id, language, type]);

  
  if (isLoading)
    return <div className="container my-5 text-center">{t("loading")}</div>;
  if (error)
    return (
      <div className="container my-5 text-center text-danger">
        Error: {error}
      </div>
    );
  if (!movieDetails)
    return (
      <div className="container my-5 text-center">{t("movieNotFound")}</div>
    );

 
  const runtime = movieDetails.runtime
    ? `${movieDetails.runtime} ${t("minutes")}`
    : t("notAvailable");
  const genres = movieDetails.genres?.map((genre) => genre.name) || [];
  const languageName =
    movieDetails.spoken_languages?.[0]?.english_name || t("notAvailable");
  const rating = movieDetails.vote_average
    ? Math.round(movieDetails.vote_average / 2)
    : 0;
  const totalStars = 5;
  const filledStars = Array(rating).fill("bi-star-fill");
  const emptyStars = Array(totalStars - rating).fill("bi-star");

  return (
    <>
      <div className="container my-4" dir={document.documentElement.dir}>
        <div
          className="row bg-white rounded shadow"
          style={{ minHeight: "250px" }}
        >
          <div className="col-md-4 p-0">
            {movieDetails.poster_path ? (
              <img
                src={`${IMAGE_BASE_URL}${movieDetails.poster_path}`}
                alt={type === "movie" ? movieDetails.title : movieDetails.name}
                className="img-fluid rounded-start"
                style={{ height: "100%", objectFit: "cover" }}
                loading="eager"
              />
            ) : (
              <div
                className="d-flex justify-content-center align-items-center bg-light rounded-start"
                style={{ height: "100%" }}
              >
                <span className="text-muted">{t("noPosterAvailable")}</span>
              </div>
            )}
          </div>

          <div
            className={`col-md-8 p-4 d-flex flex-column ${
              language === "ar" ? "text-end" : "text-start"
            }`}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h1 className="h2 fw-bold">
                {type === "movie" ? movieDetails.title : movieDetails.name}
              </h1>
              <button
                onClick={toggleFavorite}
                className="btn p-0 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                }}
                aria-label={
                  isFavorite ? t("removeFromWishlist") : t("addToWishlist")
                }
              >
                <FaHeart
                  size={16}
                  fill={isFavorite ? "#FFD700" : "white"}
                  color={isFavorite ? "#FFD700" : "white"}
                />
              </button>
            </div>

            <div className="text-muted small mb-3">
              {type == "movie"
                ? movieDetails.release_date
                : movieDetails.first_air_date || t("unknownDate")}
            </div>

            <div
              className="mb-3"
              aria-label={`Rating: ${rating} out of ${totalStars} stars`}
            >
              {filledStars.map((starClass, index) => (
                <i
                  key={`filled-${index}`}
                  className={`bi ${starClass} text-warning me-1`}
                  aria-hidden="true"
                ></i>
              ))}
              {emptyStars.map((starClass, index) => (
                <i
                  key={`empty-${index}`}
                  className={`bi ${starClass} text-warning me-1`}
                  aria-hidden="true"
                ></i>
              ))}
              <span className="ms-1">{movieDetails.vote_count}</span>
            </div>

            <p className="mb-3">
              {movieDetails.overview || t("noDescription")}
            </p>

            <div className="mb-3">
              {genres.length > 0 ? (
                genres.map((genre, index) => (
                  <span
                    key={index}
                    className="badge bg-warning text-dark me-1 mb-1"
                  >
                    {genre}
                  </span>
                ))
              ) : (
                <span className="text-muted">{t("noGenres")}</span>
              )}
            </div>

            <div
              className="text-muted small mb-3"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <span>
                {t("duration")}: {runtime}
              </span>{" "}
              |
              <span>
                {t("language")}: {language === "ar" ? "عربي" : languageName}
              </span>
            </div>

            {movieDetails.homepage && (
              <a
                href={movieDetails.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "50px", height: "50px", fontSize: "0.75rem" }}
              >
                {t("website")}
              </a>
            )}
          </div>
        </div>
      </div>

      <hr className="my-3" />

      <div className="container" dir={document.documentElement.dir}>
        <h2 className="display-4 fw-bold">{t("recommendations")}</h2>
        {recommendations.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
            {recommendations.slice(0, 12).map((movie) => (
              <div className="col" key={movie.id}>
                <MovieCard
                  id={movie.id}
                  posterPath={movie.poster_path}
                  title={type == "movie" ? movie.title : movie.name}
                  releaseDate={
                    type == "movie" ? movie.release_date : movie.first_air_date
                  }
                  rating={movie.vote_average}
                  type={type}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">{t("noRecommendations")}</div>
        )}
      </div>
    </>
  );
};

export default MovieDetails;
