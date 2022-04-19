<template lang="pug">
.image-list(v-loading="isLoading")
  .container
    template(
      ref="imageListRef"
      v-for="image of list"
      :key="image.value"
    )
      //- emit的同時改變class name會導至emit事件出不去，因此多一層div改變class
      .image-item(
        @click="imageClickHandler(image)"
      )
        .item(
          :class="{ 'selected': innerActiveImageList.find(item => item?.value === image.value) !== undefined }"
        )
          el-image.image(
            :src="image.path"
            fit="contain"
          )
          label-comp(:modelValue="image.label")

  mrc-pagination(
    v-if="innerActiveFolder !== undefined && !['often', 'recently'].includes(innerActiveFolder) && total > 50"
    v-model:page="pagination.page"
    v-model:count="pagination.count"
    :totalCount="total"
    layout="prev, pager, next, jumper"
    @change="getChangePage"
  )
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch } from 'vue'
import { ElImage } from 'element-plus'
import { useImages, Image } from './use/useImages'
import { useHandler } from './use/useHandler'
import { useVModel } from '@vueuse/core'
import { useMutation } from './use/useMutation'
import { useKeyboardEvent } from './use/useKeyboardEvent'
import { Folder } from '../aside-menu/use/useFolder'
import { SelectOptions } from '../headerbar/search/use/useSearchOption'
import LabelComp from './label-comp.vue'
import { useLoading } from '&/use/useLoading'

export default defineComponent({
  name: 'image-list',

  components: {
    ElImage,
    LabelComp,
  },

  props: {
    activeFolder: {
      type: String,
      require: true,
    },

    isBatchSelect: {
      type: Boolean,
      default: false,
    },

    isPage: {
      type: Boolean,
      default: true,
    },

    activeImage: {
      type: Object as PropType<Image>,
    },

    activeImageList: {
      type: Array as PropType<Image[]>,
      default: () => [],
    },

    customFolderList: {
      type: Array as PropType<Folder[]>,
      default: () => [],
    },

    searchValue: {
      type: String as PropType<string | string[]>,
    },

    searchSelected: {
      type: Array as PropType<SelectOptions[]>,
    },

    searchSameSelected: {
      type: Boolean,
    },

    folderTotalNumber: {
      type: Number,
      default: 0,
    },
  },

  emits: [
    'onImageSelect',
    'listUpdate',
    'update:activeImage',
    'update:activeImageList',
    'update:searchValue',
  ],

  setup(props, { emit }) {
    const imageListRef = ref()
    const loading = useLoading()

    const innerActiveFolder = useVModel(props, 'activeFolder')
    const innerSearchSameSelected = useVModel(props, 'searchSameSelected')
    const activeImage = useVModel(props, 'activeImage', emit)
    const innerActiveImageList = useVModel(props, 'activeImageList', emit)
    const customFolderList = useVModel(props, 'customFolderList')
    const searchValue = useVModel(props, 'searchValue', emit)
    const searchSelected = useVModel(props, 'searchSelected')
    const innerFolderTotalNumber = useVModel(props, 'folderTotalNumber')

    const isBatchSelect = useVModel(props, 'isBatchSelect')

    const { list, pagination, getChangePage, isSearch, searchTotal } = useImages({
      activeFolder: innerActiveFolder,
      customFolderList,
      searchValue,
      searchSelected,
      searchSameSelected: innerSearchSameSelected,
      loading,
    })

    const total = computed(() => {
      if (isSearch.value === true) return searchTotal.value
      else return innerFolderTotalNumber.value
    })

    // const { isControlKeyTrigger, batchImageClickHandler } = useKeyboardEvent({
    //   imageListRef,
    //   isBatchSelect,
    //   list,
    //   activeImageList: innerActiveImageList,
    // })

    const { imageClickHandler } = useHandler({
      emit,
      activeImage,
      activeImageList: innerActiveImageList,
      isBatchSelect,
    })

    useMutation({
      activeImage,
      activeImageList: innerActiveImageList,
      isBatchSelect,
      pagination,
      list,
    })

    watch(
      () => list.value,
      () => {
        emit('listUpdate')
      },
      { deep: true }
    )

    return {
      imageListRef,
      list,
      pagination,
      innerFolderTotalNumber,

      imageClickHandler,

      getChangePage,

      innerActiveFolder,
      innerActiveImageList,

      isLoading: loading.isLoading,

      total,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~/scss/share.scss';
.image-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  .container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .image-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 7px;
    width: 200px;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;

      :deep(label) {
        max-width: 196px;
        line-height: 18px;
        padding: 2px;
        text-align: center;
        margin-top: 8px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow-y: hidden;
        overflow-wrap: break-word;
        white-space: break-spaces;

        &:hover {
          cursor: pointer;
        }
      }
    }

    &:hover {
      cursor: pointer;

      & .el-image__inner {
        transition: transform 0.3s;
        transform: scale(1.2);
      }
    }

    .image {
      width: 200px;
      height: 200px;
      padding: 5px;
      background-color: $border-shallow-color;

      :deep(img) {
        border-radius: 2px;
      }

      &:hover {
        cursor: pointer;
      }
    }
    & .item.selected {
      .image {
        border: 1px solid $main-color;
        border-radius: 4px;
      }

      :deep(label) {
        color: $global-background-color;
        border-radius: 2px;
        background-color: $main-color;
      }
    }
  }
}
</style>
