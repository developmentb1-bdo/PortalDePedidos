import axios from "axios";
import { HandleError } from "../handler/Errors";

function getToken() {
  let user = JSON.parse(localStorage.getItem("@portal-pedidos"));
  if (user && user.token) {
    return { Authorization: user.token };
  } else {
    return {};
  }
}

export const api = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API_ADM,
});

let abortControllers = [];

api.interceptors.request.use(
  (request) => {
    const controlller = new AbortController();
    request.signal = controlller.signal;
    abortControllers.push(controlller);

    return { ...request, headers: { ...request.headers, ...getToken() } };
  },
  (error) => {
    // Erro na requisição (antes de ser enviada)
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // se não houver erro, retorna normalmente
  (error) => {
    // Aqui você trata e altera o erro antes de propagar
    if (error.name === "CanceledError") {
      return Promise.reject({
        canceled: true,
        message: "request canceled",
      });
    }
    if (error.response) {
      // Exemplo: erro com status e mensagem da API
      const message = HandleError(error, null);
      return Promise.reject({
        status: error.response.status,
        message: message || "Erro desconhecido da API",
        original: error, // opcional: manter o erro original
      });
    } else if (error.request) {
      // Erro de conexão, sem resposta
      const message = HandleError(error, null);
      return Promise.reject({
        status: null,
        message: message,
        original: error,
      });
    } else {
      // Erro ao configurar a requisição
      const message = HandleError(error, null);
      return Promise.reject({
        status: null,
        message: message,
        original: error,
      });
    }
  }
);

export function cancelAllRequests() {
  abortControllers.forEach((c) => c.abort());
  abortControllers = [];
}
