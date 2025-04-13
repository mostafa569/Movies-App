import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import '../assets/css/Home.css';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const API_URL = 'https://api.themoviedb.org/3';

const TVShows = () => {
    const [tvshows, setTvShows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

 
    const searchParams = new URLSearchParams(location.search);
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    
    useEffect(() => {
        const fetchNowPlaying = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_URL}/tv/popular?api_key=${API_KEY}&page=${currentPage}&language=${language}`
                );
                setTvShows(response.data.results);
                setTotalPages(Math.min(response.data.total_pages, 500));
            } catch (err) {
                setError('Failed to fetch tvshows');
            } finally {
                setLoading(false);
            }
        };

        fetchNowPlaying();
    }, [currentPage, language]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
 
        navigate(`/search?query=${encodeURIComponent(searchTerm)}&page=1&type=tv`);
    };

    
    const handlePageChange = (newPage) => {
        navigate(`/?page=${newPage}`);
    };

    return (
        <div className="home-container">
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
                        {t('welcomeMessage')}
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: '#666',
                        marginBottom: '20px',
                        fontWeight: '400',
                        lineHeight: '1.4',
                        textAlign: document.documentElement.dir === 'rtl' ? 'right' : 'left'
                    }}>
                        {t('welcomeDescription')}
                    </p>
                    <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchTerm}
                            onChange={handleSearchChange}
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
                    {t('popularTvShows')}
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
                        {tvshows.map(tvshow => (
                            <MovieCard
                                key={tvshow.id}
                                id={tvshow.id}
                                posterPath={tvshow.poster_path}
                                title={tvshow.name}
                                releaseDate={tvshow.first_air_date}
                                rating={tvshow.vote_average}
                                type='tv'
                            />
                        ))}
                    </div>
                )}

                {!loading && tvshows.length > 0 && (
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
            </div>
        </div>
    );
};

export default TVShows;