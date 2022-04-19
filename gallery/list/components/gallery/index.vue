<template lang="pug">
.gallery
  aside-menu(
    v-model:customList="customFolderList"
    v-model:active-folder="activeFolder"
    v-model:folderTotalNumber="folderTotalNumber"
    :is-page="isPage"
    @on-active="folderActiveHandler"
  )

  .container
    header-bar(
      @on-submit="onImageSubmitHandler"
      @on-select="onSelectHandler"
      @on-search="onSearchHandler"
      :has-active-image="hasActiveImage || isBatchSelect"
      v-model="searchValue"
      v-model:search-selected="searchSelected"
      v-model:search-same-selected="searchSameSelected"
      v-model:active-folder="activeFolder"
      :is-page="isPage"
    )

    .main(:class="{ 'not-page': !isPage }" ref="mainRef")
      image-list(
        v-model:active-folder="activeFolder"
        v-model:active-image="activeImage"
        v-model:active-image-list="activeImageList"
        :is-batch-select="isBatchSelect"
        :is-page="isPage"
        v-model:custom-folder-list="customFolderList"
        v-model:search-value="searchValue"
        v-model:search-selected="searchSelected"
        v-model:folderTotalNumber="folderTotalNumber"
        v-model:search-same-selected="searchSameSelected"
        @listUpdate="listUpdateHandler"
        @dblclick="onConfirmHandler"
      )

    .operator(v-if="!isPage")
      mrc-button(@click="onConfirmHandler" type="primary") {{ $t('確定') }}
      mrc-button(@click="onCancelHandler") {{ $t('取消') }}

  .info(
    v-if="isPage"
    :class="{ 'is-active': hasActiveImage && !isBatchSelect }"
  )
    info-comp(
      :active-image="activeImage"
      v-model:active-image-list="activeImageList"
      v-model:custom-folder-list="customFolderList"
      @on-edit-success="editSuccessHandler"
      @deleted="deleteSuccessHandler"
      @on-move-success="moveSuccessHandler"
    )

  .batch-operate(
    v-if="isPage"
    :class="{ 'is-active': isBatchSelect }"
  )
    batch-operate(
      v-model:custom-folder-list="customFolderList"
      :active-image-list="activeImageList"
      @deleted="deleteSuccessHandler"
      @on-move-success="moveSuccessHandler"
    )
</template>

<script lang="ts">
import { $t } from '@/i18n'
import { defineComponent, ref, computed } from 'vue'
import AsideMenu from './components/aside-menu/index.vue'
import HeaderBar from './components/headerbar/index.vue'
import ImageList from './components/image-list/index.vue'
import InfoComp from './components/information/index.vue'
import BatchOperate from './components/batch-operate/index.vue'
import { useHandler } from './use/useHandler'
import { useImageList } from './use/useImageList'
import { useProvideRegister } from '&/use/useProvideRegister'
import { Folder } from './components/aside-menu/use/useFolder'
import { SelectOptions } from './components/headerbar/search/use/useSearchOption'

export default defineComponent({
  name: 'gallery',

  components: {
    AsideMenu,
    HeaderBar,
    ImageList,
    InfoComp,
    BatchOperate,
  },

  props: {
    isPage: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['onSubmit', 'onCancel', 'onConfirm'],

  setup(props, { emit }) {
    const mainRef = ref(null)
    const selectStatus = ref<string>($t('選取').value)
    const isBatchSelect = computed(() => selectStatus.value === $t('取消').value)
    const customFolderList = ref<Folder[]>([])
    const folderTotalNumber = ref<number>(0)
    const searchValue = ref<string | string[]>()
    const searchSelected = ref<SelectOptions[]>([])
    const searchSameSelected = ref<boolean>(false)

    const { activeFolder, activeImage, hasActiveImage, activeImageList } = useImageList({
      isPage: props.isPage,
    })

    const {
      onImageSubmitHandler,
      folderActiveHandler,
      onSelectHandler,
      onConfirmHandler,
      onCancelHandler,
      onSearchHandler,
      listUpdateHandler,
    } = useHandler({
      props,
      emit,
      activeFolder,
      activeImage,
      activeImageList,
      selectStatus,
      folderTotalNumber,
      searchValue,
      mainRef,
    })

    const onDelete = useProvideRegister('onDelete', [() => {}])
    const deleteSuccessHandler = () => {
      onDelete()
    }

    const onMove = useProvideRegister('onMove', [() => {}])
    const moveSuccessHandler = () => {
      onMove()
    }

    const onEdit = useProvideRegister('onEdit', [() => {}])
    const editSuccessHandler = () => {
      onEdit()
    }

    const onCreate = useProvideRegister('onCreate', [() => {}])
    const createImageHandler = value => {
      onCreate()
      emit('onSubmit', value)
    }

    return {
      onImageSubmitHandler,
      folderActiveHandler,
      onSelectHandler,
      onConfirmHandler,
      onCancelHandler,
      deleteSuccessHandler,
      moveSuccessHandler,
      editSuccessHandler,
      onSearchHandler,
      listUpdateHandler,

      searchSameSelected,
      searchSelected,
      searchValue,
      activeImageList,
      activeFolder,
      isBatchSelect,
      activeImage,
      hasActiveImage,
      customFolderList,
      folderTotalNumber,
      mainRef,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/share.scss';

.gallery {
  display: flex;
  height: 100%;
  border-radius: 8px;
  background-color: $border-shallow-color;
}

.container {
  width: 100%;
  height: 100%;
  .operator {
    display: flex;
    align-items: center;
    width: inherit;
    height: 50px;
    border-top: solid 1px $border-deep-color;
    padding-left: 24px;
  }
}

.main {
  height: calc(100% - 56px);
  width: 100%;
  overflow-y: auto;

  &.not-page {
    height: calc(100% - 56px - 50px);
  }
}

.batch-operate,
.info {
  width: 0;
  height: 100%;
  background-color: $aside-menu-background-color;
  transition: width 0.3s;
  border-radius: 0 8px 8px 0;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  padding: 12px 0;

  &.is-active {
    max-width: 20%;
    min-width: 260px;
  }
}
</style>
