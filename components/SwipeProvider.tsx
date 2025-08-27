// components/SwipeProvider.tsx
"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

const routes = [
  { path: "/", name: "Home", emoji: "🏠" },
  { path: "/chatbot", name: "Chat", emoji: "💬" },
  { path: "/analysis", name: "Analysis", emoji: "📊" },
  { path: "/library", name: "Library", emoji: "📚" }
];

interface SwipeContextType {
  currentIndex: number;
  isTransitioning: boolean;
  swipeProgress: number;
  swipeDirection: 'left' | 'right' | null;
  routes: typeof routes;
}

const SwipeContext = createContext<SwipeContextType>({
  currentIndex: 0,
  isTransitioning: false,
  swipeProgress: 0,
  swipeDirection: null,
  routes
});

export const useSwipeContext = () => useContext(SwipeContext);

interface SwipeProviderProps {
  children: React.ReactNode;
}

export default function SwipeProvider({ children }: SwipeProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation states
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);
  const [nextPagePreview, setNextPagePreview] = useState<string | null>(null);

  const getCurrentIndex = () => {
    return routes.findIndex(route => route.path === pathname);
  };

  const navigateToIndex = async (index: number) => {
    if (index >= 0 && index < routes.length && !isTransitioning) {
      setIsTransitioning(true);
      
      // Add exit animation
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${swipeDirection === 'left' ? '-100%' : '100%'})`;
        containerRef.current.style.opacity = '0.7';
      }

      // Navigate after a brief delay for exit animation
      setTimeout(() => {
        router.push(routes[index].path);
        
        // Reset and add enter animation
        if (containerRef.current) {
          containerRef.current.style.transform = `translateX(${swipeDirection === 'left' ? '100%' : '-100%'})`;
          containerRef.current.style.opacity = '0.7';
          
          // Animate to center
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.style.transform = 'translateX(0%)';
              containerRef.current.style.opacity = '1';
              setIsTransitioning(false);
              setSwipeDirection(null);
              setNextPagePreview(null);
            }
          }, 50);
        }
      }, 150);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = getCurrentIndex();
    
    if (direction === 'left') {
      // Swipe left = next page
      const nextIndex = (currentIndex + 1) % routes.length;
      setSwipeDirection('left');
      navigateToIndex(nextIndex);
    } else if (direction === 'right') {
      // Swipe right = previous page  
      const prevIndex = currentIndex === 0 ? routes.length - 1 : currentIndex - 1;
      setSwipeDirection('right');
      navigateToIndex(prevIndex);
    }
  };

  // Touch event handlers with full-screen detection
  const handleTouchStart = (e: TouchEvent) => {
    if (isTransitioning) return;
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    setSwipeProgress(0);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current || isTransitioning) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    
    if (isHorizontalSwipe && Math.abs(deltaX) > 20) {
      e.preventDefault();
      
      // Calculate swipe progress (0 to 1) - more responsive threshold
      const progress = Math.min(Math.abs(deltaX) / 120, 1); // Reduced from 150 to 120
      setSwipeProgress(progress);
      
      // Show swipe direction and preview
      const direction = deltaX > 0 ? 'right' : 'left';
      setSwipeDirection(direction);
      setShowSwipeIndicator(true);
      
      // Set preview of next page
      const currentIndex = getCurrentIndex();
      if (direction === 'left') {
        const nextIndex = (currentIndex + 1) % routes.length;
        setNextPagePreview(routes[nextIndex].name);
      } else {
        const prevIndex = currentIndex === 0 ? routes.length - 1 : currentIndex - 1;
        setNextPagePreview(routes[prevIndex].name);
      }

      // Apply real-time transform during swipe
      if (containerRef.current) {
        const translateX = deltaX * 0.3; // Dampen the movement
        const opacity = 1 - (progress * 0.3);
        containerRef.current.style.transform = `translateX(${translateX}px) scale(${1 - progress * 0.05})`;
        containerRef.current.style.opacity = opacity.toString();
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current || isTransitioning) {
      resetSwipeState();
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const minSwipeDistance = 60; // Reduced from 80 for easier swiping

    if (isHorizontalSwipe && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    } else {
      // Reset position if swipe wasn't strong enough
      if (containerRef.current) {
        containerRef.current.style.transform = 'translateX(0%) scale(1)';
        containerRef.current.style.opacity = '1';
      }
      resetSwipeState();
    }
  };

  const resetSwipeState = () => {
    touchStartX.current = null;
    touchStartY.current = null;
    setSwipeProgress(0);
    setSwipeDirection(null);
    setShowSwipeIndicator(false);
    setNextPagePreview(null);
  };

  // Mouse handlers for desktop (with full-screen detection)
  const [isMouseDragging, setIsMouseDragging] = useState(false);

  const handleMouseDown = (e: MouseEvent) => {
    if (isTransitioning) return;
    setIsMouseDragging(true);
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isMouseDragging || !touchStartX.current || isTransitioning) return;
    
    const deltaX = e.clientX - touchStartX.current;
    const progress = Math.min(Math.abs(deltaX) / 150, 1);
    setSwipeProgress(progress);
    
    if (Math.abs(deltaX) > 30) {
      const direction = deltaX > 0 ? 'right' : 'left';
      setSwipeDirection(direction);
      setShowSwipeIndicator(true);
      
      const currentIndex = getCurrentIndex();
      if (direction === 'left') {
        const nextIndex = (currentIndex + 1) % routes.length;
        setNextPagePreview(routes[nextIndex].name);
      } else {
        const prevIndex = currentIndex === 0 ? routes.length - 1 : currentIndex - 1;
        setNextPagePreview(routes[prevIndex].name);
      }

      if (containerRef.current) {
        const translateX = deltaX * 0.2;
        const opacity = 1 - (progress * 0.2);
        containerRef.current.style.transform = `translateX(${translateX}px) scale(${1 - progress * 0.03})`;
        containerRef.current.style.opacity = opacity.toString();
      }
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isMouseDragging || !touchStartX.current || isTransitioning) {
      setIsMouseDragging(false);
      resetSwipeState();
      return;
    }

    const deltaX = e.clientX - touchStartX.current;
    const minSwipeDistance = 100; // Reduced for easier desktop swiping

    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    } else {
      if (containerRef.current) {
        containerRef.current.style.transform = 'translateX(0%) scale(1)';
        containerRef.current.style.opacity = '1';
      }
      resetSwipeState();
    }
    
    setIsMouseDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Touch events - use document for better full-screen detection
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Mouse events - attached to document for full coverage
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pathname, isMouseDragging, isTransitioning]);

  // Reset animations when pathname changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = 'translateX(0%) scale(1)';
      containerRef.current.style.opacity = '1';
    }
    resetSwipeState();
  }, [pathname]);

  // Context value
  const contextValue: SwipeContextType = {
    currentIndex: getCurrentIndex(),
    isTransitioning,
    swipeProgress,
    swipeDirection,
    routes
  };

  return (
    <SwipeContext.Provider value={contextValue}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Swipe Indicator */}
        {showSwipeIndicator && nextPagePreview && (
          <div 
            className={`fixed top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ${
              swipeDirection === 'left' ? 'right-4' : 'left-4'
            }`}
            style={{
              opacity: swipeProgress,
              transform: `translateY(-50%) scale(${0.8 + swipeProgress * 0.2})`
            }}
          >
            <div className="bg-black/80 text-white px-4 py-2 rounded-full shadow-xl backdrop-blur-md flex items-center gap-2">
              <span className="text-lg">
                {routes.find(r => r.name === nextPagePreview)?.emoji}
              </span>
              <span className="text-sm font-medium">{nextPagePreview}</span>
              <div className="ml-2">
                {swipeDirection === 'left' ? '→' : '←'}
              </div>
            </div>
          </div>
        )}

        {/* Swipe Progress Indicator */}
        {showSwipeIndicator && (
          <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border">
              <div className="flex items-center gap-2">
                <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-out"
                    style={{ width: `${swipeProgress * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {Math.round(swipeProgress * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Page dots indicator */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full px-3 py-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2">
              {routes.map((route, index) => {
                const isActive = route.path === pathname;
                
                return (
                  <div
                    key={route.path}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-500 scale-125 shadow-lg' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    style={{
                      transform: isActive ? 'scale(1.25)' : 'scale(1)',
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content wrapper with animations */}
        <div 
          ref={containerRef}
          className="relative w-full h-full touch-pan-y select-none z-10"
          style={{ 
            touchAction: 'pan-y',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            transition: isTransitioning ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.2s ease-out',
            transformOrigin: 'center center'
          }}
        >
          {/* Background gradient overlay during swipe */}
          {showSwipeIndicator && (
            <div 
              className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
              style={{
                background: swipeDirection === 'left' 
                  ? `linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) ${swipeProgress * 100}%)`
                  : `linear-gradient(-90deg, transparent 0%, rgba(59, 130, 246, 0.1) ${swipeProgress * 100}%)`,
                opacity: swipeProgress * 0.5
              }}
            />
          )}

          {/* Content with enhanced animations */}
          <div className={`transition-all duration-300 ease-out ${
            isTransitioning 
              ? 'filter blur-sm' 
              : showSwipeIndicator 
                ? 'filter blur-[0.5px]' 
                : 'filter blur-0'
          }`}>
            {children}
          </div>

          {/* Particle effect during swipe */}
          {showSwipeIndicator && swipeProgress > 0.5 && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: swipeProgress
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Page transition overlay */}
        {isTransitioning && (
          <div className="fixed inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm z-50 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl px-6 py-4 shadow-2xl border">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Switching pages...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes swipeGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          .swipe-glow {
            animation: swipeGlow 2s ease-in-out infinite;
          }
          
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }

          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }
          
          .ripple-effect {
            animation: ripple 0.6s ease-out;
          }
        `}</style>
      </div>
    </SwipeContext.Provider>
  );
}