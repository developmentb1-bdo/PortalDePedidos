import { api } from "@/config/api";

class AuthService {
  async login(data) {
    const { email, password } = data;
    try {
      const { data } = await api.post(`portalPedido/Login`, {
        Usuario: email,
        Senha: password,
      });

      const auth = {
        token: data.Token,
        LoginDate: new Date(),
        expiresAt: data.ExpSession,
        ...data.User[0],
      };
      return Promise.resolve(auth);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  logout() {
    localStorage.removeItem("@portal-pedidos");
  }
}

export default new AuthService();
