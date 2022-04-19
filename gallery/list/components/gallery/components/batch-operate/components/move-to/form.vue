<template lang="pug">
.form
  mrc-form(v-model="form" :fields="fields" :on-submit="submitHandler" v-bind="$attrs")
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue'
import { Folder } from '../../../aside-menu/use/useFolder'
import arrowRight from '&/components/svgs/arrow-right.vue'
import { defineFields } from '&/components/basic/form/defineFields'
import { $t } from '@/i18n'
import { useVModel } from '@vueuse/core'
import { required } from '@/validator'
import { putMultiImage } from '@/services/gallery'
import { Info } from '../../../information/use/useInfo'
import { Image } from '../../../image-list/use/useImages'

export default defineComponent({
  name: 'move-to',

  components: {
    arrowRight,
  },

  props: {
    activeImageList: {
      type: Array as PropType<Image[]>,
      default: () => [],
    },

    customFolderList: {
      type: Array as PropType<Folder[]>,
      default: () => [],
    },

    info: {
      type: Object as PropType<Info>,
    },
  },

  setup(props, { emit }) {
    const innerInfo = useVModel(props, 'info')
    const activeImageList = useVModel(props, 'activeImageList')
    const customFolderList = useVModel(props, 'customFolderList')

    const form = ref<{ to?: number }>({
      to: undefined,
    })

    const fields = computed(() =>
      defineFields([
        {
          label: $t('移至相簿').value,
          prop: 'to',
          componentAttrs: {
            options: customFolderList.value
              .filter(item =>
                activeImageList.value.length <= 1
                  ? item.label !== innerInfo?.value?.albumName
                  : true
              )
              .map(item => ({
                label: item.label,
                value: item.value,
              })),
          },
          rules: {
            required: required(),
          },
        },
      ])
    )

    const submitHandler = async () => {
      const body = {
        ids: activeImageList.value.map(item => item.value),
        groupId: form.value.to,
      }

      const [, err] = await putMultiImage(body)

      if (err) return [undefined, false]
      return [true, undefined]
    }

    return {
      fields,
      form,
      submitHandler,
      emit,
    }
  },
})
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: center;
}
</style>
