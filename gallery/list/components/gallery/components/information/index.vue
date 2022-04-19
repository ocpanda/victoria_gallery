<template lang="pug">
.information(v-loading="isLoading")
  info-item(title="檔案名稱" :info="info" :expand="true")
    template(v-slot="{ info }")
      span {{ info?.fileName ?? '' }}

  info-item(title="更多資訊" :info="info" :expand="true")
    template(v-slot="{ info }")
      .label-content
        span {{ $t('格式') }}
        span {{ info?.ext ?? '' }}
      .label-content
        span {{ $t('大小') }}
        span {{ info?.size !== undefined ? sizeFormatter(info.size) : 0 }}
      .label-content
        span {{ $t('尺寸') }}
        span {{ (info?.width === undefined || info?.height === undefined) ? 0 : `${info.width} x ${info.height}` }}
      .label-content
        span {{ $t('上傳時間') }}
        span {{ dayjs(info?.createTime ?? '').format('YYYY/MM/DD HH:mm:ss') }}
      .label-content
        span {{ $t('相簿') }}
        span {{ info?.albumName === '' ? '-' : info?.albumName ?? '-' }}

  info-item(title="標籤" :info="info")
    template(v-slot="{ info }")
      tags-comp(:tags="info?.tags ?? []")

  info-item(title="操作" :info="info" :expand="true")
    template(v-slot="{ info }")
      operator-comp(
        :info="info"
        v-model:active-image-list="activeImageList"
        v-model:active-image="innerActiveImage"
        @on-edit-success="editSuccessHandler"
        @deleted="deleteHandler"
        v-bind="$attrs"
      )

  info-item(title="所屬文章" :info="info" :divider="false")
    template(v-slot="{ info }")
      belong-article(:info="info")
</template>

<script lang="ts">
import { useLoading } from '&/use/useLoading'
import { useVModel } from '@vueuse/core'
import { defineComponent, PropType } from 'vue'
import { Image } from '../image-list/use/useImages'
import { useInfo } from './use/useInfo'
import { ElDivider } from 'element-plus'
import InfoItem from './components/info-item.vue'
import TagsComp from './components/tags.vue'
import OperatorComp from './components/operator.vue'
import BelongArticle from './components/belong-article.vue'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'information',

  components: {
    ElDivider,
    InfoItem,
    TagsComp,
    OperatorComp,
    BelongArticle,
  },

  props: {
    activeImage: {
      type: Object as PropType<Image>,
      require: true,
    },

    activeImageList: {
      type: Array as PropType<Image[]>,
      default: () => [],
    },
  },

  emits: ['onEditSuccess', 'deleted'],

  setup(props, { emit }) {
    const innerActiveImage = useVModel(props, 'activeImage')

    const loading = useLoading()

    const { info, getInfo } = useInfo({
      activeImage: innerActiveImage,
      loading,
    })

    const editSuccessHandler = async () => {
      emit('onEditSuccess')
      await getInfo(innerActiveImage.value)
    }

    const deleteHandler = () => {
      emit('deleted')
    }

    const sizeFormatter = size => {
      if (size / 1024 > 1000) return `${(size / 1024 / 1024).toFixed(2)}MB`
      else return `${(size / 1024).toFixed(2)}KB`
    }

    return {
      info,
      isLoading: loading.isLoading,
      innerActiveImage,
      editSuccessHandler,
      deleteHandler,
      dayjs,
      sizeFormatter,
    }
  },
})
</script>

<style lang="scss" scoped>
.information {
  height: 100%;
  padding: 12px;
}
</style>
