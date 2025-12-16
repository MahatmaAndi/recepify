/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  images: {
    domains: [
      "images.unsplash.com",
      "media.bettybossi.ch",
      "res.cloudinary.com",
      "i.pinimg.com",
      "glebekitchen.com",
      "www.aspicyperspective.com",
      "img.chefkoch-cdn.de"
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
        pathname: "/media/**"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8001",
        pathname: "/media/**"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**"
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
