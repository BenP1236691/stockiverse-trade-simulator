
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, 
  ShoppingBag, 
  Users, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavRoute {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const routes: NavRoute[] = [
    {
      icon: <BarChart2 size={20} />,
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      icon: <ShoppingBag size={20} />,
      label: 'Portfolio',
      href: '/portfolio'
    },
    {
      icon: <Users size={20} />,
      label: 'Leaderboard',
      href: '/leaderboard'
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      href: '/settings'
    }
  ];
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">ST</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">Stockiverse</span>
          </div>
        </Link>
        
        {isMobile ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            
            {isMenuOpen && (
              <div className="fixed inset-0 top-16 bg-background/95 backdrop-blur-sm animate-in slide-in-from-top z-50">
                <nav className="container flex flex-col gap-4 p-6">
                  {routes.map((route) => (
                    <Link 
                      key={route.href}
                      to={route.href}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                        ${location.pathname === route.href 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                        }
                      `}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {route.icon}
                      <span>{route.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav className="ml-auto flex items-center space-x-2">
            {routes.map((route) => (
              <Link 
                key={route.href}
                to={route.href}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors
                  ${location.pathname === route.href 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                  }
                `}
              >
                {route.icon}
                <span>{route.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
