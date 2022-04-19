<template lang="pug">
mrc-drawer(:size="560")
  template(#reference="{ toggle }")
    .operate-row(@click="toggle")
      arrow-right(:size="20")
      span {{ $t('移至') }}

  template(v-slot="{ toggle }")
    form-comp(
      v-bind="$attrs"
      v-model:active-image-list="activeImageList"
      v-model:custom-folder-list="customFolderList"
      @cancel="toggle"
      @success="successHandler(toggle)"
    )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Image } from '../../../image-list/use/useImages'
import { Folder } from '../../../aside-menu/use/useFolder'
import arrowRight from '&/components/svgs/arrow-right.vue'
import FormComp from './form.vue'

export default defineComponent({
  name: 'move-to',

  components: {
    arrowRight,
    FormComp,
  },

  emits: ['onMoveSuccess'],

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

  setup(props, { emit }) {
    const successHandler = toggle => {
      toggle()
      emit('onMoveSuccess')
    }

    return {
      successHandler,
    }
  },
})
</script>
