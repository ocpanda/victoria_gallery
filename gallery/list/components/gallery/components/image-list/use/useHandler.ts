import { Image } from './useImages'

export const useHandler = ({ emit, activeImage, activeImageList, isBatchSelect }) => {
  const imageClickHandler = (item: Image) => {
    activeImage.value = item

    if (isBatchSelect.value === true) {
      const existIndex = activeImageList.value
        .filter(active => active !== undefined)
        .findIndex(active => active.value === item.value)

      if (existIndex === -1) activeImageList.value.push(item)
      else activeImageList.value.splice(existIndex, 1)
    } else {
      activeImageList.value = [item]
    }
  }

  return {
    imageClickHandler,
  }
}
