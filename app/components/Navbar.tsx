"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header className={`py-4 border-b bg-white sticky top-0 left-0 right-0 z-50 ${
      scrolled ? 'shadow-sm' : ''
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo - Left */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-indigo-600 font-bold text-xl">
            RAEGERA
          </Link>
        </div>
        
        {/* Main Navigation - Center */}
        <div className="hidden md:block">
          <nav className="flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
            <Link href="/repository" className="text-gray-600 hover:text-indigo-600">Repository</Link>
            <Link href="/practice" className="text-gray-600 hover:text-indigo-600">Practice</Link>
            {user && (
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
            )}
          </nav>
        </div>
        
        {/* Auth Links - Right */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="flex items-center bg-white rounded-full px-3 py-1 hover:bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <UserCircleIcon className="h-6 w-6 text-gray-400 mr-2" aria-hidden="true" />
                    <span className="text-gray-700 mr-1 truncate max-w-[150px]">{user.email}</span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      Signed in as <span className="font-medium">{user.email}</span>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/profile" className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/settings" className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <div className="border-t border-gray-100"></div>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={signOut}
                          className={`${active ? 'bg-gray-100' : ''} flex w-full items-center px-4 py-2 text-sm text-red-600 hover:text-red-700`}
                          title="Sign Out"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-indigo-600">Sign In</Link>
              <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button - Only visible on mobile */}
        <div className="md:hidden">
          <button className="text-gray-500 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
} 