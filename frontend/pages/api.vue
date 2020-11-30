<template>
  <div>
    <h2 v-if="loading">Loading...</h2>
    <h2 v-else>Tracking Hook URL</h2>
    <input-edit :value="url" @change="urlSet($event)" />
  </div>
</template>

<script>
import InputEdit from '../components/input-edit.vue';
import { isValidURL } from '../util';

export default {
  components: {
    InputEdit
  },
  data: () => ({
    loading: true,
    url: ''
  }),
  async mounted() {
    let data = await fetch('/admin/abc/tracking-hook');
    this.url = (await data.json()).url;
    this.loading = false;
  },
  methods: {
    async urlSet(url) {
      if (url === '' || isValidURL(url)) {
        this.loading = true;
        let result = await fetch(`/admin/abc/tracking-hook`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url
          })
        });
        if (result.status === 200) {
          let { url } = await result.json();
          this.url = url;
        }
      } else {
        let url = this.url;
        this.url = '';
        setTimeout(() => {
          this.url = url;
        }, 0);
      }
      this.loading = false;
    }
  }
};
</script>