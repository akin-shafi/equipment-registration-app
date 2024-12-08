import { useMemo } from "react";

// Endpoint definitions for each step
const endpoints = {
  personalDetails: {
    endpoint: (id) => `/auth/users/profile/${id}`, // Dynamic endpoint with id
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  },
  teamMembers: {
    endpoint: () => `/teams/`, // Static endpoint
    method: "POST",
    headers: (token) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    body: (data) => JSON.stringify(data),
  },
  roomsSetup: {
    endpoint: () => `/rooms/`, // Static endpoint
    method: "POST",
    headers: (token) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    body: (data) => JSON.stringify(data),
  },
};

// Hook for returning the correct action details based on the current step
export function useOnboarding(currentStep) {
  const actionDetails = useMemo(() => {
    switch (currentStep) {
      case 0:
        return endpoints.personalDetails;
      case 1:
        return endpoints.teamMembers;
      case 2:
        return endpoints.roomsSetup;
      default:
        return null; // Return null if step is invalid
    }
  }, [currentStep]);

  return actionDetails;
}
