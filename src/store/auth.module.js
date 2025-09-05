import AuthService from "../services/AuthService";

const user = JSON.parse(localStorage.getItem("@portal-pedidos"));

const authenticateState = user
  ? { isAuthenticated: user.U_FirstAcess == "Y" ? false : true, user }
  : { isAuthenticated: false, user: null };

export const auth = {
  namespaced: true,
  state: authenticateState,
  mutations: {
    loginSuccess(state, user) {
      state.isAuthenticated = user.U_FirstAcess == "Y" ? false : true;
      state.user = user;
    },
    loginFailure(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  actions: {
    login({ commit }, data) {
      return AuthService.login(data).then(
        (resp) => {
          localStorage.setItem("@portal-pedidos", JSON.stringify(resp));
          commit("loginSuccess", resp);
          return Promise.resolve({
            message: "Login efetuado com sucesso",
            data: resp,
          });
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },
  },
};
