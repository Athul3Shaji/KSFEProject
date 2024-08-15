import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const API_URL = "http://localhost:8000";


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
  const response = await axios.post(`${API_URL}/user/login`, data);
  return response.data;
}

// Function for admin login
export async function adminLogin(data) {
  const response = await axios.post(`${API_URL}/admin/login`, data);
  return response.data;
}

// Function to fetch all agents
export async function fetchAgents() {
  try {
    const response = await axios.get(`${API_URL}/admin/agent`);
    return response.data;
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error;
  }
}

// Function to add a new agent
export async function addAgent(agentData) {
  try {
    const response = await axios.post(`${API_URL}/admin/agent/add`, agentData);
    console.log(agentData,"kkkkkkkkkkkk")
    return response.data;
  } catch (error) {
    console.error("Error adding agent:", error);
    throw error;
  }
}

// Function to update an existing agent
export async function updateAgent(id, agentData) {
  try {
    const response = await axios.put(`${API_URL}/admin/agent/${id}`, agentData);
    return response.data;
  } catch (error) {
    console.error("Error updating agent:", error);
    throw error;
  }
}

// Function to delete an agent (soft delete)
export async function deleteAgent(id) {
  try {
    const response = await axios.delete(`${API_URL}/admin/agent/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting agent:", error);
    throw error;
  }
}


// Function to fetch all employees
export async function fetchEmployees() {
  try {
    const response = await axios.get(`${API_URL}/admin/employee`);
    return response.data;
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error;
  }
}

// Function to add a new employee
export async function addEmployee(employeeData) {
  try {
    const response = await axios.post(`${API_URL}/admin/employee/add`, employeeData);
    console.log(employeeData,"kkkkkkkkkkkk")
    return response.data;
  } catch (error) {
    console.error("Error adding agent:", error);
    throw error;
  }
}

// Function to update an existing employee
export async function updateEmployee(id, employeeData) {
  try {
    const response = await axios.put(`${API_URL}/admin/employee/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error("Error updating agent:", error);
    throw error;
  }
}

// Function to delete an employee (soft delete)
export async function deleteEmployee(id) {
  try {
    console.log(id);
    const response = await axios.delete(`${API_URL}/admin/employee/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting agent:", error);
    throw error;
  }
}