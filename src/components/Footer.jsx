
import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-background/70 backdrop-blur-sm text-center py-4 mt-auto shadow-inner"
    >
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Rentify. All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;
  