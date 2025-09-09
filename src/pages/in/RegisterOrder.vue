<template>
  <div>
    <!-- BEGIN page-header -->
    <div class="d-flex justify-content-between">
      <h1 class="page-header">Cadastro de Pedido</h1>
    </div>
    <!-- END page-header -->

    <div>
      <panel title="Cadastro" noButton="true">
        <fieldset class="row" :disabled="isLoading">
          <div class="form-group col-md-6 col-12">
            <label class="col-md-12 col-form-label">Data do Documento</label>
            <div class="col-md-12">
              <input
                type="date"
                :disabled="isLoading"
                class="form-control"
                id="dataEntrega"
                v-model="data.DocDate"
              />
            </div>
          </div>
          <div class="form-group col-md-6 col-12">
            <label class="col-md-12 col-form-label">Data de Entrega</label>
            <div class="col-md-12">
              <input
                type="date"
                :disabled="isLoading"
                class="form-control"
                id="dataEntrega"
                v-model="data.DocDueDate"
                @change="onChangeDocDueDate"
              />
            </div>
          </div>
          <!-- <div class="form-group col-md-6 col-12">
            <label class="col-md-12 col-form-label">Código Status Doc.</label>
            <div class="col-md-12 d-flex flex-row input-group">
              <button
                type="button"
                class="btn btn-white d-flex h-35px align-items-center"
                :disabled="isLoading || isLoadingDocumentStatusCodeOnBlur"
                v-on:click="findDocumentStatus"
              >
                <i class="fa fa-search opacity-5 px-1"></i>
              </button>
              <b-form-input
                id="statusCode"
                class=""
                placeholder="código"
                :disabled="isLoadingDocumentStatusCodeOnBlur"
                :value="data.U_StatusDoc"
                @blur="documentStatusCodeOnBlur"
                @keyup="documentStatusKeyUp"
              ></b-form-input>
              <button
                type="button"
                class="btn btn-white d-flex h-35px align-items-center"
                :disabled="isLoading || isLoadingDocumentStatusCodeOnBlur"
              >
                <i class="fa fa-arrow-right opacity-5 px-1"></i>
              </button>
            </div>
          </div>
          <div class="form-group col-md-6 col-12">
            <label class="col-md-12 col-form-label">Nome Status Doc.</label>
            <div class="col-md-12">
              <div class="input-group">
                <button
                  id="nomeStatusDoc"
                  type="button"
                  class="btn btn-white d-flex h-35px align-items-center"
                  style="min-width: 100%"
                  disabled
                >
                  <span
                    v-if="isLoadingDocumentStatusCodeOnBlur"
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {{ data.U_nomeStatus }}
                </button>
              </div>
            </div>
          </div> -->
        </fieldset>
      </panel>

      <panel title="Itens" noButton="true">
        <template slot="header">
          <h4 class="panel-title">Itens</h4>
          <div class="d-flex flex-row">
            <label
              class="btn btn-dark w-auto rounded h-30px me-2 d-flex align-items-center justify-content-center"
            >
              <input
                id="importId"
                type="file"
                accept=".xls, .xlsx"
                @change="onImportExcel"
                :disabled="isLoadingImport"
                true
              />
              <i
                aria-hidden="true"
                class="fa fa-file-excel text-success fa-fw fa-lg me-2"
              ></i>
              Importar Excel
            </label>

            <b-button size="sm" variant="dark" @click="addNewItem"
              >Adicionar item</b-button
            >
          </div>
        </template>

        <fieldset class="row" :disabled="isLoading">
          <div class="table-responsive mb-3 mt-3">
            <b-table
              striped
              hover
              responsive
              :items="data.DocumentLines"
              :fields="itensFields"
              show-empty
              :busy="isLoadingImport"
              true
            >
              <template #table-busy>
                <div class="text-center text-reverse my-2">
                  <b-spinner class="align-middle" small></b-spinner>
                  <strong> Carregando dados...</strong>
                </div>
              </template>
              <template #empty>
                <h6
                  class="d-flex justify-content-center align-items-center mt-2"
                >
                  Nenhum item adicionado.
                </h6>
              </template>
              <template #cell(#)="row">
                {{ row.index + 1 }}
              </template>
              <template #cell(ItemCode)="row">
                <div class="d-flex flex-row input-group w-250px">
                  <button
                    type="button"
                    class="btn btn-white d-flex h-35px align-items-center"
                    :disabled="isLoading || row.item.isLoadingItem"
                    v-on:click="findItems(row.index)"
                  >
                    <i class="fa fa-search opacity-5 px-1"></i>
                  </button>
                  <b-form-input
                    class=""
                    placeholder="código"
                    :disabled="row.item.isLoadingItem"
                    v-model="data.DocumentLines[row.index].ItemCode"
                    @blur="itemCodeOnBlur(row)"
                    @keyup="itemKeyUp(row.index)"
                  ></b-form-input>
                  <button
                    type="button"
                    class="btn btn-white d-flex h-35px align-items-center"
                    :disabled="row.item.isLoadingItem"
                  >
                    <i class="fa fa-arrow-right opacity-5 px-1"></i>
                  </button>
                </div>
              </template>
              <template #cell(ItemName)="row">
                <div
                  class="form-control ps-8px bg-light w-auto h-35px text-nowrap"
                  style="min-width: 150px"
                >
                  <span
                    v-if="row.item.isLoadingItem"
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <p>
                    {{ data.DocumentLines[row.index].ItemName }}
                  </p>
                </div>
              </template>

              <template #cell(UnitPrice)="row">
                <money
                  v-model="data.DocumentLines[row.index].UnitPrice"
                  v-bind="moneyRules"
                  disabled
                  class="form-control ps-8px bg-light h-35px w-150px"
                ></money>
              </template>
              <template #cell(totalPrice)="row">
                <money
                  :value="
                    data.DocumentLines[row.index].Quantity *
                    data.DocumentLines[row.index].UnitPrice
                  "
                  v-bind="moneyRules"
                  disabled
                  class="form-control ps-8px bg-light h-35px w-150px"
                ></money>
              </template>

              <template #cell(MeasureUnit)="row">
                <div
                  class="form-control ps-8px bg-light w-auto h-35px"
                  style="min-width: 150px"
                >
                  <p>
                    {{ data.DocumentLines[row.index].MeasureUnit }}
                  </p>
                </div>
              </template>

              <template #cell(ShipDate)="row">
                <input
                  type="date"
                  class="form-control"
                  id="dataEntrega"
                  v-model="data.DocumentLines[row.index].ShipDate"
                />
              </template>
              <template #cell(Quantity)="row">
                <input
                  type="number"
                  v-model="data.DocumentLines[row.index].Quantity"
                  class="form-control ps-8px bg-light w-auto h-35px"
                />
              </template>

              <template #cell(excluir)="row">
                <button
                  v-on:click="removeItem(row.index)"
                  :disabled="isLoading"
                  type="button"
                  class="btn btn-outline-dark"
                >
                  <i class="fa fa-trash-can"></i>
                </button>
              </template>
            </b-table>
          </div>
        </fieldset>
      </panel>

      <panel title="Observações" noButton="true">
        <fieldset class="row">
          <div class="form-group col-sm-12 col-12">
            <div class="col-md-12 mb-4">
              <textarea
                v-model="data.Comments"
                @input="maxCharControl"
                class="form-control"
                rows="4"
                :disabled="isLoading"
              ></textarea>
              <div>
                <p
                  :class="
                    data.Comments.length == maxObsLength
                      ? 'mt-2 text-end text-red'
                      : 'mt-2 text-end'
                  "
                >
                  Caracteres: {{ data.Comments.length }}/{{ maxObsLength }}
                </p>
              </div>
            </div>
          </div>
        </fieldset>
      </panel>

      <panel title="Arquivos Anexos" noButton="true">
        <template slot="header">
          <h4 class="panel-title">Arquivos Anexos</h4>
          <div
            class="btn-group btn-group-toggle my-n1 panel-heading-btn"
            data-toggle="buttons"
          >
            <div class="flex-row">
              <label class="btn btn-dark h-30px w-auto rounded">
                <input
                  id="attachedId"
                  type="file"
                  accept=".pdf, .xls, .doc, .xlsx, .xlsm"
                  @change="onChangeFile"
                  :disabled="isLoadingFile"
                  multiple
                />
                <span
                  v-if="isLoadingFile"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Adicionar arquivo
              </label>
            </div>
          </div>
        </template>

        <fieldset class="row">
          <div class="table-responsive mb-3 mt-3">
            <b-table
              striped
              hover
              responsive
              :items="anexos"
              :fields="fields"
              show-empty
            >
              <template #empty>
                <h6
                  class="d-flex justify-content-center align-items-center mt-2"
                >
                  Nenhum arquivo adicionado.
                </h6>
              </template>
              <template #cell(#)="row">
                {{ row.index + 1 }}
              </template>
              <template #cell(nomeArquivo)="row">
                {{ row.value }}
              </template>
              <template #cell(extensao)="row">
                {{ row.value.split("/").pop() }}
              </template>
              <template #cell(excluir)="row">
                <button
                  v-on:click="removeAttached(row)"
                  :disabled="isLoadingFile"
                  type="button"
                  class="btn btn-outline-dark"
                >
                  <i class="fa fa-trash-can"></i>
                </button>
              </template>
            </b-table>
          </div>
        </fieldset>
      </panel>
    </div>

    <div class="d-flex align-content-end justify-content-end py-2">
      <b-button variant="dark" @click="register" :disabled="isLoading"
        ><b-spinner v-if="isLoading" small class="me-2" />Cadastrar
      </b-button>
    </div>

    <ItensModal @addSelected="addSelectedItem" />
  </div>
</template>

<script>
import { api } from "@/config/api";
import { Money } from "v-money";

import { v4 as uuidv4 } from "uuid";
import { S3 } from "@/config/AWSS3";

import * as XLSX from "xlsx";

//MODALS
import ItensModal from "@/modals/ItensModal.vue";

const ITEM = () => {
  return {
    ItemCode: "",
    ItemName: "",
    ShipDate: "",
    Quantity: "0",
    MeasureUnit: "",
    UnitPrice: "0",
    isLoadingItem: false,
  };
};

const initState = () => {
  return {
    DocDueDate: "",
    DocDate: "",
    BPL_IDAssignedToInvoice: "",
    CardCode: "",
    // U_StatusDoc: "",
    // U_nomeStatus: "",
    Comments: "",
    TaxExtension: { MainUsage: "" },
    DocumentLines: [],
    AttachmentEntry: null,
  };
};

export default {
  props: [],
  components: { Money, ItensModal },
  data() {
    return {
      isLoading: false,
      isLoadingFile: false,
      isLoadingImport: false,
      isLoadingDocumentStatusCodeOnBlur: false,
      maxObsLength: 240,
      currentItemIndex: null,
      moneyRules: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false,
      },
      anexos: [],
      fields: [
        {
          key: "#",
          sortable: false,
          class: "text-left",
        },
        {
          key: "nomeArquivo",
          label: "Nome do Arquivo",
          sortable: false,
          class: "text-left",
        },
        {
          key: "extensao",
          label: "Extensão do Arquivo",
          sortable: false,
          class: "text-left",
        },
        {
          key: "excluir",
          label: "Excluir",
          sortable: false,
          class: "text-center",
        },
      ],
      itensFields: [
        {
          key: "excluir",
          label: "",
          sortable: false,
          class: "text-center align-middle",
        },
        {
          key: "#",
          sortable: false,
          class: "text-center align-middle",
        },
        {
          key: "ItemCode",
          label: "Cód. Item",
          sortable: false,
          class: "text-start align-middle",
        },
        {
          key: "ItemName",
          label: "Descrição",
          sortable: false,
          class: "text-start align-middle",
        },
        {
          key: "MeasureUnit",
          label: "Un. Medida",
          sortable: false,
          class: "text-start align-middle",
        },
        {
          key: "Quantity",
          label: "Quantidade",
          sortable: false,
          class: "text-start align-middle",
        },
        {
          key: "ShipDate",
          label: "Data de Entrega",
          sortable: false,
          class: "text-start align-middle",
        },
        {
          key: "UnitPrice",
          label: "Preço Unitário",
          sortable: false,
          class: "text-start align-middle",
        },
        {
          key: "totalPrice",
          label: "Total",
          sortable: false,
          class: "text-start align-middle",
        },
      ],
      data: null,
    };
  },
  async created() {
    this.resetData();
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
    maxCharControl() {
      if (this.data.Comments.length > this.maxObsLength) {
        this.data.observacao = this.data.observacao.substring(
          0,
          this.maxObsLength
        );
      }
    },
    addNewItem() {
      const item = ITEM();
      if (this.data.DocDueDate) {
        item.ShipDate = this.data.DocDueDate;
      }
      this.data.DocumentLines.push(item);
    },
    removeItem(index) {
      this.data.DocumentLines.splice(index, 1);
    },
    resetData() {
      this.data = initState();
      this.anexos = [];

      this.data.DocDate = new Date()
        .toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .reverse()
        .join("-");
    },
    onChangeDocDueDate(event) {
      const date = event.target.value;

      if (this.data.DocumentLines.length > 0) {
        this.$swal({
          title: "Notificação",
          text: "Deseja alterar também a data de entrega dos itens adicionados?",
          type: "warning",
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonText: "Alterar",
          cancelButtonText: "Não alterar",
          confirmButtonClass: "btn me-5px btn-" + "dark" + "",
          cancelButtonClass: "btn btn-danger",
        }).then((res) => {
          if (res.isConfirmed) {
            this.data.DocumentLines.map((item) => {
              item.ShipDate = date;
              return item;
            });
          }
        });
      }
    },
    findItems(index) {
      this.currentItemIndex = index;
      this.$bvModal.show("ItensModal");
    },
    async itemCodeOnBlur(row) {
      if (!row.value) {
        this.data.DocumentLines[row.index].ItemCode = "";
        this.data.DocumentLines[row.index].ItemName = "";
        this.data.DocumentLines[row.index].MeasureUnit = "";
        this.data.DocumentLines[row.index].UnitPrice = "0";
        this.data.DocumentLines[row.index].Quantity = "0";
        this.data.DocumentLines[row.index].isLoadingItem = false;
        return;
      }
      try {
        this.data.DocumentLines[row.index].ItemName = "";
        this.data.DocumentLines[row.index].MeasureUnit = "";
        this.data.DocumentLines[row.index].UnitPrice = "0";
        this.data.DocumentLines[row.index].Quantity = "0";
        this.data.DocumentLines[row.index].isLoadingItem = true;
        const { data } = await api.get(
          `portalPedido/getFilterItemCodeSales?priceList=${this.$store.state.auth.user.ListNum}&itemCode=${row.value}`
        );

        if (data.value.length > 0) {
          this.data.DocumentLines[row.index].ItemCode = data.value[0].ItemCode;
          this.data.DocumentLines[row.index].ItemName = data.value[0].ItemName;
          this.data.DocumentLines[row.index].MeasureUnit =
            data.value[0].SalUnitMsr;
          this.data.DocumentLines[row.index].UnitPrice = data.value[0].Price;

          if (
            this.data.DocumentLines[this.data.DocumentLines.length - 1].ItemCode
          ) {
            this.addNewItem();
          }
        } else {
          this.data.DocumentLines[row.index].ItemCode = "";
          this.data.DocumentLines[row.index].ItemName = "";
          this.data.DocumentLines[row.index].MeasureUnit = "";
          this.data.DocumentLines[row.index].UnitPrice = "0";
          this.data.DocumentLines[row.index].Quantity = "0";
        }
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
        this.data.DocumentLines[row.index].ItemCode = "";
        this.data.DocumentLines[row.index].ItemName = "";
        this.data.DocumentLines[row.index].MeasureUnit = "";
        this.data.DocumentLines[row.index].UnitPrice = "0";
        this.data.DocumentLines[row.index].Quantity = "0";
      } finally {
        this.data.DocumentLines[row.index].isLoadingItem = false;
      }
    },
    async itemKeyUp() {},
    addSelectedItem(item) {
      this.data.DocumentLines[this.currentItemIndex].Quantity = "0";
      this.data.DocumentLines[this.currentItemIndex].ItemCode = item.ItemCode;
      this.data.DocumentLines[this.currentItemIndex].ItemName = item.ItemName;
      this.data.DocumentLines[this.currentItemIndex].UnitPrice = item.Price;
      this.data.DocumentLines[this.currentItemIndex].MeasureUnit =
        item.SalUnitMsr;

      this.currentItemIndex = null;

      if (
        this.data.DocumentLines[this.data.DocumentLines.length - 1].ItemCode
      ) {
        this.addNewItem();
      }
    },
    findDocumentStatus() {
      this.$bvModal.show("StatusDocumentModal");
    },
    documentStatusKeyUp() {
      this.data.U_nomeStatus = "";
    },
    async documentStatusCodeOnBlur(status) {
      if (!status.target.value) {
        this.data.U_nomeStatus = "";
        this.data.U_StatusDoc = "";
      } else {
        try {
          this.isLoadingDocumentStatusCodeOnBlur = true;
          this.data.U_nomeStatus = "";
          (this.data.U_StatusDoc = status.target.value),
            await api
              .get(
                `/ecosystem/getStatusDocumentSpecific?cnpj=${this.selectedCompany}&code=${status.target.value}`
              )
              .then((res) => {
                this.data.U_nomeStatus = res.data.Name;
                this.data.U_StatusDoc = res.data.Code;
              });
        } catch (error) {
          if (!error.canceled) {
            this.alert(error.message || "Erro ao buscar status do documento.");
          }
          this.data.U_nomeStatus = "";
          this.data.U_StatusDoc = "";
        } finally {
          this.isLoadingDocumentStatusCodeOnBlur = false;
        }
      }
    },
    addSelectedDocumentStatus(status) {
      this.data.U_nomeStatus = status.Name;
      this.data.U_StatusDoc = status.Code;
    },
    async onImportExcel(event) {
      if (event.target.files.length > 0) {
        for (let file of event.target.files) {
          try {
            let extensao = file.name.split(".").pop();

            if (extensao == "xls" || extensao == "xlsx") {
              const res = await this.$swal({
                title: "Notificação",
                text: "Esse processo pode levar alguns minutos. Deseja continuar?",
                type: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Continuar",
                cancelButtonText: "Cancelar",
                confirmButtonClass: "btn me-5px btn-" + "dark" + "",
                cancelButtonClass: "btn btn-danger",
              });
              if (!res.isConfirmed) return;

              try {
                this.isLoadingImport = true;
                const reader = new FileReader();

                const fileBuffer = await new Promise((resolve, reject) => {
                  reader.onload = (e) => resolve(e.target.result);
                  reader.onerror = (e) => reject(e);
                  reader.readAsArrayBuffer(file);
                });

                const data = new Uint8Array(fileBuffer);
                const workbook = XLSX.read(data, { type: "array" });

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                  header: 1,
                });

                const mappedData = jsonData
                  .slice(1)
                  .filter(
                    (row) =>
                      row &&
                      row.length &&
                      row.some(
                        (cell) =>
                          cell !== undefined && cell !== null && cell !== ""
                      )
                  )
                  .map((row) => ({
                    ItemCode: row[0],
                    Quantity: row[1],
                  }));

                const errorsArray = [];

                const apiCalls = mappedData.map((item) =>
                  api
                    .get(
                      `portalPedido/getFilterItemCodeSales?priceList=${this.$store.state.auth.user.ListNum}&itemCode=${item.ItemCode}`
                    )
                    .then((response) => {
                      if (response.data.value.length > 0) {
                        return {
                          ItemCode: response.data.value[0].ItemCode,
                          ItemName: response.data.value[0].ItemName,
                          MeasureUnit: response.data.value[0].SalUnitMsr,
                          UnitPrice: response.data.value[0].Price,
                          Quantity: item.Quantity,
                          ShipDate: "",
                          isLoadingItem: false,
                        };
                      } else {
                        errorsArray.push(item.ItemCode);
                        return {
                          ItemCode: null,
                          ItemName: null,
                          MeasureUnit: null,
                          UnitPrice: null,
                          Quantity: "0",
                          ShipDate: "",
                          isLoadingItem: false,
                        };
                      }
                    })
                );

                const ITEMS_DATA = await Promise.all(apiCalls);

                if (this.data.DocDueDate) {
                  ITEMS_DATA.map((item) => {
                    item.ShipDate = this.data.DocDueDate;
                    return item;
                  });
                }

                this.data.DocumentLines = [
                  ...this.data.DocumentLines,
                  ...ITEMS_DATA.filter((item) => item.ItemCode),
                ];

                if (errorsArray.length > 0) {
                  this.alert(
                    `Os seguintes itens não foram encontrados: ${errorsArray}`
                  );
                }
              } catch (error) {
                this.alert(
                  error.message ||
                    "Erro ao importar dados dos itens. Tente novamente ou entre em contato com o suporte."
                );
              } finally {
                this.isLoadingImport = false;
              }
            } else {
              this.alert("Insira um arquivo válido. (xls ou xlsx)");
              document.getElementById("importId").value = "";
              event.target.value = "";
              return;
            }
          } catch (error) {
            this.alert(
              error.message ||
                "Erro ao importar dados dos itens. Tente novamente ou entre em contato com o suporte."
            );
          } finally {
            this.isLoadingImport = false;
          }
        }
      }
      document.getElementById("importId").value = "";
      event.target.value = "";
    },
    async onChangeFile(file) {
      if (file.target.files.length > 0) {
        for (let file of file.target.files) {
          try {
            this.isLoadingFile = true;
            let base64 = file;
            let extensao = file.name.split(".").pop();
            let nomeArquivo = file.name.split(".");
            nomeArquivo.pop();
            nomeArquivo = nomeArquivo.join(".");
            let u_maimeType = file.type;
            this.anexos.push({
              base64,
              nomeArquivo,
              extensao,
              u_maimeType,
            });
          } catch (error) {
            this.alert(
              "Falha ao converter anexo(s). Tente Novamente ou entre em contato com o administrador."
            );
          } finally {
            this.isLoadingFile = false;
          }
        }
        document.getElementById("attachedId").value = "";
      }
    },
    async removeAttached(item) {
      this.data.anexos.splice(item.index, 1);
    },
    async register() {
      try {
        this.isLoading = true;
        const { BPLId, CardCode, MainUsage } = this.$store.state.auth.user;

        const newData = {
          BPL_IDAssignedToInvoice: BPLId,
          CardCode: CardCode,
          DocDate: this.data.DocDate,
          DocDueDate: this.data.DocDueDate,
          Comments: this.data.Comments,
          AttachmentEntry: null,
          //U_StatusDoc: this.data.U_StatusDoc,
          //U_nomeStatus: this.data.U_nomeStatus,
          TaxExtension: { MainUsage: MainUsage },
          DocumentLines: this.data.DocumentLines.map((item) => {
            return {
              ItemCode: item.ItemCode,
              ItemName: item.ItemName,
              ShipDate: item.ShipDate,
              Quantity: item.Quantity,
              MeasureUnit: item.MeasureUnit,
              UnitPrice: item.UnitPrice,
            };
          }).filter((item) => item.ItemCode),
        };

        //CADASTRO COM ANEXO
        if (this.anexos.length > 0) {
          const ANEXOS_WITH_GUID = [];
          for (let novoAnexo of this.anexos) {
            let guid = uuidv4();
            console.log(process.env.VUE_APP_ROOT_BUCKET_NAME);
            await S3.putObject({
              Key:
                novoAnexo.nomeArquivo + "_" + guid + "." + novoAnexo.extensao,
              Bucket: process.env.VUE_APP_ROOT_BUCKET_NAME,
              ContentType: novoAnexo.u_maimeType,
              Body: novoAnexo.base64,
            }).promise();
            ANEXOS_WITH_GUID.push({
              ...novoAnexo,
              base64: guid,
            });
          }

          const response = await api.post(`portalPedido/postAttachments`, {
            anexoLines: ANEXOS_WITH_GUID,
          });

          newData.AttachmentEntry = response.data.AbsoluteEntry;
        }
        const { data } = await api.post(`portalPedido/postOrders`, newData);

        this.alert(`Pedido nº ${data.DocNum} cadastrado com sucesso.`);

        this.resetData();
      } catch (error) {
        if (!error.canceled) {
          this.alert(error.message);
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
  watch: {},
};
</script>

<style>
#attachedId,
#importId {
  display: none;
}
</style>
