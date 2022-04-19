<template lang="pug">
mrc-drawer(:size="560")
  template(#reference="{ toggle }")
    .operate-row(@click="toggle")
      Icon.plus(name="plus" :size="11")
      span {{ $t('新增標籤') }}

  template(v-slot="{ toggle }")
    form-comp(v-bind="$attrs" @cancel="toggle" @success="successHandler(toggle)")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '&/components/icon/index.vue'
import FormComp from './form.vue'

export default defineComponent({
  name: 'tags',

  components: {
    Icon,
    FormComp,
  },

  emits: ['success'],

  setup(props, { emit }) {
    const successHandler = toggle => {
      emit('success')
      toggle()
    }

    return {
      successHandler,
    }
  },
})
</script>
