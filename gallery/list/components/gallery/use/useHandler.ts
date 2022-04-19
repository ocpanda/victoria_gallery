import { useProvideRegister } from '&/use/useProvideRegister'

export const useHandler = ({
  props,
  emit,
  activeFolder,
  selectStatus,
  activeImage,
  activeImageList,
  folderTotalNumber,
  searchValue,
  mainRef,
}) => {
  const imageSubmitted = useProvideRegister('submitted', [() => {}])

  const onImageSubmitHandler = value => {
    if (props.isPage) {
      imageSubmitted()
    } else {
      imageSubmitted()
      emit('onSubmit', value)
    }
  }

  const folderActiveHandler = item => {
    folderTotalNumber.value = item.count
    activeFolder.value = item.value.toString()
    searchValue.value = undefined
  }

  const onSelectHandler = value => {
    selectStatus.value = value
  }

  const onUnmountSelectImageHandler = e => {
    if (e.path.find(item => item.className === 'image-item') === undefined) {
      activeImage.value = undefined
    }
  }

  const onConfirmHandler = () => {
    emit('onConfirm', activeImageList.value)
  }

  const onCancelHandler = () => {
    emit('onCancel')
  }

  const searchProvider = useProvideRegister('onSearch', [() => {}])
  const onSearchHandler = () => {
    searchProvider()
  }

  const listUpdateHandler = () => {
    mainRef.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return {
    onImageSubmitHandler,
    folderActiveHandler,
    onSelectHandler,
    onUnmountSelectImageHandler,
    onConfirmHandler,
    onCancelHandler,
    onSearchHandler,
    listUpdateHandler,
  }
}
