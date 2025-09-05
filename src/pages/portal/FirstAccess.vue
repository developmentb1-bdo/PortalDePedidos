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
          <form v-on:submit="checkForm" method="GET" class="fs-13px">
            <h4 class="text-center p-2">Primeiro Acesso</h4>
            <div class="mb-15px">
              <b-form-input
                size="lg"
                type="text"
                class="customInput"
                placeholder="E-mail"
                id="userField"
                v-model="data.email"
                disabled
              />
            </div>
            <div class="mb-15px">
              <b-form-input
                size="lg"
                type="password"
                class="customInput"
                placeholder="Senha antiga"
                id="oldPasswordField"
                v-model="data.oldPassword"
                :disabled="isLoading"
              />
            </div>
            <div class="mb-15px">
              <b-form-input
                size="lg"
                type="password"
                class="customInput"
                placeholder="Nova senha"
                id="newPasswordField"
                v-model="data.newPassword"
                :disabled="isLoading"
              />
            </div>
            <div class="mb-15px">
              <b-form-input
                size="lg"
                type="password"
                class="customInput"
                placeholder="Confirmar senha"
                id="confirmPasswordField"
                v-model="data.confirmPassword"
                :disabled="isLoading"
              />
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
                Alterar senha
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
import AppOptions from "@/config/AppOptions.vue";
import validatePassword from "@/helpers/validatePassword.js";
import { api } from "@/config/api";

const initState = () => {
  return {
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    cardCode: null,
    internalCode: null,
  };
};

export default {
  name: "FirstAccessPage",
  data() {
    return {
      isLoading: false,
      data: initState(),
    };
  },
  created() {
    AppOptions.appEmpty = true;

    const { Usuario, CardCode, InternalCode } = this.$store.state.auth.user;

    this.data.email = Usuario;
    (this.data.cardCode = CardCode), (this.data.internalCode = InternalCode);
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
    validatePassword: validatePassword,
    checkForm: async function (e) {
      e.preventDefault();

      const {
        email,
        oldPassword,
        newPassword,
        confirmPassword,
        internalCode,
        cardCode,
      } = this.data;
      const isValidPassword = this.validatePassword(newPassword);

      if (!email) {
        this.alert("Preencha o campo e-mail!");
        return;
      }
      if (!isValidPassword.isValid) {
        this.alert(isValidPassword.message);
        return;
      }
      if (newPassword == oldPassword) {
        this.alert("Sua senha deve ser diferente da senha atual.");
        return;
      }
      if (newPassword != confirmPassword) {
        this.alert("A nova senha não confere com a confirmação de senha.");
        return;
      }

      try {
        this.isLoading = true;
        await api.patch("portalPedido/FirstAcess", {
          CardCode: cardCode,
          InternalCode: internalCode,
          Usuario: email,
          SenhaOld: oldPassword,
          SenhaNew: newPassword,
          //Token: "27709d72-877a-11f0-c000-0200170339aa-139892668069760-3581",
        });
        this.$swal({
          title: "Notificação",
          text: "Primeiro Acesso realizado com sucesso. Faça o login novamente!",
          type: "warning",
          showCancelButton: false,
          buttonsStyling: false,
          confirmButtonText: "Fechar",
          cancelButtonText: "Cancelar",
          confirmButtonClass:
            "text-white btn me-5px" + " bg-dark" + " rounded w-150px",
          cancelButtonClass: "btn btn-danger",
        }).then(() => {
          this.$router.push({ path: "/" });
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
