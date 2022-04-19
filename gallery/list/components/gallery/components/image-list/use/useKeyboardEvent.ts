import { computed, Ref } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { Image } from './useImages'

export const useKeyboardEvent = ({
  imageListRef,
  isBatchSelect,
  list,
  activeImageList,
}: {
  imageListRef: any
  isBatchSelect: Ref<boolean>
  list: Ref<Image[]>
  activeImageList: Ref<Image[]>
}) => {
  const { shift, ctrl, Z } = useMagicKeys({
    target: imageListRef.value,
  })

  const isControlKeyTrigger = computed(
    () => isBatchSelect.value && (shift.value || ctrl.value || Z.value)
  )
  const isShift = computed(() => shift.value === true && ctrl.value === false)
  const isCtrl = computed(() => shift.value === false && (ctrl.value === true || Z.value === true))

  // 批次選取keyboard事件
  const batchShiftHandler = (image: Image) => {
    const startImage = activeImageList.value?.[0] ?? image
    const endImage = image

    const startIndex = list.value.findIndex(item => item.value === startImage.value)
    const endIndex = list.value.findIndex(item => item.value === endImage.value)

    const newList = list.value.slice(startIndex, endIndex + 1)
    activeImageList.value = Array.from(new Set(newList.concat(activeImageList.value)))
  }
  const batchCtrlHandler = (image: Image) => {
    activeImageList.value.push(image)
  }
  const batchImageClickHandler = (image: Image) => {
    if (isShift.value) {
      batchShiftHandler(image)
    } else if (isCtrl.value) {
      batchCtrlHandler(image)
    }
  }

  return {
    isControlKeyTrigger,

    batchImageClickHandler,
  }
}
