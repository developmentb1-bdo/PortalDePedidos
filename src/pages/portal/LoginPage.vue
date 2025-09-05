<template>
  <!-- BEGIN login -->
  <div
    class="d-flex flex-column min-vh-100 justify-content-center align-items-center"
    style="background: linear-gradient(to bottom, #014779 50%, #e1e1e1 50%)"
  >
    <!-- Fundo laranja, agora com z-0 -->
    <!-- <div class="bg-orange-600 w-100 h-50 position-absolute top-0 z-0"></div> -->

    <!-- Header -->

    <!-- END header -->
    <!-- BEGIN login-container -->
    <div class="flex-1 d-flex justify-content-center align-items-center">
      <div
        class="border border-2 shadow border-gray-200 rounded-4 p-4 d-flex gap-4 flex-column bg-gray-100"
      >
        <div class="text-center">
          <img src="/assets/logo/logo.png" width="180" height="60" />
        </div>

        <div class="" style="min-width: 300px">
          <form v-on:submit="handleLogin" method="POST" class="">
            <div class="mb-15px">
              <b-form-input
                size="lg"
                type="text"
                class="customInput"
                placeholder="E-mail"
                id="userField"
                v-model="data.email"
                :disabled="isLoading"
              />
            </div>
            <div class="mb-15px">
              <b-form-input
                size="lg"
                type="password"
                class="customInput"
                placeholder="Senha"
                id="passwordField"
                v-model="data.password"
                :disabled="isLoading"
              />
            </div>

            <div class="mb-15px d-flex">
              <b-button
                class="w-100"
                size="lg"
                variant="dark"
                :disabled="isLoading"
                type="submit"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Entrar
              </b-button>
            </div>
            <div class="mb-10px pb-10px text-dark text-end">
              <router-link to="/login/recover-password" class="text-black"
                >Esqueci minha senha</router-link
              >
            </div>
            <hr class="bg-gray-600 opacity-2" />
          </form>
        </div>
      </div>
    </div>
    <!-- END login-container -->
  </div>
  <!-- END login -->
</template>

<script>
import AppOptions from "../../config/AppOptions.vue";

export default {
  data() {
    return {
      isLoading: false,

      data: {
        email: "",
        password: "",
      },
    };
  },
  created() {
    AppOptions.appEmpty = true;
  },
  beforeRouteLeave(to, from, next) {
    AppOptions.appEmpty = false;
    next();
  },
  methods: {
    alert(msg) {
      this.$swal({
        title: "Notificação",
        text: msg,
        type: "warning",
        showCancelButton: false,
        buttonsStyling: false,
        confirmButtonText: "Fechar",
        cancelButtonText: "Cancelar",
        confirmButtonClass:
          "text-white btn me-5px" + " bg-dark" + " rounded w-150px",
        cancelButtonClass: "btn btn-default",
      });
    },
    handleLogin: async function (e) {
      e.preventDefault();

      const { email, password } = this.data;

      if (!email || !password) {
        this.alert("Preencha os dados de login");
        return;
      }

      try {
        this.isLoading = true;
        const { data } = await this.$store.dispatch("auth/login", {
          email,
          password,
        });

        if (data.U_FirstAcess == "Y") {
          this.$router.push({ path: "/login/first-access" });
        } else {
          this.$router.push({ path: "/in/orders/register" });
        }
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.customInput:focus {
  outline: none;
  box-shadow: none;
  border-color: #014779;
}
</style>
