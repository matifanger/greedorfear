// footer
import React from 'react';
import Link from 'next/link';
import { IoHeartSharp, IoLogoGithub } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="relative w-full py-8 mt-16">
      <div className="absolute inset-0 glass-card -z-10"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300">
            <span>Built with</span>
            <IoHeartSharp className="text-neon-pink animate-pulse" />
            <span>by</span>
            <Link href="https://matifanger.dev">
              <a 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gradient font-semibold hover:opacity-80 transition-opacity duration-300"
              >
                Matias Fanger
              </a>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="https://github.com/matifanger">
              <a 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-neon-blue transition-colors duration-300 flex items-center gap-2"
              >
                <IoLogoGithub className="text-xl" />
                <span>GitHub</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;