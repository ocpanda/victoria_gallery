import { ref, watch } from 'vue'
import { getImageInfo } from '@/services/gallery'
import { Awaited } from 'ts-essentials'
import { useInjectRegister } from '&/use/useInjectRegister'

export type Info = Exclude<Awaited<ReturnType<typeof getImageInfo>>[0], undefined> & {
  value?: number
  label?: string
  path?: string
}

export const useInfo = ({ activeImage, loading }) => {
  const info = ref<Info>()

  const getInfo = async item => {
    const body = {
      id: item.value,
    }
    loading.load()
    const [res, err] = await getImageInfo(body)
    loading.unload()

    if (!err) {
      info.value = {
        ...res,
        value: item.value,
        label: item.label,
        path: item.path,
      }
    }
  }

  {
    // 取得圖片資訊
    watch(
      () => activeImage.value,
      async value => {
        if (value === undefined) return

        getInfo(activeImage.value)
      }
    )
  }

  {
    const onMove = useInjectRegister('onMove')
    onMove(async () => {
      await getInfo(activeImage.value)
    })
  }

  return {
    info,
    getInfo,
  }
}
