import { $t } from '@/i18n'
import { ref, watch } from 'vue'
import { deepCopy } from '&/helper'
import { useHasAuth } from '@/use/useHasAuth'

export const rawControlList = [
  {
    label: $t('本機').value,
    value: 'local',
    type: 'primary',
  },
  {
    label: $t('外部圖片').value,
    value: 'url',
    type: 'primary',
  },
  {
    label: $t('選取').value,
    value: 'select',
    type: 'primary',
  },
]

export const useControl = ({ emit, isPage, activeFolder }) => {
  const hasAuth = useHasAuth()

  const fields = ref<
    { label: string; value: typeof rawControlList[number]['value']; type: 'primary' | 'default' }[]
  >([])
  const controlList = isPage.value
    ? rawControlList
    : rawControlList.filter(item => item.value !== 'select')
  fields.value = deepCopy(
    controlList.filter(item => (item.value === 'select' ? true : hasAuth.create))
  )

  watch(
    () => activeFolder.value,
    () => {
      const field = fields.value.find(item => item.value === 'select')!

      field.label = $t('選取').value
      field.type = 'primary'
      emit('onSelect', field.label)
    }
  )

  const selectClickHandler = () => {
    const field = fields.value.find(item => item.value === 'select')

    if (field === undefined) return
    if (field.label === $t('選取').value) {
      field.label = $t('取消').value
      field.type = 'default'
    } else {
      field.label = $t('選取').value
      field.type = 'primary'
    }
    emit('onSelect', field.label)
  }

  return {
    fields,
    selectClickHandler,
  }
}
