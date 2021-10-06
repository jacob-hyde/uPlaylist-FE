const state = function() {
	return {
		cart: []
	};
};

const getters = {
	getCart(state) {
		return state.cart;
	}
};

const mutations = {
	ADD_TO_CART(state, val) {
		state.cart.push(val);
	},
  REMOVE_FROM_CART(state, val) {
		state.cart = state.cart.filter((v) => {
			return v.id !== val.id;
		});
	},
	CLEAR_CART(state) {
		state.cart = [];
	}
};

const actions = {
	clearCart({ commit }) {
		commit('CLEAR_CART');
	}
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
};
