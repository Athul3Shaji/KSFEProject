import axios from "axios";
// import { toast } from "react-toastify";
export const API_URL = "http://localhost:3000/";



export async function adminLogin(data) {
    const datavalue = await axios
      .post(`${API_URL}/admin`, data)
      .then((response) => {
        return response?.data ? response?.data : response?.response?.data;
      });
    return datavalue;
  }

  