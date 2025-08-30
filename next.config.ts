import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lsmvmmgkpbyqhthzdexc.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'theflex.global',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hostaway-platform.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;