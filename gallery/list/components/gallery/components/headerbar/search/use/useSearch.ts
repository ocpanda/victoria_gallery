import { useVModel } from '@vueuse/core'

export const useSearch = ({ props, emit }) => {
  const innerModelValue = useVModel(props, 'modelValue', emit)

  return {
    innerModelValue,
  }
}
