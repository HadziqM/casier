import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function Backdrop({ children }: Props) {
  return (
    <motion.div
      className="top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center fixed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
}
