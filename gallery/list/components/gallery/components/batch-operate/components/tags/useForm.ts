export const useForm = ({ tags }: { tags: string[] }) => {
  const checkTags = () => {
    if (tags.every(tag => (typeof tag === 'number' ? true : tag.length >= 2 && tag.length <= 100)))
      return true
    else return false
  }

  return {
    checkTags,
  }
}
