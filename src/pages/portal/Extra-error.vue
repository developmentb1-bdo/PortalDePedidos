<template>
  <!-- BEGIN error -->
  <div class="error">
    <div class="error-code">404</div>
    <div class="error-content">
      <div class="error-message">Página não encontrada...</div>
      <div class="error-desc mb-4">
        A página que você está procurando não existe. <br />
      </div>
      <div>
        <router-link to="/" class="btn btn-success px-3"
          >Ir para o login</router-link
        >
      </div>
    </div>
  </div>
  <!-- END error -->
</template>

<script>
import AppOptions from "../config/AppOptions.vue";

export default {
  created() {
    AppOptions.appEmpty = true;
  },
  beforeRouteLeave(to, from, next) {
    AppOptions.appEmpty = false;
    next();
  },
};
</script>
