<template lang="pug">
.gallery-label(@click="clickHandler" :class="{ 'active': innerActiveFolder === item?.value?.toString() }")
  .label
    Icon(
      :size="20"
      :name="iconName"
    )
    span {{ item?.label }}
  .label
    span {{ item?.count }}
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { Folder } from './use/useFolder'
import Icon from '&/components/icon/index.vue'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'gallery-label',

  props: {
    item: {
      type: Object as PropType<Folder>,
      require: true,
    },

    activeFolder: {
      type: String,
      require: true,
    },
  },

  components: {
    Icon,
  },

  emits: ['onActive'],

  setup(props, { emit }) {
    const innerActiveFolder = useVModel(props, 'activeFolder')

    const isSelect = computed(() => innerActiveFolder.value === props.item?.value?.toString())
    const iconName = computed(() => {
      if (props.item?.image === 'el-folder') {
        return isSelect.value === true ? 'folder-opened' : 'folder'
      } else {
        return props.item?.image.replace('el-', '')
      }
    })

    const clickHandler = () => {
      emit('onActive', props.item)
    }

    return {
      iconName,
      clickHandler,
      innerActiveFolder,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/share.scss';

.gallery-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: inherit;
  color: $font-sub-content-color;

  .label {
    display: flex;
    align-items: center;
    line-height: 20px;

    span {
      font-size: 14px;
      margin-left: 12px;
    }
  }

  &:hover {
    cursor: pointer;
    color: $font-primary-color;
  }

  &.active {
    color: $font-primary-color;
  }
}
</style>
