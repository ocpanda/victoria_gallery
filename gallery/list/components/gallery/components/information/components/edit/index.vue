<template lang="pug">
mrc-drawer(:width="560")
  template(#reference="{ toggle }")
    .operate-row(@click="toggle")
      edit-svg(size="20")
      span {{ $t('編輯') }}

  template(v-slot="{ toggle }")
    form-comp(v-bind="$attrs" :info="info" @success="successHandler(toggle)" @cancel="toggle")
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Info } from '../../use/useInfo'
import EditSvg from '&/components/svgs/edit.vue'
import FormComp from './form.vue'

export default defineComponent({
  name: 'edit',

  components: {
    EditSvg,
    FormComp,
  },

  props: {
    info: {
      type: Object as PropType<Info>,
    },
  },

  emits: ['onEditSuccess'],

  setup(props, { emit }) {
    const successHandler = toggle => {
      toggle()
      emit('onEditSuccess')
    }

    return {
      successHandler,
    }
  },
})
</script>
