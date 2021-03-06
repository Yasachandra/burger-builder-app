import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
};

const purchaseInit = (state) => updateObject(state, { purchased: false });

const purchaseBurgerStart = (state) => updateObject(state, { loading: true });

const purchaseBurgerSuccess = (state, action) => {
  const newOrder = updateObject(action.orderData, { id: action.orderId });
  return updateObject(state, {
    loading: false,
    orders: [...state.orders, newOrder],
    purchased: true,
  });
};

const purchaseBurgerFailed = (state) => updateObject(state, { loading: false });

const fetchOrdersStart = (state) => updateObject(state, { loading: true });

const fetchOrdersSuccess = (state, action) =>
  updateObject(state, {
    orders: action.orders,
    loading: false,
  });

const fetchOrdersFailed = (state) => updateObject(state, { loading: false });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASE_INIT:
      return purchaseInit(state);
    case actionTypes.PURCHASE_BURGER_START:
      return purchaseBurgerStart(state);
    case actionTypes.PURCHASE_BURGER_SUCCESS:
      return purchaseBurgerSuccess(state, action);
    case actionTypes.PURCHASE_BURGER_FAILED:
      return purchaseBurgerFailed(state);
    case actionTypes.FETCH_ORDERS_START:
      return fetchOrdersStart(state);
    case actionTypes.FETCH_ORDERS_SUCCESS:
      return fetchOrdersSuccess(state, action);
    case actionTypes.FETCH_ORDERS_FAILED:
      return fetchOrdersFailed(state);
    default:
      return state;
  }
};

export default reducer;
