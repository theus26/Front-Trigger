import axios from "axios";

const api = axios.create({
  baseURL: "https://disparador.dailsonsc.com",
});

export default api;
