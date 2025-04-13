import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { useLanguage } from '../context/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const API_URL = 'https://api.themoviedb.org/3';

const SearchResults = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type') || 'movie';
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/search/${type}?api_key=${API_KEY}&query=${query}&page=${currentPage}&language=${language}`
        );
        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 500));
      } catch (err) {
        setError('Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, currentPage, language, type]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(location.search);
    params.set('page', newPage);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.target.elements.searchInput.value;
    if (!searchInput.trim()) return;

    const params = new URLSearchParams();
    params.set('query', searchInput);
    params.set('type', type);
    params.set('page', 1);
    navigate(`/search?${params.toString()}`);
  };
  useEffect(() => {
    const searchInput = document.querySelector('input[name="searchInput"]');
    if (searchInput) {
      searchInput.value = query;
    }
  }, [query]);
  return (
    <div className="search-results-container">
      <div style={{
        backgroundColor: '#f4f4f4',
        padding: '32px 0',
        marginBottom: '32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#000',
            textAlign: document.documentElement.dir === 'rtl' ? 'right' : 'left'
          }}>
            {t('searchResults')}
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '20px',
            fontWeight: '400',
            lineHeight: '1.4',
            textAlign: document.documentElement.dir === 'rtl' ? 'right' : 'left'
          }}>
            {t('searchingFor')}: "{query}"
          </p>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              name="searchInput"
              type="text"
              placeholder={t('searchPlaceholder')}
              defaultValue={query}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '14px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'white',
                outline: 'none',
                boxShadow: 'none',
                color: '#333',
                fontWeight: '400',
                textAlign: document.documentElement.dir === 'rtl' ? 'right' : 'left',
                paddingRight: document.documentElement.dir === 'rtl' ? '50px' : '16px',
                paddingLeft: document.documentElement.dir === 'rtl' ? '16px' : '50px'
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                [document.documentElement.dir === 'rtl' ? 'left' : 'right']: '0',
                top: '0',
                height: '100%',
                padding: '0 24px',
                backgroundColor: '#FFE234',
                border: 'none',
                borderRadius: document.documentElement.dir === 'rtl' ? '4px 0 0 4px' : '0 4px 4px 0',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                color: '#000',
                whiteSpace: 'nowrap'
              }}
            >
              {t('search')}
            </button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '24px'
        }}>
          {movies.length} {t('resultsFound')}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{error}</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {movies.map(movie => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                posterPath={movie.poster_path}
                title={(type=='movie')?movie.title:movie.name}
                releaseDate={(type=='movie')?movie.release_date:movie.first_air_date}
                rating={movie.vote_average}
                type={type}
              />
            ))}
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '40px'
          }}>
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#666',
                fontSize: '20px'
              }}
            >
              ‹
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: currentPage === pageNum ? '#FFE234' : 'transparent',
                    cursor: 'pointer',
                    color: currentPage === pageNum ? '#000' : '#666',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span style={{ color: '#666' }}>...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#666',
                fontSize: '20px'
              }}
            >
              ›
            </button>
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px',display:'flex',flexDirection:'column',alignItems:'center' }}>
            {t('noResultsFound')}
            <button onClick={() => navigate(-1)} style={{ marginTop: '12px', cursor: 'pointer' }} className='btn btn-danger'>
              {t('goBack')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
