import categoryModel from "../models/category.model.js";

const addCateGory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if ((!name, !description)) {
      return res
        .status(400)
        .json({ message: "All name and description required", success: false });
    }
    const newCategory = new categoryModel({ name, description });
    await newCategory.save();
    return res
      .status(201)
      .json({ message: "Category added successfully", success: true });
  } catch (err) {
    next(err);
  }
};
const getCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.find();
    if (category.length < 1) {
      return res.status(404).json({ message: "No category item in db" });
    }
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "No category item in db" });
    }
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { name, description } = req.bodyif();
    if (!name || !description) {
      return res.status(403).json({ message: "Name and description reuired" });
    }
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).jspn({ message: "Category not found" });
    }
    const update = await categoryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          description,
        },
      },
      { new: true }
    );
    return res.status(200).json(update);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "No such category" });
    }
    await category.deleteOne();
    return res.status(200).json({ message: "Category deleted sucessfully" });
  } catch (err) {
    next(err);
  }
};
export {
  addCateGory,
  deleteCategory,
  getCategory,
  getCategoryById,
  updateCategory,
};
