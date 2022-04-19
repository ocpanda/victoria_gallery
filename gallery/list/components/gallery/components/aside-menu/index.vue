<template lang="pug">
.gallery-aside-container(
  v-loading="isLoading"
  :class="{ expand: expandMenu }"
)
  menu-svg.menu-toggle(v-if="false" @click="toggleMenu" :class="{ 'no-expand': !expandMenu }")

  .gallery-aside-menu(:class="{ expand: expandMenu, 'not-scrolling': !isAsideScrolling }" ref="galleryAsideRef")
    .default-container
      gallery-label(
        v-for="item of defaultList"
        :item="item"
        :key="item.value"
        @click="toggleMenuOpen"
        @on-active="activeHandler"
        v-bind="$attrs"
      )

    .custom-container
      group-comp(
        :expandMenu="expandMenu"
        :custom-list="innerCustomList"
        @on-success="onGroupSuccessHandler"
        v-bind="$attrs"
      )

      gallery-label(
        v-for="item of innerCustomList"
        :item="item"
        :key="item.value"
        @click="toggleMenuOpen"
        @on-active="activeHandler"
        v-bind="$attrs"
      )
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useFolder, Folder } from './use/useFolder'
import { useAsideMenu } from './use/useAsideMenu'
import GroupComp from './components/group/index.vue'
import GalleryLabel from './gallery-label.vue'
import MenuSvg from '&/components/svgs/menu.vue'
import { useVModel } from '@vueuse/core'
import { useLoading } from '&/use/useLoading'

export default defineComponent({
  name: 'gallery-aside-menu',

  components: {
    GroupComp,
    GalleryLabel,
    MenuSvg,
  },

  props: {
    customList: {
      type: Array as PropType<Folder[]>,
      default: () => [],
    },
  },

  emits: ['onActive', 'update:folderTotalNumber'],

  setup(props, { emit }) {
    const loading = useLoading()
    const innerCustomList = useVModel(props, 'customList', emit)
    const { defaultList, activeHandler, loadGalleryAlbumList } = useFolder({
      emit,
      customList: innerCustomList,
      loading,
    })

    const { expandMenu, toggleMenu, toggleMenuOpen, galleryAsideRef, isAsideScrolling } =
      useAsideMenu()

    const onGroupSuccessHandler = () => {
      loadGalleryAlbumList()
    }

    return {
      defaultList,
      innerCustomList,
      expandMenu,
      toggleMenu,
      toggleMenuOpen,
      activeHandler,
      onGroupSuccessHandler,
      isLoading: loading.isLoading,
      galleryAsideRef,
      isAsideScrolling,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/share.scss';

.menu-toggle {
  color: $font-sub-content-color;

  &:hover {
    cursor: pointer;
  }

  &.no-expand {
    transform: rotate(180deg);
  }
}

.gallery-aside-container {
  height: inherit;
  width: 48px;
  background-color: $aside-menu-background-color;
  border-radius: 8px 0 0 8px;
  padding: 12px;
  transition: width 0.2s;

  &.expand {
    width: 240px;
  }
}

.gallery-aside-menu {
  height: inherit;
  margin-top: 12px;
  width: 24px;
  height: calc(100% - 40px);
  transition: width 0.2s;
  white-space: nowrap;
  overflow: hidden;
  overflow-y: overlay;

  &.not-scrolling::-webkit-scrollbar {
    display: none;
  }

  &.expand {
    width: 100%;
  }

  :deep(.title-label),
  .title-label {
    display: flex;
    justify-content: space-between;
    width: inherit;
    color: $font-sub-content-color;

    span {
      font-size: 14px;
    }

    svg {
      &:hover {
        cursor: pointer;
      }
    }
  }

  .gallery-label:not(:first-child) {
    margin-top: 12px;
  }

  .custom-container {
    margin-top: 20px;
  }
}
</style>
