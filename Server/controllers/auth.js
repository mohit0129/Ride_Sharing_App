//controllers/auth.js
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors/index.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    birthDate, 
    role,
    vehicleType,
    manufacturer,
    model,
    modelYear,
    licensePlate,
    color
  } = req.body;

  // Validate role
  if (!["customer", "rider"].includes(role)) {
    throw new BadRequestError("Role must be either 'customer' or 'rider'");
  }

  // Validate required fields for all users
  if (!firstName || !lastName || !phone || !birthDate) {
    throw new BadRequestError("Please provide all required fields");
  }

  // Check if user with the same phone already exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw new BadRequestError("User with this phone number already exists");
  }

  // Additional validation for riders
  if (role === "rider") {
    if (!vehicleType || !manufacturer || !model || !modelYear || !licensePlate || !color) {
      throw new BadRequestError("Please provide all vehicle details for rider signup");
    }
    
    if (!["bike", "car"].includes(vehicleType)) {
      throw new BadRequestError("Vehicle type must be either 'bike' or 'car'");
    }
  }

  try {
    // Create the user object with the appropriate structure
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      birthDate: new Date(birthDate),
      role,
      status: "active" // Set default status to active
    };

    // Add vehicle details for riders
    if (role === "rider") {
      userData.vehicleDetails = {
        vehicleType,
        manufacturer,
        model,
        modelYear,
        licensePlate,
        color
      };
    }

    const user = new User(userData);
    await user.save();

    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();

    // Return user data without sensitive information
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    };

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user: userResponse,
      access_token: accessToken,
      refresh_token: refreshToken
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signin = async (req, res) => {
  const { phone } = req.body;

  // Phone is required for all users now
  if (!phone) {
    throw new BadRequestError("Please provide phone number");
  }

  try {
    // Find user by phone
    const user = await User.findOne({ phone });

    if (!user) {
      throw new UnauthenticatedError("User not found");
    }

    // Check if user account is active
    if (user.status !== "active") {
      throw new UnauthenticatedError("Account is not active. Please contact support.");
    }

    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();

    // Return user data without sensitive information
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    };

    return res.status(StatusCodes.OK).json({
      message: "User logged in successfully",
      user: userResponse,
      access_token: accessToken,
      refresh_token: refreshToken
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const adminRegister = async (req, res) => {
  const { username, password, phone, email } = req.body;

  // Now require phone for admin registration and make email optional
  if (!username || !password || !phone) {
    throw new BadRequestError("Please provide username, password, and phone number");
  }

  try {
    // Check if admin already exists (by username, phone, or email if provided)
    const queryConditions = [
      { username, role: "admin" },
      { phone, role: "admin" }
    ];
    
    // Only check for email if it's provided
    if (email) {
      queryConditions.push({ email, role: "admin" });
    }
    
    const existingAdmin = await User.findOne({ 
      $or: queryConditions
    });
    
    if (existingAdmin) {
      // More specific error message based on which field is duplicated
      if (existingAdmin.username === username) {
        throw new BadRequestError("Admin with this username already exists");
      } else if (existingAdmin.phone === phone) {
        throw new BadRequestError("Admin with this phone number already exists");
      } else if (email && existingAdmin.email === email) {
        throw new BadRequestError("Admin with this email already exists");
      } else {
        throw new BadRequestError("Admin with these credentials already exists");
      }
    }

    // Create first admin as superadmin
    const adminCount = await User.countDocuments({ role: "admin" });
    const isSuper = adminCount === 0;

    const adminData = {
      username,
      password,
      phone,
      role: "admin",
      isSuper,
      permissions: isSuper ? ['all'] : ['view'],
      status: "active"
    };
    
    // Only add email if it's provided
    if (email) {
      adminData.email = email;
    }

    const admin = new User(adminData);
    await admin.save();

    const accessToken = admin.createAccessToken();
    const refreshToken = admin.createRefreshToken();

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(StatusCodes.CREATED).json({
      message: "Admin created successfully",
      user: adminResponse,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    // Better error handling for MongoDB duplicate key errors
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      throw new BadRequestError(`Admin with this ${duplicateField} already exists`);
    }
    console.error(error);
    throw error;
  }
};

export const adminLogin = async (req, res) => {
  // Allow login with either username+password or phone
  const { username, password, phone } = req.body;

  // Check which login method is being attempted
  const isUsernameLogin = username && password;
  const isPhoneLogin = phone;

  if (!isUsernameLogin && !isPhoneLogin) {
    throw new BadRequestError("Please provide either username+password or phone number");
  }

  try {
    let admin;
    
    if (isUsernameLogin) {
      // Username/password login
      admin = await User.findOne({ username, role: "admin" });
      
      if (!admin) {
        throw new UnauthenticatedError("Invalid credentials");
      }

      const isPasswordCorrect = await admin.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid credentials");
      }
    } else {
      // Phone login
      admin = await User.findOne({ phone, role: "admin" });
      
      if (!admin) {
        throw new UnauthenticatedError("Admin not found with this phone number");
      }
    }

    const accessToken = admin.createAccessToken();
    const refreshToken = admin.createRefreshToken();

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(StatusCodes.OK).json({
      message: "Admin logged in successfully",
      user: adminResponse,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    throw new BadRequestError("Refresh token is required");
  }

  try {
    // Determine which token secret to use by checking the token
    let payload;
    let isAdmin = false;
    
    try {
      // First try to verify as an admin token
      payload = jwt.verify(refresh_token, process.env.ADMIN_TOKEN_SECRET);
      isAdmin = payload.role === "admin" || payload.isAdmin;
    } catch (err) {
      // If that fails, try as a regular user token
      payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    }

    // Find user by ID (regardless of role)
    const user = await User.findById(payload.id);

    if (!user) {
      throw new UnauthenticatedError("Invalid refresh token");
    }

    // Check if user account is active
    if (user.status !== "active") {
      throw new UnauthenticatedError("Account is not active. Please contact support.");
    }

    const newAccessToken = user.createAccessToken();
    const newRefreshToken = user.createRefreshToken();

    res.status(StatusCodes.OK).json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken
    });
  } catch (error) {
    console.error(error);
    throw new UnauthenticatedError("Invalid refresh token");
  }
};

///////////
// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude passwords
    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, birthDate, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.phone = phone ?? user.phone;
    user.email = email ?? user.email;
    user.birthDate = birthDate ? new Date(birthDate) : user.birthDate;
    user.role = role ?? user.role;

    await user.save();

    res.status(StatusCodes.OK).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "deactive"].includes(status)) {
      throw new BadRequestError("Invalid status value");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    user.status = status;
    await user.save();

    res.status(StatusCodes.OK).json({ message: `User status updated to ${status}` });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Create user (admin, customer, rider)
export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, birthDate, role, username, password, vehicleType, manufacturer, model, modelYear, licensePlate, color } = req.body;

    // Validate required fields
    if (!role || !phone) {
      throw new BadRequestError("Role and phone number are required");
    }

    if (role === "admin" && (!username || !password)) {
      throw new BadRequestError("Admin must have a username and password");
    }

    if (["customer", "rider"].includes(role) && (!firstName || !lastName || !birthDate)) {
      throw new BadRequestError("Customers and riders must have first name, last name, and birth date");
    }

    if (role === "rider" && (!vehicleType || !manufacturer || !model || !modelYear || !licensePlate || !color)) {
      throw new BadRequestError("Riders must provide vehicle details");
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new BadRequestError("User with this phone number already exists");
    }

    const userData = { firstName, lastName, email, phone, birthDate, role, username, password, status: "active" };

    if (role === "rider") {
      userData.vehicleDetails = { vehicleType, manufacturer, model, modelYear, licensePlate, color };
    }

    if (role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      userData.isSuper = adminCount === 0;
      userData.permissions = userData.isSuper ? ['all'] : ['view'];
    }

    const user = new User(userData);
    await user.save();

    res.status(StatusCodes.CREATED).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    throw error;
  }
};