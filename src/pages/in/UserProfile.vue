<template>
  <div>
    <!-- BEGIN page-header -->
    <div class="d-flex justify-content-between">
      <h1 class="page-header">Perfil do Usuário</h1>
    </div>
    <!-- END page-header -->

    <div>
      <panel title="Perfil" noButton="true">
        <fieldset>
          <form v-on:submit="changePassword" method="GET" class="row">
            <div class="form-group col-md-6 col-12">
              <label class="col-md-12 col-form-label">Nome</label>
              <div class="col-md-12">
                <input
                  type="text"
                  disabled
                  class="form-control"
                  id="nameInput"
                  v-model="name"
                />
              </div>
            </div>
            <div class="form-group col-md-6 col-12">
              <label class="col-md-12 col-form-label">E-mail</label>
              <div class="col-md-12">
                <input
                  type="text"
                  disabled
                  class="form-control"
                  id="emailInput"
                  v-model="email"
                />
              </div>
            </div>
            <div class="form-group col-md-6 col-12">
              <label class="col-md-12 col-form-label">Senha antiga</label>
              <div class="col-md-12">
                <input
                  type="password"
                  :disabled="isLoading"
                  class="form-control"
                  id="oldPasswordInput"
                  v-model="data.oldPassword"
                />
              </div>
            </div>
            <div class="form-group col-md-6 col-12">
              <label class="col-md-12 col-form-label">Senha nova</label>
              <div class="col-md-12">
                <input
                  type="password"
                  :disabled="isLoading"
                  class="form-control"
                  id="newPasswordInput"
                  v-model="data.newPassword"
                />
              </div>
            </div>
            <div class="form-group col-md-6 col-12">
              <label class="col-md-12 col-form-label">Confirmar senha</label>
              <div class="col-md-12">
                <input
                  type="password"
                  :disabled="isLoading"
                  class="form-control"
                  id="confirmPasswordInput"
                  v-model="data.confirmPassword"
                />
              </div>
            </div>

            <div class="form-group col-12 d-flex py-4 justify-content-end">
              <b-button
                size="md"
                variant="dark"
                type="submit"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Alterar senha</b-button
              >
            </div>
          </form>
        </fieldset>
      </panel>
    </div>
  </div>
</template>

<script>
import { api } from "@/config/api";
import validatePassword from "@/helpers/validatePassword.js";

const initState = () => {
  return {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
};

export default {
  name: "UserProfilePage",
  props: [],
  components: {},
  data() {
    return {
      isLoading: false,
      name: "",
      email: "",
      data: initState(),
    };
  },
  async created() {
    const { NomeUser, Usuario } = this.$store.state.auth.user;
    this.name = NomeUser;
    this.email = Usuario;
  },
  computed: {},
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
        confirmButtonClass: "btn me-5px btn-" + "dark" + "",
        cancelButtonClass: "btn btn-danger",
      });
    },
    validatePassword: validatePassword,
    async changePassword(e) {
      e.preventDefault();

      const isValidPassword = this.validatePassword(this.data.newPassword);

      if (!isValidPassword.isValid) {
        this.alert(isValidPassword.message);
        return;
      }
      if (this.data.newPassword == this.data.oldPassword) {
        this.alert("Sua senha deve ser diferente da senha atual.");
        return;
      }
      if (this.data.newPassword != this.data.confirmPassword) {
        this.alert("A nova senha não confere com a confirmação de senha.");
        return;
      }

      try {
        this.isLoading = true;
        await api.patch("portalPedido/ChangePassword", {
          Usuario: this.email,
          SenhaOld: this.data.oldPassword,
          SenhaNew: this.data.newPassword,
        });

        this.alert("Senha alterada com sucesso!");
        this.data = initState();
      } catch (error) {
        if (!error.canceled) {
          this.alert(
            error.message ||
              "Erro ao alterar senha. Tente novamente ou entre em contato com o suporte."
          );
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
