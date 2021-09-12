<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <p @click="$store.commit('add')">{{$store.state.count}}</p>
    <p @click="$store.dispatch('add')">async{{$store.state.count}}</p>
    <p>double: {{$store.getters.double}}</p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  }
}
</script>
