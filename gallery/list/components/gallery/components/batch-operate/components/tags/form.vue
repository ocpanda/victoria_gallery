<template lang="pug">
.form(v-loading="isLoading")
  mrc-form(v-model="form" :fields="fields" :on-submit="saveHandler" v-bind="$attrs")
    template(#content:tags="{ field, v }")
      tags-remote-select(
        v-model="form.tags"
        v-bind="field.componentAttrs"
        @blur="v.$touch"
      )
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue'
import { defineFields } from '&/components/basic/form/defineFields'
import { $t } from '@/i18n'
import { Image } from '../../../image-list/use/useImages'
import TagsRemoteSelect from '@/components/tags-remote-select/index.vue'
import { useVModel } from '@vueuse/core'
import { useLoading } from '&/use/useLoading'
import { putMultiImage } from '@/services/gallery'
import { required } from '@/validator'
import { useForm } from './useForm'
import { useNotice } from '&/use/useNotice'

type Form = { tags?: string[] }

export default defineComponent({
  name: 'tags-form',

  components: {
    TagsRemoteSelect,
  },

  props: {
    activeImageList: {
      type: Array as PropType<Image[]>,
      default: () => [],
    },
  },

  setup(props) {
    const innerActiveImageList = useVModel(props, 'activeImageList')

    const form = ref<Form>({
      tags: undefined,
    })
    const fields = defineFields([
      {
        label: $t('標籤').value,
        prop: 'tags',
        componentAttrs: {
          multiple: true,
          collapseTags: false,
          allowCreate: true,
          defaultFirstOption: true,
        },
        rules: {
          required: required(),
        },
      },
    ])

    const commitForm = computed(() => ({
      ids: innerActiveImageList.value.map(item => item.value),
      commits:
        form.value.tags?.map(tag => ({
          // 1 新增 2 刪除
          action: 1,
          ...(typeof tag === 'string' ? { label: tag } : []),
          ...(typeof tag === 'number' ? { value: tag } : []),
        })) ?? [],
    }))

    const { load, unload, isLoading } = useLoading()
    const saveHandler = async () => {
      const { checkTags } = useForm({ tags: form?.value?.tags ?? [] })
      if (!checkTags()) {
        useNotice().message.warn($t('長度需介於 2 ~ 100 字').value)
        return [undefined, false]
      }

      load()
      const [, err] = await putMultiImage(commitForm.value)
      unload()

      if (!err) return [true, undefined]
      else return [undefined, false]
    }

    return {
      fields,
      form,
      commitForm,
      isLoading,

      saveHandler,
    }
  },
})
</script>

<style lang="scss">
.form {
  display: flex;
  justify-content: center;
}
</style>
