<template lang="pug">
mrc-upload(
  v-if="modelValue?.value === 'local'"
  v-model="file"
  :preview="false"
  :accept-formats="imageConstraints.acceptFormats"
  :max-size="imageConstraints.maxSize"
  :max-file="0"
)

mrc-dialog-trigger(v-else-if="modelValue?.value === 'url'")
  template(#reference="{ open }")
    mrc-button(
      :type="modelValue?.type"
      @click="buttonHandleMethod === undefined ? '' : buttonHandleMethod(open)"
    )
      div {{ modelValue?.label ?? '-' }}
  external-img(@on-success="externalSuccessHandler")

mrc-button(
  v-else-if="modelValue?.value === 'select'"
  :type="modelValue?.type"
  @click="buttonHandleMethod === undefined ? '' : buttonHandleMethod()"
)
  div {{ modelValue?.label ?? '-' }}
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from 'vue'
import { rawControlList } from './use/useControl'
import { useControl } from './use/useControl'
import { useLocalFile } from './use/useLocalFile'
import ExternalImg from './components/external-img.vue'

const imageConstraints = {
  acceptFormats: ['jpg', 'png'],
  maxSize: 50 * 1024 * 1024,
} as const

export default defineComponent({
  name: 'fields',

  components: {
    ExternalImg,
  },

  props: {
    modelValue: {
      type: Object as PropType<typeof rawControlList[number]>,
      require: true,
    },
    controller: {
      type: Object as PropType<ReturnType<typeof useControl>>,
    },
  },

  emits: ['onSuccess'],

  setup(props, { emit }) {
    const { file } = useLocalFile({ emit })

    const buttonHandleMethod = computed(() => {
      if (props.modelValue?.value === 'select') {
        return props.controller?.selectClickHandler
      } else if (props.modelValue?.value === 'url') {
        return (open: any = undefined) => {
          if (open !== undefined) open()
        }
      } else {
        return undefined
      }
    })

    const externalSuccessHandler = value => {
      emit('onSuccess', value)
    }

    return {
      buttonHandleMethod,
      file,
      externalSuccessHandler,
      imageConstraints,
    }
  },
})
</script>
