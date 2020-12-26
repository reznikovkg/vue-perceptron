import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const buildM = (n, zero = true) => {
  const matrix = [];
  for (let i = 0; i < n; i++) {
    matrix.push([]);

    for (let j = 0; j < n; j++) {
      matrix[i].push(zero ? 0 : randomNumber(-0.3, 0.3));
    }
  }
  return matrix
}

const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
}

export default new Vuex.Store({
  state: {
    speed: 0.3,
    n: 20,
    size: 400,
    matrix: [],
    factors: localStorage.getItem('factors') ? JSON.parse(localStorage.getItem('factors')) : [],
    mode: 'picture',
    result: false,
    request: false
  },
  getters: {
    getMatrix: state => {
      return state.matrix;
    },
    getFactors: state => {
      return state.factors;
    },
    getSize: state => {
      return state.size;
    },
    getN: state => {
      return state.n;
    },
    getMode: state => {
      return state.mode;
    },
    getResult: state => {
      return state.result;
    },
    getRequest: state => {
      return state.request;
    },
  },
  mutations: {
    setMatrix(state, _matrix) {
      state.matrix = _matrix;
    },
    setFactors(state, _factors = null) {
      state.factors = _factors ? _factors : buildM(state.n, false);
      localStorage.setItem('factors', JSON.stringify(state.factors));
    },
    setMode(state, mode) {
      state.mode = mode;
    },
    setResult(state, result) {
      state.result = result;
    },
    setRequest(state, request) {
      state.request = request;
    },
    setMatrixCell(state, payload) {
      let matrix = state.matrix;
      matrix[payload.i][payload.j] = payload.value;
      state.matrix = [...matrix];
    },
  },
  actions: {
    setMatrix({commit}, _matrix) {
      commit("setMatrix", _matrix);
    },
    setFactors({commit}) {
      commit("setFactors");
    },
    setMode({commit}, _mode) {
      commit("setMode", _mode);
    },
    setMatrixCell({commit}, payload) {
      commit("setMatrixCell", payload);
    },
    buildMatrix({commit, state}) {
      commit('setMatrix', buildM(state.n))
    },
    identifyMatrix({commit, state}) {
      let sum = 0;
      for (let i = 0; i < state.n; i++) {
        for (let j = 0; j < state.n; j++) {
          sum += state.matrix[i][j] * state.factors[i][j];
        }
      }

      console.log(sum)
      commit('setResult', sum > 0)
      commit('setRequest', true)
    },
    correctFactors({commit, state}, payload) {
      commit('setRequest', false)

      if (!payload) {
        const test = !state.result ? 1 : -1;
        let factors = state.factors;
        for (let i = 0; i < state.n; i++) {
          for (let j = 0; j < state.n; j++) {
            factors[i][j] += state.speed * state.matrix[i][j] * test;
          }
        }
        commit('setFactors', factors)
      }
    },
    fitMatrix({commit, state}, payload) {

      const findL = () => {
        for (let i = 0; i < state.n; i++) {
          for (let j = 0; j < state.n; j++) {
            if (state.matrix[j][i]) return i;
          }
        }

        return 0;
      }

      const findT = () => {
        for (let i = 0; i < state.n; i++) {
          for (let j = 0; j < state.n; j++) {
            if (state.matrix[i][j]) return i;
          }
        }

        return 0;
      }

      const findR = () => {
        for (let i = state.n - 1; i >= 0; i--) {
          for (let j = 0; j < state.n; j++) {
            if (state.matrix[j][i]) return i;
          }
        }

        return 0;
      }

      const findB = () => {
        for (let i = state.n - 1; i >= 0; i--) {
          for (let j = 0; j < state.n; j++) {
            if (state.matrix[i][j]) return i;
          }
        }

        return 0;
      }

      const t = {
        l: findL(),
        r: findR(),
        t: findT(),
        b: findB()
      };

      const matrix = buildM(state.n);

      for (let i = 0; i < state.n; i++) {
        for (let j = 0; j < state.n; j++) {

          const x = Math.floor(t.t + i / (state.n - 1) * (t.b - t.t + 1));
          const y = Math.floor(t.l + j / (state.n - 1) * (t.r - t.l + 1));

          matrix[i][j] = state.matrix[
            x < state.n ? x : state.n - 1
            ][
            y < state.n ? y : state.n - 1
            ];
        }
      }
      commit('setMatrix', matrix);
    },
  }
});
