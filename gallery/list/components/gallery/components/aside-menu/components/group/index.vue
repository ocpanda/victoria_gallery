<template lang="pug">
mrc-drawer(:size="560")
  template(#reference="{ toggle }")
    .title-label(v-if="expandMenu")
      span {{ $t('相簿') }}
      edit-svg(
        v-if="isPage"
        :size="20"
        @click="toggle"
      )

  template(v-slot="{ toggle }")
    form-comp(v-bind="$attrs" @success="successHandler(toggle)" @cancel="toggle")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EditSvg from '&/components/svgs/edit.vue'
import FormComp from './form.vue'

export default defineComponent({
  name: 'group',

  components: {
    EditSvg,
    FormComp,
  },

  props: {
    expandMenu: {
      type: Boolean,
    },

    isPage: {
      type: Boolean,
    },
  },

  emits: ['onSuccess'],

  setup(props, { emit }) {
    const successHandler = toggle => {
      console.log('qwdqwdqwd')
      toggle()
      emit('onSuccess')
    }

    return {
      successHandler,
    }
  },
})
</script>
