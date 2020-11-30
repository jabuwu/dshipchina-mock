<template>
  <div>
    <div v-if="editing">
      <input :type="type" ref="input" v-model="newValue" @blur="commit()" @keydown.enter="commit()" @keydown.esc="cancel()" :disabled="disabled" />
    </div>
    <div v-else>
      {{ oldValue }} <button @click="edit()" :disabled="disabled">Edit</button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    oldValue: '',
    newValue: '',
    editing: false
  }),
  props: {
    value: {
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'input'
    }
  },
  created() {
    this.oldValue = this.value;
  },
  methods: {
    edit() {
      this.newValue = this.oldValue;
      this.editing = true;
      setTimeout(() => {
        this.$refs['input'].focus();
        this.$refs['input'].select();
      }, 0);
    },
    commit() {
      this.editing = false;
      if (this.oldValue != this.newValue) {
        this.oldValue = this.newValue;
        if (this.type === 'number') {
          this.$emit('change', Number(this.newValue));
        } else {
          this.$emit('change', this.newValue);
        }
      }
    },
    cancel() {
      this.newValue = this.oldValue;
      this.editing = false;
    }
  },
  watch: {
    value: function () {
      this.oldValue = this.value;
    }
  }
};
</script>