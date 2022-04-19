import { ref, watch } from 'vue'
import { useScroll } from '@vueuse/core'

export const useAsideMenu = () => {
  const galleryAsideRef = ref<HTMLElement | null>(null)
  const isAsideScrolling = ref(false)
  const { isScrolling } = useScroll(galleryAsideRef)
  watch(
    () => isScrolling.value,
    async value => {
      if (value === true) isAsideScrolling.value = true
      else {
        await setTimeout(() => {
          isAsideScrolling.value = false
        }, 1000)
      }
    }
  )

  const expandMenu = ref(true)
  const toggleMenu = () => {
    expandMenu.value = !expandMenu.value
  }

  const toggleMenuOpen = () => {
    expandMenu.value = true
  }

  return {
    expandMenu,
    toggleMenu,
    toggleMenuOpen,
    galleryAsideRef,
    isAsideScrolling,
  }
}
