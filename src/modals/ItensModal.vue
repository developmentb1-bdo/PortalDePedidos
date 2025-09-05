<!--usage:    <ItensModal :company="company" @addSelected="addSelected" /> -->

<template>
  <b-modal
    :hide-header="true"
    :hide-footer="true"
    @show="onShow"
    @hide="onHide"
    size="lg"
    id="ItensModal"
  >
    <div>
      <div class="title">
        <p class="fs-18px"><strong>Lista de Itens</strong></p>
      </div>
    </div>
    <hr />
    <div
      class="d-flex flex-row justify-content-end mb-2 rounded p-1"
      style="background-color: #ebebeb"
    >
      <div class="d-flex flex-row justify-content-between">
        <b-form-input class="me-2" placeholder="nome" v-model="name" />
        <button
          class="btn btn-inverse me-2"
          :disabled="isLoading"
          @click="searchByName"
        >
          Buscar
        </button>
      </div>
      <div class="d-flex flex-row justify-content-between">
        <b-form-input class="me-2" placeholder="código" v-model="code" />
        <button
          class="btn btn-inverse"
          :disabled="isLoading"
          @click="searchByCode"
        >
          Buscar
        </button>
      </div>
    </div>

    <div id="tableScroll" style="max-height: 300px; overflow-y: scroll">
      <b-table
        :items="items"
        :fields="fields"
        :select-mode="selectMode"
        :busy="isLoading"
        responsive="sm"
        ref="selectableTable"
        selectable
        show-empty
        @row-selected="onRowSelected"
        @row-dblclicked="onDblClicked"
      >
        <template #table-busy>
          <div class="text-center text-reverse my-2">
            <b-spinner small class="align-middle"></b-spinner>
            <strong> Carregando dados...</strong>
          </div>
        </template>
        <template #empty>
          <h6 class="d-flex justify-content-center align-items-center mt-2">
            Nenhum arquivo adicionado.
          </h6>
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

    <div class="row mt-4">
      <div class="flex-1 mb-4">
        <b-button
          variant="dark"
          @click="addSelected"
          :disabled="selected.length == 0 || isLoading"
          class="me-2"
          >Adicionar</b-button
        >
        <b-button variant="danger" @click="onCancelModal" class="me-2"
          >Cancelar</b-button
        >
        <b-button
          variant="outline-dark"
          @click="onShow"
          :disabled="isLoading"
          class="me-2"
          >Recarregar</b-button
        >
      </div>
      <div class="flex-1 mb-4 d-flex justify-content-end">
        <b-button
          variant="outline-dark"
          @click="previousPage"
          class="me-2"
          :disabled="skip == 0 || isLoading"
          >Anterior</b-button
        >

        <b-button
          variant="outline-dark"
          @click="nextPage"
          :disabled="isLoading || disabledNextPage"
          >Próxima</b-button
        >
      </div>
    </div>
  </b-modal>
</template>

<script>
import { api, cancelAllRequests } from "@/config/api";

export default {
  data() {
    return {
      isLoading: false,
      skip: 0,
      disabledNextPage: true,
      name: "",
      code: "",
      searchType: "",
      fields: [
        {
          key: "selected",
          label: "",
          thClass: "w-30px text-center",
          tdClass: "w-30px text-center",
        },
        {
          key: "ItemCode",
          label: "Código",
          thClass: "text-nowrap",
        },
        { key: "ItemName", label: "Descrição do item" },
        {
          key: "SalUnitMsr",
          label: "Unidade",
        },
      ],
      items: [],
      selectMode: "single",
      selected: [],
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
        confirmButtonClass: "btn me-5px btn-" + "dark" + "",
        cancelButtonClass: "btn btn-danger",
      });
    },
    addSelected() {
      this.$emit("addSelected", this.selected[0]);
      this.selected = [];
      this.skip = 0;
      this.items = [];
      this.$bvModal.hide("ItensModal");
    },
    onDblClicked(item) {
      this.$emit("addSelected", item);
      this.selected = [];
      this.skip = 0;
      this.items = [];
      this.$bvModal.hide("ItensModal");
    },
    onHide() {
      cancelAllRequests();
      this.isLoading = false;
      this.skip = 0;
      this.disabledNextPage = true;
      this.isLoading = false;
      this.items = [];
      this.selected = [];
      this.name = "";
      this.code = "";
      this.searchType = "";
    },
    scrollUp() {
      const scroll = document.getElementById("tableScroll");
      if (scroll) {
        document.getElementById("tableScroll").scroll(0, 0);
      }
    },
    async onShow() {
      this.disabledNextPage = true;
      this.searchType = "";
      this.name = "";
      this.code = "";
      this.skip = 0;
      try {
        this.isLoading = true;
        await api
          .get(
            `portalPedido/getItemSales?priceList=${this.$store.state.auth.user.ListNum}&skip=${this.skip}`
          )
          .then((res) => {
            if (res.data["odata.nextLink"] || res.data["@odata.nextLink"]) {
              this.disabledNextPage = false;
            } else {
              this.disabledNextPage = true;
            }
            this.items = res.data.value;
            this.scrollUp();
          });
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
    onRowSelected(items) {
      this.selected = items;
    },
    onCancelModal() {
      this.selected = [];
      this.skip = 0;
      this.searchType = "";
      this.items = [];
      this.$bvModal.hide("ItensModal");
    },
    async nextPage() {
      try {
        this.isLoading = true;
        let url = "";
        if (this.searchType === "code") {
          url = `portalPedido/getFilterItemCodeSales?priceList=${
            this.$store.state.auth.user.ListNum
          }&itemCode=${this.code}&skip=${this.skip + 20}`;
        } else if (this.searchType === "name") {
          url = `portalPedido/getFilterItemNameSales?priceList=${
            this.$store.state.auth.user.ListNum
          }&itemName=${this.name}&skip=${this.skip + 20}`;
        } else {
          url = `portalPedido/getItemSales?priceList=${
            this.$store.state.auth.user.ListNum
          }&skip=${this.skip + 20}`;
        }
        await api.get(url).then((res) => {
          if (res.data["odata.nextLink"] || res.data["@odata.nextLink"]) {
            this.disabledNextPage = false;
          } else {
            this.disabledNextPage = true;
          }
          this.skip = this.skip + 20;
          this.items = res.data.value;
          this.scrollUp();
        });
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
        this.items = [];
      } finally {
        this.isLoading = false;
      }
    },
    async previousPage() {
      try {
        this.isLoading = true;
        this.onError = false;
        let url = "";
        if (this.searchType === "code") {
          url = `portalPedido/getFilterItemCodeSales?priceList=${
            this.$store.state.auth.user.ListNum
          }&itemCode=${this.code}&skip=${this.skip - 20}`;
        } else if (this.searchType === "name") {
          url = `portalPedido/getFilterItemNameSales?priceList=${
            this.$store.state.auth.user.ListNum
          }&itemName=${this.name}&skip=${this.skip - 20}`;
        } else {
          url = `portalPedido/getItemSales?priceList=${
            this.$store.state.auth.user.ListNum
          }&skip=${this.skip - 20}`;
        }
        await api.get(url).then((res) => {
          this.skip = this.skip - 20;
          this.disabledNextPage = false;
          this.items = res.data.value;
          this.scrollUp();
        });
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
        this.items = [];
      } finally {
        this.isLoading = false;
      }
    },
    async searchByName() {
      if (this.name == "") {
        return;
      }
      try {
        this.isLoading = true;
        this.searchType = "name";
        this.skip = 0;
        await api
          .get(
            `portalPedido/getFilterItemNameSales?priceList=${this.$store.state.auth.user.ListNum}&itemName=${this.name}&skip=0`
          )
          .then((res) => {
            if (res.data["odata.nextLink"] || res.data["@odata.nextLink"]) {
              this.disabledNextPage = false;
            } else {
              this.disabledNextPage = true;
            }
            this.items = res.data.value;
            this.scrollUp();
          });
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
        this.items = [];
      } finally {
        this.isLoading = false;
      }
    },
    async searchByCode() {
      if (this.code == "") {
        return;
      }

      try {
        this.isLoading = true;
        this.onError = false;
        this.searchType = "code";
        this.skip = 0;
        await api
          .get(
            `portalPedido/getFilterItemCodeSales?priceList=${this.$store.state.auth.user.ListNum}&itemCode=${this.code}&skip=0`
          )
          .then((res) => {
            if (res.data["odata.nextLink"] || res.data["@odata.nextLink"]) {
              this.disabledNextPage = false;
            } else {
              this.disabledNextPage = true;
            }
            this.items = res.data.value;
            this.scrollUp();
          });
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
        this.items = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
