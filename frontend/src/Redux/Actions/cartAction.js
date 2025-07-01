// import axios from "axios";
// import { ADD_TO_CART, REMOVE_CART_ITEM } from "../Constants/cartConstants";

// export const addToCartAction = (id, quantity) => async (dispatch, getState) => {
//   const { data } = await axios.get(`http://localhost:8080/api/product/getSingleProduct/${id}`);
//   //console.log("CART ACTION CALL");
//   dispatch({
//     type: ADD_TO_CART,
//     payload: {
//       id: data.product._id,
//       name: data.product.name,
//       rate: data.product.rate,
//       stocks: data.product.stocks,
//       kilogramOption: data.product.kilogramOption,
//       image: data.product.url,
//       quantity,
//     },
//   });
//   localStorage.setItem(
//     "userCart",
//     JSON.stringify(getState().userCart.cartItems)
//   );
// };

// export const removeCartItemAction = (id) => (dispatch, getState) => {
//   dispatch({ type: REMOVE_CART_ITEM, payload: id });
//   localStorage.setItem(
//     "userCart",
//     JSON.stringify(getState().userCart.cartItems)
//   );
// };


import axios from "axios";
import { ADD_TO_CART, REMOVE_CART_ITEM } from "../Constants/cartConstants";

// Base API URL from environment variable
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const addToCartAction = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`${BASE_URL}/product/getSingleProduct/${id}`);

  // Ensure kilogramOption is unique
  const uniqueKgOptions = [...new Set(data.product.kilogramOption)];

  dispatch({
    type: ADD_TO_CART,
    payload: {
      id: data.product._id,
      name: data.product.name,
      rate: data.product.rate,
      stocks: data.product.stocks,
      kilogramOption: uniqueKgOptions, // cleaned values
      image: data.product.url,
      quantity,
    },
  });

  localStorage.setItem(
    "userCart",
    JSON.stringify(getState().userCart.cartItems)
  );
};

export const removeCartItemAction = (id) => (dispatch, getState) => {
  dispatch({ type: REMOVE_CART_ITEM, payload: id });

  localStorage.setItem(
    "userCart",
    JSON.stringify(getState().userCart.cartItems)
  );
};