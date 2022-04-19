<template lang="pug">
.operate-row(@click="deleteHandler")
  delete-svg(:size="20")
  span {{ $t('刪除') }}
</template>

<script lang="ts">
import { defineComponent, PropType, computed, h } from 'vue'
import { Image } from '../../../image-list/use/useImages'
import DeleteSvg from '&/components/svgs/delete.vue'
import { useNotice } from '&/use/useNotice'
import { $t } from '@/i18n'
import { ElMessageBox } from 'element-plus'
import { getDeleteImgInfo, deleteImgRef } from '@/services/gallery'

export default defineComponent({
  name: 'delete-comp',

  components: {
    DeleteSvg,
  },

  props: {
    activeImageList: {
      type: Array as PropType<Image[]>,
      default: () => [],
    },
  },

  emits: ['deleted'],

  setup(props, { emit }) {
    const deleteIdsList = computed(() => props.activeImageList.map(item => item.value))

    const deleteHandler = async () => {
      const confirm = await useNotice()
        .confirm.warn($t('確認是否刪除圖片？').value)
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })

      if (!confirm) return

      const checkDeleteList = await preCheckCanNotDelete()

      if (checkDeleteList === false || checkDeleteList === undefined) return
      if (checkDeleteList.good.length === 0) {
        const badList = checkDeleteList.bad.map(item => item.label)

        await ElMessageBox({
          message: h('div', null, [
            h('p', null, $t('以下圖片發佈中無法刪除').value),
            h('p', null, badList.join(',')),
          ]),
          confirmButtonText: $t('確定').value,
          type: 'warning',
        })
        return
      }
      if (checkDeleteList.bad.length !== 0) {
        const badList = checkDeleteList.bad.map(item => item.label)

        const confirm = await ElMessageBox({
          message: h('div', null, [
            h('p', null, $t('以下圖片發佈中無法刪除，是否要繼續？').value),
            h('p', null, badList.join(',')),
          ]),
          confirmButtonText: $t('確定').value,
          cancelButtonText: $t('取消').value,
          showCancelButton: true,
          type: 'warning',
        })
          .then(() => true)
          .catch(() => false)

        if (confirm === false) return
      }

      // TODO: 刪除實際圖片
      const success = await onDeleteImgRef(checkDeleteList.good)

      if (success) {
        useNotice().message.success($t('成功').value)
        emit('deleted')
      }
    }

    const onDeleteImgRef = async good => {
      const body = {
        ids: good.map(datum => datum.value),
      }

      const [, err] = await deleteImgRef(body)

      if (err) return false
      else return true
    }

    const preCheckCanNotDelete = async () => {
      const body = {
        ids: deleteIdsList.value,
      }

      const [res, err] = await getDeleteImgInfo(body)

      if (err) return false

      return res
    }

    return {
      deleteHandler,
    }
  },
})
</script>
