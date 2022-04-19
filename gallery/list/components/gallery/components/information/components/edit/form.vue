<template lang="pug">
.form
  mrc-form(v-model="form" :fields="fields" :on-submit="submitHandler" v-bind="$attrs")
    template(#content:tags="{ field, v }")
      tags-remote-select(
        v-model="form.tags"
        @blur="v.$touch()"
        :restoreMethod="restoreMethod"
        v-bind="field.componentAttrs"
      )
</template>

<script lang="ts">
import { defineFields } from '&/components/basic/form/defineFields'
import { $t } from '@/i18n'
import { required, maxLength, noSpecialRegex } from '@/validator'
import { defineComponent, PropType, ref, computed } from 'vue'
import { Info } from '../../use/useInfo'
import TagsRemoteSelect from '@/components/tags-remote-select/index.vue'
import { useVModel } from '@vueuse/core'
import { putImage, putTags } from '@/services/gallery'
import { deepCopy } from '&/helper'
import { useForm } from '@/views/gallery/list/components/gallery/components/batch-operate/components/tags/useForm'
import { useNotice } from '&/use/useNotice'

export default defineComponent({
  name: 'form-comp',

  components: {
    TagsRemoteSelect,
  },

  props: {
    info: {
      type: Object as PropType<Info>,
    },
  },

  setup(props) {
    const info = useVModel(props, 'info')

    const oldTagsList = ref(info.value?.tags ?? [])

    const form = ref<{ filename: string; tags: any }>({
      filename: props.info?.fileName ?? '',
      tags: info.value?.tags?.map(item => item.value) ?? [],
    })
    const fields = defineFields([
      {
        label: $t('檔案名稱').value,
        prop: 'filename',
        rules: {
          required: required(),
          maxLength: maxLength(100),
          noSpecialRegex: noSpecialRegex(),
        },
      },
      {
        label: $t('標籤').value,
        prop: 'tags',
        componentAttrs: {
          multiple: true,
          collapseTags: false,
          allowCreate: true,
          defaultFirstOption: true,
        },
      },
    ])

    const putFile = async () => {
      const body = {
        id: info.value?.value ?? 0,
        filename: form.value?.filename ?? '',
      }

      return putImage(body)
    }

    const oldTagsDiffList = computed(() => {
      return oldTagsList.value
        .filter(item => form.value.tags.find(datum => datum === item.value) === undefined)
        .map(item => item.value)
    })
    const newTagsDiffList = computed(() => {
      return form.value.tags.filter(item => {
        return (
          oldTagsList.value.find(datum => datum.value === item || datum.label === item) ===
          undefined
        )
      })
    })
    const putImageTag = async () => {
      const body = {
        value: info.value?.value ?? 0,
        commits: newTagsDiffList.value
          .map(item => ({
            action: 1,
            ...(typeof item === 'string' ? { label: item } : []),
            ...(typeof item === 'number' ? { value: item } : []),
          }))
          .concat(
            oldTagsDiffList.value.map(item => ({
              value: item,
              action: 2,
            }))
          ),
      }

      return putTags(body)
    }

    const submitHandler = async () => {
      const { checkTags } = useForm({ tags: form.value?.tags ?? [] })
      if (!checkTags()) {
        useNotice().message.warn($t('長度需介於 2 ~ 100 字').value)
        return [undefined, true]
      }

      const [, fileErr] = await putFile()
      const [, tagErr] = await putImageTag()

      if (!fileErr && !tagErr) return [true, undefined]
      else return [undefined, false]
    }

    const restoreMethod = () => {
      return (
        props.info?.tags?.map(item => ({
          value: item.value,
          label: item.label,
        })) ?? []
      )
    }

    return {
      form,
      fields,
      submitHandler,
      restoreMethod,
      newTagsDiffList,
      oldTagsDiffList,
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
