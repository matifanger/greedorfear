/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    RAPIDAPI_HOST: process.env.RAPIDAPI_HOST,
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
  },
}
