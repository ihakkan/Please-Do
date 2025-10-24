
const withPWAInit = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

// Custom cache rules for offline functionality
const customRuntimeCaching = [
  // Cache Google Fonts
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
    },
  },
  // Cache sound effects
  {
    urlPattern: /^https:\/\/www\.zapsplat\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'sound-effects',
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
      },
    },
  },
  // Generic network-first strategy for other resources
  ...runtimeCaching
];

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: customRuntimeCaching,
  fallbacks: {
    document: '/offline',
    // You can add fallbacks for images, fonts, etc. here if needed
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
