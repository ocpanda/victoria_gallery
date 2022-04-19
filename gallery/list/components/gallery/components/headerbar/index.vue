<template lang="pug">
.header-bar(:class="{ 'has-active-image': hasActiveImage }")
  .controls
    fields(
      v-for="field of fields"
      :modelValue="field"
      :key="field.label"
      :controller="controller"
      @on-success="successHandler"
    )

  .search
    search-comp(v-bind="$attrs")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Fields from './fields/index.vue'
import SearchComp from './search/index.vue'
import { useControl } from './fields/use/useControl'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'header-bar',

  components: {
    Fields,
    SearchComp,
  },

  emits: ['onSubmit', 'onSelect'],

  props: {
    hasActiveImage: {
      type: Boolean,
      default: false,
    },

    isPage: {
      type: Boolean,
      default: true,
    },

    activeFolder: {
      type: String,
      require: true,
    },
  },

  setup(props, { emit }) {
    const innerIsPage = useVModel(props, 'isPage')
    const innerActiveFolder = useVModel(props, 'activeFolder')
    const controller = useControl({ emit, isPage: innerIsPage, activeFolder: innerActiveFolder })

    const successHandler = value => {
      emit('onSubmit', value)
    }

    return {
      fields: controller.fields.value,
      controller,
      successHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/share.scss';

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: max-content;
  background-color: $aside-menu-background-color;
  padding: 12px;
  border-radius: 0 8px 0 0;

  &.has-active-image {
    border-radius: 0 0 0 0;
  }
}

.controls {
  display: flex;

  div.wrapper:first-child {
    margin-right: 12px;
  }
}
</style>
