<template lang="pug">
.container
  label {{ $t(`已選取${selectCount}張圖片`) }}

  info-item(v-if="hasAuth.edit" title="標籤" :expand="true")
    tags-comp(:active-image-list="activeImageList")

  info-item(title="操作" :divider="false" :expand="true")
    download-comp(
      :active-image-list="activeImageList"
    )

    delete-comp(
      v-if="hasAuth.delete"
      :active-image-list="activeImageList"
      @deleted="emit('deleted')"
    )

    move-to-comp(
      v-if="hasAuth.edit"
      v-model:custom-folder-list="customFolderList"
      :active-image-list="activeImageList"
      @on-move-success="emit('onMoveSuccess')"
    )
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { Image } from '../image-list/use/useImages'
import { Folder } from '../aside-menu/use/useFolder'
import InfoItem from '../information/components/info-item.vue'
import TagsComp from './components/tags/index.vue'
import DownloadComp from './components/download/index.vue'
import DeleteComp from './components/delete/index.vue'
import MoveToComp from './components/move-to/index.vue'
import { useHasAuth } from '@/use/useHasAuth'

export default defineComponent({
  name: 'batch-operate',

  components: {
    MoveToComp,
    DeleteComp,
    InfoItem,
    TagsComp,
    DownloadComp,
  },

  props: {
    activeImageList: {
      type: Array as PropType<Image[]>,
      default: () => [],
    },

    customFolderList: {
      type: Array as PropType<Folder[]>,
      default: () => [],
    },
  },

  emits: ['deleted', 'onMoveSuccess'],

  setup(props, { emit }) {
    const hasAuth = useHasAuth()

    const selectCount = computed(
      () => props.activeImageList.filter(item => item !== undefined).length
    )

    return {
      hasAuth,
      selectCount,
      emit,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~/scss/share.scss';
.container {
  width: 100%;
  height: inherit;
  padding: 56px 12px 12px 12px;

  label {
    font-size: 16px;
  }

  .operate-row,
  :deep(.operate-row) {
    display: flex;
    align-items: center;
    margin-top: 12px;

    span {
      padding-left: 8px;
    }

    &:hover {
      cursor: pointer;
      color: $font-primary-color;

      .el-icon,
      .theme-provider svg,
      :deep(.theme-provider svg),
      :deep(.el-icon) {
        color: $font-main-color;
      }

      .plus {
        background-color: $font-main-color;
        &.el-icon {
          color: $font-primary-color;
        }
      }
    }

    .plus {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      background-color: $font-support-color;
      border-radius: 100%;
    }
  }
}
</style>
