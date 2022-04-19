<template lang="pug">
mrc-popover(
  placement="bottom"
  trigger="hover"
  :content="innerLabel"
  :disabled="popoverDisabled"
  ref="labelRef"
)
  template(#reference)
    label {{ innerLabel }}
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { sleep } from '&/helper'

export default defineComponent({
  name: 'label-comp',

  props: {
    modelValue: {
      type: String,
    },
  },

  setup(props) {
    const innerLabel = useVModel(props, 'modelValue')
    const labelRef = ref()

    const popoverDisabled = ref(true)
    watch(
      () => [innerLabel.value, labelRef.value],
      async () => {
        await sleep()

        if (!labelRef.value) return

        const node = labelRef.value.$el.nextElementSibling
        if (node.clientHeight < node.scrollHeight) {
          popoverDisabled.value = false
        }
      },
      { immediate: true }
    )

    return {
      labelRef,
      popoverDisabled,
      innerLabel,
    }
  },
})
</script>
