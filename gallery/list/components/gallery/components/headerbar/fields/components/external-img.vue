<template lang="pug">
mrc-form(
  v-model="form"
  :fields="fields"
  :on-submit="save"
)
</template>

<script lang="ts">
import { defineFields } from '&/components/basic/form/defineFields'
import { useNotice } from '&/use/useNotice'
import { $t } from '@/i18n'
import { postGalleryImage } from '@/services/gallery'
import { maxLength, required, url } from '@/validator'
import { defineComponent, ref } from 'vue'

type Form = { url?: string }

export default defineComponent({
  name: 'external-img',

  emits: ['onSuccess'],

  setup(props, { emit }) {
    const form = ref<Form>({
      url: undefined,
    })
    const fields = defineFields([
      {
        label: $t('外部圖片').value,
        prop: 'url',
        tip: $t('請輸入URL, 例: http://abc.123.tt/messi.jpg').value,
        rules: {
          required: required(),
          url: url(),
        },
      },
    ])

    const save = async () => {
      if (form.value?.url === undefined) return [undefined, false]

      const imageUrl = form?.value?.url?.split('?').shift()
      const fileName = imageUrl?.split('/')?.pop() ?? 'image'

      const fileNameValidator = maxLength(86)
      if (!fileNameValidator.$validator(fileName)) {
        useNotice().message.warn(`${$t('檔案名稱').value}${fileNameValidator.$message}`)
        return [undefined, false]
      }

      const body = {
        name: fileName?.split('.').shift() ?? '',
        url: form?.value?.url,
      }
      const [res, err] = await postGalleryImage(body)

      if (!err) {
        emit('onSuccess', res)
        return [res, undefined]
      } else return [undefined, false]
    }

    return {
      form,
      fields,
      save,
    }
  },
})
</script>
