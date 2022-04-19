import { $t } from '@/i18n'
import { ref } from 'vue'
import { getGalleryAlbumList } from '@/services/gallery'
import { useInjectRegister } from '&/use/useInjectRegister'

export type Folder = {
  label: string
  value: number | 'all' | 'often' | 'recently'
  image: string
  count: number
  select?: boolean
}

export const defaultFolderList: Folder[] = [
  {
    label: $t('全部').value,
    value: 'all',
    image: 'el-coin',
    count: 0,
  },
  {
    label: $t('最常使用').value,
    value: 'often',
    image: 'el-coin',
    count: 0,
  },
  {
    label: $t('最近上傳').value,
    value: 'recently',
    image: 'el-view',
    count: 0,
  },
]

export const useFolder = ({ emit, customList, loading }) => {
  const defaultList = ref(defaultFolderList.map(item => ({ ...item, select: false })))

  const loadGalleryAlbumList = async () => {
    loading.load()
    const [res, err] = await getGalleryAlbumList()
    loading.unload()

    if (!err && res !== undefined) {
      for (const item of defaultList.value) {
        const defaultRes = res.default.find(datum => datum.value === item.value)

        if (defaultRes === undefined) continue
        item.count = defaultRes?.count

        if (item.value === 'all') emit('onActive', item)
      }

      customList.value = res.custom.map(item => ({
        ...item,
        image: 'el-folder',
        select: false,
      }))
    }
  }

  ;(async () => {
    await loadGalleryAlbumList()
  })()

  const activeHandler = item => {
    const custom = customList.value.find(custom => custom.value === item.value)
    const defaultItem = defaultList.value.find(defaultItem => defaultItem.value === item.value)

    for (const custom of customList.value) {
      custom.select = false
    }
    for (const defaultItem of defaultList.value) {
      defaultItem.select = false
    }

    if (custom !== undefined) {
      custom.select = true
    } else if (defaultItem !== undefined) {
      defaultItem.select = true
    }
    emit('onActive', item)
  }

  {
    // inject event
    const onDelete = useInjectRegister('onDelete')
    onDelete(() => {
      loadGalleryAlbumList()
    })

    const onMove = useInjectRegister('onMove')
    onMove(() => {
      loadGalleryAlbumList()
    })

    const onCreate = useInjectRegister('submitted')
    onCreate(() => {
      loadGalleryAlbumList()
    })
  }

  return {
    defaultList,
    customList,
    activeHandler,
    loadGalleryAlbumList,
  }
}
