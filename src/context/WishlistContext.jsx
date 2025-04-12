 
import { createContext, useContext, useState } from 'react';


const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
 
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('tmdb-wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      return [];
    }
  });

 
  const addToWishlist = (item) => {
    if (!item || !item.type || !item.id) {
      console.error('Invalid item or missing required properties:', item);
      return;
    }
    
   
    const itemToAdd = {
      ...item,
      id: String(item.id)
    };
    
    setWishlist(prev => {
      
      const itemExists = prev.some(existingItem => 
        String(existingItem.id) === String(itemToAdd.id) && 
        existingItem.type === itemToAdd.type
      );
      
      if (itemExists) {
        return prev;  
      }
      
      
      const updatedWishlist = [...prev, itemToAdd];
      
 
      try {
        localStorage.setItem('tmdb-wishlist', JSON.stringify(updatedWishlist));
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error);
      }
      
      return updatedWishlist;
    });
  };

   
  const removeFromWishlist = (itemId, itemType) => {
    
    const idToRemove = String(itemId);
    
    setWishlist(prev => {
      const updatedWishlist = prev.filter(item => {
        if (itemType) {
           
          return !(String(item.id) === idToRemove && item.type === itemType);
        }
     
        return String(item.id) !== idToRemove;
      });
      
   
      try {
        localStorage.setItem('tmdb-wishlist', JSON.stringify(updatedWishlist));
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error);
      }
      
      return updatedWishlist;
    });
  };

   
  const isInWishlist = (itemId, itemType) => {
 
    const idToCheck = String(itemId);
    
    return wishlist.some(item => {
      if (itemType) {
        
        return String(item.id) === idToCheck && item.type === itemType;
      }
     
      return String(item.id) === idToCheck;
    });
  };
 
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('tmdb-wishlist');
  };
 
  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};