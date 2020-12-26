<template>
    <div class="cell" @mouseenter="mouseOverCell" :class="{ active: !!active }">
        <slot/>
    </div>
</template>

<script>
export default {
    name: "Cell",
    props: {
        active: {
            type: Number,
            default: 0
        },
        i: {
            type: Number,
            default: 0
        },
        j: {
            type: Number,
            default: 0
        },
    },
    methods: {
        mouseOverCell: function (e) {
            if (e.ctrlKey) this.$emit('mouseOverCell', {i: this.i, j: this.j})
        }
    }
}
</script>

<style scoped lang="less">

.cell {
    box-shadow: inset 0 0 1px 1px blue;
    transition: 2s;
    background: transparent;

    &:hover {
        transition: .01s;
        background: blue;
    }

    &.active {
        background: blue;
    }
}
</style>
