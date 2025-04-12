import React from 'react';
import { Heart, MoreVertical } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import '../assets/css/MovieCard.css'; 

const MovieCard = ({ id, posterPath, title, releaseDate, rating, type }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
   const isFavorite = isInWishlist(id, type);

 
const toggleFavorite = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  console.log("Toggle favorite:", id, type, isFavorite);  
  
  if (isFavorite) {
    removeFromWishlist(id, type);
  } else {
     
    addToWishlist({ 
      id: id, 
      posterPath: posterPath, 
      title: title, 
      releaseDate: releaseDate, 
      rating: rating,
      type: type 
    });
  }
};

  const handleCardClick = () => {
    navigate(`/${type}/${id}`);
  };

  const handleOptionsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Options clicked for content:', id, 'type:', type);
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('unknownDate');
    return new Date(dateString).toLocaleDateString(language, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const ratingPercentage = Math.round(rating * 10);
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  return (
    <div
      onClick={handleCardClick}
      className="movie-card"
    >
      
      <div className="movie-poster" style={(!posterPath) ? { backgroundColor:'#ddd' } : {}}>
        <img
          src={posterPath ? `${imageBaseUrl}${posterPath}` : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'}
          alt={title}
          className="poster-image"
          style={(!posterPath) ? { width: '100px',height:'100px',overflow:'hidden',position:'relative',top:'40%' } : {}}
        />
        

     
        <div
          style={{
            position: 'absolute',
            bottom: '-20px',
            left: '10px',
            width: '47px',
            height: '47px',
            borderRadius: '50%',
            background: `conic-gradient(${
              ratingPercentage > 70 ? '#4CAF50' : ratingPercentage > 50 ? '#FFC107' : '#F44336'
            } ${ratingPercentage * 3.6}deg, #2e2e2e ${ratingPercentage * 3.6}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#0d0d0d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '13px',
            }}
          >
            {ratingPercentage}%
          </div>
        </div>

         
        <div className="movie-actions">
          <button
            onClick={handleOptionsClick}
            className="action-btn"
            aria-label="Options"
          >
            <MoreVertical size={16} />
          </button>

          <button
            onClick={toggleFavorite}
            className="action-btn"
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={16}
              fill={isFavorite ? '#FFD700' : 'transparent'}
              color={isFavorite ? '#FFD700' : 'white'}
            />
          </button>
        </div>
      </div>
 
      <div style={{ padding: '25px 12px 12px 12px' }}>
        <h3
          style={{
            fontWeight: 'bold',
            fontSize: '16px',
            marginBottom: '8px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>
            {releaseDate && formatDate(releaseDate)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '14px' }}>{rating.toFixed(1)}</span>
            <span style={{ color: '#FFD700', fontSize: '14px' }}>★</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;