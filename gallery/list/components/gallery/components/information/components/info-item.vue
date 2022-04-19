<template lang="pug">
.info-item(:class="{ 'not-expand': !isExpand }")
  .container
    .icon
      arrow-right(@click="expandHandler" size="10")
    .content
      label(v-if="title !== undefined" @click="expandHandler") {{ $t(title) }}

      .content-inner
        slot(:info="info")
          span ''

el-divider(v-if="divider")
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { Info } from '../use/useInfo'
import { ElDivider } from 'element-plus'
import ArrowRight from '&/components/svgs/arrow-right.vue'

export default defineComponent({
  name: 'info-item',

  components: {
    ElDivider,
    ArrowRight,
  },

  props: {
    title: {
      type: String,
    },

    info: {
      type: Object as PropType<Info>,
    },

    divider: {
      type: Boolean,
      default: true,
    },

    expand: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const isExpand = ref<boolean>(props.expand)

    const expandHandler = () => {
      isExpand.value = !isExpand.value
    }

    return {
      isExpand,
      expandHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.info-item {
  display: flex;
  flex-direction: column;
  max-height: 200px;
  transition: all 0.3s ease;
  overflow: hidden;

  &.not-expand {
    max-height: 22px;

    :deep(.icon) {
      svg {
        transform: rotate(0deg);
      }
    }
  }

  .container {
    display: flex;
    width: 100%;
    align-items: baseline;
    max-height: inherit;
    .content {
      display: flex;
      padding-top: 6px;
      width: calc(100% - 20px);
      flex-direction: column;
      margin-left: 8px;
      max-height: inherit;
      .content-inner {
        height: inherit;
        overflow-y: auto;
        padding: 4px;
      }

      label {
        padding-bottom: 6px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  span {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    overflow: hidden;
    padding-bottom: 6px;
    overflow-wrap: break-word;
    white-space: break-spaces;
  }

  :deep(.label-content) {
    display: flex;
    justify-content: space-between;

    &:not(:first-child) {
      margin-top: 12px;
    }
  }

  :deep(.icon) {
    svg {
      transform: rotate(90deg);
      transition: all 0.1s ease;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
