import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

 
const Nav = styled.nav`
  background-color: #FFE234;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1000;
  direction: ${props => props.direction};
`;

const Logo = styled.div`
  font-weight: bold;
  font-size: 18px;
`;

const MobileMenuButton = styled.div`
  display: none;
  cursor: pointer;
  font-size: 24px;
  z-index: 1001;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: black;
  padding: 6px 0;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #333;
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownTrigger = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: ${props => props.isOpen ? '#f0f0f0' : 'transparent'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 10;
  margin-top: 5px;
  min-width: 120px;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: ${props => !props.lastItem ? '1px solid #eee' : 'none'};
  text-align: ${props => props.textAlign};
  direction: ${props => props.direction};
  background-color: ${props => props.active ? '#f5f5f5' : 'white'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #FFE234;
  padding: 80px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  z-index: 1000;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MobileNavLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-size: 18px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:before {
    content: '→';
    transition: transform 0.2s;
  }
  
  &:hover:before {
    transform: translateX(5px);
  }
`;

const MobileDropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  cursor: pointer;
  font-size: 18px;
`;

const MobileDropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0 10px 20px;
  gap: 15px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
`;

const MobileDropdownItem = styled.div`
  padding: 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${props => props.active ? '#333' : '#555'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:before {
    content: '•';
    color: ${props => props.active ? '#333' : '#555'};
  }
`;

const WishlistBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: red;
  color: white;
  font-size: 12px;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
`;

const Navbar = () => {
  const { wishlist, wishlistCount } = useWishlist();  
  const { language, languages, changeLanguage, t } = useLanguage();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const languageRef = useRef(null);
  const wishlistRef = useRef(null);
  const mobileMenuRef = useRef(null);

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
    <Nav direction={languages.find(l => l.code === language)?.dir || 'ltr'}>
      <Logo>Movie App</Logo>

      <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? '' : '☰'}
      </MobileMenuButton>

      <DesktopNav>
        <NavLinks>
          <NavLink to="/">{t('movies')}</NavLink>
          <NavLink to="/tvshows">{t('tvShows')}</NavLink>
        </NavLinks>
 
        <DropdownContainer ref={languageRef}>
          <DropdownTrigger 
            onClick={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
            isOpen={openDropdown === 'language'}
          >
            {languages.find(l => l.code === language)?.name}
            <span style={{ fontSize: '10px' }}>
              {openDropdown === 'language' ? '▲' : '▼'}
            </span>
          </DropdownTrigger>

          {openDropdown === 'language' && (
            <DropdownMenu>
              {languages.map((lang, index) => (
                <DropdownItem
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setOpenDropdown(null);
                  }}
                  textAlign={lang.dir === 'rtl' ? 'right' : 'left'}
                  direction={lang.dir}
                  active={language === lang.code}
                  lastItem={index === languages.length - 1}
                >
                  {lang.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </DropdownContainer>

        <DropdownContainer ref={wishlistRef}>
          <DropdownTrigger
            onClick={() => setOpenDropdown(openDropdown === 'wishlist' ? null : 'wishlist')}
            isOpen={openDropdown === 'wishlist'}
            style={{ position: 'relative' }}
          >
            <Heart
              size={20}
              fill={wishlistCount > 0 ? "#333" : "none"}
              stroke="#333"
            />
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {t('wishlist')}
            </span>
            {wishlistCount > 0 && <WishlistBadge>{wishlistCount}</WishlistBadge>}
            <span style={{ fontSize: '10px' }}>{openDropdown === 'wishlist' ? '▲' : '▼'}</span>
          </DropdownTrigger>

          {openDropdown === 'wishlist' && (
            <DropdownMenu style={{ minWidth: '160px' }}>
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
            </DropdownMenu>
          )}
        </DropdownContainer>
      </DesktopNav>

      <MobileMenu isOpen={isMobileMenuOpen} ref={mobileMenuRef}>
        {isMobileMenuOpen && (
          <CloseButton onClick={() => setIsMobileMenuOpen(false)}>✕</CloseButton>
        )}
        
        <MobileNavLinks>
          <MobileNavLink 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('movies')}
          </MobileNavLink>
          <MobileNavLink 
            to="/tvshows" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('tvShows')}
          </MobileNavLink>
        </MobileNavLinks>

        <div>
          <MobileDropdownTrigger onClick={() => setMobileDropdown(mobileDropdown === 'language' ? null : 'language')}>
            <div>
              <span style={{ marginRight: '8px' }}>🌐</span>
              {t('language')}: {languages.find(l => l.code === language)?.name}
            </div>
            {mobileDropdown === 'language' ? '▲' : '▼'}
          </MobileDropdownTrigger>
          
          {mobileDropdown === 'language' && (
            <MobileDropdownMenu>
              {languages.map((lang) => (
                <MobileDropdownItem
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setMobileDropdown(null);
                  }}
                  active={language === lang.code}
                >
                  {lang.name}
                </MobileDropdownItem>
              ))}
            </MobileDropdownMenu>
          )}
        </div>

        <div>
          <MobileDropdownTrigger onClick={() => setMobileDropdown(mobileDropdown === 'wishlist' ? null : 'wishlist')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart
                size={20}
                fill={wishlistCount > 0 ? "#333" : "none"}
                stroke="#333"
              />
              {t('wishlist')}
              {wishlistCount > 0 && (
                <span style={{ 
                  background: 'red', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '20px', 
                  height: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {wishlistCount}
                </span>
              )}
            </div>
            {mobileDropdown === 'wishlist' ? '▲' : '▼'}
          </MobileDropdownTrigger>
          
          {mobileDropdown === 'wishlist' && (
            <MobileDropdownMenu>
              <Link
                to="/wishlist/movie"
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
                onClick={() => {
                  setMobileDropdown(null);
                  setIsMobileMenuOpen(false);
                }}
              >
                <MobileDropdownItem>
                  🎬 {t('movies')} ({movieCount})
                </MobileDropdownItem>
              </Link>
              <Link
                to="/wishlist/tv"
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
                onClick={() => {
                  setMobileDropdown(null);
                  setIsMobileMenuOpen(false);
                }}
              >
                <MobileDropdownItem>
                  📺 {t('tvShows')} ({tvCount})
                </MobileDropdownItem>
              </Link>
            </MobileDropdownMenu>
          )}
        </div>
      </MobileMenu>
    </Nav>
  );
};

export default Navbar;