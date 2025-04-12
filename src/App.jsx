import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Wishlist from './pages/Wishlist';
import MovieDetails from './pages/MovieDetails';
import { LanguageProvider } from './context/LanguageContext';
import { WishlistProvider } from './context/WishlistContext';
import TVShows from './pages/TVShows';

function App() {
  return (
    <LanguageProvider>
      <WishlistProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/movie/:id" element={<MovieDetails type='movie' />} />
              <Route path="/tvshows" element={<TVShows />} />
              <Route path="/tv/:id" element={<MovieDetails type='tv' />} />
              <Route path="/wishlist/movie" element={<Wishlist type='movie' />} />
              <Route path="/wishlist/tv" element={<Wishlist type='tv' />} />
            </Routes>
          </div>
        </Router>
      </WishlistProvider>
    </LanguageProvider>
  );
}

export default App;