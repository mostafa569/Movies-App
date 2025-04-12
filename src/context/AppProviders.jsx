import { WishlistProvider } from './WishlistContext';
import { LanguageProvider } from './LanguageContext';

export const AppProviders = ({ children }) => {
  return (
    <LanguageProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </LanguageProvider>
  );
};
