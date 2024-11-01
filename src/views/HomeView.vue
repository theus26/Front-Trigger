<script setup lang="ts">
import { getFetchInstances } from "@/service/Disparador/disparadorService";
import { ref } from "vue";
import Desconectar from "@/components/Disparador/Desconectar.vue";
import Conectar from "@/components/Disparador/Conectar.vue";
import Profile from "@/components/Disparador/Profile.vue";
import Excluir from "@/components/Disparador/Excluir.vue";
import AdicionarConexao from "@/components/Disparador/AdicionarConexao.vue";
import { onMounted } from "vue";
import SkeletonTable from "@/components/Disparador/SkeletonTable.vue";
import Disparar from "@/components/Disparador/Disparar.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const instances = ref();
const load = ref(false);
const accountId = ref<string>(String(route.query.account_id));

onMounted(() => {
  getInstances();
});

const getInstances = () => {
  load.value = true;
  getFetchInstances(accountId.value).then(({ data }) => {
    instances.value = data;
    load.value = false;
  });
};

const formatarNumeroWhatsapp = (numero: string) => {
  if (numero != null) return numero.replace("@s.whatsapp.net", "");
  return "";
};

const formataNomeConexao = (conexao: string) => {
  if (conexao !== null)
    return conexao.replace(`account_${accountId.value}`, "");
  return "";
};
</script>

<template>
  <main class="tw-w-full tw-h-full">
    <SkeletonTable v-if="load" />
    <div v-else>
      <div class="tw-flex tw-justify-between tw-m-1">
        <div class="tw-text-2xl tw-font-sans tw-font-semibold">Conexões</div>
        <AdicionarConexao :accountId="accountId" @getInstances="getInstances" />
      </div>
      <v-table fixed-header>
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-left">Nome</th>
            <th class="text-left">Número conectado</th>
            <th class="text-left"></th>
            <th class="text-left"></th>
            <th class="text-left"></th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in instances" :key="item.instanceId">
            <td>
              <Profile :img_url="item.profilePictureUrl" />
            </td>
            <td>{{ formataNomeConexao(item.instanceName) }}</td>
            <td>
              {{
                item.owner
                  ? formatarNumeroWhatsapp(item.owner)
                  : "xxxxxxxxxxxxx"
              }}
            </td>
            <td>
              <Disparar @getInstances="getInstances" :instance="item" />
            </td>
            <td>
              <Conectar
                :accountId="accountId"
                @getInstances="getInstances"
                :instance="item"
              />
            </td>
            <td>
              <Desconectar
                :accountId="accountId"
                @getInstances="getInstances"
                :instance="item"
              />
            </td>
            <td>
              <Excluir
                :accountId="accountId"
                @getInstances="getInstances"
                :instance="item"
              />
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </main>
</template>
