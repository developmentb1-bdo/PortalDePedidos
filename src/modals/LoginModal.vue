<template>
  <!-- BEGIN #modalLogin -->
  <b-modal
    no-close-on-esc
    no-close-on-backdrop
    id="modalLogin"
    size="sm"
    centered
    title="Renovar Sessão"
    hide-header-close
    hide-footer
    @show="onShow"
    @hide="onHide"
    ok-title="Renovar Sessão"
  >
    <form v-on:submit="handleSession">
      <div class="form-floating mb-15px">
        <input
          v-model="form.UserName"
          v-on:input="setIsErrorVisible"
          type="text"
          class="form-control h-45px fs-13px"
          placeholder="Email Address"
        />
        <label
          for="UserName"
          class="d-flex align-items-center fs-13px text-gray-600"
          >Usuário</label
        >
      </div>
      <div class="form-floating mb-15px">
        <input
          v-model="form.Password"
          v-on:input="setIsErrorVisible"
          type="Password"
          class="form-control h-45px fs-13px"
          placeholder="Senha"
        />
        <label
          for="Password"
          class="d-flex align-items-center fs-13px text-gray-600"
          >Senha</label
        >
      </div>
      <div
        v-if="hasError"
        class="d-flex-1 h-auto mb-2 bg-danger rounded"
        style="min-height: 35px"
      >
        <label class="fs-13px text-white-600 ps-3">{{ errorMsg }} </label>
      </div>
      <div class="d-flex justify-content-end">
        <b-button
          type="submit"
          variant="dark"
          class="mt-1"
          block
          :disabled="isLoading"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span v-else>Renovar Sessão</span>
        </b-button>
      </div>
    </form>
  </b-modal>
</template>

<script>
export default {
  name: "LoginModal",
  data() {
    return {
      isLoading: false,
      hasError: false,
      errorMsg: "",
      form: {
        UserName: "",
        Password: "",
      },
    };
  },
  created() {},
  methods: {
    onShow() {
      if (this.getUser()) {
        this.form.UserName = this.$store.state.auth.user.Usuario;
      } else {
        this.form.UserName = "";
        this.form.Password = "";
      }
    },
    onHide() {
      this.form.UserName = "";
      this.form.Password = "";
    },
    getUser() {
      if (
        this.$store.state.auth.isAuthenticated &&
        this.$store.state.auth.user.Usuario
      ) {
        return true;
      } else {
        return false;
      }
    },
    setIsErrorVisible() {
      this.hasError = false;
    },
    async handleSession(e) {
      e.preventDefault();
      if (this.form.UserName.trim() == "" || this.form.Password.trim() == "") {
        this.hasError = true;
        this.errorMsg = "Você precisa inserir um e-mail e senha.";
        return;
      }

      try {
        this.isLoading = true;
        this.hasError = false;
        await this.$store.dispatch("auth/login", {
          email: this.form.UserName,
          password: this.form.Password,
        });
        this.$emit("restartSession");
        this.$bvModal.hide("modalLogin");
      } catch (error) {
        this.errorMsg = error.message;
        this.hasError = true;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
