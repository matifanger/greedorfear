// footer
import React from 'react';
import styles from '../styles/Home.module.css'


const Footer = () => {
    return (
        <footer className={styles.footer}>
        <a
          href="https://matifanger.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          By Matias Fanger with ❤️
        </a>
      </footer>
    );
}

export default Footer;