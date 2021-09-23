const state = function() {
	return {
		filters: {
			search: '',
			followers: [ 100, 3000000 ],
			price: [ 1, 25 ],
			genres: []
		},
		genres: []
	};
};

const getters = {
	getGenres(state) {
		return state.genres;
	},
	getFilters(state) {
		return state.filters;
	}
};

const mutations = {
	SET_GENRES(state, val) {
		state.genres = val;
	},
	SET_FILTERS(state, val) {
		state.filters = val;
	},
	RESET_FILTERS(state) {
		state.filters = {
			search: '',
			followers: [ 100, 3000000 ],
			price: [ 1, 25 ],
			genres: []
		};
	}
};

const actions = {
	getGenres({ commit }) {
		return new Promise((resolve, reject) => {
			this.$axios
				.get(`genre`)
				.then((response) => response.data)
				.then((response) => {
					resolve(response.data);
					commit('SET_GENRES', response.data);
				})
				.catch((error) => reject(error));
		});
	}
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
};
