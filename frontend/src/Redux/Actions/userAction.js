import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  CLEAR_ERROR,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  LOAD_LOGIN_USER_REQUEST,
  LOAD_LOGIN_USER_FAIL,
  LOAD_LOGIN_USER_SUCCESS,
  LOGOUT_USER_REQUEST,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  USER_PASSWORD_UPDATE_REQUEST,
  USER_PASSWORD_UPDATE_SUCCESS,
  USER_PASSWORD_UPDATE_FAIL,
  SEND_PASSWORD_REST_EMAIL_REQUEST,
  SEND_PASSWORD_REST_EMAIL_SUCCESS,
  SEND_PASSWORD_REST_EMAIL_FAIL,
  USER_PASSWORD_REST_REQUEST,
  USER_PASSWORD_REST_SUCCESS,
  USER_PASSWORD_REST_FAIL,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_ROLE_FAIL,
} from "../Constants/userConstants";

import axios from "axios";

export const userRegisterAction = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const { data } = await axios.post(" /api/user/register", userData);
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, error: error.response.data.message });
  }
};

// export const userLoginAction = (userData) => async (dispatch) => {
//   try {
//     dispatch({ type: USER_LOGIN_REQUEST });
//     const config = { headers: { "Content-Type": "application/json" } };
//     const { data } = await axios.post(" /api/user/login", userData);
//     dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({ type: USER_LOGIN_FAIL, error: error.response.data.message });
//   }
// };


export const userLoginAction = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(" /api/user/login", userData, config);

    console.log("✅ Login Success:", data);

    // Store token in both localStorage and cookies
    localStorage.setItem("authToken", data.token);

    document.cookie = `token=${data.token}; path=/; Secure`;

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
  } catch (error) {
    console.error("❌ Login Failed:", error.response?.data?.message || "Unknown Error");
    dispatch({ type: USER_LOGIN_FAIL, error: error.response?.data?.message || "Login failed!" });
  }
};

// export const loadUserAction = () => async (dispatch) => {
//   try {
//     dispatch({ type: LOAD_LOGIN_USER_REQUEST });
//     const { data } = await axios.get(" /api/user/getloggeduser");
//     dispatch({
//       type: LOAD_LOGIN_USER_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     dispatch({
//       type: LOAD_LOGIN_USER_FAIL,
//       error: error.response.data.message,
//     });
//   }
// };

export const loadUserAction = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_LOGIN_USER_REQUEST });

    const token = localStorage.getItem("authToken");

    const { data } = await axios.get(" /api/user/getloggeduser", {
      withCredentials: true, // ✅ Ensures cookies are sent
      headers: { Authorization: `Bearer ${token}` } // ✅ Sends authentication token
    });

    dispatch({ type: LOAD_LOGIN_USER_SUCCESS, payload: data });
  } catch (error) {
    // console.error("❌ Load User Failed:", error.response?.data?.message || "Unknown Error");
    dispatch({ type: LOAD_LOGIN_USER_FAIL, error: error.response?.data?.message || "Failed to load user!" });
  }
};
// export const logOutUserAction = () => async (dispatch) => {
//   try {
//     dispatch({ type: LOGOUT_USER_REQUEST });
//     const { data } = await axios.get(" /api/user/logOut");
//     dispatch({ type: LOGOUT_USER_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({ type: LOGOUT_USER_FAIL, error: error.response.data.message });
//   }
// };

// export const userPasswordUpdateAction = (userData) => async (dispatch) => {
//   try {
//     dispatch({ type: USER_PASSWORD_UPDATE_REQUEST });
//     const { data } = await axios.put(" /api/user/changePassword", userData);
//     dispatch({ type: USER_PASSWORD_UPDATE_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({
//       type: USER_PASSWORD_UPDATE_FAIL,
//       error: error.response.data.message,
//     });
//   }
// };

export const logOutUserAction = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT_USER_REQUEST });

    const token = localStorage.getItem("authToken"); // ✅ Ensure token is retrieved

    const { data } = await axios.get(" /api/user/logOut", {
      withCredentials: true, // ✅ Ensures cookies are sent
      headers: { Authorization: `Bearer ${token}` } // ✅ Sends authentication token
    });

    dispatch({ type: LOGOUT_USER_SUCCESS, payload: data });

    // Clear token after successful logout
    localStorage.removeItem("authToken");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  } catch (error) {
    console.error("❌ Logout Failed:", error.response?.data?.message || "Unknown Error");
    dispatch({ type: LOGOUT_USER_FAIL, error: error.response?.data?.message || "Failed to log out!" });
  }
};

export const userPasswordUpdateAction = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_PASSWORD_UPDATE_REQUEST });

    const token = localStorage.getItem("authToken"); // ✅ Ensure token is retrieved

    const { data } = await axios.put(" /api/user/changePassword", userData, {
      withCredentials: true, // ✅ Ensures cookies are sent
      headers: { Authorization: `Bearer ${token}` } // ✅ Sends authentication token
    });

    dispatch({ type: USER_PASSWORD_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    console.error("❌ Password Update Failed:", error.response?.data?.message || "Unknown Error");
    dispatch({ type: USER_PASSWORD_UPDATE_FAIL, error: error.response?.data?.message || "Failed to update password!" });
  }
};
export const restPasswordSendEmailAction = (email) => async (dispatch) => {
  try {
    dispatch({ type: SEND_PASSWORD_REST_EMAIL_REQUEST });
    const { data } = await axios.post(" /api/user/send-reset-password-email", {
      email,
    });
    dispatch({ type: SEND_PASSWORD_REST_EMAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEND_PASSWORD_REST_EMAIL_FAIL,
      error: error.response.data.message,
    });
  }
};

export const restPasswordAction =
  (id, token, password, confirm_password) => async (dispatch) => {
    try {
      dispatch({ type: USER_PASSWORD_REST_REQUEST });
      const { data } = await axios.post(
        ` /api/user/reset-password/${id}/${token}`,
        {
          password,
          confirm_password,
        }
      );
      dispatch({ type: USER_PASSWORD_REST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_PASSWORD_REST_FAIL,
        error: error.response.data.message,
      });
    }
  };

// export const getAllUsersAdminAction = () => async (dispatch) => {
//   try {
//     dispatch({ type: GET_ALL_USERS_REQUEST });
//     const { data } = await axios.get(" /api/user/admin/user");
//     dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({
//       type: GET_ALL_USERS_FAIL,
//       error: error.response.data.message,
//     });
//   }
// };

export const getAllUsersAdminAction = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_USERS_REQUEST });

    const token = localStorage.getItem("authToken"); // ✅ Ensure token is retrieved

    const { data } = await axios.get(" /api/user/admin/user", {
      withCredentials: true, // ✅ Ensures cookies are sent
      headers: { Authorization: `Bearer ${token}` } // ✅ Sends authentication token
    });

    dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data });
  } catch (error) {
    console.error("❌ Error Fetching Users:", error.response?.data?.message || "Unauthorized!");
    dispatch({ type: GET_ALL_USERS_FAIL, error: error.response?.data?.message || "Unauthorized!" });
  }
};

// export const deleteUserAdminAction = (userId) => async (dispatch) => {
//   try {
//     dispatch({ type: DELETE_USER_REQUEST });
//     const { data } = await axios.delete(` /api/user/admin/user/${userId}`);
//     dispatch({ type: DELETE_USER_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({ type: DELETE_USER_FAIL, error: error.response.data.message });
//   }
// };


export const deleteUserAdminAction = (userId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST });

    const token = localStorage.getItem("authToken"); // ✅ Ensure token is retrieved

    const { data } = await axios.delete(` /api/user/admin/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` } // ✅ Sends authentication token
    });

    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
  } catch (error) {
    console.error("❌ Error Deleting User:", error.response?.data?.message || "Unauthorized!");
    dispatch({ type: DELETE_USER_FAIL, error: error.response?.data?.message || "Unauthorized!" });
  }
};

// export const adminUpdateUserAction = (userId, UserRole) => async (dispatch) => {
//   try {
//     dispatch({ type: UPDATE_USER_ROLE_REQUEST });
//     const { data } = await axios.put(` /api/user/admin/user/${userId}`, {
//       UserRole,
//     });
//     dispatch({ type: UPDATE_USER_ROLE_SUCCESS, payload: data });
//   } catch (error) {
//     // console.log(error.response.data.message);
//     dispatch({
//       type: UPDATE_USER_ROLE_FAIL,
//       error: error.response.data.message,
//     });
//   }
// };

export const adminUpdateUserAction = (userId, UserRole) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_ROLE_REQUEST });

    const token = localStorage.getItem("authToken"); // ✅ Ensure token is retrieved

    const { data } = await axios.put(` /api/user/admin/user/${userId}`, { UserRole }, {
      headers: { Authorization: `Bearer ${token}` } // ✅ Sends authentication token
    });

    dispatch({ type: UPDATE_USER_ROLE_SUCCESS, payload: data });
  } catch (error) {
    console.error("❌ Error Updating User Role:", error.response?.data?.message || "Unauthorized!");
    dispatch({ type: UPDATE_USER_ROLE_FAIL, error: error.response?.data?.message || "Unauthorized!" });
  }
};

export const clearError = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERROR });
};
