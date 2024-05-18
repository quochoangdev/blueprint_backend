import productService from "../services/productService";
import { UploadCloudList } from '../utility/UploadCloudList'


// Read Product
const readFunc = async (req, res) => {
  try {
    if (req.query.page && req.query.limit && (req.query.categories || req.query.brand || req.query.version || req.query.sort)) {
      let { page, limit, categories, brand, version, sort } = req.query;
      let data = await productService.readProductWithCategoriesBrand(+page, +limit, categories, brand, version, sort);
      return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT, });

    } else if (req.query.page && req.query.limit && req.query.search) {
      let { page, limit, search } = req.query;
      let data = await productService.readProductWithSearch(+page, +limit, search);
      return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT, });

    } else if (req.query.page && req.query.limit) {
      let { page, limit } = req.query;
      let data = await productService.readProductWithPagination(+page, +limit);
      return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT, });

    } else if (req.query.id) {
      let { id } = req.query;
      let data = await productService.readProductId(+id);
      return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT, });

    } else {
      let data = await productService.readProduct();
      return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT, });
    }

  } catch (error) {
    return res.status(500).json({ EM: "Error from server", EC: -1, DT: [], });
  }


  
};

// Read Product Detail
const readFuncDetail = async (req, res) => {
  try {
    if (req.params.slug) {
      let { slug, color } = req.params;
      let data = await productService.readProductDetail(slug, color);
      return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT, });

    } else {
      return res.status(200).json({ EM: "Read product success", EC: 0, DT: [], });
    }

  } catch (error) {
    return res.status(500).json({ EM: "Error from server", EC: -1, DT: [], });
  }
};

// Read Product Sort
const readFuncSort = async (req, res) => {
  try {
    if (req.query.page && req.query.limit && req.query.sort) {
      let { page, limit, sort } = req.query;
      let data = await productService.readProductSort(+page, +limit, sort);
      return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT, });

    } else {
      let data = await productService.readProduct();
      return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT, });
    }

  } catch (error) {
    return res.status(500).json({ EM: "Error from server", EC: -1, DT: [], });
  }
};

// Create Product
const createFunc = async (req, res) => {
  try {
    const { title, price, version, quantity, image, capacity, color, percentDiscount, categoriesId, brandId } = req.body.data;
    const dataImage = {}
    if (!title || !price || !version || !quantity || !image || !capacity || !color || !percentDiscount || !categoriesId || !brandId) {
      return res.status(200).json({ EM: "Missing Required Parameters", EC: 1, DT: "", });
    }

    const uploadPromises = Object.keys(image).map(async key => {
      const imageCloud = await UploadCloudList(image[key], "ecommerce")
      dataImage[key] = imageCloud
    })

    await Promise.all(uploadPromises)

    const newData = { ...req.body.data, image: dataImage, };
    let data = await productService.createProduct(newData);
    return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT, });

  } catch (error) {
    return res.status(500).json({ EM: "Error from server", EC: -1, DT: [], });
  }
};

// Update Product
const updateFunc = async (req, res) => {
  try {
    // const { image } = req.body.data
    let newData = req.body.data;

    // if (image) {
    // const imageCloud = await UploadCloudList(image, "blueprint_image_avatar");
    // newData = await { ...req.body.data, image: imageCloud, };
    // }
    const data = await productService.updateProduct(newData);
    return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT, });

  } catch (error) {
    return res.status(500).json({ EM: "Error from server", EC: -1, DT: [], });
  }
};

// Delete Product
const deleteFunc = async (req, res) => {
  try {
    let { id } = req.body;
    let data = await productService.deleteProduct(id);
    return res.status(200).json({ EM: data.EM, EC: data.EC, DT: data.DT });

  } catch (error) {
    return res.status(500).json({ EM: "Error from server", EC: -1, DT: "", });
  }
};

module.exports = { readFunc, readFuncSort, readFuncDetail, createFunc, updateFunc, deleteFunc };
