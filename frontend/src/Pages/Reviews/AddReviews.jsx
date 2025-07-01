import React from "react";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import { MdClose } from "react-icons/md";
import "./Reviews.css";
import { useState, useRef } from "react";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
// import { Rating } from "@material-ui/lab";
import { Rating } from '@mui/material';
import { useSelector } from "react-redux";
const AddReviews = () => {
  const RegisterSuccess = useRef();
  const { loading: userLoading, user } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState(0);
  const [validationError, setValidationError] = useState();
  const [addError, setAddError] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [AddSuccess, setAddSuccess] = useState(true);
  const [message, setMessage] = useState(null);

  document.title = `Add Review`;


  //Add Reviews
  // const addReviewsHandel = async () => {
  //   try {
  //     if (comment.trim().length !== 0 && ratings !== 0) {
  //       setAddLoading(true);
  //       const { data } = await axios.post("http://localhost:8080/api/user/add/review", {
  //         comment,
  //         ratings,
  //       });

  //       setAddLoading(false);
  //       setAddSuccess(data.success);
  //       setMessage(data.message);
  //     } else {
  //       setValidationError("All Field Are Required..!!");
  //     }
  //   } catch (error) {
  //     setAddLoading(false);
  //     setAddSuccess(false);
  //     setAddError(error.response.data.message);
  //   }
  // };

const addReviewsHandel = async () => {
  try {
    if (comment.trim().length !== 0 && ratings !== 0) {
      setAddLoading(true);

      const token = localStorage.getItem("authToken"); // ✅ Ensure the token is stored

      console.log("📢 Sending Review Request:", { comment, ratings });

      const { data } = await axios.post("http://localhost:8080/api/user/add/review", {
        comment,
        ratings,
      }, {
        withCredentials: true, // ✅ Ensures cookies are sent
        headers: { Authorization: `Bearer ${token}` } // ✅ Sends authentication token
      });

      console.log("✅ Review added successfully:", data);

      setAddLoading(false);
      setAddSuccess(data.success);
      setMessage(data.message);
    } else {
      setValidationError("All Fields Are Required..!!");
    }
  } catch (error) {
    console.error("❌ Error adding review:", error.response?.data?.message || "Unknown error");
    setAddLoading(false);
    setAddSuccess(false);
    setAddError(error.response?.data?.message || "Unknown error");
  }
};

  if (validationError) {
    setTimeout(() => {
      setValidationError(null);
    }, 5000);
  }
  const closeRegisterPop = () => {
    RegisterSuccess.current.style.display = "none";
  };
  return (
    <>
      <Header />
      {addLoading || userLoading ? (
        <Loader LoadingName={"Processing Reviews"} />
      ) : (
        <div className="reviews-container-section">
          <h1 className="Heading regHeading">
            Add <span>Reviews</span>
          </h1>
          {message ? (
            <div className="RegisterSuccess" ref={RegisterSuccess}>
              <div className="pop-card">
                <button id="close-btn" onClick={closeRegisterPop}>
                  <MdClose />
                </button>
                <div className="successLoader">
                  <h3 className="loader-text"></h3>
                </div>
                <h1>{message}</h1>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="add-reviews-box">
            <input
              type="text"
              value={user.firstName + " " + user.lastName}
              readOnly
            />
            <div className="stars add-reviews-star">
       <Rating
  onChange={(event, newValue) => {
    setRatings(newValue || 0); // Fallback to 0 if null
  }}
  value={ratings}
  size="large"
/>
              
            </div>
            <textarea
              value={comment}
              placeholder="Comment..."
              required
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            {validationError ? (
              <h4 className="validError">All Field Are Required..!!</h4>
            ) : (
              ""
            )}

            <button onClick={addReviewsHandel}>Submit</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AddReviews;
