<template>
  <div>
    <!-- BEGIN #header -->
    <div
      id="header"
      class="app-header"
      v-bind:class="{ 'app-header-inverse': appOptions.appHeaderInverse }"
    >
      <div class="d-flex flex-1 justify-content-between">
        <!-- BEGIN navbar-header -->
        <div class="navbar-header d-flex flex-1">
          <button
            type="button"
            class="navbar-mobile-toggler"
            v-on:click="toggleSidebarEndMobile"
            v-if="appOptions.appSidebarTwo"
          >
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>

          <button
            type="button"
            class="navbar-mobile-toggler"
            v-on:click="toggleTopMenuMobile"
            v-if="appOptions.appTopMenu && !appOptions.appSidebarNone"
          >
            <span class="fa-stack fa-lg text-inverse">
              <i class="far fa-square fa-stack-2x"></i>
              <i class="fa fa-cog fa-stack-1x"></i>
            </span>
          </button>
          <button
            type="button"
            class="navbar-mobile-toggler"
            v-on:click="toggleTopMenuMobile"
            v-if="appOptions.appTopMenu && appOptions.appSidebarNone"
          >
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <button
            type="button"
            class="navbar-mobile-toggler"
            v-on:click="toggleHeaderMegaMenuMobile"
            v-if="appOptions.appHeaderMegaMenu"
          >
            <span class="fa-stack fa-lg text-inverse m-t-2">
              <i class="far fa-square fa-stack-2x"></i>
              <i class="fa fa-cog fa-stack-1x"></i>
            </span>
          </button>
          <button
            type="button"
            class="navbar-mobile-toggler"
            v-on:click="toggleSidebarMobile"
            v-if="!appOptions.appSidebarNone"
          >
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link to="" class="navbar-brand">
            <div class="">
              <img
                src="/assets/logo/logo.png"
                width="80"
                height="35"
                crossOrigin="anonymous"
              />
            </div>
          </router-link>
        </div>
        <!-- END navbar-header -->

        <!-- BEGIN header-nav -->
        <div class="navbar-nav">
          <header-mega-menu
            v-if="appOptions.appHeaderMegaMenu"
          ></header-mega-menu>
          <!-- <div class="navbar-item navbar-form">
          <form action="" method="POST" name="search">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                placeholder="Enter keyword"
              />
              <button type="submit" class="btn btn-search">
                <i class="fa fa-search"></i>
              </button>
            </div>
          </form>
        </div> -->

          <!-- <b-nav-item-dropdown
          class="navbar-item"
          menu-class="dropdown-menu media-list"
          right
          toggle-class="navbar-link dropdown-toggle icon"
          no-caret
        >
          <template slot="button-content">
            <i class="fa fa-bell"></i>
            <span class="badge">5</span>
          </template>
          <div class="dropdown-header">NOTIFICATIONS (5)</div>
          <a href="javascript:;" class="dropdown-item media">
            <div class="media-left">
              <i class="fa fa-bug media-object bg-gray-500"></i>
            </div>
            <div class="media-body">
              <h6 class="media-heading">
                Server Error Reports
                <i class="fa fa-exclamation-circle text-danger"></i>
              </h6>
              <div class="text-muted fs-10px">3 minutes ago</div>
            </div>
          </a>
          <a href="javascript:;" class="dropdown-item media">
            <div class="media-left">
              <img
                src="/assets/img/user/user-1.jpg"
                class="media-object"
                alt=""
              />
              <i
                class="fab fa-facebook-messenger text-blue media-object-icon"
              ></i>
            </div>
            <div class="media-body">
              <h6 class="media-heading">John Smith</h6>
              <p>Quisque pulvinar tellus sit amet sem scelerisque tincidunt.</p>
              <div class="text-muted fs-10px">25 minutes ago</div>
            </div>
          </a>
          <a href="javascript:;" class="dropdown-item media">
            <div class="media-left">
              <img
                src="/assets/img/user/user-2.jpg"
                class="media-object"
                alt=""
              />
              <i
                class="fab fa-facebook-messenger text-blue media-object-icon"
              ></i>
            </div>
            <div class="media-body">
              <h6 class="media-heading">Olivia</h6>
              <p>Quisque pulvinar tellus sit amet sem scelerisque tincidunt.</p>
              <div class="text-muted fs-10px">35 minutes ago</div>
            </div>
          </a>
          <a href="javascript:;" class="dropdown-item media">
            <div class="media-left">
              <i class="fa fa-plus media-object bg-gray-500"></i>
            </div>
            <div class="media-body">
              <h6 class="media-heading">New User Registered</h6>
              <div class="text-muted fs-10px">1 hour ago</div>
            </div>
          </a>
          <a href="javascript:;" class="dropdown-item media">
            <div class="media-left">
              <i class="fa fa-envelope media-object bg-gray-500"></i>
              <i
                class="fab fa-google text-warning media-object-icon fs-14px"
              ></i>
            </div>
            <div class="media-body">
              <h6 class="media-heading">New Email From John</h6>
              <div class="text-muted fs-10px">2 hour ago</div>
            </div>
          </a>
          <div class="dropdown-footer text-center">
            <a href="javascript:;" class="text-decoration-none">View more</a>
          </div>
        </b-nav-item-dropdown> -->

          <b-nav-item-dropdown
            right
            menu-class="me-1"
            class="navbar-item navbar-user dropdown"
            toggle-class="navbar-link dropdown-toggle d-flex align-items-center"
            no-caret
          >
            <template slot="button-content">
              <div
                class="rounded-circle bg-primary w-30px h-30px me-2 text-white d-flex justify-content-center align-items-center"
              >
                {{ name.length > 0 ? name[0] : "U" }}
              </div>
              <span class="d-none d-md-inline">{{ name || "Usuário" }}</span>
              <b class="caret"></b>
            </template>

            <span>
              <a
                v-on:click="$router.push({ path: '/in/profile/edit' })"
                class="dropdown-item"
                >Editar usuário</a
              >
            </span>
            <div class="dropdown-divider"></div>
            <span>
              <a v-on:click="logout" class="dropdown-item">Sair</a>
            </span>
            <div class="dropdown-divider"></div>
          </b-nav-item-dropdown>
          <div
            class="navbar-divider d-none d-md-block"
            v-if="appOptions.appSidebarTwo"
          ></div>
          <div
            class="navbar-item d-none d-md-block"
            v-if="appOptions.appSidebarTwo"
          >
            <a
              href="javascript:;"
              v-on:click="toggleSidebarEnd"
              class="navbar-link icon"
            >
              <i class="fa fa-th"></i>
            </a>
          </div>
        </div>
        <!-- end header navigation right -->
      </div>
    </div>
    <!-- end #header -->
  </div>
</template>

<script>
import AppOptions from "../../config/AppOptions.vue";
import HeaderMegaMenu from "./HeaderMegaMenu.vue";

export default {
  name: "Header",
  components: {
    HeaderMegaMenu,
  },
  data() {
    return {
      name: "",
      lastName: "",
      appOptions: AppOptions,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.isAuthenticated;
    },
  },
  created() {
    if (this.loggedIn) {
      const { NomeUser } = this.$store.state.auth.user;
      this.name = NomeUser || "";
    }
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
        confirmButtonClass: "btn me-5px btn-" + "primary" + "",
        cancelButtonClass: "btn btn-default",
      });
    },

    toggleSidebarMobile() {
      this.appOptions.appSidebarMobileToggled =
        !this.appOptions.appSidebarMobileToggled;
    },
    toggleSidebarEnd() {
      this.appOptions.appSidebarEndToggled =
        !this.appOptions.appSidebarEndToggled;
    },
    toggleSidebarEndMobile() {
      this.appOptions.appSidebarEndMobileToggled =
        !this.appOptions.appSidebarEndMobileToggled;
    },
    toggleTopMenuMobile() {
      this.appOptions.appTopMenuMobileToggled =
        !this.appOptions.appTopMenuMobileToggled;
    },
    toggleHeaderMegaMenuMobile() {
      this.appOptions.appHeaderMegaMenuMobileToggled =
        !this.appOptions.appHeaderMegaMenuMobileToggled;
    },
    checkForm: function (e) {
      e.preventDefault();
      this.$router.push({ path: "/extra/search" });
    },
    async logout() {
      await this.$store.dispatch("auth/logout", this.data);
      this.$router.push({ path: "/" });
    },
  },
};
</script>
