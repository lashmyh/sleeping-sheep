import axios from "axios";
import * as Sentry from "@sentry/react"; //errors logged in sentry

const API_URL = import.meta.env.VITE_API_URL;

//////////////////////// Error Handling /////////////////////////

const handleApiError = (error, functionName) => {
    const errorMessage = error.response
        ? `Error in ${functionName}: ${error.response.status} - ${error.response.data.message || error.response.statusText}`
        : `Error in ${functionName}: ${error.message}`;


    Sentry.captureException(new Error(errorMessage));

    return errorMessage;
};

////////////// Authorisation ////////////////////////////////

export const registerUser = async (userData) => {
    try {
        return await axios.post(`${API_URL}/auth/register`, userData);
    } catch (error) {
        handleApiError(error, "Register User");
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        return await axios.post(`${API_URL}/auth/login`, credentials);
    } catch (error) {
        handleApiError(error, "Login User");
        throw error;
    }
};

/////////////////// Posts /////////////////////////////////////

export const fetchAllPosts = async (page = 1, limit = 20) => {
    try {
        return await axios.get(`${API_URL}/posts/`, {
            params: { page, limit }
        });
    } catch (error) {
        handleApiError(error, "Fetch All Posts");
        throw error;
    }
};

export const fetchUserPosts = async (token, page = 1, limit = 20) => {
    try {
        return await axios.get(`${API_URL}/posts/user`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit }
        });
    } catch (error) {
        handleApiError(error, "Fetch User Posts");
        throw error;
    }
};

// Fetch all public posts containing search query
export const fetchSearchedPosts = async (query, page = 1, limit = 20) => {
    try {
        return await axios.get(`${API_URL}/posts/search/${query}`, {
            params: { page, limit }
        });
    } catch (error) {
        handleApiError(error, "Fetch Searched Posts");
        throw error;
    }
};

// Fetch all tags by a user
export const fetchUserTags = async (token) => {
    try {
        return await axios.get(`${API_URL}/posts/user/tags`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        handleApiError(error, "Fetch User Tags");
        throw error;
    }
};

export const createNewPost = async (token, postData) => {
    try {
        return await axios.post(`${API_URL}/posts/`, postData, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        handleApiError(error, "Create New Post");
        throw error;
    }
};

export const fetchUserSinglePost = async (token, postId) => {
    try {
        return await axios.get(`${API_URL}/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        handleApiError(error, "Fetch User Single Post");
        throw error;
    }
};

export const updatePost = async (token, postData, postId) => {
    try {
        return await axios.put(`${API_URL}/posts/${postId}`, postData, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        handleApiError(error, "Update Post");
        throw error;
    }
};

export const deletePost = async (token, postId) => {
    try {
        return await axios.delete(`${API_URL}/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        handleApiError(error, "Delete Post");
        throw error;
    }
};

/////////////////////// User ///////////////////////////////////

export const fetchUser = async (userId) => {
    try {
        return await axios.get(`${API_URL}/users/${userId}`);
    } catch (error) {
        handleApiError(error, "Fetch User");
        throw error;
    }
};

export const updateProfile = async (token, profileData) => {
    try {
        return await axios.put(`${API_URL}/users/`, profileData, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        handleApiError(error, "Update Profile");
        throw error;
    }
};

export const deleteAccount = async (token) => {
    try {
        return await axios.delete(`${API_URL}/users/delete`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        handleApiError(error, "Delete Account");
        throw error;
    }
};


