<template>

</template>

<script>
export default {
    mounted() {
        window.addEventListener('keyup', this.handleKeyEsc);
    },
    beforeUnmount() {
        window.removeEventListener('keyup', this.handleKeyEsc);
    },
    methods: {
        handleKeyEsc(event) {
            if (event.key === 'Escape') {
                this.$router.push("/menu");
            }
        }
    }
}
</script>

<style>

</style>