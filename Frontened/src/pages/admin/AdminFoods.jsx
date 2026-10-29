import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import ImageField from "../../components/admin/ImageField";
import {
  getAllFoods,
  getAllCategories,
  createFood,
  updateFood,
  deleteFood,
} from "../../services/foodService";
import { getImageUrl } from "../../utils/apiHelpers";

const EMPTY_FORM = {
  name: "",
  price: "",
  description: "",
  category: "",
};

function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [foodData, catData] = await Promise.all([
        getAllFoods(),
        getAllCategories(),
      ]);
      setFoods(foodData);
      setCategories(catData);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (food) => {
    setEditing(food);
    setForm({
      name: food.name,
      price: String(food.price ?? ""),
      description: food.description,
      category: food.category?._id || food.category || "",
    });
    setFile(null);
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = "Food name is required";

    if (String(form.price).trim() === "") {
      next.price = "Price is required";
    } else if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
      next.price = "Price must be a number greater than zero";
    }

    if (!form.description.trim()) next.description = "Description is required";
    if (!form.category) next.category = "Please select a category";
    if (!editing && !file) next.image = "Please select an image";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("price", String(form.price));
    formData.append("description", form.description.trim());
    formData.append("category", form.category);
    if (file) formData.append("image", file);

    try {
      setSaving(true);
      if (editing) {
        await updateFood(editing._id, formData);
        toast.success("Food item updated successfully");
      } else {
        await createFood(formData);
        toast.success("Food item added successfully");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (food) => {
    setDeleteError("");
    setPendingDelete(food);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      setDeleting(true);
      await deleteFood(pendingDelete._id);
      toast.success("Food item deleted successfully");
      setPendingDelete(null);
      setDeleteError("");
      fetchData();
    } catch (err) {
      setDeleteError(err.message);
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const categoryName = (food) =>
    food.category?.name || "Uncategorised";

  return (
    <AdminLayout
      title="Food Item Management"
      subtitle="Add, edit and delete food items with price, category and image"
      activeTab="Food Items"
      actions={
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>
          <Plus size={18} /> Add Food Item
        </button>
      }
    >
      {loading ? (
        <div className="admin-loading">
          <LoaderCircle size={30} className="spin" />
          <span>Loading food items...</span>
        </div>
      ) : foods.length === 0 ? (
        <div className="admin-empty">
          <h3>No food items yet</h3>
          <p>Add your first food item to start building the menu.</p>
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>
            <Plus size={18} /> Add Food Item
          </button>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id}>
                  <td>
                    <div className="admin-thumb">
                      <img
                        src={getImageUrl(food.image)}
                        alt={food.name}
                      />
                    </div>
                  </td>
                  <td>
                    <strong>{food.name}</strong>
                    <span className="admin-cell-sub">
                      {food.description}
                    </span>
                  </td>
                  <td>
                    <span className="admin-price">Rs {food.price}</span>
                  </td>
                  <td>
                    <span className="admin-tag">{categoryName(food)}</span>
                  </td>
                  <td className="right">
                    <div className="admin-row-actions">
                      <button
                        className="admin-btn admin-btn-secondary"
                        onClick={() => openEdit(food)}
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(food)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit Food Item" : "Add Food Item"}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : editing ? "Update" : "Add Food Item"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-field">
            <label className="admin-label">
              Food Name <span className="req">*</span>
            </label>
            <input
              className={`admin-input ${errors.name ? "invalid" : ""}`}
              type="text"
              placeholder="e.g. Chicken Biryani"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {errors.name && <span className="admin-error">{errors.name}</span>}
          </div>

          <div className="admin-two-col">
            <div className="admin-field">
              <label className="admin-label">
                Price (Rs) <span className="req">*</span>
              </label>
              <input
                className={`admin-input ${errors.price ? "invalid" : ""}`}
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 350"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
              />
              {errors.price && (
                <span className="admin-error">{errors.price}</span>
              )}
            </div>

            <div className="admin-field">
              <label className="admin-label">
                Category <span className="req">*</span>
              </label>
              <select
                className={`admin-input ${errors.category ? "invalid" : ""}`}
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="admin-error">{errors.category}</span>
              )}
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">
              Description <span className="req">*</span>
            </label>
            <textarea
              className={`admin-input ${errors.description ? "invalid" : ""}`}
              rows="3"
              placeholder="Describe this food item"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            {errors.description && (
              <span className="admin-error">{errors.description}</span>
            )}
          </div>

          <ImageField
            file={file}
            setFile={setFile}
            existingImage={editing?.image}
          />
          {errors.image && <span className="admin-error">{errors.image}</span>}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete food item?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" will be permanently removed from the menu.`
            : ""
        }
        confirmLabel="Delete item"
        onConfirm={confirmDelete}
        onCancel={() => {
          setPendingDelete(null);
          setDeleteError("");
        }}
        error={deleteError}
        busy={deleting}
      />
    </AdminLayout>
  );
}

export default AdminFoods;
