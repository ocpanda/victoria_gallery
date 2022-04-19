<template lang="pug">
.form
  mrc-form(v-model="galleries" :fields="fields" :on-submit="submitHandler" v-bind="$attrs")
    template(#content:gallery)
      .gallery-list
        template(v-for="(gallery, index) of galleries" :key="`${gallery.value}-${index}`")
          .gallery
            mrc-input(v-model="gallery.label" :disabled="isGalleryDisabled(galleries[index].label, index)")
            .close(v-if="!isGalleryDisabled(galleries[index].label, index)" @click="removeGalleryHandler(index)")
              close-svg(:size="10" fill="global-background")

    template(#content:_operate)
      span.add-gallery(@click="addGalleryHandler") {{ $t('新增相簿') }}
</template>

<script lang="ts">
import { defineFields } from '&/components/basic/form/defineFields'
import { $t } from '@/i18n'
import { defineComponent, PropType, getCurrentInstance, ref, computed } from 'vue'
import { Folder } from '../../use/useFolder'
import CloseSvg from '&/components/svgs/close.vue'
import { deepCopy } from '&/helper'
import { postGroup, putGroup, deleteGroup } from '@/services/gallery'

type Gallery = { value: number; label?: string }

export default defineComponent({
  name: 'form-comp',

  components: {
    CloseSvg,
  },

  props: {
    customList: {
      type: Array as PropType<Folder[]>,
      default: () => [],
    },
  },

  setup(props) {
    const repo = getCurrentInstance()?.appContext.config.globalProperties.$repo
    const classificationList = repo.Classification.getList()

    const galleries = ref<Gallery[]>([])
    galleries.value = props.customList.map(item => ({
      value: item.value as number,
      label: item.label,
    }))
    const oldGalleries = ref<Gallery[]>(deepCopy(galleries.value))

    const fields = defineFields([
      {
        label: $t('相簿名稱').value,
        prop: 'gallery',
      },
      {
        label: '',
        prop: '_operate',
      },
    ])

    const addGalleryHandler = () => {
      galleries.value.push({
        label: undefined,
        value: 0,
      })
    }

    const removeGalleryHandler = index => {
      galleries.value.splice(index, 1)
    }

    const isGalleryDisabled = (value, index) => {
      return (
        classificationList.find(item => {
          return item.label === value && index < classificationList.length
        }) !== undefined
      )
    }

    const deleteGalleries = computed(() => {
      return oldGalleries.value.filter(old => {
        return galleries.value.find(item => item.value === old.value) === undefined
      })
    })
    const createGalleries = computed(() =>
      galleries.value.filter(item => item.value === 0 && !['', undefined].includes(item.label))
    )
    const editedGalleries = computed(() => {
      return galleries.value.filter(item => {
        if (item.value === 0) return false

        return (
          oldGalleries.value.find(old => old.label === item.label) === undefined &&
          !['', undefined].includes(item.label)
        )
      })
    })
    const deleteGallery = async () => {
      return Promise.allSettled(
        deleteGalleries.value.map(item => {
          return deleteGroup({ value: item.value })
        })
      )
        .then(value => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return value.every(item => item.value[1] === undefined)
        })
        .catch(() => false)
    }
    const postGallery = async () => {
      return Promise.allSettled(
        createGalleries.value.map(item => {
          return postGroup({ label: item.label as string })
        })
      )
        .then(value => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return value.every(item => item.value[1] === undefined)
        })
        .catch(() => false)
    }
    const putGallery = async () => {
      return Promise.allSettled(
        editedGalleries.value.map(item => {
          return putGroup({ value: item.value, label: item.label as string })
        })
      )
        .then(value => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return value.every(item => item.value[1] === undefined)
        })
        .catch(() => false)
    }
    const submitHandler = async () => {
      let putErr = true
      let postErr = true
      let deleteErr = true
      if (editedGalleries.value.length > 0) {
        putErr = await putGallery()
      }
      if (createGalleries.value.length > 0) {
        postErr = await postGallery()
      }
      if (deleteGalleries.value.length > 0) {
        deleteErr = await deleteGallery()
      }

      if (putErr && postErr && deleteErr) return [true, undefined]
      else return [undefined, false]
    }

    return {
      galleries,
      fields,

      addGalleryHandler,
      removeGalleryHandler,
      submitHandler,

      isGalleryDisabled,
    }
  },
})
</script>

<style lang="scss">
@import '~/scss/share.scss';

.form {
  display: flex;
  justify-content: center;
}

.gallery-list {
  display: flex;
  flex-direction: column;

  & .gallery:not(:first-child) {
    margin-top: 8px;
  }
}

.add-gallery {
  color: $font-main-color;

  &:hover {
    cursor: pointer;
  }
}

.gallery {
  display: flex;
  align-items: center;

  .mrc-input {
    width: 180px;
  }

  .close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-left: 8px;
    background-color: $feedback-danger-color;
    border-radius: 20px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
