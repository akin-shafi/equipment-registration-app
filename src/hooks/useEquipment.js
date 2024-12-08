import { useState } from 'react';

export function useEquipment() {
  const [equipment, setEquipment] = useState([]);

  const registerEquipment = async (name, description, category) => {
    const response = await fetch('/api/registerEquipment', { method: 'POST', body: JSON.stringify({ name, description, category }) });
    if (response.ok) {
      const newEquipment = await response.json();
      setEquipment((prev) => [...prev, newEquipment]);
    }
  };

  const editEquipment = async (equipmentId, updates) => {
    const response = await fetch(`/api/editEquipment/${equipmentId}`, { method: 'PUT', body: JSON.stringify(updates) });
    if (response.ok) {
      const updatedEquipment = await response.json();
      setEquipment((prev) => prev.map((item) => item.id === equipmentId ? updatedEquipment : item));
    }
  };

  const deleteEquipment = async (equipmentId) => {
    const response = await fetch(`/api/deleteEquipment/${equipmentId}`, { method: 'DELETE' });
    if (response.ok) {
      setEquipment((prev) => prev.filter((item) => item.id !== equipmentId));
    }
  };

  return {
    equipment,
    registerEquipment,
    editEquipment,
    deleteEquipment,
  };
}
