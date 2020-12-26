<template>
    <div class="perceptron">
        <div class="canvas">
            <div v-for="i in getMatrix.length" :key="i" class="row">
                <Cell v-for="j in getMatrix[i-1].length" :key="j"
                      :style="{ width: `${getSize/getN}px`, height: `${getSize/getN}px` }"
                      :active="getMatrix[i-1][j-1]"
                      :i="i-1"
                      :j="j-1"
                      @mouseOverCell="mouseOverCell"
                />
            </div>
        </div>

        <nav>
            <button @click="buildMatrix">Reset</button>

            <button v-if="getMode !== 'draw'" @click="setMode('draw')">Draw</button>
            <button v-else @click="setMode('mode')" class="primary">UnDraw</button>

            <button @click="fitMatrix">Fit</button>

            <button @click="identifyMatrix">Identify</button>


            <div v-if="getRequest">
                <span v-if="getResult">It`s CROSS</span>
                <span v-else>It`s CIRCLE</span>

                <div class="btn-group">
                    <button class="success" @click="correctFactors(true)">TRUE</button>
                    <button class="error" @click="correctFactors(false)">FALSE</button>
                </div>
            </div>


        </nav>
    </div>
</template>

<script>
import Cell from "@/components/Cell";
import {mapGetters, mapActions} from 'vuex';

export default {
    name: 'Perceptron',
    components: {
        Cell
    },
    props: {},
    data() {
        return {}
    },
    computed: {
        ...mapGetters([
            'getMatrix',
            'getSize',
            'getN',
            'getMode',
            "getResult",
            "getRequest",
            "getFactors"
        ]),
    },
    mounted() {
        if (!this.getFactors) this.setFactors();
        this.buildMatrix();
    },
    methods: {
        ...mapActions([
            "buildMatrix",
            "setMatrixCell",
            "setMode",
            "fitMatrix",
            "setFactors",
            "identifyMatrix",
            "correctFactors"
        ]),
        mouseOverCell(p) {
            if (this.getMode === 'draw') {
                this.setMatrixCell({...p, value: 1})
            }
        }
    }
}
</script>


<style scoped lang="less">

.perceptron {
    display: flex;
}

.canvas {
    border: 2px solid blue;
    margin: 20px;

    .row {
        display: flex;
        justify-content: space-between;
    }
}

nav {
    margin: 20px;

    display: grid;
    grid-template-columns: 120px;
    grid-auto-rows: 40px;

    grid-gap: 10px;
}

.btn-group {
    margin: 10px 0;
    display: grid;
    grid-template-columns: 60px 60px;
    grid-auto-rows: 30px;

    grid-gap: 10px;
}

button {
    border: none;
    box-shadow: 3px 2px 6px rgba(0, 0, 0, .2);
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
    }

    &.primary {
        background: #b0b5ff;
    }

    &.success {
        background: #87ff77;
    }

    &.error {
        background: #ff6e87;
    }
}
</style>
