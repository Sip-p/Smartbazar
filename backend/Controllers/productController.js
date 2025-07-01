const productModel = require("../models/productModel");
const cloudinary = require('cloudinary').v2;
const sendError = require("../utils/sendError");
const { filterData } = require("../utils/filterQuery");
const crypto = require("crypto");

 

// Backend: Node.js (for example)
 
const generateSignature = (params) => {
  const queryString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  console.log("🔍 String to sign:", queryString);
  console.log("🔍 Cloud API Secret:", process.env.CLOUD_API_SECRET);

  const signature = crypto
    .createHash("sha1")
    .update(queryString + process.env.CLOUD_API_SECRET)
    .digest("hex");

  console.log("🔍 Generated Signature:", signature); // ✅ Check if it matches Cloudinary's expected signature

  return signature;
};

 

// Send this signature in your response

//Add Product
// const addProduct = async (req, res) => {
//   try {
//     const { name, rate, stocks, category, kilogramOption, image } = req.body;
//     if (kilogramOption.length == 1) {
//       return sendError(res, 400, ["Weight: Required..!!"]);
//     } else {
//       const kgOption = [];
//       kilogramOption.map((kg) => {
//         kgOption.push(kg);
//       });

// const result = await cloudinary.v2.uploader.upload(image, {
//          folder: "products",
//       });

//       const newProduct = await productModel.create({
//         name,
//         rate,
//         stocks,
//         category,
//         kilogramOption: kgOption,
//         public_id: result.public_id,
//         url: result.url,
//       });

//       res.status(201).json({
//         success: true,
//         message: "Product Add SuccessFully..!!",
//         newProduct,
//       });
//     }
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const errors = {};
//       Object.keys(error.errors).map((key) => {
//         errors[key] = error.errors[key].message;
//       });
//       sendError(res, 400, Object.values(errors));
//     } else {
//       console.log(error);
//       sendError(res, 400, ["Somethings Went Wrong..!!"]);
//     }
//   }
// };

// const addProduct = async (req, res) => {
//   try {
//     const { name, rate, stocks, category, kilogramOption, image } = req.body;

//     // ✅ Ensure kilogramOption is an array before using .map()
//     const validKilogramOption = Array.isArray(kilogramOption) ? kilogramOption : [];

//     if (validKilogramOption.length === 0) {
//       return sendError(res, 400, ["Weight: Required..!!"]);
//     }

//     const kgOption = validKilogramOption.map((kg) => kg);

//     const result = await cloudinary.v2.uploader.upload(image, {
//       folder: "products",
//     });

//     const newProduct = await productModel.create({
//       name,
//       rate,
//       stocks,
//       category,
//       kilogramOption: kgOption,
//       public_id: result.public_id,
//       url: result.url,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product Added Successfully..!!",
//       newProduct,
//     });
//   } catch (error) {
//     console.error("❌ Error Adding Product:", error.message);
//     sendError(res, 400, ["Something Went Wrong..!!"]);
//   }
// };

// const addProduct = async (req, res) => {
//   try {
//     console.log("🔍 New Product Data Received:", req.body);

//     const { name, rate, stocks, category, kilogramOption, image } = req.body;

//     if (!name || !rate || !category || !stocks || !image) {
//       return sendError(res, 400, ["All fields are required!"]);
//     }

//     // Upload image to Cloudinary without manually signing
//     const result = await cloudinary.uploader.upload(image, {
//       folder: "products",
//     });

//     const newProduct = await productModel.create({
//       name,
//       rate,
//       stocks,
//       category,
//       kilogramOption,
//       public_id: result.public_id,
//       url: result.secure_url,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product Added Successfully!",
//       newProduct,
//     });
//   } catch (error) {
//     console.error("❌ Error Adding Product:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };

const addProduct = async (req, res) => {
  try {
    console.log("🔍 New Product Data Received:", req.body);

    const { name, rate, stocks, category, kilogramOption, image } = req.body;

    if (!name || !rate || !category || !stocks || !image) {
      return sendError(res, 400, ["All fields are required!"]);
    }

    // ✅ Ensure `generateSignature` function is correctly defined at the top of this file
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = generateSignature({ folder: "products", timestamp });

    // ✅ Use chunked upload for large files
    const result = await cloudinary.uploader.upload_large(image, {
      folder: "products",
      chunk_size: 6000000, // Upload in 6MB chunks
      timestamp,
      signature,
      api_key: process.env.CLOUD_API_KEY,
    });

    console.log("✅ Cloudinary Upload Success:", result);

    const newProduct = await productModel.create({
      name,
      rate,
      stocks,
      category,
      kilogramOption,
      public_id: result.public_id,
      url: result.url,
    });

    console.log("✅ Product Successfully Added:", newProduct);
    res.status(201).json({ success: true, message: "Product Added Successfully!", newProduct });
  } catch (error) {
    console.error("❌ Error Adding Product:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

//Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (productId) {
      const isProductExit = await productModel.findById(productId);
      if (isProductExit) {
        const DeletedProduct = await productModel
          .findByIdAndDelete(productId)
          .populate("category");
        res.status(200).json({
          success: true,
          message: "Product Delete SuccessFully..!!",
          DeletedProduct,
        });
      } else {
        sendError(res, 400, "Product Not Found");
      }
    } else {
      sendError(res, 400, "Product Id Not Found");
    }
  } catch (error) {
    sendError(res, 400, error.message);
  }
};

//Update Products
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, rate, kilogramOption, category, stocks, image } = req.body;
    if (productId) {
      const isProductExit = await productModel.findById(productId);
      if (image !== "") {
        const result = await cloudinary.v2.uploader.upload(image, {
          folder: "products",
        });
        isProductExit.url = result.url;
        isProductExit.public_id = result.public_id;
        isProductExit.name = name;
        isProductExit.rate = rate;
        isProductExit.category = category;
        isProductExit.stocks = stocks;
        isProductExit.kilogramOption = kilogramOption;

        await isProductExit.save();
        res.status(200).json({
          success: true,
          message: "Product Updated..!!",
        });
      } else {
        isProductExit.name = name;
        isProductExit.rate = rate;
        isProductExit.category = category;
        isProductExit.stocks = stocks;
        isProductExit.kilogramOption = kilogramOption;
        await isProductExit.save();
        res.status(200).json({
          success: true,
          message: "Product Updated..!!",
        });
      }
    } else {
      sendError(res, 400, "Product Id Not Found");
    }
  } catch (error) {
    console.log(error);
    sendError(res, 400, error.message);
  }
};

//Retrieve All Products
const getAllProduct = async (req, res) => {
  try {
    const productsDocCount = await productModel.find().countDocuments();
    const queryStr = filterData(productModel.find(), req.query);
    const products = await queryStr.populate("category");
    res.status(200).json({
      success: true,
      message: "Product Retrieve SuccessFully..!!",
      products,
      productsDocCount,
    });
  } catch (error) {
    console.log(error);
    sendError(res, 400, error.message);
  }
};

//Retrieve First Five Products
///....changed
// const getRecentProducts = async (req, res) => {
//   try {
//     // const products = await productModel.find().sort({ date: -1 }).limit(10);
//     const products = await productModel.find().sort({ createdAt: -1 }).limit(10);
//     res.status(200).json({
//       success: true,
//       products,
//     });
//   } catch (error) {
//     sendError(res, 400, "Something Is Wrong..!!");
//   }
// };
// const getRecentProducts = async (req, res) => {
//   try {
//     const products = await productModel.find().sort({ createdAt: -1 }).limit(10);
//     res.status(200).json({ success: true, products });
//     console.log("Recent products fetched successfully"); // Debugging log
//   } catch (error) {
//     console.log("llll")
//     console.error("Error fetching recent products:", error); // Debugging log
//     sendError(res, 500, "Something Is Wrong..!!");
//   }
// };
const getRecentProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ createdAt: -1 }).limit(10);
    console.log("Recent Products from DB:", products); // Debugging log
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Backend Error:", error); // Log error details
    res.status(500).json({ success: false, message: "Server Error!" });
  }
};

//Retrieve Single Product
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    if (productId) {
      const product = await productModel
        .findById(productId)
        .populate("category");

      if (product) {
        res.status(200).json({
          success: true,
          message: "Product Retrieve SuccessFully..!!",
          product,
        });
      } else {
        sendError(res, 400, "Product Not Found..!!");
      }
    } else {
      sendError(res, 400, "Product Id Not Found");
    }
  } catch (error) {
    console.log(error.message);
    sendError(res, 400, "Somethings Is Wrong..!!");
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProduct,
  getRecentProducts,
  getSingleProduct,
};
