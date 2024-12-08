import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  const login = async (email, password) => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const createUser = async (name, email, password) => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("/api/createUser", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      return response.ok;
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const createInstitution = async (name, email, phone) => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("/api/createInstitution", {
        method: "POST",
        body: JSON.stringify({ name, email, phone }),
      });
      return response.ok;
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const fetchInstitution = async (institutionId) => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`/api/institutions/${institutionId}`);
      return response.json();
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return {
    user,
    isLoading, // Expose isLoading
    login,
    createUser,
    createInstitution,
    fetchInstitution,
    logout,
  };
}
