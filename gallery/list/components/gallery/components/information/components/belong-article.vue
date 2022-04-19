<template lang="pug">
.belong-article
  mrc-popover(
    v-for="article of info?.article ?? []"
    :key="info?.value ?? 0"
    placement="left"
    trigger="hover"
    :content="article"
  )
    template(#reference)
      .article {{ article }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Info } from '../use/useInfo'

export default defineComponent({
  name: 'belong-article',

  props: {
    info: {
      type: Object as PropType<Info>,
    },
  },
})
</script>

<style lang="scss">
.article {
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 8px;

  &:first-child {
    margin-top: 18px;
  }
}
</style>
