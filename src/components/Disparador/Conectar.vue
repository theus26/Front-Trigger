<script setup lang="ts">
import { mdiCellphoneNfc, mdiClose, mdiDataMatrixRemove } from "@mdi/js";
import type { GetInstancesData } from "@/interfaces/disparador";
import { ref } from "vue";
import { getQrcodeInstance } from "@/service/Disparador/disparadorService";
import { watch, defineProps } from "vue";

interface Props {
  instance: GetInstancesData;
  accountId: string;
}

const props = defineProps<Props>();

const emit = defineEmits(["getInstances"]);

const img = ref("");
const dialog = ref(false);
const loading = ref(false);
const img2 = ref("");

watch(img, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      getQrcodeInstance(props.instance.instanceName).then(({ data }) => {
        if (data.base64) {
          img.value = data.base64;
          img2.value = data.base64;
        } else {
          emit("getInstances");
        }
      });
    }, 30000);
  }
});

const getQrcode = () => {
  loading.value = true;
  img.value = "";
  getQrcodeInstance(props.instance.instanceName)
    .then(({ data }) => {
      img.value = data.base64;
      dialog.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
};

const formataNomeConexao = (conexao: string) => {
  if (conexao !== null)
    return conexao.replace(`account_${props.accountId}`, "");
  return "";
};
</script>

<template>
  <div>
    <v-btn
      :loading="loading"
      @click="getQrcode()"
      :disabled="props.instance.status === 'open'"
      class="tw-bg-lime-400"
      size="small"
    >
      <v-icon :icon="mdiCellphoneNfc" class="tw-mr-1" />
      CONECTAR
    </v-btn>
    <v-dialog v-model="dialog" max-width="400">
      <template v-slot:default="{ isActive }">
        <v-card rounded="lg">
          <v-card-title
            class="d-flex justify-space-between align-center tw-bg-gray-100"
          >
            <div class="text-h5 text-medium-emphasis ps-2">
              Conexão: {{ formataNomeConexao(props.instance.instanceName) }}
            </div>
            <v-btn
              :icon="mdiClose"
              variant="text"
              @click="dialog = false"
            ></v-btn>
          </v-card-title>
          <v-card-text class="tw-pt-1" v-if="img">
            <img :src="img" />
          </v-card-text>
          <v-card-text
            v-else
            class="tw-pt-1 tw-flex tw-items-center tw-justify-center"
          >
            <v-icon size="330" :icon="mdiDataMatrixRemove" class="tw-mr-1" />
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
