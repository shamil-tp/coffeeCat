<script>
    export default{
        name:"MainLayout"
    }
</script>
<template>
    <div class="main__container--section">
        <RouterView/>
    </div>
</template>
<style scoped>
    .main__container--section{
        width: 100%;
        height: 100vh;
        background-color: rgb(32, 17, 6);
    }
</style>