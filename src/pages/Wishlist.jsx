import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import '../assets/css/Wishlist.css';
import { HeartOff } from "lucide-react";

const Wishlist = ({ type }) => {
  const { wishlist } = useWishlist();
  const { t, language } = useLanguage();
 
  const filteredWishlist = type 
    ? wishlist.filter(item => item.type === type)
    : wishlist;
 
  const isRTL = language === 'ar';

  return (
    <div className="wishlist-page" dir={isRTL ? "rtl" : "ltr"}>
      <h2>
        {t('wishlist')} 
        {type && ` - ${type === 'movie' ? t('movies') : t('tvShows')}`}
      </h2>

      {filteredWishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-gray-400 empty-wishlist">
          <HeartOff size={150} color="currentColor" strokeWidth={1.5} className="empty-icon" />
          <p className="mt-4">
            {type 
              ? t(type === 'movie' ? 'noMoviesInWishlist' : 'noTVShowsInWishlist')
              : t('noItemsInWishlist')}
          </p>
          
          <Link to="/" className="back-to-home mt-4">
            {t('backToHome')}
          </Link>
        </div>
      ) : (
        <>
          <div className="wishlist-grid">
            {filteredWishlist.map((item) => (
              <MovieCard
                key={`${item.id}-${item.type}`}
                id={item.id}
                posterPath={item.posterPath}
                title={item.title}
                releaseDate={item.releaseDate}
                rating={item.rating}
                type={item.type}  
              />
            ))}
          </div>
          
          <Link to="/" className="back-to-home">
            {t('backToHome')}
          </Link>
        </>
      )}
    </div>
  );
};

export default Wishlist;