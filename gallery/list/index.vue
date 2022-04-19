<template lang="pug">
gallery-comp
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GalleryComp from './components/gallery/index.vue'

export default defineComponent({
  name: 'gallery-index',

  components: {
    GalleryComp,
  },
})
</script>
