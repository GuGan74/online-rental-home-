
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Home, LogIn, UserPlus, LogOut, Building } from 'lucide-react';
// import { motion } from 'framer-motion';

// const Navbar = ({ user, onLogout }) => {
//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ type: 'spring', stiffness: 120, damping: 15 }}
//       className="bg-background/80 backdrop-blur-md shadow-md sticky top-0 z-50"
//     >
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <Link to="/" className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors duration-300">
//           <Building className="h-8 w-8" />
//           <span className="text-2xl font-bold tracking-tight">Rentify</span>
//         </Link>
//         <div className="flex items-center space-x-3">
//           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//             {/* <Button variant="ghost" asChild>
//               <Link to="/home" className="flex items-center space-x-1">
//                 <Home className="h-4 w-4" />
//                 <span>Home</span>
//               </Link>
//             </Button> */}
//           </motion.div>
//           {user ? (
//              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Button variant="ghost" onClick={onLogout} className="flex items-center space-x-1 text-destructive hover:text-destructive/90">
//                     <LogOut className="h-4 w-4" />
//                     <span>Logout</span>
//                 </Button>
//             </motion.div>
//           ) : (
//             <>
//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Button variant="ghost" asChild>
//                   <Link to="/" className="flex items-center space-x-1">
//                     <LogIn className="h-4 w-4" />
//                     <span>Login</span>
//                   </Link>
//                 </Button>
//               </motion.div>
//                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Button variant="default" asChild className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity duration-300">
//                   <Link to="/register" className="flex items-center space-x-1">
//                     <UserPlus className="h-4 w-4" />
//                     <span>Register</span>
//                   </Link>
//                 </Button>
//               </motion.div>
//             </>
//           )}
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;
  


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogIn, UserPlus, LogOut, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();           
    navigate('/');        
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      className="bg-background/80 backdrop-blur-md shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors duration-300">
          <Building className="h-8 w-8" />
          <span className="text-2xl font-bold tracking-tight">Rentify</span>
        </Link>
        <div className="flex items-center space-x-3">
          {user ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                onClick={handleLogoutClick}
                className="flex items-center space-x-1 text-destructive hover:text-destructive/90"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" asChild>
                  <Link to="/" className="flex items-center space-x-1">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="default"
                  asChild
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity duration-300"
                >
                  <Link to="/register" className="flex items-center space-x-1">
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;