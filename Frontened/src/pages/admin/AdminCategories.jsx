import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import ImageField from "../../components/admin/ImageField";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/foodService";
import { getImageUrl } from "../../utils/apiHelpers";

const EMPTY_FORM = { name: "", description: "" };

function AdminCategories() {
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

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({ name: category.name, description: category.description });
    setFile(null);
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Category name is required";
    if (!form.description.trim())
      next.description = "Description is required";
    if (!editing && !file) next.image = "Please select an image";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    if (file) formData.append("image", file);

    try {
      setSaving(true);
      if (editing) {
        await updateCategory(editing._id, formData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category added successfully");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    setDeleteError("");
    setPendingDelete(category);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      setDeleting(true);
      await deleteCategory(pendingDelete._id);
      toast.success("Category deleted successfully");
      setPendingDelete(null);
      setDeleteError("");
      fetchCategories();
    } catch (err) {
      setDeleteError(err.message);
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Category Management"
      subtitle="Add, edit and delete menu categories with images"
      activeTab="Categories"
      actions={
        <button className="admin-btn admin-btn-primary" onClick={openAdd}>
          <Plus size={18} /> Add Category
        </button>
      }
    >
      {loading ? (
        <div className="admin-loading">
          <LoaderCircle size={30} className="spin" />
          <span>Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="admin-empty">
          <h3>No categories yet</h3>
          <p>Add your first category to start building the menu.</p>
          <button className="admin-btn admin-btn-primary" onClick={openAdd}>
            <Plus size={18} /> Add Category
          </button>
        </div>
      ) : (
        <div className="admin-card-grid">
          {categories.map((category) => (
            <article className="admin-card" key={category._id}>
              <div className="admin-card-image">
                <img
                  src={getImageUrl(category.image)}
                  alt={category.name}
                />
              </div>

              <div className="admin-card-body">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>

              <div className="admin-card-actions">
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => openEdit(category)}
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => handleDelete(category)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit Category" : "Add Category"}
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
              {saving ? "Saving..." : editing ? "Update" : "Add Category"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-field">
            <label className="admin-label">
              Category Name <span className="req">*</span>
            </label>
            <input
              className={`admin-input ${errors.name ? "invalid" : ""}`}
              type="text"
              placeholder="e.g. Breakfast"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {errors.name && <span className="admin-error">{errors.name}</span>}
          </div>

          <div className="admin-field">
            <label className="admin-label">
              Description <span className="req">*</span>
            </label>
            <textarea
              className={`admin-input ${errors.description ? "invalid" : ""}`}
              rows="3"
              placeholder="Short description of this category"
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
        title="Delete category?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" will be permanently removed. Categories that still have food items cannot be deleted.`
            : ""
        }
        confirmLabel="Delete category"
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

export default AdminCategories;
