<script setup lang="ts">

const table = [
  0, 1, 2, 3
]
</script>

<template>
  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-left"></th>
        <th class="text-left">
          Nome
        </th>
        <th class="text-left">
          Número conectado
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in table" :key="item">
        <td>
          <v-skeleton-loader type="avatar"></v-skeleton-loader>
        </td>
        <td>
          <v-skeleton-loader type="list-item"></v-skeleton-loader>
        </td>
        <td>
          <v-skeleton-loader type="list-item"></v-skeleton-loader>
        </td>
        <td>
          <v-skeleton-loader type="list-item"></v-skeleton-loader>
        </td>
        <td>
          <v-skeleton-loader type="list-item"></v-skeleton-loader>
        </td>
        <td>
          <v-skeleton-loader type="list-item"></v-skeleton-loader>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
