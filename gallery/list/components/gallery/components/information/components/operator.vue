<template lang="pug">
.operator-container
  edit-comp(
    v-if="hasAuth.edit"
    v-model:active-image-list="activeImageList"
    :info="info"
    v-bind="$attrs"
  )

  download-comp(v-model:active-image-list="activeImageList")

  delete-comp(
    v-if="hasAuth.delete"
    v-model:active-image-list="activeImageList"
    v-bind="$attrs"
  )

  move-to-comp(
    v-if="hasAuth.edit"
    v-model:active-image-list="activeImageList"
    v-model:info="info"
    @on-move-success="emit('onMoveSuccess')"
    v-bind="$attrs"
  )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import DeleteSvg from '&/components/svgs/delete.vue'
import Icon from '&/components/icon/index.vue'
import { Info } from '../use/useInfo'
import DownloadComp from '../../batch-operate/components/download/index.vue'
import DeleteComp from '../../batch-operate/components/delete/index.vue'
import EditComp from './edit/index.vue'
import MoveToComp from '../../batch-operate/components/move-to/index.vue'
import { Image } from '../../image-list/use/useImages'
import { useHasAuth } from '@/use/useHasAuth'

export default defineComponent({
  name: 'operator',

  components: {
    EditComp,
    DeleteSvg,
    Icon,
    DownloadComp,
    DeleteComp,
    MoveToComp,
  },

  emits: ['onMoveSuccess'],

  props: {
    info: {
      type: Object as PropType<Info>,
    },

    activeImageList: {
      type: Array as PropType<Image[]>,
      default: () => [],
    },
  },

  setup(props, { emit }) {
    const hasAuth = useHasAuth()

    return {
      emit,
      hasAuth,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~/scss/share.scss';

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
  }
}
</style>
