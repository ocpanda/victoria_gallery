<template lang="pug">
.search-container
  mrc-select(
    v-model="selected"
    :options="options"
    collapse-tags
    multiple
  )
    template(#option:content="{ row }")
      mrc-checkbox(
        @change="checkboxChangeHandler(row)"
        :modelValue="selected.includes(row.value)"
        :label="row.value"
      )
        span {{ row.label }}

  mrc-input(
    v-show="searchType === 'input'"
    :disabled="!canSearch"
    v-model="innerModelValue"
    :prefix-icon="Search"
  )

  tags-remote-select(
    v-show="searchType === 'select'"
    v-model="innerModelValue"
    :multiple="true",
    :collapseTags="false",
    :disabled="!canSearch"
  )

  mrc-checkbox(
    v-model="innerSearchSameSelected"
    :true-label="true"
    :false-label="false"
    :disabled="typeof innerModelValue === 'string' ? true : (innerModelValue?.length ?? 0) < 2"
  ) {{ $t('同時符合') }}

  mrc-button(
    @click="searchHandler"
    :disabled="!canSearch"
    type="primary"
  )
    div {{ $t('搜尋') }}
</template>

<script lang="ts">
import { defineComponent, PropType, computed, watch, ref } from 'vue'
import { useSearchOption, SelectOptions } from './use/useSearchOption'
import { useSearch } from './use/useSearch'
import { Search } from '@element-plus/icons'
import TagsRemoteSelect from '@/components/tags-remote-select/index.vue'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'search',

  components: {
    TagsRemoteSelect,
  },

  emits: ['onSearch', 'update:modelValue', 'update:searchSelected', 'update:searchSameSelected'],

  props: {
    modelValue: {
      type: String,
    },

    searchSelected: {
      type: Array as PropType<SelectOptions[]>,
    },

    searchSameSelected: {
      type: Boolean,
    },
  },

  setup(props, { emit }) {
    const { selected, options } = useSearchOption({ props, emit })

    const checkboxSelect = ref(
      options.value.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.value]: false,
        }),
        {}
      )
    )

    const searchType = computed(() => {
      return selected.value.flat(1).every(item => item === 'tag') ? 'select' : 'input'
    })
    const canSearch = computed(() => selected.value.length !== 0)
    watch(
      () => searchType.value,
      () => {
        innerModelValue.value = undefined
      }
    )

    const { innerModelValue } = useSearch({ props, emit })
    const innerSearchSameSelected = useVModel(props, 'searchSameSelected', emit)

    const searchHandler = () => {
      emit('onSearch')
    }

    // 同步內層mrc-checkbox與外層select的值
    const checkboxChangeHandler = row => {
      const selectIndex = selected.value.findIndex(item => item === row.value)
      if (selectIndex === -1) selected.value.push(row.value)
      else {
        if (selected.value.length === 1) return

        selected.value.splice(selectIndex, 1)
      }
    }

    return {
      checkboxSelect,
      selected,
      options,
      innerModelValue,
      searchType,
      canSearch,
      Search,
      innerSearchSameSelected,

      checkboxChangeHandler,
      searchHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.search-container {
  display: flex;
  align-items: center;

  .mrc-input {
    width: 100%;
  }
  .mrc-button {
    margin-left: 12px;
  }
}
</style>
