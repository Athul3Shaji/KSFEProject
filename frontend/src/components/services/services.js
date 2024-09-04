import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/admin");
  };
  return logout;
};

// Function for user login
export async function userLogin(data) {
  const response = await axiosInstance.post(`/user/login`, data);
  return response.data;
}

// Function for admin login
export async function adminLogin(data) {
  const response = await axiosInstance.post(`/admin/login`, data);
  return response.data;
}

// Function to fetch all agents
export async function fetchAgents() {
  try {
    const response = await axiosInstance.get(`/admin/agent`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to add a new agent
export async function addAgent(agentData) {
  try {
    const response = await axiosInstance.post(`/admin/agent/add`, agentData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to update an existing agent
export async function updateAgent(id, agentData) {
  try {
    const response = await axiosInstance.put(`/admin/agent/update/${id}`, agentData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to delete an agent (soft delete)
export async function deleteAgent(id) {
  try {
    const response = await axiosInstance.delete(`/admin/agent/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to fetch all employees
export async function fetchEmployees() {
  try {
    const response = await axiosInstance.get(`/admin/employee`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to add a new employee
export async function addEmployee(employeeData) {
  try {
    const response = await axiosInstance.post(`/admin/employee/add`, employeeData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to update an existing employee
export async function updateEmployee(id, employeeData) {
  try {
    const response = await axiosInstance.put(`/admin/employee/update/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to delete an employee (soft delete)
export async function deleteEmployee(id) {
  try {
    const response = await axiosInstance.delete(`/admin/employee/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to fetch all chitties
export async function fetchChitty() {
  try {
    const response = await axiosInstance.get(`/admin/chitty`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to add a new chitty
export async function addChitty(chitttyData) {
  try {
    const response = await axiosInstance.post(`/admin/chitty/add`, chitttyData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to update an existing chitty
export async function updateChitty(id, chitttyData) {
  try {
    const response = await axiosInstance.put(`/admin/chitty/update/${id}`, chitttyData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to delete a chitty (soft delete)
export async function deleteChitty(id) {
  try {
    const response = await axiosInstance.delete(`/admin/chitty/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to fetch all users
export async function fetchUsers() {
  try {
    const response = await axiosInstance.get(`/user`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to add user data
export async function AddUserData(userData) {
  try {
    const response = await axiosInstance.post(`/user/add`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to fetch users by filter
export async function fetchUsersByFilter(ids) { 
  try {
    const response = await axiosInstance.get(`/admin/search-user`, {
      params: {
        chittyIds: ids.chittyIds, 
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Function to fetch users by filter
export async function fetchUserById(id) { 
  try {
    const response = await axiosInstance.get(`/user/${id}` )
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Functionadd to update user data
export async function updateUserData(id,userData) {
  try {
    const response = await axiosInstance.put(`/user/update/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
}