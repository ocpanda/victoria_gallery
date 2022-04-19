<template lang="pug">
.tags-container
  tag-comp(v-for="(tag, index) of tags ?? []" :tag="tag" :key="tag.value")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import TagComp from './tag.vue'

type Tag = { value: number; label: string }

export default defineComponent({
  name: 'tags',

  components: {
    TagComp,
  },

  props: {
    tags: {
      type: Array as PropType<Tag[]>,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/share.scss';

.tags-container {
  display: flex;
  flex-wrap: wrap;
  margin-left: -4px;
  .tag {
    background-color: $border-shallow-color;
    width: max-content;
    max-width: 120px;
    padding: 8px;
    border-radius: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 4px;
  }
}
</style>
