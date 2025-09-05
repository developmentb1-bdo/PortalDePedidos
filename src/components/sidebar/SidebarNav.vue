<template>
  <!-- begin sidebar nav -->
  <div class="menu" v-if="menus">
    <div class="menu-search mb-n3" v-if="appOptions.appSidebarSearch">
      <input
        type="text"
        v-on:keyup="handleSidebarFilter"
        class="form-control"
        placeholder="Sidebar menu filter..."
      />
    </div>

    <div
      class="d-flex rounded fs-10px align-items-center justify-content-center mt-4 p-1 ms-2 me-2 mb- border border-gray-700"
    >
      <button
        class="text-red btn p-0"
        @click="openModalLogin"
        v-if="this.$store.state.auth.isAuthenticated && sessionTime <= 0"
      >
        Renovar Sessão
      </button>
      <span v-else class="text-gray-500 cursor-pointer" @click="openModalLogin"
        >Sessão expira em:
        <span
          :class="
            this.$store.state.auth.isAuthenticated
              ? sessionTime > 5
                ? 'text-gray-500'
                : 'text-red'
              : ''
          "
          >{{ sessionTime }} min</span
        ></span
      >
    </div>

    <div class="menu-header">Menu</div>
    <template v-for="menu in menus">
      <sidebar-nav-list
        ref="sidebarNavList"
        v-bind:menu="menu"
        v-bind:scrollTop="scrollTop"
        v-bind:key="menu.path"
        v-bind:status="menu.status"
        v-on:collapse-other="handleCollapseOther(menu)"
        v-on:show-float-submenu="handleShowFloatSubmenu"
        v-on:hide-float-submenu="handleHideFloatSubmenu"
      ></sidebar-nav-list>
    </template>

    <!-- BEGIN minify-button -->
    <div class="menu-item d-flex">
      <a
        href="javascript:;"
        class="app-sidebar-minify-btn ms-auto"
        v-on:click="handleSidebarMinify()"
        ><i class="fa fa-angle-double-left"></i
      ></a>
    </div>
    <!-- END minify-button -->
    <LoginModal @restartSession="restartSession" />
  </div>
  <!-- end sidebar nav -->
</template>

<script>
import SidebarMenu from "./SidebarMenu.vue";
import SidebarNavList from "./SidebarNavList.vue";
import AppOptions from "../../config/AppOptions.vue";
import LoginModal from "@/modals/LoginModal.vue";

export default {
  name: "SidebarNav",
  props: ["scrollTop"],
  components: {
    SidebarNavList,
    LoginModal,
  },
  data() {
    return {
      menus: SidebarMenu,
      appOptions: AppOptions,
      sessionId: null,
      sessionTime: this.handleStartSessionTime(),
    };
  },
  created() {},
  mounted() {
    this.checkSessiontime();
  },
  computed: {},

  methods: {
    openModalLogin() {
      this.$bvModal.show("modalLogin");
    },
    restartSession() {
      this.sessionTime = this.handleStartSessionTime();
      this.handleSessionTime();
    },
    handleStartSessionTime() {
      if (this.$store.state.auth.isAuthenticated) {
        const agora = new Date().getTime();
        let diff =
          (agora - new Date(this.$store.state.auth.user.LoginDate).getTime()) /
          1000;
        diff /= 60;

        diff = Math.abs(Math.round(diff)) + 1;

        return this.$store.state.auth.user.expiresAt - diff;
      } else {
        return 0;
      }
    },
    checkSessiontime() {
      if (this.$store.state.auth.isAuthenticated) {
        const agora = new Date().getTime();
        let diff =
          (agora - new Date(this.$store.state.auth.user.LoginDate).getTime()) /
          1000;
        diff /= 60;
        diff = Math.abs(Math.round(diff)) + 1;

        const sessionTime = this.$store.state.auth.user.expiresAt - diff;

        if (sessionTime < 1) {
          this.sessionTime = 0;
          this.$bvModal.show("modalLogin");
        } else {
          this.handleSessionTime();
        }
      }
    },
    handleSessionTime() {
      const sessionTimeArray = JSON.parse(localStorage.getItem("@intervalIds"));
      if (sessionTimeArray) {
        sessionTimeArray.map((session) => clearInterval(session));
        localStorage.removeItem("@intervalIds");
      }

      this.sessionId = setInterval(() => {
        if (this.$store.state.auth.isAuthenticated) {
          const agora = new Date().getTime();
          let diff =
            (agora -
              new Date(this.$store.state.auth.user.LoginDate).getTime()) /
            1000;
          diff /= 60;

          diff = Math.abs(Math.round(diff));
          this.sessionTime = this.$store.state.auth.user.expiresAt - diff - 1;

          if (this.sessionTime <= 0) {
            this.sessionTime = 0;
            clearInterval(this.sessionId);
            this.$bvModal.show("modalLogin");
          }
        } else {
          const sessionTimeArray = JSON.parse(
            localStorage.getItem("@intervalIds")
          );
          if (sessionTimeArray) {
            sessionTimeArray.map((session) => clearInterval(session));
            localStorage.removeItem("@intervalIds");
          }
        }
      }, 60000);

      //CHECK INTERVALS
      let ids = JSON.parse(localStorage.getItem("@intervalIds"));
      let intervalIds = ids ? [...ids, this.sessionId] : [this.sessionId];
      localStorage.setItem("@intervalIds", JSON.stringify(intervalIds));
    },
    handleShowFloatSubmenu: function (menu, offset) {
      this.$emit("show-float-submenu", menu, offset);
    },
    handleHideFloatSubmenu: function () {
      this.$emit("hide-float-submenu");
    },
    handleCollapseOther: function (menu) {
      for (var i = 0; i < this.menus.length; i++) {
        this.$refs.sidebarNavList[i].collapse(menu);
      }
    },
    handleSidebarMinify: function () {
      this.appOptions.appSidebarMinified = !this.appOptions.appSidebarMinified;
    },
    handleSidebarFilter: function (e) {
      var value = e.target.value;
      value = value.toLowerCase();

      if (value) {
        for (var x = 0; x < this.menus.length; x++) {
          var title = this.menus[x].title.toLowerCase();
          var children = this.menus[x].children;

          if (title.search(value) > -1) {
            this.$refs.sidebarNavList[x].show();

            if (children) {
              this.$refs.sidebarNavList[x].searchExpand();
            }
          } else {
            if (children) {
              var hasActive = false;
              for (var y = 0; y < children.length; y++) {
                var title2 = children[y].title.toLowerCase();

                if (title2.search(value) > -1) {
                  hasActive = true;
                  this.$refs.sidebarNavList[x].$refs.sidebarNavList[y].show();
                  this.$refs.sidebarNavList[x].searchExpand();
                } else {
                  if (hasActive) {
                    this.$refs.sidebarNavList[x].searchExpand();
                  } else {
                    this.$refs.sidebarNavList[x].hide();
                  }
                  this.$refs.sidebarNavList[x].$refs.sidebarNavList[y].hide();
                }
              }
            } else {
              this.$refs.sidebarNavList[x].hide();
            }
          }
        }
      } else {
        for (var a = 0; a < this.menus.length; a++) {
          this.$refs.sidebarNavList[a].show();

          var submenu = this.menus[a].children;
          if (submenu) {
            for (var b = 0; b < submenu.length; b++) {
              this.$refs.sidebarNavList[a].$refs.sidebarNavList[b].show();
            }
          }
        }
      }
      console.log("------");
    },
  },
  watch: {},
};
</script>
