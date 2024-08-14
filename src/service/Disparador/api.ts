import axios from "axios";

const api = axios.create({
  baseURL: "https://n8n.chatking.com.br/webhook/disparador",
});

export default api;
