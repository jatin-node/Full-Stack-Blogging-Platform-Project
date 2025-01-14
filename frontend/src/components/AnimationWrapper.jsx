import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const AnimationWrapper = ({ children, type }) => {
  return (
    <AnimatePresence>
      <motion.div
        key={type}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper;
