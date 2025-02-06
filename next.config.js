/** @type {import('next').NextConfig} */

const withMDX = require('@next/mdx')();

const nextConfig = {
    reactStrictMode: false,
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx']
}

module.exports = withMDX(nextConfig)
