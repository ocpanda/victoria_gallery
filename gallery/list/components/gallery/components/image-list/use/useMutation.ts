import { watch } from 'vue'

export const useMutation = ({ activeImage, activeImageList, isBatchSelect, pagination, list }) => {
  {
    // 取消image active
    watch(
      () => activeImage.value,
      value => {
        if (value !== undefined) return

        activeImageList.value = []
      }
    )
  }

  {
    watch(
      () => isBatchSelect.value,
      value => {
        if (activeImageList.value.length === 0) {
          activeImage.value = list.value[0]
          activeImageList.value = [list.value[0]]
        } else {
          if (value === true) {
            activeImage.value = undefined
            activeImageList.value = []
          } else {
            activeImage.value = activeImageList.value?.[0] ?? undefined
            activeImageList.value = [activeImageList.value?.[0]] ?? []
          }
        }
      }
    )
  }

  {
    // 預設選取第一張
    watch(
      () => list.value,
      value => {
        if (pagination.value.page === 1) {
          activeImage.value = value[0]
          activeImageList.value = [value[0]]
        }
      }
    )
  }
}
