import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { wishlist, wishlistCount } = useWishlist();  
  const { language, languages, changeLanguage, t } = useLanguage();
  const [openDropdown, setOpenDropdown] = useState(null);

  const languageRef = useRef(null);
  const wishlistRef = useRef(null);

  const movieCount = wishlist.filter(item => item.type === 'movie').length;
  const tvCount = wishlist.filter(item => item.type === 'tv').length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target) &&
        wishlistRef.current &&
        !wishlistRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav
      style={{
        backgroundColor: '#FFE234',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        direction: languages.find(l => l.code === language)?.dir || 'ltr'
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
        Movie App
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>{t('movies')}</Link>
          <Link to="/tvshows" style={{ textDecoration: 'none', color: 'black' }}>{t('tvShows')}</Link>
        </div>
 
        <div style={{ position: 'relative' }} ref={languageRef}>
          <div
            onClick={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '4px',
              backgroundColor: openDropdown === 'language' ? '#f0f0f0' : 'transparent'
            }}
          >
            {languages.find(l => l.code === language)?.name}
            <span style={{ fontSize: '10px' }}>
              {openDropdown === 'language' ? '▲' : '▼'}
            </span>
          </div>

          {openDropdown === 'language' && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              zIndex: 10,
              marginTop: '5px',
              minWidth: '120px'
            }}>
              {languages.map(lang => (
                <div
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setOpenDropdown(null);
                  }}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: lang.code !== languages[languages.length - 1].code ? '1px solid #eee' : 'none',
                    textAlign: lang.dir === 'rtl' ? 'right' : 'left',
                    direction: lang.dir,
                    backgroundColor: language === lang.code ? '#f5f5f5' : 'white'
                  }}
                >
                  {lang.name}
                </div>
              ))}
            </div>
          )}
        </div>

         
        <div style={{ position: 'relative' }} ref={wishlistRef}>
          <div
            onClick={() => setOpenDropdown(openDropdown === 'wishlist' ? null : 'wishlist')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '4px',
              backgroundColor: openDropdown === 'wishlist' ? '#f0f0f0' : 'transparent',
              position: 'relative'
            }}
          >
            <Heart
              size={20}
              fill={wishlistCount > 0 ? "#333" : "none"}
              stroke="#333"
            />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {t('wishlist')}
            </span>
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'red',
                color: 'white',
                fontSize: '12px',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlistCount}
              </span>
            )}
            <span style={{ fontSize: '10px' }}>{openDropdown === 'wishlist' ? '▲' : '▼'}</span>
          </div>

          {openDropdown === 'wishlist' && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              zIndex: 10,
              marginTop: '5px',
              minWidth: '160px'
            }}>
              <Link
                to="/wishlist/movie"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  textDecoration: 'none',
                  color: 'black',
                  borderBottom: '1px solid #eee'
                }}
                onClick={() => setOpenDropdown(null)}
              >
                <span>🎬 {t('movies')}</span>
                <span style={{ fontWeight: 'bold' }}>{movieCount}</span>
              </Link>
              <Link
                to="/wishlist/tv"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  textDecoration: 'none',
                  color: 'black'
                }}
                onClick={() => setOpenDropdown(null)}
              >
                <span>📺 {t('tvShows')}</span>
                <span style={{ fontWeight: 'bold' }}>{tvCount}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
