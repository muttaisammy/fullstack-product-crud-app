
import axios from "axios";

export const getProducts = async () => {
  try {
    const res = await axios.get("http://localhost:3000/products/");
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const addProduct = async (product) => {
  try {
    const res = await axios.post("http://localhost:3000/products/", product);
    return res.data;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

export const updateProduct = async (product, productId) => {
  try {
    const res = await axios.put(
      "http://localhost:3000/products/" + productId,
      product
    );
    return res.data;
  } catch (err) {
    return {
      error: err,
    };
  }
};
export const deleteProduct = async (productId, productThumbnail) => {
  try {
    const res = await axios.delete(
      "http://localhost:3000/products/" + productId
    );
    return res.data;
  } catch (err) {
    return { error: err };
  }
};
export const getProductById = async (id) => {
  try {
    const res = await axios.get("http://localhost:3000/products/" + id);
    return res.data
  } catch (err) {
    return {error: err.message}
  }
};


export const uploadProductThumbnail = async (formData) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/thumbnailUpload/",
      formData
    );
    return res.data
      
  } catch (err) {
    console.log(err);
    return {error: err.message};
  }
};

