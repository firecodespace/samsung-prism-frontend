// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { useSwipeContext } from "./SwipeProvider";

const tabs = [
  { 
    href: "/", 
    label: "Home", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    href: "/chatbot", 
    label: "Chat", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  },
  { 
    href: "/analysis", 
    label: "Analysis", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    href: "/library", 
    label: "Library", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  
  // Get swipe context to be aware of swipe state
  const { currentIndex, isTransitioning, swipeProgress, swipeDirection, routes } = useSwipeContext();

  // Calculate which tab should appear active during swipes
  const getVisuallyActiveTab = () => {
    if (!swipeDirection || swipeProgress < 0.3) {
      return pathname;
    }
    
    // If we're swiping with significant progress, show the target tab as active
    if (swipeDirection === 'left') {
      const nextIndex = (currentIndex + 1) % routes.length;
      return routes[nextIndex].path;
    } else {
      const prevIndex = currentIndex === 0 ? routes.length - 1 : currentIndex - 1;
      return routes[prevIndex].path;
    }
  };

  const visuallyActivePath = getVisuallyActiveTab();

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <nav className={clsx(
        "rounded-full shadow-xl backdrop-blur-md bg-white/90 dark:bg-black/80 border border-gray-200/50 dark:border-gray-800/50 px-2 py-2 transition-all duration-300",
        isTransitioning && "scale-95 opacity-80",
        swipeProgress > 0.1 && "scale-98"
      )}>
        <ul className="flex items-center gap-1">
          {tabs.map((tab, tabIndex) => {
            const isActive = visuallyActivePath === tab.href;
            const isCurrentlyActive = pathname === tab.href;
            const isHovered = hoveredTab === tab.href;
            const isExpanded = isActive || isHovered;
            
            // Add transition effect during swipes
            const isSwipeTarget = swipeDirection && swipeProgress > 0.3 && 
              ((swipeDirection === 'left' && tabIndex === (currentIndex + 1) % routes.length) ||
               (swipeDirection === 'right' && tabIndex === (currentIndex === 0 ? routes.length - 1 : currentIndex - 1)));
            
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-3 rounded-full text-sm font-medium transition-all duration-300 ease-out relative overflow-hidden group",
                    isActive
                      ? "bg-gray-900 text-white dark:bg-white dark:text-black shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
                    // Add special styling for swipe targets
                    isSwipeTarget && "ring-2 ring-blue-500/50 ring-offset-1 ring-offset-white dark:ring-offset-black",
                    // Scale effect during transitions
                    isTransitioning && isCurrentlyActive && "scale-95",
                    swipeProgress > 0.1 && isCurrentlyActive && "scale-95 opacity-70"
                  )}
                  onMouseEnter={() => setHoveredTab(tab.href)}
                  onMouseLeave={() => setHoveredTab(null)}
                  style={{
                    // Smooth transition for swipe states
                    transform: isSwipeTarget ? `scale(${1 + swipeProgress * 0.1})` : undefined,
                    opacity: isSwipeTarget ? 0.8 + (swipeProgress * 0.2) : undefined
                  }}
                >
                  {/* Icon */}
                  <span className={clsx(
                    "relative z-10 flex-shrink-0 transition-transform duration-300",
                    isSwipeTarget && "animate-pulse"
                  )}>
                    {tab.icon}
                  </span>
                  
                  {/* Label with expand animation */}
                  <span 
                    className={clsx(
                      "whitespace-nowrap transition-all duration-300 ease-out relative z-10",
                      isExpanded 
                        ? "opacity-100 translate-x-0 max-w-20" 
                        : "opacity-0 -translate-x-2 max-w-0"
                    )}
                    style={{
                      transitionProperty: "opacity, transform, max-width",
                    }}
                  >
                    {tab.label}
                  </span>

                  {/* Active indicator with improved animation */}
                  {isActive && (
                    <div className={clsx(
                      "absolute inset-0 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 dark:from-white dark:to-gray-100",
                      isSwipeTarget && "animate-pulse"
                    )} />
                  )}

                  {/* Swipe preview indicator */}
                  {isSwipeTarget && swipeProgress > 0.5 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Swipe progress indicator on navbar */}
        {swipeProgress > 0.1 && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
            <div className="w-8 h-1 bg-gray-200/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-100"
                style={{ width: `${swipeProgress * 100}%` }}
              />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}