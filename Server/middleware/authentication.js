// // // // // //middkeware/authentication.js
// // // // // import jwt from "jsonwebtoken";
// // // // // import User from "../models/User.js";
// // // // // import NotFoundError from "../errors/not-found.js";
// // // // // import UnauthenticatedError from "../errors/unauthenticated.js";

// // // // // const auth = async (req, res, next) => {
// // // // //   const authHeader = req.headers.authorization;
// // // // //   if (!authHeader || !authHeader.startsWith("Bearer")) {
// // // // //     throw new UnauthenticatedError("Authentication invalid");
// // // // //   }
// // // // //   const token = authHeader.split(" ")[1];
// // // // //   try {
// // // // //     const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
// // // // //     req.user = { id: payload.id, phone: payload.phone };
// // // // //     req.socket = req.io;

// // // // //     const user = await User.findById(payload.id);

// // // // //     if (!user) {
// // // // //       throw new NotFoundError("User not found");
// // // // //     }

// // // // //     next();
// // // // //   } catch (error) {
// // // // //     throw new UnauthenticatedError("Authentication invalid");
// // // // //   }
// // // // // };

// // // // // export default auth;

// // // // //middleware/authentication.js
// // // // import jwt from "jsonwebtoken";
// // // // import User from "../models/User.js";
// // // // import NotFoundError from "../errors/not-found.js";
// // // // import UnauthenticatedError from "../errors/unauthenticated.js";

// // // // const auth = async (req, res, next) => {
// // // //   const authHeader = req.headers.authorization;
// // // //   if (!authHeader || !authHeader.startsWith("Bearer")) {
// // // //     throw new UnauthenticatedError("Authentication invalid");
// // // //   }
// // // //   const token = authHeader.split(" ")[1];
// // // //   try {
// // // //     const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
// // // //     // Include role and status in the request user object
// // // //     req.user = { 
// // // //       id: payload.id, 
// // // //       phone: payload.phone,
// // // //       role: payload.role,
// // // //       status: payload.status
// // // //     };
    
// // // //     if (req.io) {
// // // //       req.socket = req.io;
// // // //     }

// // // //     const user = await User.findById(payload.id);

// // // //     if (!user) {
// // // //       throw new NotFoundError("User not found");
// // // //     }

// // // //     // Check if user account is active
// // // //     if (user.status !== "active") {
// // // //       throw new UnauthenticatedError("Account is not active. Access denied.");
// // // //     }

// // // //     next();
// // // //   } catch (error) {
// // // //     throw new UnauthenticatedError("Authentication invalid");
// // // //   }
// // // // };

// // // // export default auth;

// // // //middleware/authentication.js
// // // import jwt from "jsonwebtoken";
// // // import User from "../models/User.js";
// // // import { NotFoundError, UnauthenticatedError, ForbiddenError } from "../errors/index.js";

// // // // Universal authentication middleware
// // // export const auth = async (req, res, next) => {
// // //   const authHeader = req.headers.authorization;
// // //   if (!authHeader || !authHeader.startsWith("Bearer")) {
// // //     throw new UnauthenticatedError("Authentication invalid");
// // //   }
  
// // //   const token = authHeader.split(" ")[1];
  
// // //   try {
// // //     // Try with regular user token first
// // //     try {
// // //       const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
// // //       // Regular user auth
// // //       req.user = { 
// // //         id: payload.id, 
// // //         phone: payload.phone,
// // //         role: payload.role,
// // //         status: payload.status,
// // //         isAdmin: false
// // //       };
      
// // //     } catch (err) {
// // //       // If that fails, try with admin token
// // //       const adminPayload = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
      
// // //       if (!adminPayload.isAdmin) {
// // //         throw new UnauthenticatedError("Authentication invalid");
// // //       }
      
// // //       // Admin auth
// // //       req.user = {
// // //         id: adminPayload.id,
// // //         username: adminPayload.username,
// // //         role: 'admin',
// // //         isAdmin: true,
// // //         isSuper: adminPayload.isSuper
// // //       };
// // //     }
    
// // //     // Set socket if available
// // //     if (req.io) {
// // //       req.socket = req.io;
// // //     }

// // //     // Verify the user exists and is active
// // //     const user = await User.findById(req.user.id);

// // //     if (!user) {
// // //       throw new NotFoundError("User not found");
// // //     }

// // //     // Check if user account is active
// // //     if (user.status !== "active") {
// // //       throw new UnauthenticatedError("Account is not active. Access denied.");
// // //     }
    
// // //     // For admin users, add permissions to req object
// // //     if (req.user.isAdmin) {
// // //       req.user.permissions = user.permissions || [];
// // //     }

// // //     next();
// // //   } catch (error) {
// // //     throw new UnauthenticatedError("Authentication invalid");
// // //   }
// // // };

// // // // Middleware to restrict access to specific roles
// // // export const restrictTo = (...roles) => {
// // //   return (req, res, next) => {
// // //     if (!roles.includes(req.user.role)) {
// // //       throw new ForbiddenError(`Access denied. Role '${req.user.role}' not authorized.`);
// // //     }
// // //     next();
// // //   };
// // // };

// // // // Middleware to check if admin has specific permission
// // // export const hasPermission = (requiredPermission) => {
// // //   return (req, res, next) => {
// // //     // Only applicable to admin users
// // //     if (req.user.role !== 'admin') {
// // //       throw new ForbiddenError('Admin permissions required');
// // //     }
    
// // //     const { permissions, isSuper } = req.user;
    
// // //     // Super admin has all permissions
// // //     if (isSuper || permissions.includes('all') || permissions.includes(requiredPermission)) {
// // //       return next();
// // //     }
    
// // //     throw new ForbiddenError(`Admin does not have permission: ${requiredPermission}`);
// // //   };
// // // };

// // // export default auth;

// // //middleware/authentication.js
// // import jwt from "jsonwebtoken";
// // import User from "../models/User.js";
// // import Admin from "../models/Admin.js";
// // import { NotFoundError, UnauthenticatedError, ForbiddenError } from "../errors/index.js";

// // // Universal authentication middleware
// // export const auth = async (req, res, next) => {
// //   const authHeader = req.headers.authorization;
// //   if (!authHeader || !authHeader.startsWith("Bearer")) {
// //     throw new UnauthenticatedError("Authentication invalid");
// //   }
  
// //   const token = authHeader.split(" ")[1];
  
// //   try {
// //     // Try with regular user token first
// //     try {
// //       const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
// //       // Regular user auth
// //       req.user = { 
// //         id: payload.id, 
// //         phone: payload.phone,
// //         role: payload.role,
// //         status: payload.status,
// //         isAdmin: false
// //       };
      
// //       // Verify the user exists and is active
// //       const user = await User.findById(req.user.id);

// //       if (!user) {
// //         throw new NotFoundError("User not found");
// //       }

// //       // Check if user account is active
// //       if (user.status !== "active") {
// //         throw new UnauthenticatedError("Account is not active. Access denied.");
// //       }
      
// //     } catch (err) {
// //       // If that fails, try with admin token
// //       const adminPayload = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
      
// //       if (!adminPayload.isAdmin) {
// //         throw new UnauthenticatedError("Authentication invalid");
// //       }
      
// //       // Find the admin
// //       const admin = await Admin.findById(adminPayload.id);
      
// //       if (!admin) {
// //         throw new NotFoundError("Admin not found");
// //       }
      
// //       // Admin auth
// //       req.user = {
// //         id: adminPayload.id,
// //         username: adminPayload.username,
// //         isAdmin: true,
// //         isSuper: admin.isSuper,
// //         permissions: admin.permissions || []
// //       };
// //     }
    
// //     // Set socket if available
// //     if (req.io) {
// //       req.socket = req.io;
// //     }

// //     next();
// //   } catch (error) {
// //     throw new UnauthenticatedError("Authentication invalid");
// //   }
// // };

// // // Middleware to restrict access to admin users
// // export const adminOnly = async (req, res, next) => {
// //   if (!req.user.isAdmin) {
// //     throw new ForbiddenError("Admin access required");
// //   }
// //   next();
// // };

// // // Middleware to restrict access to specific roles
// // export const restrictTo = (...roles) => {
// //   return (req, res, next) => {
// //     if (req.user.isAdmin) {
// //       return next(); // Admins have access to all routes
// //     }
    
// //     if (!roles.includes(req.user.role)) {
// //       throw new ForbiddenError(`Access denied. Role '${req.user.role}' not authorized.`);
// //     }
// //     next();
// //   };
// // };

// // // Middleware to check if admin has specific permission
// // export const hasPermission = (requiredPermission) => {
// //   return (req, res, next) => {
// //     // Only applicable to admin users
// //     if (!req.user.isAdmin) {
// //       throw new ForbiddenError('Admin permissions required');
// //     }
    
// //     const { permissions, isSuper } = req.user;
    
// //     // Super admin has all permissions
// //     if (isSuper || permissions.includes('all') || permissions.includes(requiredPermission)) {
// //       return next();
// //     }
    
// //     throw new ForbiddenError(`Admin does not have permission: ${requiredPermission}`);
// //   };
// // };

// // export default auth;

// //middleware/authentication.js
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import Admin from "../models/Admin.js";
// import { NotFoundError, UnauthenticatedError, ForbiddenError } from "../errors/index.js";

// // Universal authentication middleware
// export const auth = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer")) {
//     throw new UnauthenticatedError("Authentication invalid");
//   }
  
//   const token = authHeader.split(" ")[1];
  
//   try {
//     // Try with regular user token first
//     try {
//       const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
//       // Regular user auth
//       req.user = { 
//         id: payload.id, 
//         phone: payload.phone,
//         role: payload.role,
//         status: payload.status,
//         isAdmin: false
//       };
      
//       // Verify the user exists and is active
//       const user = await User.findById(req.user.id);

//       if (!user) {
//         throw new NotFoundError("User not found");
//       }

//       // Check if user account is active
//       if (user.status !== "active") {
//         throw new UnauthenticatedError("Account is not active. Access denied.");
//       }
      
//     } catch (err) {
//       // If that fails, try with admin token
//       const adminPayload = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
      
//       if (!adminPayload.isAdmin) {
//         throw new UnauthenticatedError("Authentication invalid");
//       }
      
//       // Find the admin using the Admin model (which is a discriminator of User)
//       // This still queries the User collection but with the condition __t: 'admin'
//       const admin = await Admin.findById(adminPayload.id);
      
//       if (!admin) {
//         throw new NotFoundError("Admin not found");
//       }
      
//       // Admin auth
//       req.user = {
//         id: adminPayload.id,
//         username: adminPayload.username,
//         role: 'admin',
//         isAdmin: true,
//         isSuper: admin.isSuper,
//         permissions: admin.permissions || []
//       };
      
//       // Check if admin account is active (if you're using status field for admins too)
//       if (admin.status && admin.status !== "active") {
//         throw new UnauthenticatedError("Account is not active. Access denied.");
//       }
//     }
    
//     // Set socket if available
//     if (req.io) {
//       req.socket = req.io;
//     }

//     next();
//   } catch (error) {
//     throw new UnauthenticatedError("Authentication invalid");
//   }
// };

// // Middleware to restrict access to specific roles
// export const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       throw new ForbiddenError(`Access denied. Role '${req.user.role}' not authorized.`);
//     }
//     next();
//   };
// };

// // Middleware to check if admin has specific permission
// export const hasPermission = (requiredPermission) => {
//   return (req, res, next) => {
//     // Only applicable to admin users
//     if (req.user.role !== 'admin') {
//       throw new ForbiddenError('Admin permissions required');
//     }
    
//     const { permissions, isSuper } = req.user;
    
//     // Super admin has all permissions
//     if (isSuper || permissions.includes('all') || permissions.includes(requiredPermission)) {
//       return next();
//     }
    
//     throw new ForbiddenError(`Admin does not have permission: ${requiredPermission}`);
//   };
// };



// // admin
// export const adminAuth = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer")) {
//     throw new UnauthenticatedError("Admin authentication invalid");
//   }
//   const token = authHeader.split(" ")[1];
//   try {
//     const payload = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
    
//     if (!payload.isAdmin) {
//       throw new UnauthenticatedError("Admin authentication invalid");
//     }
    
//     const admin = await Admin.findById(payload.id);
    
//     if (!admin) {
//       throw new UnauthenticatedError("Admin not found");
//     }
    
//     // Add admin data to request
//     req.admin = {
//       id: admin._id,
//       username: admin.username,
//       isSuper: admin.isSuper,
//       permissions: admin.permissions,
//     };
    
//     req.socket = req.io;
    
//     next();
//   } catch (error) {
//     throw new UnauthenticatedError("Admin authentication invalid");
//   }
// };

// // Middleware to check if admin has specific permission
// export const hasAdminPermission = (requiredPermission) => {
//   return (req, res, next) => {
//     const { permissions, isSuper } = req.admin;
    
//     // Super admin has all permissions
//     if (isSuper || permissions.includes('all') || permissions.includes(requiredPermission)) {
//       return next();
//     }
    
//     throw new ForbiddenError(`Admin does not have permission: ${requiredPermission}`);
//   };
// };

// export default auth;

//middleware/authentication.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { NotFoundError, UnauthenticatedError, ForbiddenError } from "../errors/index.js";

// Universal authentication middleware
export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    let payload;
    // Try with regular user token first
    try {
      payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
      // Only set isAdmin to false if not specified in payload
      if (payload.role !== "admin") {
        payload.isAdmin = false;
      }
    } catch (err) {
      // If that fails, try with admin token
      payload = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
      
      if (payload.role !== "admin" && !payload.isAdmin) {
        throw new UnauthenticatedError("Authentication invalid");
      }
      
      payload.isAdmin = true;
    }
    
    // Find the user by ID (will work for any role)
    const user = await User.findById(payload.id);
    
    if (!user) {
      throw new NotFoundError("User not found");
    }
    
    // Check if user account is active
    if (user.status !== "active") {
      throw new UnauthenticatedError("Account is not active. Access denied.");
    }
    
    // Set user data in request
    req.user = {
      id: user._id,
      role: user.role,
      status: user.status,
      isAdmin: user.role === "admin"
    };
    
    // Add role-specific properties
    if (user.role === "admin") {
      req.user.username = user.username;
      req.user.isSuper = user.isSuper;
      req.user.permissions = user.permissions || [];
    } else {
      req.user.phone = user.phone;
    }
    
    // Set socket if available
    if (req.io) {
      req.socket = req.io;
    }

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

// Middleware to restrict access to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(`Access denied. Role '${req.user.role}' not authorized.`);
    }
    next();
  };
};

// Middleware to check if admin has specific permission
export const hasPermission = (requiredPermission) => {
  return (req, res, next) => {
    // Only applicable to admin users
    if (req.user.role !== 'admin') {
      throw new ForbiddenError('Admin permissions required');
    }
    
    const { permissions, isSuper } = req.user;
    
    // Super admin has all permissions
    if (isSuper || permissions.includes('all') || permissions.includes(requiredPermission)) {
      return next();
    }
    
    throw new ForbiddenError(`Admin does not have permission: ${requiredPermission}`);
  };
};

// For backward compatibility - uses the unified auth middleware
export const adminAuth = auth;

// Middleware to check if admin has specific permission (for backward compatibility)
export const hasAdminPermission = hasPermission;

export default auth;