import axios from "axios";
// import { toast } from "react-toastify";
export const API_URL = "http://localhost:8000";

//function for user login
export async function userLogin(data) {
  const datavalue = await axios
    .post(`${API_URL}/user/login`, data)
    .then((response) => {
      return response?.data ? response?.data : response?.response?.data;
    });
  return datavalue;
}

//function for admin login
export async function adminLogin(data) {
  console.log("user",data)
    const datavalue = await axios
      .post(`${API_URL}/admin/login`, data)
      .then((response) => {
        return response?.data ? response?.data : response?.response?.data;
      });
    return datavalue;
  }

  