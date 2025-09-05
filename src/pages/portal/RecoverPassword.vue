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

        <div class="w-300px">
          <form v-on:submit="recoverPassword" method="GET" class="fs-13px">
            <h4 class="text-center p-2">Recuperar acesso</h4>
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

            <div class="mb-10px pb-10px text-dark text-end">
              <router-link to="/login/recover-password/code" class="text-black"
                >Inserir código de acesso</router-link
              >
            </div>

            <div class="mb-15px d-flex justify-content-between gap-4">
              <b-button
                size="md"
                variant="outline-dark"
                type="button"
                @click="$router.push({ path: '/' })"
              >
                Voltar
              </b-button>
              <b-button
                size="md"
                :disabled="isLoading"
                type="submit"
                variant="dark"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Enviar
              </b-button>
            </div>
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
import validateEmail from "../../helpers/validateEmail";
import { api } from "@/config/api";

export default {
  name: "RecoverPasswordPage",
  data() {
    return {
      isLoading: false,
      data: {
        email: "",
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
        cancelButtonClass: "btn btn-danger",
      });
    },
    validateEmail: validateEmail,
    async recoverPassword(e) {
      e.preventDefault();

      const { email } = this.data;

      if (!validateEmail(email)) {
        this.alert("Preencha um e-mail válido!");
        return;
      }

      try {
        this.isLoading = true;
        await api.patch("portalPedido/SendEmailForgotPassword", {
          Usuario: this.data.email,
        });

        this.$swal({
          title: "Notificação",
          text: "Verifique seu e-mail para continuar com a recuperação de senha.",
          type: "warning",
          showCancelButton: false,
          buttonsStyling: false,
          confirmButtonText: "Fechar",
          cancelButtonText: "Cancelar",
          confirmButtonClass:
            "text-white btn me-5px" + " bg-dark" + " rounded w-150px",
          cancelButtonClass: "btn btn-danger",
        }).then(() => {
          this.$router.push({ path: "/login/recover-password/code" });
        });
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
