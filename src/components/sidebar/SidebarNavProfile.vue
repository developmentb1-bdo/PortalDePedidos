<template>
  <div class="menu">
    <div class="menu-profile">
      <a href="javascript:;" class="menu-profile-link" v-on:click="expand()">
        <div class="menu-profile-cover with-shadow"></div>
        <div class="menu-profile-image">
          <div
            class="rounded-circle bg-green w-30px h-30px me-2 text-white d-flex justify-content-center align-items-center"
          >
            {{ name[0] }}{{ lastname[0] }}
          </div>
        </div>
        <div class="menu-profile-info">
          <div class="d-flex align-items-center">
            <div class="flex-grow-1">{{ name }} {{ lastname }}</div>
            <div class="menu-caret ms-auto"></div>
          </div>
        </div>
      </a>
    </div>
    <div
      id="appSidebarProfileMenu"
      class="collapse"
      v-bind:class="{
        'd-block':
          this.stat == 'expand' && !this.appOptions.pageSidebarMinified,
        'd-none': this.stat == 'collapse',
      }"
    >
      <div class="menu-item pt-5px">
        <a href="javascript:;" class="menu-link">
          <div class="menu-icon"><i class="fa fa-cog"></i></div>
          <div class="menu-text">Settings</div>
        </a>
      </div>
      <div class="menu-item">
        <a href="javascript:;" class="menu-link">
          <div class="menu-icon"><i class="fa fa-pencil-alt"></i></div>
          <div class="menu-text">Send Feedback</div>
        </a>
      </div>
      <div class="menu-item pb-5px">
        <a href="javascript:;" class="menu-link">
          <div class="menu-icon"><i class="fa fa-question-circle"></i></div>
          <div class="menu-text">Helps</div>
        </a>
      </div>
      <div class="menu-divider m-0"></div>
    </div>
  </div>
</template>

<script>
import AppOptions from "../../config/AppOptions.vue";

export default {
  name: "SidebarNavProfile",
  data() {
    return {
      stat: "",
      name: "",
      lastname: "",
      appOptions: AppOptions,
    };
  },
  created() {
    this.name = this.$store.state.auth.user.name;
    this.lastname = this.$store.state.auth.user.middleName;
  },
  methods: {
    expand: function () {
      this.stat = this.stat == "expand" ? "collapse" : "expand";
    },
  },
};
</script>
