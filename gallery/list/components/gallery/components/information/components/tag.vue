<template lang="pug">
.tags-container
  mrc-popover(
    :key="tag?.value"
    placement="left"
    trigger="hover"
    :content="tag?.label"
    :disabled="popoverDisabled"
    ref="tagRef"
  )
    template(#reference)
      .tag {{ tag?.label }}
</template>

<script lang="ts">
import { useVModel } from '@vueuse/core'
import { defineComponent, PropType, ref, watch } from 'vue'
import { deepCopy, sleep } from '&/helper'

type Tag = { value: number; label: string }

export default defineComponent({
  name: 'tags',

  props: {
    tag: {
      type: Object as PropType<Tag>,
    },
  },

  setup(props) {
    const innerTag = useVModel(props, 'tag')
    const tagRef = ref()

    const popoverDisabled = ref(true)
    watch(
      () => [innerTag.value, tagRef.value],
      async () => {
        await sleep()

        if (!tagRef.value) return

        const node = tagRef.value.$el.nextElementSibling
        if (node.clientWidth < node.scrollWidth) {
          popoverDisabled.value = false
        }
      },
      { immediate: true }
    )

    return {
      tagRef,
      popoverDisabled,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/share.scss';
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
</style>
