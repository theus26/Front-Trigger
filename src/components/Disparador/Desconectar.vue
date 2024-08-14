<script setup lang="ts">
import { mdiCellphoneNfcOff, mdiClose } from '@mdi/js'
import type { GetInstancesData } from '@/interfaces/disparador'
import { ref } from 'vue';
import { deleteDesconectarInstancia } from '@/service/Disparador/disparadorService';
defineProps<{
  instance: GetInstancesData
}>()
const emit = defineEmits(['getInstances']);
const dialog = ref(false)
const load = ref(false)

const desconectarInstancia = (instance: string) => {
  load.value = true
  deleteDesconectarInstancia(instance).finally(() => {
    emit('getInstances');
    load.value = false
  })
}

const formataNomeConexao = (conexao: string) => {
  if (conexao !== null) return conexao.replace('account_3', '')
  return ''
}

</script>

<template>
  <div>
    <v-btn :disabled="instance.status !== 'open'" @click="dialog = true" class="tw-bg-red-400" size="small">
      <v-icon :icon="mdiCellphoneNfcOff" class="tw-mr-1" />
      DESCONECTAR
    </v-btn>
    <v-dialog v-model="dialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center tw-bg-gray-100">
          <div class="text-h5 text-medium-emphasis ps-2">
            Desconectar conexão
          </div>
          <v-btn :icon="mdiClose" variant="text" @click="dialog = false"></v-btn>
        </v-card-title>
        <v-card-text class="tw-pt-1">
          Tem certeza que deseja desconectar a conexão de nome <strong>{{ formataNomeConexao(instance.instanceName) }}</strong> ?
        </v-card-text>
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Confirmar" :loading="load"
            @click="desconectarInstancia(instance.instanceName)"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>