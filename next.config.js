/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'], // Menambahkan 'localhost' ke daftar domain yang diizinkan
  },
};

module.exports = nextConfig;
