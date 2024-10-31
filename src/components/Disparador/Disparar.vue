<script setup lang="ts">
import {
  mdiReceiptTextSendOutline,
  mdiClose,
  mdiTrashCanOutline,
} from "@mdi/js";
import type {
  GetInstancesData,
  PostDataMessagesDisparar,
} from "@/interfaces/disparador";
import { postDispararMensagens } from "@/service/Disparador/disparadorService";
import { ref } from "vue";
import * as XLSX from "xlsx";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface Props {
  instance: GetInstancesData;
}

const props = defineProps<Props>();
const emit = defineEmits(["getInstances"]);
const dialog = ref(false);
const load = ref(false);
const textoParaEnvio = ref("");
const numeroEnvioInput = ref("");
const numerosParaEnvio = ref([] as string[]);
const fileInput = ref<HTMLInputElement | null>(null); // Criação de referência para o input
const fileInputMessages = ref<HTMLInputElement | null>(null); // Criação de referência para o input
const messages = ref<PostDataMessagesDisparar[]>([
  {
    type: "text",
  },
]);
const typesOptions = [
  {
    label: "Texto",
    value: "text",
  },
  {
    label: "Imagem",
    value: "image",
  },
  {
    label: "Documento",
    value: "document",
  },
  {
    label: "Vídeo",
    value: "video",
  },
];
const MAX_FILE_SIZE_MB = 40;

const disparar = () => {
  load.value = true;
  console.log(messages.value);

  postDispararMensagens(
    props.instance.instanceName,
    numerosParaEnvio.value,
    messages.value
  ).finally(() => {
    emit("getInstances");
    load.value = false;
    notify();
  });
};

const convertToBase64 = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result); // Retorna a string Base64
      } else {
        reject("Erro ao converter para Base64");
      }
    };

    reader.onerror = () => {
      reject("Erro ao ler o arquivo");
    };
  });
};

const onFileChange = async (event: any, index: number) => {
  const file = event.target.files?.[0];
  if (file) {
    let tamanhoPermitido = file.size / (1024 * 1024) > MAX_FILE_SIZE_MB;
    if (!tamanhoPermitido) {
      const base64 = await convertToBase64(file);
      const dataUrl = URL.createObjectURL(file);
      messages.value[index] = {
        filename: file.name,
        ...tratarBase64(base64),
        dataUrl,
      };
    } else {
      toast.error("O tamanho máximo permitido para arquivos é de 40MB.", {
        autoClose: 8000,
      });
    }
  }

  if (fileInputMessages.value) {
    fileInputMessages.value.value = "";
  }
};

const tratarBase64 = (base64: string) => {
  let obj = {
    mediatype: "",
    mimetype: "",
    type: "",
    media: "",
  };
  if (base64.startsWith("data:")) {
    const mediaType = base64.split(";")[0];
    const type = mediaType.split(":")[1].split("/")[0];

    obj = {
      ...obj,
      mediatype: type.replace("application", "document"),
      mimetype: mediaType.split(":")[1].replace("application", "document"),
      type: type.includes("audio")
        ? "audio"
        : type.includes("image")
        ? "image"
        : type.includes("application")
        ? "document"
        : type.includes("video")
        ? "video"
        : "media",
      media: base64.split(",")[1],
    };
  }

  return obj;
};

const apagarNumero = (numero: string) => {
  numerosParaEnvio.value = numerosParaEnvio.value.filter(
    (item) => item !== numero
  );
};

const adicionarNumero = () => {
  numerosParaEnvio.value.push(extractNumbers(numeroEnvioInput.value));
  numeroEnvioInput.value = "";
};

const notify = () => {
  toast.success(
    "Sua campanha começará em breve.\n Obs: Haverá um delay de 1 a 3 minutos entre os disparos!",
    {
      autoClose: 20000,
    }
  );
};

const extractNumbers = (inputString: string) => {
  return String(inputString).replace(/[^0-9]/g, "");
};

const handleFileUpload = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Obtenha a primeira planilha do arquivo Excel
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Converte a planilha em um objeto JSON com o cabeçalho
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Encontrar o índice da coluna com o nome 'numeros'
    const headerRow: any = jsonData[0];
    const specificColumnIndex = headerRow.findIndex(
      (header: any) => header === "numeros"
    );

    if (specificColumnIndex !== -1) {
      // Extraindo dados da coluna 'numeros'
      // columnData.value = jsonData.slice(1).map((row: any) => row[specificColumnIndex]).filter(item => item !== undefined);
      const arrayNumeros = jsonData
        .slice(1)
        .map((row: any) => row[specificColumnIndex])
        .filter((item) => item !== undefined);
      const arrayNumerosFormatados = arrayNumeros.map((item) =>
        extractNumbers(item)
      );
      numerosParaEnvio.value.push(...arrayNumerosFormatados);
    } else {
      console.error("Coluna 'numeros' não encontrada.");
    }

    // Limpar o valor do input de arquivo
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  };

  reader.readAsArrayBuffer(file);
};

const adicionarObjetoMessage = () => {
  messages.value.push({
    type: "text",
  });
};

const removerMessage = (index: number) => {
  messages.value.splice(index, 1);
};

const setValueTypeMessage = (value: string, index: number) => {
  messages.value[index] = {
    type: value,
  };
};
</script>

<template>
  <div>
    <v-btn
      :disabled="instance.status !== 'open'"
      @click="dialog = true"
      class="tw-bg-blue-400"
      size="small"
    >
      <v-icon :icon="mdiReceiptTextSendOutline" class="tw-mr-1" />
      Disparar
    </v-btn>
    <v-dialog v-model="dialog" max-width="500">
      <v-card rounded="lg">
        <v-card-title
          class="d-flex justify-space-between align-center tw-bg-gray-100"
        >
          <div class="text-h5 text-medium-emphasis ps-2">Disparar Mensagem</div>
          <v-btn
            :icon="mdiClose"
            variant="text"
            @click="dialog = false"
          ></v-btn>
        </v-card-title>
        <v-card-text class="tw-pt-1">
          <div class="tw-my-4 tw-font-normal tw-text-lg">
            1- Conteúdo do disparo.
          </div>
          <div v-for="(message, index) in messages" :key="index">
            <div class="tw-flex">
              <v-select
                @update:modelValue="
                  (value) => setValueTypeMessage(value, index)
                "
                v-model="message.type"
                :items="typesOptions"
                item-title="label"
                item-value="value"
                label="Tipo do conteúdo"
                single-line
              ></v-select>
              <div v-if="index != 0">
                <v-btn
                  class="tw-bg-slate-300 tw-h-[55px] tw-ml-[4px] tw-f"
                  size="small"
                  @click="removerMessage(index)"
                >
                  <v-icon :icon="mdiTrashCanOutline" class="tw-mr-1" />
                </v-btn>
              </div>
            </div>
            <div v-if="message.type === 'image'">
              <div v-if="message.dataUrl">
                <img
                  class="tw-h-full tw-w-full"
                  :src="message.dataUrl"
                  alt="Imagem selecionada"
                />
              </div>
            </div>
            <div v-if="message.type === 'video'" class="tw-w-full tw-h-[345px]">
              <div v-if="message.dataUrl" class="tw-w-full tw-h-full">
                <video
                  class="tw-h-full tw-w-full"
                  :src="message.dataUrl"
                  controls
                  :loop="true"
                  :volume="1.0"
                >
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
              </div>
            </div>
            <div v-if="message.type === 'audio'">
              <div v-if="message.dataUrl">
                <audio controls>
                  <source :src="message.dataUrl" />
                  <!-- Your browser does not support the audio element. -->
                </audio>
              </div>
            </div>
            <div v-if="message.type === 'document'">
              <div v-if="message.dataUrl">
                <iframe
                  :src="message.dataUrl"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                  style="border: none"
                ></iframe>
              </div>
            </div>
            <div v-if="message.type === 'text'">
              <v-textarea
                rows="4"
                label="Mensagem"
                v-model="message.message"
              ></v-textarea>
            </div>
            <div
              v-if="!message.dataUrl && message.type != 'text'"
              class="tw-mb-4"
            >
              <input
                class="tw-hidden"
                ref="fileInputMessages"
                id="fuploadMessage"
                name="fuploadMessage"
                type="file"
                @change="(e) => onFileChange(e, index)"
              />
              <label
                for="fuploadMessage"
                class="control-label label-bordered tw-cursor-pointer tw-mr-1 tw-mb-1 tw-inline-flex tw-items-center tw-rounded-md tw-bg-gray-200 tw-px-4 tw-py-2 tw-text-xs tw-font-medium tw-ring-1 tw-ring-inset tw-ring-gray-500/10"
              >
                Clique aqui para escolher um arquivo
              </label>
            </div>
          </div>
          <div>
            <v-btn
              class="ms-auto tw-bg-gray-300"
              text="Adicionar +"
              @click="adicionarObjetoMessage"
            ></v-btn>
          </div>
          <div class="tw-my-4 tw-font-normal tw-text-lg">
            2- Adicione os números.
          </div>
          <div class="tw-mb-2">Manual:</div>
          <div class="tw-flex tw-items-center">
            <div>
              <v-text-field
                class="tw-h-[58px]"
                :hide-spin-buttons="true"
                type="number"
                label="Numero para envio"
                v-model="numeroEnvioInput"
              ></v-text-field>
              <div class="tw-font-light tw-text-xs">Ex: 551199885566</div>
            </div>
            <v-btn
              class="tw-h-[58px] tw-ml-2"
              :disabled="numeroEnvioInput.length < 12"
              variant="text"
              @click="adicionarNumero"
              >Adicionar</v-btn
            >
          </div>
          <div class="tw-mt-4 tw-mb-2">Via planilha:</div>
          <div class="tw-mb-4">
            <input
              class="tw-hidden"
              ref="fileInput"
              id="fupload"
              name="fupload"
              type="file"
              @change="handleFileUpload"
            />
            <label
              for="fupload"
              class="control-label label-bordered tw-cursor-pointer tw-mr-1 tw-mb-1 tw-inline-flex tw-items-center tw-rounded-md tw-bg-gray-200 tw-px-4 tw-py-2 tw-text-xs tw-font-medium tw-ring-1 tw-ring-inset tw-ring-gray-500/10"
            >
              Clique aqui para escolher um arquivo
            </label>
            <div class="tw-font-light tw-text-xs">
              Obs: Permitido arquivos .csv ou .xlsx(Exel) com a coluna
              'numeros'.
            </div>
          </div>
          <div v-if="numerosParaEnvio.length > 0" class="tw-mb-1">
            Numeros adicionados para envio:
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div v-for="item in numerosParaEnvio" :key="item">
              <span
                class="tw-mr-1 tw-mb-1 tw-inline-flex tw-items-center tw-rounded-md tw-bg-blue-500 tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-text-white tw-ring-1 tw-ring-inset tw-ring-gray-500/10"
              >
                {{ item }}
                <v-icon
                  @click="apagarNumero(item)"
                  size="x-small"
                  :icon="mdiClose"
                />
              </span>
            </div>
          </div>
        </v-card-text>
        <template v-slot:actions>
          <v-btn
            :disabled="numerosParaEnvio.length == 0 || messages.length == 0"
            class="ms-auto tw-bg-gray-300"
            text="Enviar"
            :loading="load"
            @click="disparar"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
