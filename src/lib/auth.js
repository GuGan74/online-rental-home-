
import React from 'react';

const USER_KEY = 'rentalAppUser';

///// Save user data to localStorage
export const loginUser = (userData) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Could not save user to localStorage", error);
  }
};

/////Get user data from localStorage
export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Could not retrieve user from localStorage", error);
    return null;
  }
};

//// Remove user data from localStorage
export const logoutUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Could not remove user from localStorage", error);
  }
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getUser();
};
  