/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["gateway.pinata.cloud"],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    PINATA_BEARER_TOKEN: process.env.PINATA_BEARER_TOKEN,
  },
};

module.exports = nextConfig;
