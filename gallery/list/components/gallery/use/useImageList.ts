import { ref, computed } from 'vue'
import { Image } from '../components/image-list/use/useImages'

export const useImageList = ({ isPage }) => {
  const activeFolder = ref<string>('all')

  const activeImage = ref<Image>()

  const activeImageList = ref<Image[]>([])

  const hasActiveImage = computed(() => isPage && activeImage.value !== undefined)

  return {
    activeFolder,
    activeImage,
    hasActiveImage,
    activeImageList,
  }
}
