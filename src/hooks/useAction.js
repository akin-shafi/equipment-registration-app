const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use Vite environment variable

// ================== Users =========================== //
export const fetchUsers = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const data = await response.json();
    console.log();
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const createUser = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/auth/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateUser = async (id, data, token) => {
  const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteUser = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete user");
};

export const fetchRoles = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const result = await response.json();
    const data = result.roles;
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

// ================== Institutions=========================== //
export const fetchInstitution = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/institutions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const result = await response.json();
    const data = result.institutions;
    console.log("fetchInstitution data", data);
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const fetchInstitutionById = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/institutions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch institution data.");
    }

    const data = await response.json();

    // Return the institution object directly
    return data.institution;
  } catch (error) {
    throw new Error(error.message || "Error fetching institution data.");
  }
};

export const fetchInstitutionsByIds = async (ids, token) => {
  try {
    // Validate that ids is a non-empty array
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Invalid input: 'ids' must be a non-empty array.");
    }

    const response = await fetch(`${API_BASE_URL}/institutions/findByIds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }), // Send ids as the request body
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch institutions.");
    }

    // Parse and validate the response
    const result = await response.json();
    const institutions = result?.institutions;

    // console.log("Fetched institutions:", institutions);

    // Ensure institutions is always an array
    return Array.isArray(institutions) ? institutions : [];
  } catch (error) {
    console.error("Error fetching institutions:", error);
    throw new Error(error.message || "Error fetching institutions.");
  }
};

export const createInstitution = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/institutions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateInstitution = async (id, data, token) => {
  const response = await fetch(`${API_BASE_URL}/institutions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteInstitution = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/institutions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete institution");
};

// ================== Equipments =========================== //

export const fetchEquipment = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipment`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const data = await response.json();
    console.log();
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const fetchEquipmentsByInstituteId = async (institutionId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/equipment/institution/${institutionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const data = await response.json();
    console.log();
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};

export const sendBulkEquipment = async (data, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipment/bulk-upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't manually set Content-Type when sending FormData
      },
      body: data, // Directly send FormData here
    });

    if (response.ok) {
      console.log("Bulk upload successful");
      const result = await response.json();

      // Check if there are skipped rows
      if (result.skippedRows && result.skippedRows.length > 0) {
        console.warn("Some rows were skipped due to duplicates:");
        console.table(result.skippedRows); // Log skipped rows in a table format
      }

      return result; // Return the full response including skipped rows
    } else {
      console.error("Bulk upload failed");
      const errorResponse = await response.json();
      // Return error details
      return {
        statusCode: response.status,
        message: errorResponse.message || "Unknown error occurred",
      };
    }
  } catch (error) {
    console.error("Error uploading bulk data", error);
    throw new Error(error.message || "Error during bulk upload");
  }
};

// ==================== Assets ====================//

// DELETE an asset by ID
export const deleteAssetById = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete asset");
};

// POST a new asset
export const createAsset = async (data, token) => {
  const response = await fetch(`${API_BASE_URL}/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// PUT update an asset by ID
export const updateAsset = async (id, data, token) => {
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

// GET all assets
export const fetchAssets = async (token) => {
  const response = await fetch(`${API_BASE_URL}/assets`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// GET assets by institution ID
// export const fetchAssetsByInstitutionId = async (institutionId, token) => {
//   const response = await fetch(
//     `${API_BASE_URL}/assets/by-institution/${institutionId}`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );
//   return response.json();
// };

export const fetchAssetsByinstitutionId = async (institutionId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/assets/by-institution/${institutionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch room types.");
    }

    const data = await response.json();
    // const data = result.institutions;
    console.log("fetchInstitution data", data);
    // Ensure that data is always an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(error.message || "Error fetching room types.");
  }
};
