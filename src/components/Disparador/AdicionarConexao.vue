<script setup lang="ts">
import { mdiPlus, mdiClose, mdiRefresh } from '@mdi/js'
import { ref } from 'vue';
import { postCriarInstance } from '@/service/Disparador/disparadorService';

interface Props {
  accountId: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['getInstances']);
const dialog = ref(false)
const load = ref(false)
const instanceName = ref('')
const rules = [
  (value: string) => !!value || 'Obrigatório.',
  (value: string) => (value || '').length <= 20 || 'Max 20 characters',
]

const AdicionarInstancia = () => {
  load.value = true
  postCriarInstance(`account_${props.accountId}${instanceName.value}`).finally(() => {
    emit('getInstances');
    load.value = false
  })
}

</script>

<template>
  <div class="tw-flex tw-h-full">
    <div class="tw-mr-4">
      <v-btn v-tooltip="'Recarregar conexões'" @click="emit('getInstances')">
        <v-icon :icon="mdiRefresh" class="tw-mr-1" />
      </v-btn>
    </div>
    <div>
      <v-btn @click="dialog = true" class="tw-bg-lime-500">
        <v-icon :icon="mdiPlus" class="tw-mr-1" />
        ADICIONAR CONEXÃO
      </v-btn>
    </div>
    <v-dialog v-model="dialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center tw-bg-gray-100">
          <div class="text-h5 text-medium-emphasis ps-2">
            Adicionar conexão
          </div>
          <v-btn :icon="mdiClose" variant="text" @click="dialog = false"></v-btn>
        </v-card-title>
        <v-card-text class="tw-pt-1">
          <div>
            <v-text-field label="Nome da conexão" v-model="instanceName" :rules="rules"></v-text-field>
          </div>
        </v-card-text>
        <template v-slot:actions>
          <v-btn :disabled="!instanceName" class="ms-auto" text="Adicionar" :loading="load"
            @click="AdicionarInstancia()"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>