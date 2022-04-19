import { postGalleryImage } from '@/services/gallery'
import { ref, watch } from 'vue'
import { useNotice } from '&/use/useNotice'
import { maxLength } from '@/validator'
import { $t } from '@/i18n'

export const useLocalFile = ({ emit }) => {
  const file = ref<File[] | undefined>([])

  {
    // 選擇完圖片即上傳
    watch(
      () => file.value,
      async value => {
        if (value === undefined) return

        if (
          !value.every(item => {
            return maxLength(86).$validator(item.name.split('.').shift() as string) === true
          })
        ) {
          useNotice().message.warn(`${$t('檔案名稱').value}${maxLength(86).$message}`)
          return
        }

        const res = await Promise.allSettled(
          value.map(async item => {
            const body = {
              name: item.name.split('.').shift() as string,
              file: item,
            }

            const [res, err] = await postGalleryImage(body)
            if (!err) return res
            else return false
          })
        ).then(res => {
          if (res.every(item => item.status === 'fulfilled')) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return (
              res
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                .map(item => item.value as { value: number; path: string })
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                .filter(item => item !== false)
            )
          }
        })

        if (res?.length !== 0) {
          emit('onSuccess', res)
        }
        file.value = undefined
      }
    )
  }

  return {
    file,
  }
}
