<template lang="pug">
.operate-row(@click="downloadHandler")
  Icon(name="download" :size="20")
  span {{ $t('下載') }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Icon from '&/components/icon/index.vue'
import { Image } from '../../../image-list/use/useImages'
import { getDownloadImage } from '@/services/gallery'

export default defineComponent({
  name: 'download',

  components: {
    Icon,
  },

  props: {
    activeImageList: {
      type: Array as PropType<Image[]>,
      default: () => [],
    },
  },

  setup(props) {
    const downloadHandler = async () => {
      const body = {
        ids: props.activeImageList.map(item => item.value),
      }

      const [res, err]: [any, any] = await getDownloadImage(body)

      if (err) return

      let filename
      if (['image/jpeg', 'image/jpg', 'image/png'].includes(res.headers['content-type'])) {
        filename = res.headers['content-disposition'].match(/(?<=utf-8'').+$/g).pop()
      } else {
        filename = 'tsna-image.zip'
      }

      const url = window.URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = decodeURIComponent(filename)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    return {
      downloadHandler,
    }
  },
})
</script>
