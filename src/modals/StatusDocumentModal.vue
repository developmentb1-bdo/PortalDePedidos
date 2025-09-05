<!-- usage:    <StatusDocumentModal @addSelected="addSelected" /> -->

<template>
  <b-modal
    no-close-on-esc
    no-close-on-backdrop
    :hide-header="true"
    :hide-footer="true"
    @show="onShow"
    @hide="onHide"
    size="lg"
    id="StatusDocumentModal"
  >
    <div class="title">
      <strong class="fs-18px">Status do Documento</strong>
    </div>
    <hr />

    <div
      class="d-flex flex-row justify-content-end mb-2 rounded p-1"
      style="background-color: #ebebeb"
    >
      <div class="d-flex flex-row justify-content-between me-2">
        <b-form-input
          class="me-2"
          placeholder="nome"
          v-model="data.name"
          :disabled="data.isLoadingData"
        />
        <button
          class="btn btn-inverse"
          :disabled="data.isLoadingData"
          @click="searchByName"
        >
          Buscar
        </button>
      </div>
      <div class="d-flex flex-row justify-content-between">
        <b-form-input
          class="me-2"
          placeholder="código"
          v-model="data.code"
          :disabled="data.isLoadingData"
        />
        <button
          class="btn btn-inverse"
          :disabled="data.isLoadingData"
          @click="searchByCode"
        >
          Buscar
        </button>
      </div>
    </div>
    <div id="tableScroll" style="max-height: 300px; overflow-y: scroll">
      <b-table
        :items="data.items"
        :fields="fields"
        :select-mode="selectMode"
        :busy="data.isLoadingData"
        responsive="sm"
        ref="selectableTable"
        selectable
        @row-selected="onRowSelected"
        @row-dblclicked="onDblClicked"
        thClass="w-20px"
        tdClass="w-20px"
        show-empty
      >
        <template #empty>
          <h6 class="d-flex justify-content-center align-items-center mt-2">
            <span><strong>Nenhuma informação encontrada.</strong></span>
          </h6>
        </template>
        <template #table-busy>
          <div class="text-center text-reverse my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong> Carregando dados...</strong>
          </div>
        </template>
        <template #cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <span aria-hidden="true">&check;</span>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <span aria-hidden="true">&nbsp;</span>
            <span class="sr-only">Not selected</span>
          </template>
        </template>
      </b-table>
    </div>

    <div class="mt-4">
      <div class="d-inline-flex form-group col-12 justify-content-end">
        <div class="col-auto">
          <button
            @click="previousPage"
            :disabled="data.skip == 0 || data.isLoadingData"
            class="btn btn-primary me-2"
          >
            Anterior
          </button>
        </div>
        <div class="col-auto">
          <button
            @click="nextPage"
            class="btn btn-primary"
            :disabled="data.disabledNextPage || data.isLoadingData"
          >
            Próxima
          </button>
        </div>
      </div>
      <div class="row form-group col-md-12 col-12 mt-4">
        <div class="col-auto">
          <button
            class="btn btn-inverse"
            @click="addSelected"
            :disabled="this.data.selected.length == 0"
          >
            Adicionar
          </button>
        </div>
        <div class="col-auto">
          <button class="btn btn-default" @click="onCancelModal">
            Cancelar
          </button>
        </div>
        <div class="col-auto">
          <button
            class="btn btn-warning"
            @click="onShow"
            :disabled="data.isLoadingData"
          >
            Recarregar
          </button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { api, cancelAllRequests } from "@/config/api";
import AuthService from "../../../services/AuthService";
import { HandleError } from "../../../handler/HandleError";

const initDataState = () => {
  return {
    selected: [],
    items: [],
    isLoadingData: false,
    skip: 0,
    disabledNextPage: true,
    code: "",
    name: "",
    searchType: "",
    filter: {
      code: "",
      name: "",
    },
  };
};

export default {
  props: ["company"],
  data() {
    return {
      data: initDataState(),
      fields: [
        {
          key: "selected",
          label: "",
          thClass: "w-30px text-center",
          tdClass: "w-30px text-center",
        },
        {
          key: "Code",
          label: "Código",
        },
        { key: "Name", label: "Descrição" },
      ],
      selectMode: "single",
    };
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
    addSelected() {
      this.$emit("addSelected", this.data.selected[0]);
      this.$bvModal.hide("StatusDocumentModal");
    },
    onDblClicked(item) {
      this.$emit("addSelected", item);
      this.$bvModal.hide("StatusDocumentModal");
    },
    onHide() {
      cancelAllRequests();
      this.data = initDataState();
    },
    onCancelModal() {
      this.$bvModal.hide("StatusDocumentModal");
    },
    onRowSelected(items) {
      this.data.selected = items;
    },
    scrollUp() {
      const scroll = document.getElementById("tableScroll");
      if (scroll) {
        document.getElementById("tableScroll").scroll(0, 0);
      }
    },
    async onShow() {
      this.data = initDataState();
      const isTokenValid = await AuthService.tokenValidation();
      if (isTokenValid) {
        try {
          this.data.isLoadingData = true;
          await api
            .get(
              `/ecosystem/getStatusDocument?cnpj=${this.$store.state.company.company.Cnpj}&skip=${this.data.skip}`
            )
            .then((res) => {
              if (res.data["odata.nextLink"] || res.data["@odata.nextLink"]) {
                this.disabledNextPage = false;
              } else {
                this.disabledNextPage = true;
              }

              this.data.items = res.data.value;
              this.scrollUp();
            });
        } catch (error) {
          const msg = HandleError(
            error,
            "Erro ao buscar informações. Tente novamente ou entre em contato com o suporte"
          );
          this.alert(msg);
        } finally {
          this.data.isLoadingData = false;
        }
      } else {
        this.$bvModal.show("modalLogin");
      }
    },
    async searchByName() {
      if (this.data.name == "") {
        this.alert("Preencha o nome");
        return;
      }
      const isTokenValid = await AuthService.tokenValidation();
      if (isTokenValid) {
        try {
          this.data.isLoadingData = true;
          await api
            .get(
              `/ecosystem/getStatusDocument?cnpj=${
                this.$store.state.company.company.Cnpj
              }&name=${this.data.name}&skip=${0}`
            )
            .then((res) => {
              if (res.data["odata.nextLink"] || res.data["@odata.nextLink"]) {
                this.data.disabledNextPage = false;
              } else {
                this.data.disabledNextPage = true;
              }
              this.data.items = res.data.value;
              this.data.skip = 0;
              this.data.searchType = "name";
              this.data.filter = {
                code: "",
                name: this.data.name,
              };
              this.scrollUp();
            });
        } catch (error) {
          const msg = HandleError(
            error,
            "Erro ao buscar informações. Tente novamente ou entre em contato com o suporte"
          );
          this.alert(msg);
        } finally {
          this.data.isLoadingData = false;
        }
      } else {
        this.$bvModal.show("modalLogin");
      }
    },
    async searchByCode() {
      if (this.data.code == "") {
        this.alert("Preencha o código");
        return;
      }
      const isTokenValid = await AuthService.tokenValidation();
      if (isTokenValid) {
        try {
          this.data.isLoadingData = true;

          await api
            .get(
              `/ecosystem/getStatusDocumentSpecific?cnpj=${this.$store.state.company.company.Cnpj}&code=${this.data.code}`
            )
            .then((res) => {
              if (res.data["odata.nextLink"] || res.data["@odata.nextLink"]) {
                this.data.disabledNextPage = false;
              } else {
                this.data.disabledNextPage = true;
              }
              this.data.items = [res.data];
              this.data.skip = 0;
              this.data.searchType = "code";
              this.data.filter = {
                code: this.data.code,
                name: "",
              };
            });
        } catch (err) {
          console.log(err);
          this.data.items = [];
          const msg = HandleError(err, "Código não encontrado.");
          this.alert(msg);
        } finally {
          this.data.isLoadingData = false;
        }
      } else {
        this.$bvModal.show("modalLogin");
      }
    },
    async nextPage() {
      const isTokenValid = await AuthService.tokenValidation();
      if (isTokenValid) {
        try {
          this.data.isLoadingData = true;
          let url = "";

          if (this.data.searchType === "code") {
            url = `/ecosystem/getStatusDocumentSpecific?cnpj=${
              this.$store.state.company.company.Cnpj
            }&code=${this.data.filter.code}&skip=${this.data.skip + 20}`;
          } else if (this.data.searchType === "name") {
            url = `/ecosystem/getStatusDocument?cnpj=${
              this.$store.state.company.company.Cnpj
            }&name=${this.data.filter.name}&skip=${this.data.skip + 20}`;
          } else {
            url = `/ecosystem/getStatusDocument?cnpj=${
              this.$store.state.company.company.Cnpj
            }&skip=${this.data.skip + 20}`;
          }
          await api.get(url).then((res) => {
            if (res.data["odata.nextLink"] || res.data["@odata.nextLink"]) {
              this.data.disabledNextPage = false;
            } else {
              this.data.disabledNextPage = true;
            }
            this.data.skip = this.data.skip + 20;
            this.data.items = res.data.value;
            this.scrollUp();
          });
        } catch (error) {
          const msg = HandleError(
            error,
            "Erro ao buscar informações. Tente novamente ou entre em contato com o suporte"
          );
          this.alert(msg);
        } finally {
          this.data.isLoadingData = false;
        }
      } else {
        this.$bvModal.show("modalLogin");
      }
    },
    async previousPage() {
      const isTokenValid = await AuthService.tokenValidation();
      if (isTokenValid) {
        try {
          this.data.isLoadingData = true;
          let url = "";
          if (this.data.searchType === "code") {
            url = `/ecosystem/getStatusDocumentSpecific?cnpj=${
              this.$store.state.company.company.Cnpj
            }&code=${this.data.filter.code}&skip=${this.data.skip - 20}`;
          } else if (this.data.searchType === "name") {
            url = `/ecosystem/getStatusDocument?cnpj=${
              this.$store.state.company.company.Cnpj
            }&name=${this.data.filter.name}&skip=${this.data.skip - 20}`;
          } else {
            url = `/ecosystem/getStatusDocument?cnpj=${
              this.$store.state.company.company.Cnpj
            }&skip=${this.data.skip - 20}`;
          }

          await api.get(url).then((res) => {
            this.data.skip = this.data.skip - 20;
            this.data.disabledNextPage = false;
            this.data.items = res.data.value;
            this.scrollUp();
          });
        } catch (error) {
          const msg = HandleError(
            error,
            "Erro ao buscar informações. Tente novamente ou entre em contato com o suporte"
          );
          this.alert(msg);
        } finally {
          this.data.isLoadingData = false;
        }
      } else {
        this.$bvModal.show("modalLogin");
      }
    },
  },
};
</script>

<style>
.tdCss {
  width: 150px;
}
</style>

<!-- usage:    <StatusDocumentModal :company="company" @addSelected="addSelected" />
  
  <template>
    <b-modal
      :hide-header="true"
      :hide-footer="true"
      @show="onShow"
      @hide="onHide"
      size="lg"
      id="StatusDocumentModal"
    >
      <div class="title">
        <strong class="fs-18px">Status do Documento</strong>
      </div>
  
      <hr />
  
      <div id="tableScroll" style="max-height: 300px; overflow-y: scroll">
        <b-table
          :items="items"
          :fields="fields"
          :select-mode="selectMode"
          :busy="isLoadingData"
          responsive="sm"
          ref="selectableTable"
          selectable
          @row-selected="onRowSelected"
          @row-dblclicked="onDblClicked"
          thClass="w-20px"
          tdClass="w-20px"
        >
          <template #table-busy>
            <div class="text-center text-reverse my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong> Carregando dados...</strong>
            </div>
          </template>
  
          <template #cell(selected)="{ rowSelected }">
            <template v-if="rowSelected">
              <span aria-hidden="true">&check;</span>
              <span class="sr-only">Selected</span>
            </template>
            <template v-else>
              <span aria-hidden="true">&nbsp;</span>
              <span class="sr-only">Not selected</span>
            </template>
          </template>
        </b-table>
      </div>
  
      <div
        v-if="onError"
        class="d-flex flex-1 flex-column justify-content-center align-items-center h-100px"
      >
        <strong>Falha ao carregar dados. Tente Novamente</strong>
      </div>
      <div
        v-if="
          Array.isArray(items) && items.length === 0 && !isLoadingData && !onError
        "
        class="d-flex flex-1 flex-column justify-content-center align-items-center h-100px"
      >
        <strong>Nenhum status encontrado.</strong>
      </div>
  
      <div class="row mt-4">
        <div class="flex-1 mb-4">
          <button
            class="btn btn-inverse me-2"
            @click="addSelected"
            :disabled="this.selected.length == 0"
          >
            Adicionar
          </button>
          <button class="btn btn-default" @click="onCancelModal">Cancelar</button>
          <button
            class="btn btn-warning ms-2"
            @click="onShow"
            :disabled="isLoadingData || isLoading"
          >
            Recarregar
          </button>
        </div>
        <div class="flex-1 mb-4 d-flex justify-content-end">
          <button
            @click="previousPage"
            :disabled="currentSkip == 0 || isLoading"
            class="btn btn-default me-2"
          >
            Anterior
          </button>
          <button
            @click="nextPage"
            class="btn btn-primary"
            :disabled="isLoading || disabledNextPage"
          >
            Próxima
          </button>
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm me-2 mt-2 ms-2"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
      </div>
    </b-modal>
  </template>
  
  <script>
  import { api } from "../../../config/api";
  import AuthService from "../../../services/AuthService";
  import AuthHeader from "../../../services/AuthHeader";
  
  export default {
    props: ["company"],
    data() {
      return {
        onError: false,
        isLoadingData: false,
        currentSkip: 0,
        disabledNextPage: true,
        isLoading: false,
        code: "",
        searchName: "",
        fields: [
          {
            key: "selected",
            label: "",
            thClass: "w-30px text-center",
            tdClass: "w-30px text-center",
          },
          {
            key: "Code",
            label: "Código",
          },
          { key: "Name", label: "Descrição" },
        ],
        items: [],
        selectMode: "single",
        selected: [],
      };
    },
    methods: {
      addSelected() {
        this.$emit("addSelected", this.selected[0]);
        this.selected = [];
        this.currentSkip = 0;
        this.items = [];
        this.$bvModal.hide("StatusDocumentModal");
      },
      onDblClicked(item) {
        this.$emit("addSelected", item);
        this.selected = [];
        this.currentSkip = 0;
        this.items = [];
        this.$bvModal.hide("StatusDocumentModal");
      },
      onHide() {
        this.code = "";
        this.isLoadingData = false;
        this.currentSkip = 0;
        this.disabledNextPage = false;
        this.isLoading = false;
        this.items = [];
        this.selected = [];
        this.code = "";
        this.searchName = "";
        this.onError = false;
      },
      async onShow() {
        this.onError = false;
        this.disabledNextPage = true;
        this.code = "";
        this.searchName = "";
        const isTokenValid = await AuthService.tokenValidation();
        if (isTokenValid) {
          try {
            this.isLoadingData = true;
            await api
              .get(
                `/ecosystem/getStatusDocument?cnpj=${this.company}&skip=${this.currentSkip}`,
                {
                  headers: AuthHeader(),
                }
              )
              .then((res) => {
                if (res.data["odata.nextLink"] || res.data["@odata.nextLink"]) {
                  this.disabledNextPage = false;
                } else {
                  this.disabledNextPage = true;
                }
  
                this.items = res.data.value;
                document.getElementById("tableScroll").scroll(0, 0);
              });
          } catch (err) {
            this.onError = true;
            this.items = [];
            console.log(err);
          } finally {
            this.isLoadingData = false;
          }
        } else {
          this.$bvModal.show("modalLogin");
        }
      },
      async searchByName() {
        if (this.searchName == "") {
          return;
        }
        const isTokenValid = await AuthService.tokenValidation();
        if (isTokenValid) {
          try {
            this.isLoadingData = true;
            this.onError = false;
            await api
              .get(
                `/ecosystem/getCenterName?cnpj=${this.company}&centerName=${this.searchName}`,
                {
                  headers: AuthHeader(),
                }
              )
              .then((res) => {
                this.items = res.data.value;
                document.getElementById("tableScroll").scroll(0, 0);
              });
          } catch (err) {
            this.items = [];
            this.onError = true;
            console.log(err);
          } finally {
            this.isLoadingData = false;
          }
        } else {
          this.$bvModal.show("modalLogin");
        }
      },
      async searchByCode() {
        if (this.code == "") {
          return;
        }
  
        const isTokenValid = await AuthService.tokenValidation();
        if (isTokenValid) {
          try {
            this.isLoadingData = true;
            this.onError = false;
            await api
              .get(
                `/ecosystem/getCenterCode?cnpj=${this.company}&centerCode=${this.code}`,
                {
                  headers: AuthHeader(),
                }
              )
              .then((res) => {
                this.disabledNextPage = true;
  
                this.items = res.data.value;
                document.getElementById("tableScroll").scroll(0, 0);
              });
          } catch (err) {
            this.onError = true;
            this.items = [];
            console.log(err);
          } finally {
            this.isLoadingData = false;
          }
        } else {
          this.$bvModal.show("modalLogin");
        }
      },
      onRowSelected(items) {
        this.selected = items;
      },
      onCancelModal() {
        this.selected = [];
        this.currentSkip = 0;
        this.items = [];
        this.$bvModal.hide("StatusDocumentModal");
      },
      async nextPage() {
        this.onError = false;
        const isTokenValid = await AuthService.tokenValidation();
        if (isTokenValid) {
          try {
            this.isLoading = true;
            await api
              .get(
                `/ecosystem/getStatusDocument?cnpj=${this.company}&skip=${
                  this.currentSkip + 20
                }`,
                {
                  headers: AuthHeader(),
                }
              )
              .then((res) => {
                if (res.data["odata.nextLink"] || res.data["@odata.nextLink"]) {
                  this.disabledNextPage = false;
                } else {
                  this.disabledNextPage = true;
                }
                this.currentSkip = this.currentSkip + 20;
                this.items = res.data.value;
                document.getElementById("tableScroll").scroll(0, 0);
              });
          } catch (err) {
            this.onError = true;
            this.items = [];
            console.log(err);
          } finally {
            this.isLoading = false;
          }
        } else {
          this.$bvModal.show("modalLogin");
        }
      },
      async previousPage() {
        this.onError = false;
        const isTokenValid = await AuthService.tokenValidation();
        if (isTokenValid) {
          try {
            this.isLoading = true;
            await api
              .get(
                `/ecosystem/getStatusDocument?cnpj=${this.company}&skip=${
                  this.currentSkip - 20
                }`,
                {
                  headers: AuthHeader(),
                }
              )
              .then((res) => {
                this.currentSkip = this.currentSkip - 20;
                this.disabledNextPage = false;
                this.items = res.data.value;
                document.getElementById("tableScroll").scroll(0, 0);
              });
          } catch (err) {
            this.onError = true;
            this.items = [];
            console.log(err);
          } finally {
            this.isLoading = false;
          }
        } else {
          this.$bvModal.show("modalLogin");
        }
      },
    },
  };
  </script>
  
  <style>
  .tdCss {
    width: 150px;
  }
  </style> -->
