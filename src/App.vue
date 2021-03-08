<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
	name: 'App'
})
export default class extends Vue {}
</script>

<style lang="scss">
	.blog-list {
		padding: 10px;
        height: 100%;
    display: flex;
    flex-direction: column;
	}
  .page-content{
    padding-top: 10px;
    display: flex;
        height: 0;
    flex: 1;
  }
</style>
