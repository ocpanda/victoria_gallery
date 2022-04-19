import { deepCopy } from '&/helper'
import { $t } from '@/i18n'
import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'

type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }

const selectTypes = [
  {
    label: $t('檔案名稱').value,
    value: 'filename',
  },
  {
    label: $t('相簿').value,
    value: 'gallery',
  },
  {
    label: $t('標籤').value,
    value: 'tag',
  },
] as const

export type SelectOptions = typeof selectTypes[number]['value'][]

export const useSearchOption = ({ props, emit }) => {
  const selected = useVModel(props, 'searchSelected', emit)
  selected.value = ['tag']
  const options = ref<DeepWriteable<typeof selectTypes>>(deepCopy(selectTypes))

  watch(
    () => selected.value,
    (value, old) => {
      if (value.length === 0) {
        selected.value = old
      }
    }
  )

  return {
    selected,
    options,
  }
}
