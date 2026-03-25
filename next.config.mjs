/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  serverExternalPackages: ['@react-pdf/renderer'],
}

export default nextConfig
