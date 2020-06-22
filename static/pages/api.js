function isValidURL(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};

const Api = Vue.component('api', {
  template: `
    <div>
      <h2 v-if="loading">Loading...</h2>
      <h2 v-else>Tracking Hook URL</h2>
      <input-edit :value="url" @change="urlSet($event)" />
    </div>
  `,
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
});

