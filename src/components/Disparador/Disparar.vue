<script setup lang="ts">
import { mdiReceiptTextSendOutline, mdiClose } from '@mdi/js'
import type { GetInstancesData } from '@/interfaces/disparador'
import { postDispararMensagens } from '@/service/Disparador/disparadorService';
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


interface Props {
  instance: GetInstancesData;
}

const props = defineProps<Props>();
const emit = defineEmits(['getInstances']);
const dialog = ref(false)
const load = ref(false)
const textoParaEnvio = ref('')
const numeroEnvioInput = ref('')
const numerosParaEnvio = ref([] as string[])
const fileInput = ref<HTMLInputElement | null>(null); // Criação de referência para o input

const disparar = () => {
  load.value = true
  postDispararMensagens(props.instance.instanceName, numerosParaEnvio.value, textoParaEnvio.value).finally(() => {
    emit('getInstances');
    load.value = false
    notify()
  })
}

const apagarNumero = (numero: string) => {
  numerosParaEnvio.value = numerosParaEnvio.value.filter((item) => item !== numero)
}

const adicionarNumero = () => {
  numerosParaEnvio.value.push(extractNumbers(numeroEnvioInput.value))
  numeroEnvioInput.value = ''
}

const notify = () => {
  toast.success("Sua campanha começará em breve.\n Obs: Haverá um delay de 1 a 3 minutos entre os disparos!", {
    autoClose: 20000,
  });
}

const extractNumbers = (inputString: string) => {
  return String(inputString).replace(/[^0-9]/g, '');
}

const handleFileUpload = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Obtenha a primeira planilha do arquivo Excel
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Converte a planilha em um objeto JSON com o cabeçalho
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Encontrar o índice da coluna com o nome 'numeros'
    const headerRow: any = jsonData[0];
    const specificColumnIndex = headerRow.findIndex((header: any) => header === 'numeros');

    if (specificColumnIndex !== -1) {
      // Extraindo dados da coluna 'numeros'
      // columnData.value = jsonData.slice(1).map((row: any) => row[specificColumnIndex]).filter(item => item !== undefined);
      const arrayNumeros = jsonData.slice(1).map((row: any) => row[specificColumnIndex]).filter(item => item !== undefined);
      const arrayNumerosFormatados = arrayNumeros.map((item) => extractNumbers(item))
      numerosParaEnvio.value.push(...arrayNumerosFormatados)
    } else {
      console.error("Coluna 'numeros' não encontrada.");
    }

    // Limpar o valor do input de arquivo
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };

  reader.readAsArrayBuffer(file);
}
</script>

<template>
  <div>
    <v-btn :disabled="instance.status !== 'open'" @click="dialog = true" class="tw-bg-blue-400" size="small">
      <v-icon :icon="mdiReceiptTextSendOutline" class="tw-mr-1" />
      Disparar
    </v-btn>
    <v-dialog v-model="dialog" max-width="500">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center tw-bg-gray-100">
          <div class="text-h5 text-medium-emphasis ps-2">
            Disparar Mensagem
          </div>
          <v-btn :icon="mdiClose" variant="text" @click="dialog = false"></v-btn>
        </v-card-title>
        <v-card-text class="tw-pt-1">
          <div class="tw-my-4 tw-font-normal tw-text-lg">1- Adicione a mensagem que será enviada.</div>
          <v-textarea rows="4" label="Mensagem" v-model="textoParaEnvio"></v-textarea>
          <div class="tw-my-4 tw-font-normal tw-text-lg">2- Adicione os números.</div>
          <div>Manual:</div>
          <div class="tw-flex tw-items-center">
            <div>
              <v-text-field class="tw-h-[58px]" :hide-spin-buttons="true" type="number" label="Numero para envio"
                v-model="numeroEnvioInput"></v-text-field>
              <div class="tw-font-light tw-text-xs">
                Ex: 551199885566
              </div>
            </div>
            <v-btn class="tw-h-[58px] tw-ml-2" :disabled="numeroEnvioInput.length < 12" variant="text"
              @click="adicionarNumero">Adicionar</v-btn>
          </div>
          <div class="tw-mt-4"> Via planilha:</div>
          <div class="tw-mb-4">
            Arquivo CSV
            <input label="teste" ref="fileInput" type="file" @change="handleFileUpload" />
          </div>
          <div v-if="numerosParaEnvio.length > 0" class="tw-mb-1">
            Numeros adicionados para envio:
          </div>
          <div class="tw-flex tw-flex-wrap">
            <div v-for="item in numerosParaEnvio">
              <span
                class="tw-mr-1 tw-mb-1 tw-inline-flex tw-items-center tw-rounded-md tw-bg-blue-500 tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-text-white tw-ring-1 tw-ring-inset tw-ring-gray-500/10">
                {{ item }}
                <v-icon @click="apagarNumero(item)" size="x-small" :icon="mdiClose" />
              </span>
            </div>
          </div>
        </v-card-text>
        <template v-slot:actions>
          <v-btn :disabled="numerosParaEnvio.length == 0 || !textoParaEnvio" class="ms-auto tw-bg-gray-300"
            text="Enviar" :loading="load" @click="disparar"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>