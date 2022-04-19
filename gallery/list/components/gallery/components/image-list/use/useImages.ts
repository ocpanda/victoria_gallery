import { getAlbumDefaultList, getAlbumGroupList, getAlbumSearch } from '@/services/gallery'
import { ref, watch } from 'vue'
import { defaultFolderList } from '../../aside-menu/use/useFolder'
import { useInjectRegister } from '&/use/useInjectRegister'
import { deepCompare } from '&/helper'
import { minLength } from '@/validator'
import { useNotice } from '&/use/useNotice'

export type Image = { value: number; label: string; path: string }
type SearchType = 'default' | 'custom' | 'search'

export const useImages = ({
  activeFolder,
  customFolderList,
  searchValue,
  searchSelected,
  searchSameSelected,
  loading,
}) => {
  const list = ref<Image[]>([])

  const nowType = ref<SearchType>('default')
  const form = ref<any>()

  const pagination = ref<{ page: number; count: number }>({
    page: 1,
    count: 50,
  })

  const getAlbumImageList = async (body, type: SearchType): Promise<any> => {
    if (type === 'default') return getAlbumDefaultList(body)
    else if (type === 'custom') return getAlbumGroupList(body)
    else if (type === 'search') return getAlbumSearch(body)
  }

  const getChangePage = () => {
    if (nowType.value === 'search') getSearchList()
    else getImageListPage(activeFolder.value)
  }

  const getImageList = async (body, type: SearchType) => {
    if (type !== nowType.value) {
      pagination.value.page = 1
      nowType.value = type
    } else {
      if (type === 'default') {
        if (body.type !== form.value?.type) pagination.value.page = 1
      } else if (type === 'custom') {
        if (body.id !== form.value.id) pagination.value.page = 1
      } else {
        if (
          deepCompare(
            {
              key: form.value.key,
              fileName: form.value.fileName,
              albumName: form.value.albumName,
              tag: form.value.tag,
            },
            body
          )
        )
          pagination.value.page = 1
      }
    }

    form.value = {
      ...body,
      count: pagination.value.count,
      page: pagination.value.page,
    }
    loading.load()
    const [res, err] = await getAlbumImageList(form.value, type)
    loading.unload()
    if (!err) {
      if (isSearch.value === true) {
        list.value = res.data
        searchTotal.value = res.total
      } else list.value = res
    }
  }

  const getImageListPage = value => {
    // 取得預設資料夾圖片
    if (defaultFolderList.map(item => item.value).includes(value)) {
      const type = defaultFolderList.findIndex(item => item.value === value)
      const body = {
        type: type + 1,
      }

      getImageList(body, 'default')
    } else if (customFolderList.value.map(item => item.value).includes(parseInt(value, 10))) {
      const body = {
        id: value,
      }

      getImageList(body, 'custom')
    }
  }

  const getSearchList = async () => {
    const body = {
      key: searchValue.value,
      fileName: searchSelected.value.flat(1).includes('filename') ? 1 : 0,
      albumName: searchSelected.value.flat(1).includes('gallery') ? 1 : 0,
      tag: searchSelected.value.flat(1).includes('tag') ? 1 : 0,
      match: searchSameSelected.value === true ? 1 : 0,
    }
    await getImageList(body, 'search')
  }

  const isSearch = ref(false)
  const searchTotal = ref(0)
  {
    // 取得圖片
    watch(
      () => activeFolder.value,
      async value => {
        if (value === 'search') return

        isSearch.value = false
        getImageListPage(value)
      },
      { immediate: true }
    )
  }

  {
    // inject event
    const onDelete = useInjectRegister('onDelete')
    onDelete(() => {
      getImageListPage(activeFolder.value)
    })

    const onMove = useInjectRegister('onMove')
    onMove(() => {
      getImageListPage(activeFolder.value)
    })

    const onEdit = useInjectRegister('onEdit')
    onEdit(() => {
      getImageListPage(activeFolder.value)
    })

    const onCreate = useInjectRegister('submitted')
    onCreate(() => {
      getImageListPage(activeFolder.value)
    })

    const onSearch = useInjectRegister('onSearch')
    onSearch(async () => {
      activeFolder.value = 'search'
      isSearch.value = true
      if ((searchValue.value ?? '').length > 0) await getSearchList()
      else useNotice().message.warn(minLength(1).$message)
    })
  }

  return {
    list,
    pagination,
    getChangePage,
    isSearch,
    searchTotal,
  }
}
