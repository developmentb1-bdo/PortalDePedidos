<!--usage:     <OrderPdfModal
      :selectedDocNum="selectedDocNum" 
      :selectedDocEntry="selectedDocEntry" 
      
    /> -->

<template>
  <b-modal
    no-close-on-esc
    no-close-on-backdrop
    :hide-header="true"
    :hide-footer="true"
    @hide="onHide"
    size="lg"
    id="OrderPdfModal"
  >
    <div
      class="d-flex flex-row justify-content-between title align-items-center"
    >
      <strong class="fs-18px">Pedido Nº{{ docNum }}</strong>
      <div class="d-flex align-items-center">
        <b-dropdown
          id="dropdown-1"
          text="Anexos"
          class="m-md-2"
          :disabled="
            isLoadingData || attachedFiles.length == 0 || isLoadingAttachment
          "
          dropleft
          variant="default"
        >
          <template #button-content class="align-items-center d-flex">
            <span
              v-if="isLoadingAttachment"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            <label> Anexos </label>
          </template>

          <b-dropdown-item
            v-for="(item, index) in attachedFiles"
            :key="index"
            @click="
              downloadAttachment(
                item.AbsoluteEntry,
                item.FileName,
                item.FileExtension
              )
            "
            >{{ item.FileName }}</b-dropdown-item
          >
        </b-dropdown>
        <b-button
          class="me-2"
          @click="generatePDF"
          :disabled="isLoadingData || isLoadingDownload || hasError"
          variant="default"
        >
          <span
            v-if="isLoadingDownload"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          <i class="fa fa-file-pdf fa-lg text-red me-2" aria-hidden="true"></i>
          Download
        </b-button>
      </div>
    </div>

    <hr />

    <div
      v-if="hasError"
      class="d-flex flex-column justify-content-center align-items-center"
    >
      <p>
        <strong>Erro ao carregar dados</strong>
      </p>
      <p>
        <strong>Tente novamente ou entre em contato com o suporte.</strong>
      </p>
      <button class="btn btn-default" @click="onShow">Recarregar</button>
    </div>

    <div v-else>
      <div
        v-if="isLoadingData"
        class="d-flex justify-content-center align-items-center"
      >
        <b-spinner small label="Spinning" class="align-middle"></b-spinner>
        <span class="ms-2"><strong>Carregando dados...</strong></span>
      </div>
      <div v-else ref="content">
        <!-- INÍCIO CONTEÚDO PDF -->
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            min-width: 900px;
            width: auto;
          "
        >
          <header
            class="d-flex p-8px h-80px border-1 border-top border-start border-end border-bottom"
            style="
              background-color: white;
              border-width: 1px;
              border-color: black;
            "
          >
            <div class="d-flex flex-1 justify-content-start align-items-center">
              <img
                src="/assets/logo/logo.png"
                width="150"
                height="60"
                crossOrigin="anonymous"
              />
            </div>
          </header>
          <!-- 
          <div class="d-flex flex-row align-items-center mt-8px">
            <div class="d-flex flex-column flex-1">
              <div class="col-sm-12 col-12">
                <label class="w-80px"><strong>Empresa:</strong> </label
                ><label>{{ companyInfo.nome }}</label>
              </div>
              <div class="col-sm-12 col-12">
                <label class="w-80px"><strong>Filial:</strong> </label
                ><label class="">{{ this.details[0].BPLName }}</label>
              </div>
              <div class="col-sm-12 col-12">
                <label class="w-80px"><strong>CNPJ:</strong> </label
                ><label class="">{{ this.details[0].VATRegNum }}</label>
              </div>
            </div>
          </div> -->

          <hr />

          <h1
            class="text-black fs-14px text-center p-5px rounded"
            style="border: 1px solid #e1e1e1"
          >
            <strong class="fs-18px">PEDIDO Nº{{ this.docNum }}</strong>
          </h1>

          <hr />

          <div
            class="d-flex justify-content-between rounded px-8px h-30px align-items-center"
            style="border: 1px solid #e1e1e1; background-color: #f1f1f1"
          >
            <label>
              <strong>Vendedor: </strong
              ><label>{{
                this.details[0].U_nomeSalesP ? this.details[0].U_nomeSalesP : ""
              }}</label>
            </label>
          </div>

          <br />

          <h1
            class="text-black fs-14px text-center p-5px"
            style="background-color: #e1e1e1"
          >
            DATAS FORNECIDAS
          </h1>

          <div
            class="d-flex flex-row justify-content-between align-items-center ps-4 pe-4"
          >
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Data de Emissão</strong></label
              >
              <label class="col-md-12 text-center"
                >{{
                  this.details[0].DocDate.substring(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")
                }}
              </label>
            </div>
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Data de Entrega</strong></label
              >
              <label class="col-md-12 text-center"
                >{{
                  this.details[0].DocDueDate.substring(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")
                }}
              </label>
            </div>
          </div>

          <hr />

          <h1
            class="text-black fs-14px text-center p-5px"
            style="background-color: #e1e1e1"
          >
            DADOS DO CLIENTE
          </h1>

          <div class="d-flex flex-column">
            <div class="col-sm-12 col-12 ps-4 pe-4">
              <label class="w-150px"><strong>Cliente:</strong> </label
              ><label class="">{{ this.details[0].CardName }} </label>
            </div>
            <div class="col-sm-12 col-12 ps-4 pe-4">
              <label class="w-150px"><strong>Cód. Cliente:</strong> </label
              ><label class="">{{ this.details[0].CardCode }} </label>
            </div>

            <div class="col-sm-12 col-12 ps-4 pe-4">
              <label class="w-150px"><strong>CPF/CNJP:</strong> </label
              ><label class="">{{
                this.details[0].TaxExtension.TaxId0
                  ? this.details[0].TaxExtension.TaxId0
                  : this.details[0].TaxExtension.TaxId4
                  ? this.details[0].TaxExtension.TaxId4
                  : ""
              }}</label>
            </div>
            <br />
            <div class="col-sm-12 col-12 ps-4 pe-4">
              <div class="d-flex flex-1 flex-column">
                <strong><p>ENDEREÇO</p></strong>
                <label
                  v-if="
                    this.details[0].AddressExtension.BillToStreet ||
                    this.details[0].AddressExtension.BillToStreetNo ||
                    this.details[0].AddressExtension.BillToZipCode
                  "
                >
                  <label
                    v-if="this.details[0].AddressExtension.BillToAddressType"
                    >{{ this.details[0].AddressExtension.BillToAddressType }}
                  </label>
                  {{
                    this.details[0].AddressExtension.BillToStreet &&
                    (this.details[0].AddressExtension.BillToStreetNo ||
                      this.details[0].AddressExtension.BillToZipCode)
                      ? `${this.details[0].AddressExtension.BillToStreet}, `
                      : this.details[0].AddressExtension.BillToStreet
                      ? this.details[0].AddressExtension.BillToStreet
                      : ""
                  }}
                  {{
                    this.details[0].AddressExtension.BillToStreetNo &&
                    this.details[0].AddressExtension.BillToZipCode
                      ? `${this.details[0].AddressExtension.BillToStreetNo}, `
                      : this.details[0].AddressExtension.BillToStreetNo
                      ? this.details[0].AddressExtension.BillToStreetNo
                      : ""
                  }}
                  {{ this.details[0].AddressExtension.BillToZipCode }}
                </label>
                <label
                  v-if="
                    this.details[0].AddressExtension.BillToCity ||
                    this.details[0].AddressExtension.BillToState ||
                    this.details[0].AddressExtension.BillToCountry ||
                    this.details[0].AddressExtension.BillToGlobalLocationNumber
                  "
                >
                  {{
                    this.details[0].AddressExtension.BillToCity &&
                    (this.details[0].AddressExtension.BillToState ||
                      this.details[0].AddressExtension.BillToCountry)
                      ? `${this.details[0].AddressExtension.BillToCity}, `
                      : this.details[0].AddressExtension.BillToCity
                      ? this.details[0].AddressExtension.BillToCity
                      : ""
                  }}
                  {{
                    this.details[0].AddressExtension.BillToState &&
                    this.details[0].AddressExtension.BillToCountry
                      ? `${this.details[0].AddressExtension.BillToState}, `
                      : this.details[0].AddressExtension.BillToState
                      ? this.details[0].AddressExtension.BillToState
                      : ""
                  }}
                  {{ this.details[0].AddressExtension.BillToCountry }}
                  {{
                    this.details[0].AddressExtension.BillToCountry &&
                    this.details[0].AddressExtension.BillToGlobalLocationNumber
                      ? ` (${this.details[0].AddressExtension.BillToGlobalLocationNumber})`
                      : this.details[0].AddressExtension
                          .BillToGlobalLocationNumber
                      ? this.details[0].AddressExtension
                          .BillToGlobalLocationNumber
                      : ""
                  }}
                </label>
                <label
                  v-if="
                    this.details[0].AddressExtension.BillToAddress2 ||
                    this.details[0].AddressExtension.BillToAddress3
                  "
                >
                  <strong>Complemento: </strong
                  >{{
                    this.details[0].AddressExtension.BillToAddress2 &&
                    this.details[0].AddressExtension.BillToAddress3
                      ? `${this.details[0].AddressExtension.BillToAddress2} - `
                      : this.details[0].AddressExtension.BillToAddress2
                      ? this.details[0].AddressExtension.BillToAddress2
                      : ""
                  }}
                  {{ this.details[0].AddressExtension.BillToAddress3 }}
                </label>
                <label v-if="this.details[0].AddressExtension.BillToBlock">
                  <strong>Bloco: </strong
                  >{{ this.details[0].AddressExtension.BillToBlock }}
                </label>
                <label v-if="this.details[0].AddressExtension.BillToBuilding">
                  <strong>Prédio: </strong
                  >{{ this.details[0].AddressExtension.BillToBuilding }}
                </label>
              </div>
            </div>
          </div>

          <hr />

          <h1
            class="text-black fs-14px text-center p-5px"
            style="background-color: #e1e1e1"
          >
            CONDIÇÕES COMERCIAIS
          </h1>

          <div
            class="d-flex flex-row justify-content-between align-items-center ps-4 pe-4"
          >
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Condição de Pagamento</strong></label
              >
              <label class="col-md-12 text-center">{{
                this.details[0].U_nomeCondicaoP
                  ? this.details[0].U_nomeCondicaoP
                  : "-"
              }}</label>
            </div>
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Forma de Pagamento</strong></label
              >
              <label class="col-md-12 text-center">{{
                this.details[0].PaymentMethod
                  ? this.details[0].PaymentMethod
                  : "-"
              }}</label>
            </div>
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Utilização Principal</strong></label
              >
              <label class="col-md-12 text-center">{{
                this.details[0].TaxExtension.MainUsage
                  ? this.details[0].TaxExtension.MainUsage
                  : "-"
              }}</label>
            </div>
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Moeda</strong></label
              >
              <label class="col-md-12 text-center"
                >{{ this.details[0].DocCurrency }}
              </label>
            </div>
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Dados do Câmbio</strong></label
              >
              <label class="col-md-12 text-center">
                {{ this.details[0].DocRate }}
              </label>
            </div>
            <div
              class="d-flex flex-column align-items-center justify-content-center rounded"
              style="background-color: #e1e1e1; font-size: 16px; padding: 4px"
            >
              <label class="col-md-12 text-center"
                ><strong>Total</strong></label
              >
              <label class="col-md-12 text-center"
                >{{ this.convertCurrency(this.details[0].DocTotal) }}
              </label>
            </div>
          </div>

          <h1
            class="text-black fs-14px text-center p-5px mt-4"
            style="background-color: #e1e1e1"
          >
            OBSERVAÇÕES
          </h1>
          <p>
            {{ this.details[0].Comments ? this.details[0].Comments : "N/A" }}
          </p>

          <hr />

          <div class="" style="border: 1px solid #e1e1e1">
            <h1
              class="text-black fs-14px text-center p-5px"
              style="background-color: #e1e1e1"
            >
              DADOS DO PRODUTO / SERVIÇO
            </h1>
            <b-table :items="items" :fields="fields" hover show-empty>
              <template #empty>
                <h6
                  class="d-flex justify-content-center align-items-center mt-2"
                >
                  Nenhum item encontrado.
                </h6>
              </template>
              <template #cell(#)="row">
                <span class="form-span">{{ row.index + 1 }}</span>
              </template>
              <template #cell(ShipDate)="row">
                <span class="form-span">{{
                  row.value.substring(0, 10).split("-").reverse().join("/")
                }}</span>
              </template>
              <template #cell(Price)="row">
                <span class="form-span">{{ convertCurrency(row.value) }}</span>
              </template>
              <!-- <template #cell(Price)="row">
                                      <span class="form-span">{{ convertCurrency(row.value) }}</span>
                                    </template> -->
              <template #cell(LineTotal)="row">
                <span class="form-span">{{ convertCurrency(row.value) }}</span>
              </template>
            </b-table>
          </div>

          <hr />

          <h1
            class="text-black fs-14px text-center p-5px"
            style="background-color: #e1e1e1"
          >
            TOTAIS
          </h1>

          <div
            class="d-flex flex-row justify-content-between align-items-center ps-4 pe-4"
          >
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Peso Líquido</strong></label
              >
              <label class="col-md-12 text-center">{{
                this.details[0].TaxExtension.NetWeight
                  ? this.details[0].TaxExtension.NetWeight
                  : "-"
              }}</label>
            </div>
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Peso Bruto</strong></label
              >
              <label class="col-md-12 text-center">{{
                this.details[0].TaxExtension.GrossWeight
                  ? this.details[0].TaxExtension.GrossWeight
                  : "-"
              }}</label>
            </div>
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Volumes</strong></label
              >
              <label class="col-md-12 text-center">{{
                this.details[0].U_BDO_VolumeCx
                  ? this.details[0].U_BDO_VolumeCx
                  : "-"
              }}</label>
            </div>
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>IPI/ST (Substituição Tributária)</strong></label
              >
              <label class="col-md-12 text-center"
                >{{ this.details[0].VatSum }}
              </label>
            </div>
            <div
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <label class="col-md-12 text-center"
                ><strong>Dados do Câmbio</strong></label
              >
              <label class="col-md-12 text-center">
                {{ this.details[0].DocRate }}
              </label>
            </div>
          </div>

          <hr />

          <h1
            class="text-black fs-14px text-center p-5px"
            style="background-color: #e1e1e1"
          >
            FRETE
          </h1>

          <div class="d-flex flex-column">
            <div class="col-sm-12 col-12 ps-4 pe-4">
              <label class="w-150px"><strong>Valor do Frete:</strong> </label
              ><label class="">
                {{
                  this.details[0].DocumentAdditionalExpenses.length > 0
                    ? this.convertCurrencyFrete(
                        this.details[0].DocumentAdditionalExpenses[0].LineTotal
                      )
                    : this.convertCurrencyFrete(0)
                }}</label
              >
            </div>
          </div>

          <!-- FIM CONTEÚDO PDF -->
        </div>
      </div>
    </div>

    <hr />

    <div class="row mt-4">
      <div class="d-flex flex-1 mb-4 justify-content-end">
        <button class="btn btn-danger" @click="onCancelModal">Fechar</button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { api, cancelAllRequests } from "@/config/api";

//import generatePdfExtraInformation from "../../../handler/generatePdfExtraInformation";
import { S3 } from "@/config/AWSS3";
import downloadjs from "downloadjs";
import jspdf from "jspdf";

const initialState = () => {
  return {
    docNum: null,
    isLoadingData: false,
    isLoadingAttachment: false,
    isLoadingDownload: false,
    isSendingEmail: false,
    showPdfEmail: false,
    hasError: true,
    emailDestinatario: "",
    details: [
      {
        AddressExtension: {
          ShipToAddressType: "",
          ShipToStreet: "",
          ShipToStreetNo: "",
          ShipToZipCode: "",
          ShipToAddress2: "",
          ShipToAddress3: "",
          ShipToBlock: "",
          ShipToBuilding: "",
          ShipToCity: "",
          ShipToState: "",
          ShipToCountry: "",
          ShipToGlobalLocationNumber: "",
          BillToAddressType: "",
          BillToStreet: "",
          BillToStreetNo: "",
          BillToZipCode: "",
          BillToAddress2: "",
          BillToAddress3: "",
          BillToBlock: "",
          BillToBuilding: "",
          BillToCity: "",
          BillToState: "",
          BillToCountry: "",
          BillToGlobalLocationNumber: "",
        },
        BPLName: "", //filial
        DocumentsOwner: "", //código do solicitante
        ImportFileNum: "",
        DocDate: "", //data lançamento
        DocDueDate: "", //data entrega
        TaxDate: "", //data de solicitação

        CardCode: "", //código fornecedor
        CardName: "", // nome do fornecedor
        TaxExtension: {
          TaxId0: "", // cnpj
          TaxId4: "", // cpf
        },
        DocCurrency: "", //moeda de compra
        DocRate: "", // dados do câmbio
        Doctotal: "", // valor total documento

        DocumentAdditionalExpenses: [],
        DocumentLines: [],
        Comments: "", //Observação
      },
    ],
    PaymentTermsGroupName: "", //condição de pagamento

    items: [],
    filteredFields: [],
    fields: [
      {
        key: "#",
        label: "#",
        class: "text-center align-middle",
        thClass: "fs-10px text-nowrap",
        tdClass: "fs-10px",
      },
      {
        key: "ItemCode",
        label: "Código",
        class: "text-center align-middle",
        thClass: "fs-10px text-nowrap",
        tdClass: "fs-10px",
      },
      {
        key: "ItemDescription",
        label: "Descrição do Item",
        class: "text-start align-middle",
        thClass: "fs-10px",
        tdClass: "fs-10px",
      },
      {
        key: "CFOPCode",
        label: "CFOP",
        class: "text-center align-middle",
        thClass: "fs-10px text-nowrap",
        tdClass: "fs-10px",
      },
      {
        key: "MeasureUnit",
        label: "Unidade",
        class: "text-center align-middle",
        thClass: "fs-10px text-nowrap",
        tdClass: "fs-10px",
      },
      {
        key: "ShipDate",
        label: "Data Entrega",
        class: "text-center align-middle",
        thClass: "fs-10px text-nowrap",
        tdClass: "fs-10px",
      },
      {
        key: "Quantity",
        label: "Quantidade",
        class: "text-center align-middle",
        thClass: "fs-10px text-nowrap",
        tdClass: "fs-10px",
      },
      {
        key: "Price",
        label: "Preço Unit.",
        class: "text-center align-middle",
        thClass: "fs-10px text-nowrap",
        tdClass: "fs-10px",
      },

      {
        key: "LineTotal",
        label: "Total (MC)",
        class: "text-center align-middle",
        thClass: "fs-10px text-nowrap",
        tdClass: "fs-10px",
      },
    ],
    attachedFiles: [],
  };
};

export default {
  props: ["selectedDocNum", "selectedDocEntry"],
  data() {
    return initialState();
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
    reset() {
      Object.assign(this.$data, initialState());
    },
    onHide() {
      cancelAllRequests();
      this.$emit("resetDocNum");
      this.reset();
    },
    onCancelModal() {
      this.reset();
      this.$bvModal.hide("OrderPdfModal");
    },
    onShow() {},
    async getData() {
      try {
        this.isLoadingData = true;
        this.hasError = false;

        const { data } = await api.get(
          `portalPedido/getGeneric?query=Orders?$filter=DocNum eq ${this.docNum}`
        );

        if (data.value[0].AttachmentEntry) {
          await api
            .get(
              `portalPedido/getAttachments?attachmentEntry=${data.value[0].AttachmentEntry}`
            )
            .then(async (res) => {
              this.attachedFiles = res.data.Attachments2_Lines.map((item) => {
                item.AbsoluteEntry = res.data.AbsoluteEntry;
                return item;
              });
            });
        }

        this.details = data.value;
        this.items = this.details[0].DocumentLines;
      } catch (err) {
        console.log(err);
        this.hasError = true;
      } finally {
        this.isLoadingData = false;
      }
    },
    async generatePDF() {
      const addFooters = (doc) => {
        const pageCount = doc.internal.getNumberOfPages();

        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        for (var i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(
            "Página " + String(i) + " de " + String(pageCount),
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 15,
            {
              align: "center",
            }
          );
        }
      };
      try {
        this.isLoadingDownload = true;

        let fileName = "Pedido-" + this.docNum + ".pdf";

        const html = this.$refs.content.innerHTML;

        const doc = new jspdf({
          orientation: "portrait",
          unit: "px",
          format: [928.7, 1122.5],
          hotfixes: ["px_scaling"],
        });

        await doc.html(html, {
          margin: [15, 0, 40, 0],
          callback: async function (doc) {
            const numOfPages = doc.internal.getNumberOfPages();

            for (let i = numOfPages; i > 0; i--) {
              if (
                doc.internal.pages[i] &&
                doc.internal.pages[i][0] == "0.75 w" &&
                doc.internal.pages[i][12] != "q"
              ) {
                doc.deletePage(i);
              }
            }

            addFooters(doc);
            doc.save(fileName);
          },
          x: 15,
          y: 0,
          autoPaging: "text",
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoadingDownload = false;
      }
    },
    convertCurrency(value) {
      if (this.details[0].DocCurrency == "R$") {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      } else {
        return value;
      }
    },
    convertCurrencyFrete(value) {
      if (this.details[0].DocCurrency == "R$") {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      } else {
        return value;
      }
    },
    async downloadAttachment(AbsoluteEntry, fileName, ext) {
      try {
        this.isLoadingAttachment = true;
        await api.get(
          `portalPedido/downloadAttachments?attachmentEntry=${AbsoluteEntry}&fileName=${
            fileName + "." + ext
          }`
        );
        let nomeArquivo = fileName.split("_");
        nomeArquivo.pop();
        nomeArquivo = nomeArquivo
          .join("")
          .split("")
          .filter((item) => item != "." && item != " ")
          .join("");
        const arquivo = await S3.getObject({
          Key: fileName + "." + ext,
          Bucket: process.env.VUE_APP_ROOT_BUCKET_NAME,
        }).promise();
        downloadjs(
          new Blob([arquivo.Body], {
            type: arquivo.ContentType,
          }),
          nomeArquivo,
          arquivo.ContentType
        );
      } catch (error) {
        console.log(error);
        this.alert(
          "Erro ao tentar realizar o download do arquivo. Tente novamente ou entre em contato com o suporte."
        );
      } finally {
        this.isLoadingAttachment = false;
      }
    },
  },
  watch: {
    selectedDocNum: function (docNum) {
      if (docNum) {
        this.docNum = docNum;
        this.getData();
      }
    },
  },
};
</script>

<style>
@media (min-width: 576px) {
  #OrderPdfModal .modal-lg {
    max-width: 1200px;
    min-width: 930px;
  }
}
@media (min-width: 992px) {
  #OrderPdfModal .modal-lg {
    max-width: 1200px;
    min-width: 930px;
    padding-left: 20px;
    padding-right: 20px;
  }
}
@media (min-width: 1200px) {
  #OrderPdfModal .modal-lg {
    max-width: 1200px;
    min-width: 930px;
    padding-left: 100px;
    padding-right: 100px;
  }
}
</style>
