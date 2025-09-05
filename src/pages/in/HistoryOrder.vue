<template>
  <div>
    <div class="d-flex justify-content-between">
      <h1 class="page-header flex-1">Histórico de Pedidos</h1>
    </div>

    <panel title="Histórico" noButton="true">
      <template slot="header">
        <h4 class="panel-title">Histórico</h4>
        <div
          class="btn-group btn-group-toggle my-n1 panel-heading-btn"
          data-toggle="buttons"
        >
          <button
            href="javascript:;"
            @click="onRefresh"
            class="btn btn-xs btn-default"
            :disabled="isLoading"
          >
            <i class="fa fa-redo"></i>
            Atualizar
          </button>

          <button
            class="btn btn-xs btn-default"
            :disabled="isLoading"
            @click="toggleFilter"
          >
            <i class="fa fa-filter" aria-hidden="true"></i>
            Filtro
          </button>
          <button
            class="btn btn-xs btn-default"
            :disabled="isLoading"
            @click="clearFilter"
          >
            Limpar Filtro
          </button>
        </div>
      </template>

      <!-- Início Filtro -->
      <b-form @submit="onFilter" v-show="showFilter">
        <div class="row">
          <!-- INÍCIO STATUS DOCUMENTO -->

          <div class="form-group col-md-4 col-4">
            <label class="col-form-label text-nowrap">Nº Doc:</label>
            <div class="col-12">
              <b-form-input
                type="number"
                v-model="filter.numDoc"
              ></b-form-input>
            </div>
          </div>

          <div class="form-group col-md-4 col-4">
            <label class="col-form-label text-nowrap">Data Início:</label>
            <div class="col-12">
              <b-form-input
                type="date"
                v-model="filter.dateStart"
              ></b-form-input>
            </div>
          </div>

          <div class="form-group col-md-4 col-4">
            <label class="col-form-label text-nowrap">Data Final:</label>
            <div class="col-12">
              <b-form-input type="date" v-model="filter.dateEnd"></b-form-input>
            </div>
          </div>

          <div
            class="form-group d-flex gap-2 align-items-end justify-content-end mt-4 mb-2px"
          >
            <div class="form-group col-auto">
              <b-button
                type="submit"
                class=""
                variant="dark"
                :disabled="isLoading"
              >
                Filtrar
              </b-button>
            </div>
            <div class="form-group col-auto">
              <b-button
                @click="clearFilterFields"
                class=""
                variant="outline-dark"
                :disabled="isLoading"
              >
                Limpar campos
              </b-button>
            </div>
          </div>
          <hr class="mt-3" />
        </div>
      </b-form>

      <!-- Fim Filtro -->
      <b-table
        :items="items"
        :fields="fields"
        :busy="isLoading"
        responsive
        hover
        show-empty
      >
        <template #table-busy>
          <div class="text-center text-reverse my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong> Carregando dados...</strong>
          </div>
        </template>
        <template #empty>
          <h6 class="d-flex justify-content-center align-items-center mt-2">
            Nenhum pedido encontrado.
          </h6>
        </template>
        <template #cell(DocDate)="row">
          <span class="form-span">{{
            row.value.substring(0, 10).split("-").reverse().join("/")
          }}</span>
        </template>
        <template #cell(DocDueDate)="row">
          <span class="form-span">{{
            row.value.substring(0, 10).split("-").reverse().join("/")
          }}</span>
        </template>
        <template #cell(DocTotal)="row">
          <span>{{ convertCurrency(row) }}</span>
        </template>
        <template #cell(Cancelled)="row">
          <template
            v-if="row.value == 'tNO' && row.item.DocumentStatus == 'bost_Open'"
          >
            <span class="form-span"><strong>Aberto</strong></span>
          </template>
          <template
            v-if="
              row.value == 'tYES' && row.item.DocumentStatus == 'bost_Close'
            "
          >
            <span class="form-span text-red"><strong>Cancelado</strong></span>
          </template>
          <template
            v-if="row.value == 'tNO' && row.item.DocumentStatus == 'bost_Close'"
          >
            <span class="form-span text-red"><strong>Fechado</strong></span>
          </template>
        </template>
        <template #cell(pdf)="row">
          <b-button
            size="sm"
            @click="showPdf(row.item)"
            class="mr-1"
            variant="default"
          >
            <i class="fa fa-file-pdf fa-lg text-red" aria-hidden="true"></i>
          </b-button>
        </template>
        <template #cell(detail)="row">
          <b-button
            size="sm"
            @click="info(row.item)"
            class="mr-1"
            variant="outline-dark"
          >
            <i class="fa fa-search" aria-hidden="true"></i>
          </b-button>
        </template>
      </b-table>
      <div class="d-flex align-items-center justify-content-between">
        <!-- Início Contador Registro -->

        <div
          class="d-flex align-items-center justify-content-between flex-1 pe-4"
        >
          <div class="d-flex justify-content-center align-items-center">
            <label
              class="font-bold bg-gray-300 rounded border border-gray-500 py-2 px-2"
            >
              Pedidos encontrados: {{ isLoading ? "  " : totalOrders }}
            </label>
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <label
              class="font-bold bg-gray-300 rounded border border-gray-500 py-2 px-2"
            >
              Valor total: {{ isLoading ? "  " : convertCurrencyTotal() }}
            </label>
          </div>
        </div>
        <!-- Fim Contador Registro -->
        <div class="justify-content-center d-flex">
          <b-button
            @click="getFirstPage"
            class="mt-1 me-1"
            variant="outline-dark"
            :disabled="skip == 0 || isLoading"
          >
            Primeira
          </b-button>
          <b-button
            @click="prevPage"
            class="mt-1 me-1"
            variant="outline-dark"
            :disabled="skip == 0 || isLoading"
          >
            Anterior
          </b-button>
          <b-button
            @click="nextPage"
            class="mt-1 me-1"
            variant="outline-dark"
            :disabled="!hasNextPage || isLoading"
          >
            Próxima
          </b-button>
          <b-button
            @click="getLastPage"
            class="mt-1 me-1"
            variant="outline-dark"
            :disabled="!hasNextPage || isLoading"
          >
            Última
          </b-button>
        </div>
      </div>
    </panel>

    <OrderPdfModal
      :selectedDocNum="selectedDocNum"
      :selectedDocEntry="selectedDocEntry"
      @resetDocNum="resetDocNumEntry"
    />
  </div>
</template>

<script>
import { api } from "@/config/api";

//MODALS
import OrderPdfModal from "@/modals/OrderPdfModal.vue";

const initFilter = () => {
  return {
    numDoc: "",
    dateStart: "",
    dateEnd: "",
  };
};

const initFiltered = () => {
  return {
    numDoc: "",
    dateStart: "",
    dateEnd: "",
    path: "",
    pathTotalValue: "",
  };
};

export default {
  name: "HistoryOrderPage",
  components: { OrderPdfModal },
  data() {
    return {
      skip: 0,
      totalOrders: 0,
      totalOrdersValue: 0,
      lastPage: 0,
      isDisabled: false,
      isLoading: false,
      isLoadingForceUpdate: false,
      isLoadingSalesPersonCodeOnBlur: false,
      isLoadingDocumentStatusCodeOnBlur: false,
      isLoadingCustomerCodeOnBlur: false,
      isLoadingCpfCnpjOnBlur: false,
      selectedSalesOrder: {},
      hasNextPage: false,
      selectedDocNum: "",
      selectedDocEntry: "",
      items: [],
      fields: [
        {
          key: "DocNum",
          label: "Nº do Doc",
          class: "text-nowrap text-start align-middle",
        },
        // {
        //   key: "DocDate",
        //   label: "Data de Emissão",
        //   class: "text-start align-middle",
        // },
        {
          key: "DocDueDate",
          label: "Data de Entrega",
          class: "text-start align-middle text-nowrap",
        },
        // {
        //   key: "BPLName",
        //   label: "Filial",
        //   class: "text-start align-middle",
        // },
        // {
        //   key: "CardName",
        //   label: "Cliente",
        //   class: "text-start align-middle",
        // },
        {
          key: "DocTotal",
          label: "Total",
          thClass: "text-start align-middle",
          tdClass: "text-start align-middle",
          sortable: false,
        },
        {
          key: "Cancelled",
          label: "Status SAP B1",
          class: "text-start align-middle",
        },
        // {
        //   key: "U_nomeStatus",
        //   label: "Status do Documento",
        //   class: "text-start align-middle",
        // },
        {
          key: "pdf",
          label: "PDF",
          class: "align-middle text-start",
        },
        // {
        //   key: "detail",
        //   label: "Detalhes",
        //   class: "text-end align-middle",
        // },
      ],
      searchType: null,
      showFilter: false,
      filter: initFilter(),
      filtered: initFiltered(),
    };
  },
  async created() {
    this.getHistory();
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
    calculateLastSkip(numOfReg) {
      return Math.floor((numOfReg - 1) / 20) * 20;
    },
    async getHistory() {
      try {
        this.isLoading = true;

        await Promise.all([
          api.get(
            `portalPedido/getOrders?cardCode=${this.$store.state.auth.user.CardCode}&isAdmin=Y`
          ),
          api.get(
            `portalPedido/getCountOrders?cardCode=${this.$store.state.auth.user.CardCode}`
          ),
          api.get(
            `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}`
          ),
        ]).then((res) => {
          this.searchType = null;
          this.filter = initFilter();
          this.filtered = initFiltered();
          this.items = res[0].data.value;
          this.lastPage = this.calculateLastSkip(res[1].data);
          this.totalOrders = res[1].data;
          this.totalOrdersValue = res[2].data.value[0].total;
          this.skip = 0;

          if (res[0].data["odata.nextLink"] || res[0].data["@odata.nextLink"]) {
            this.hasNextPage = true;
          } else {
            this.hasNextPage = false;
          }
        });
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(value) {
      if (value.includes("T") || value.includes("Z")) {
        let removePart = value.substring(
          value.indexOf("T") + 1,
          value.indexOf("Z")
        );
        let newDate = value.split("T" + removePart + "Z");
        return newDate.join("");
      } else {
        return value.split("-").reverse().join("/");
      }
    },
    convertCurrency(row) {
      if (row.item.DocCurrency == "R$") {
        return new Intl.NumberFormat(`pt-BR`, {
          currency: `BRL`,
          style: "currency",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(row.value);
      }

      return `${row.value} (Sem especificação do tipo de moeda)`;
    },
    convertCurrencyTotal() {
      return new Intl.NumberFormat(`pt-BR`, {
        currency: `BRL`,
        style: "currency",
      }).format(this.totalOrdersValue);
    },
    async info(item) {
      this.selectedSalesOrder = item;
      this.selectedDocNum = item.DocNum;
      this.selectedDocEntry = item.DocEntry;

      this.$bvModal.show("HistoricoPedidoVendaModal");
    },
    async showPdf(item) {
      this.selectedDocNum = item.DocNum;
      this.selectedDocEntry = item.DocEntry;
      this.$bvModal.show("OrderPdfModal");
    },
    resetDocNumEntry() {
      this.selectedDocNum = null;
      this.selectedDocEntry = null;
    },
    async getLastPage() {
      this.isLoading = true;

      try {
        if (this.searchType) {
          const [ORDER, TOTAL_ORDERS, TOTAL_VALUE] = await Promise.all([
            api.get(
              `portalPedido/getGeneric?query=Orders?$filter=${this.filtered.path}&$skip=${this.lastPage}`
            ),
            api.get(
              `/portalPedido/getGeneric?query=Orders/$count?$filter=${this.filtered.path}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}&${this.filtered.pathTotalValue}`
            ),
          ]);

          this.items = ORDER.data.value;
          this.totalOrders = TOTAL_ORDERS.data;
          this.totalOrdersValue = TOTAL_VALUE.data.value[0].total;
          this.skip = this.lastPage;

          if (ORDER.data["odata.nextLink"] || ORDER.data["@odata.nextLink"]) {
            this.hasNextPage = true;
          } else {
            this.hasNextPage = false;
          }
        } else {
          await Promise.all([
            api.get(
              `portalPedido/getOrders?cardCode=${this.$store.state.auth.user.CardCode}&isAdmin=Y&skip=${this.lastPage}`
            ),
            api.get(
              `portalPedido/getCountOrders?cardCode=${this.$store.state.auth.user.CardCode}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}`
            ),
          ]).then((res) => {
            this.items = res[0].data.value;
            this.lastPage = this.calculateLastSkip(res[1].data);
            this.totalOrders = res[1].data;
            this.totalOrdersValue = res[2].data.value[0].total;
            this.skip = this.lastPage;
            if (
              res[0].data["odata.nextLink"] ||
              res[0].data["@odata.nextLink"]
            ) {
              this.hasNextPage = true;
            } else {
              this.hasNextPage = false;
            }
          });
        }
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
    async getFirstPage() {
      this.isLoading = true;

      try {
        if (this.searchType) {
          const [ORDER, TOTAL_ORDERS, TOTAL_VALUE] = await Promise.all([
            api.get(
              `portalPedido/getGeneric?query=Orders?$filter=${
                this.filtered.path
              }&$skip=${0}`
            ),
            api.get(
              `/portalPedido/getGeneric?query=Orders/$count?$filter=${this.filtered.path}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}&${this.filtered.pathTotalValue}`
            ),
          ]);

          this.items = ORDER.data.value;
          this.totalOrders = TOTAL_ORDERS.data;
          this.totalOrdersValue = TOTAL_VALUE.data.value[0].total;
          this.skip = 0;

          if (ORDER.data["odata.nextLink"] || ORDER.data["@odata.nextLink"]) {
            this.hasNextPage = true;
          } else {
            this.hasNextPage = false;
          }
        } else {
          await Promise.all([
            api.get(
              `portalPedido/getOrders?cardCode=${this.$store.state.auth.user.CardCode}&isAdmin=Y&skip=0`
            ),
            api.get(
              `portalPedido/getCountOrders?cardCode=${this.$store.state.auth.user.CardCode}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}`
            ),
          ]).then((res) => {
            this.items = res[0].data.value;
            this.lastPage = this.calculateLastSkip(res[1].data);
            this.totalOrders = res[1].data;
            this.totalOrdersValue = res[2].data.value[0].total;
            this.skip = 0;
            if (
              res[0].data["odata.nextLink"] ||
              res[0].data["@odata.nextLink"]
            ) {
              this.hasNextPage = true;
            } else {
              this.hasNextPage = false;
            }
          });
        }
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
    async prevPage() {
      try {
        this.isLoading = true;

        if (this.searchType) {
          const [ORDER, TOTAL_ORDERS, TOTAL_VALUE] = await Promise.all([
            api.get(
              `portalPedido/getGeneric?query=Orders?$filter=${
                this.filtered.path
              }&$skip=${this.skip - 20}`
            ),
            api.get(
              `/portalPedido/getGeneric?query=Orders/$count?$filter=${this.filtered.path}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}&${this.filtered.pathTotalValue}`
            ),
          ]);

          this.items = ORDER.data.value;
          this.totalOrders = TOTAL_ORDERS.data;
          this.totalOrdersValue = TOTAL_VALUE.data.value[0].total;
          this.skip -= 20;

          if (ORDER.data["odata.nextLink"] || ORDER.data["@odata.nextLink"]) {
            this.hasNextPage = true;
          } else {
            this.hasNextPage = false;
          }
        } else {
          await Promise.all([
            api.get(
              `portalPedido/getOrders?cardCode=${
                this.$store.state.auth.user.CardCode
              }&isAdmin=Y&skip=${this.skip - 20}`
            ),
            api.get(
              `portalPedido/getCountOrders?cardCode=${this.$store.state.auth.user.CardCode}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}`
            ),
          ]).then((res) => {
            this.items = res[0].data.value;
            this.lastPage = this.calculateLastSkip(res[1].data);
            this.totalOrders = res[1].data;
            this.totalOrdersValue = res[2].data.value[0].total;
            this.skip -= 20;
            if (
              res[0].data["odata.nextLink"] ||
              res[0].data["@odata.nextLink"]
            ) {
              this.hasNextPage = true;
            } else {
              this.hasNextPage = false;
            }
          });
        }
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
    async nextPage() {
      try {
        this.isLoading = true;

        if (this.searchType) {
          const [ORDER, TOTAL_ORDERS, TOTAL_VALUE] = await Promise.all([
            api.get(
              `portalPedido/getGeneric?query=Orders?$filter=${
                this.filtered.path
              }&$skip=${this.skip + 20}`
            ),
            api.get(
              `/portalPedido/getGeneric?query=Orders/$count?$filter=${this.filtered.path}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}&${this.filtered.pathTotalValue}`
            ),
          ]);

          this.items = ORDER.data.value;
          this.totalOrders = TOTAL_ORDERS.data;
          this.totalOrdersValue = TOTAL_VALUE.data.value[0].total;
          this.skip += 20;

          if (ORDER.data["odata.nextLink"] || ORDER.data["@odata.nextLink"]) {
            this.hasNextPage = true;
          } else {
            this.hasNextPage = false;
          }
        } else {
          await Promise.all([
            api.get(
              `portalPedido/getOrders?cardCode=${
                this.$store.state.auth.user.CardCode
              }&isAdmin=Y&skip=${this.skip + 20}`
            ),
            api.get(
              `portalPedido/getCountOrders?cardCode=${this.$store.state.auth.user.CardCode}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}`
            ),
          ]).then((res) => {
            this.items = res[0].data.value;
            this.lastPage = this.calculateLastSkip(res[1].data);
            this.totalOrders = res[1].data;
            this.totalOrdersValue = res[2].data.value[0].total;

            this.skip += 20;
            if (
              res[0].data["odata.nextLink"] ||
              res[0].data["@odata.nextLink"]
            ) {
              this.hasNextPage = true;
            } else {
              this.hasNextPage = false;
            }
          });
        }
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
    async onRefresh() {
      try {
        this.isLoading = true;

        if (this.searchType) {
          const [ORDER, TOTAL_ORDERS, TOTAL_VALUE] = await Promise.all([
            api.get(
              `portalPedido/getGeneric?query=Orders?$filter=${this.filtered.path}&$skip=${this.skip}`
            ),
            api.get(
              `/portalPedido/getGeneric?query=Orders/$count?$filter=${this.filtered.path}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}&${this.filtered.pathTotalValue}`
            ),
          ]);

          this.items = ORDER.data.value;
          this.totalOrders = TOTAL_ORDERS.data;
          this.lastPage = this.calculateLastSkip(TOTAL_ORDERS.data);
          this.totalOrdersValue = TOTAL_VALUE.data.value[0].total;

          if (ORDER.data["odata.nextLink"] || ORDER.data["@odata.nextLink"]) {
            this.hasNextPage = true;
          } else {
            this.hasNextPage = false;
          }
        } else {
          await Promise.all([
            api.get(
              `portalPedido/getOrders?cardCode=${this.$store.state.auth.user.CardCode}&isAdmin=Y&skip=${this.skip}`
            ),
            api.get(
              `portalPedido/getCountOrders?cardCode=${this.$store.state.auth.user.CardCode}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}`
            ),
          ]).then((res) => {
            this.items = res[0].data.value;
            this.lastPage = this.calculateLastSkip(res[1].data);
            this.totalOrders = res[1].data;
            this.totalOrdersValue = res[2].data.value[0].total;
            if (
              res[0].data["odata.nextLink"] ||
              res[0].data["@odata.nextLink"]
            ) {
              this.hasNextPage = true;
            } else {
              this.hasNextPage = false;
            }
          });
        }
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
    clearFilterFields() {
      this.filter = initFilter();
    },
    clearFilter() {
      this.skip = 0;
      this.searchType = null;
      this.filter = initFilter();
      this.filtered = initFiltered();
      this.onRefresh();
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    async onFilter() {
      if (
        !this.filter.numDoc &&
        !this.filter.dateStart &&
        !this.filter.dateEnd
      ) {
        this.alert("Preencha pelo menos um tipo de filtro.");
        return;
      }

      try {
        this.isLoading = true;
        if (this.filter.numDoc) {
          const [ORDER, TOTAL_ORDERS, TOTAL_VALUE] = await Promise.all([
            api.get(
              `portalPedido/getGeneric?query=Orders?$filter=DocNum eq ${this.filter.numDoc} and CardCode eq '${this.$store.state.auth.user.CardCode}'`
            ),
            api.get(
              `/portalPedido/getGeneric?query=Orders/$count?$filter=DocNum eq ${this.filter.numDoc} and CardCode eq '${this.$store.state.auth.user.CardCode}'`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}&docNum=${this.filter.numDoc}`
            ),
          ]);

          this.items = ORDER.data.value;
          this.filtered.numDoc = this.filter.numDoc;
          this.filtered.path = `DocNum eq ${this.filter.numDoc} and CardCode eq '${this.$store.state.auth.user.CardCode}'`;
          this.filtered.pathTotalValue = `docNum=${this.filter.numDoc}`;
          this.searchType = "code";
          this.skip = 0;
          this.hasNextPage = false;
          this.totalOrders = TOTAL_ORDERS.data;
          this.lastPage = this.calculateLastSkip(TOTAL_ORDERS.data);
          this.totalOrdersValue = TOTAL_VALUE.data.value[0].total;
        } else if (this.filter.dateStart || this.filter.dateEnd) {
          let count = 0;
          let url = "";
          let urlTotalValue = "";
          if (this.filter.dateStart) {
            url = `DocDate ge '${this.filter.dateStart}'`;
            urlTotalValue = `dateFrom=${this.filter.dateStart}`;
            count += 1;
          }
          if (this.filter.dateEnd) {
            url += `${
              count > 0
                ? ` and DocDate le '${this.filter.dateEnd}'`
                : `DocDate le '${this.filter.dateEnd}'`
            }`;
            urlTotalValue += `${
              count > 0
                ? `&dateTo=${this.filter.dateEnd}`
                : `dateTo=${this.filter.dateEnd}`
            }`;
          }
          const [ORDER, TOTAL_ORDERS, TOTAL_VALUE] = await Promise.all([
            api.get(`portalPedido/getGeneric?query=Orders?$filter=${url}`),
            api.get(
              `/portalPedido/getGeneric?query=Orders/$count?$filter=${url}`
            ),
            api.get(
              `portalPedido/getTotalValueOrders?cardCode=${this.$store.state.auth.user.CardCode}&${urlTotalValue}`
            ),
          ]);

          this.items = ORDER.data.value;
          this.filtered.dateStart = this.filter.dateStart;
          this.filtered.dateEnd = this.filter.dateEnd;
          this.filtered.path = url;
          this.filtered.pathTotalValue = urlTotalValue;
          this.searchType = "date";
          this.skip = 0;
          this.totalOrders = TOTAL_ORDERS.data;
          this.lastPage = this.calculateLastSkip(TOTAL_ORDERS.data);
          this.totalOrdersValue = TOTAL_VALUE.data.value[0].total;

          if (ORDER.data["odata.nextLink"] || ORDER.data["@odata.nextLink"]) {
            this.hasNextPage = true;
          } else {
            this.hasNextPage = false;
          }
        }
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
