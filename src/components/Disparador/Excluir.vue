<script setup lang="ts">
import { mdiTrashCanOutline, mdiClose } from '@mdi/js'
import type { GetInstancesData } from '@/interfaces/disparador'
import { ref } from 'vue';
import { deleteDeletarInstancia } from '@/service/Disparador/disparadorService';

interface Props {
  instance: GetInstancesData;
  accountId: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['getInstances']);
const dialog = ref(false)
const load = ref(false)

const deletarInstancia = (instance: string) => {
  load.value = true
  deleteDeletarInstancia(instance).finally(() => {
    emit('getInstances');
    load.value = false
  })
}

const formataNomeConexao = (conexao: string) => {
  if (conexao !== null) return conexao.replace(`account_${props.accountId}`, '')
  return ''
}

</script>

<template>
  <div>
    <v-btn class="tw-bg-slate-300" size="small" @click="dialog = true">
      <v-icon :icon="mdiTrashCanOutline" class="tw-mr-1" />
      EXCLUIR
    </v-btn>
    <v-dialog v-model="dialog" max-width="400">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center tw-bg-gray-100">
          <div class="text-h5 text-medium-emphasis ps-2">
            Excluir conexão
            <!--  -->
          </div>
          <v-btn :icon="mdiClose" variant="text" @click="dialog = false"></v-btn>
        </v-card-title>
        <v-card-text class="tw-pt-1">
          Tem certeza que deseja excluir a conexão de nome <strong>{{ formataNomeConexao(props.instance.instanceName) }}</strong> ?
        </v-card-text>
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Confirmar" :loading="load"
            @click="deletarInstancia(props.instance.instanceName)"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>