import { useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { getImageUrl } from "../../utils/apiHelpers";

/**
 * Image picker with preview.
 * - required: image is mandatory while adding a new item
 * - existingImage: current stored path (used in edit mode)
 */
function ImageField({ file, setFile, existingImage, required = true }) {
  const inputRef = useRef(null);
  const inputId = useId();
  const [preview, setPreview] = useState(null);

  const previewSrc = preview || (existingImage ? getImageUrl(existingImage) : "");

  const handleChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="admin-image-field">
      <label className="admin-label" htmlFor={inputId}>
        Image {required && <span className="req">*</span>}
      </label>

      <div className="admin-image-row">
        <div className="admin-image-preview">
          {previewSrc ? (
            <img src={previewSrc} alt="preview" />
          ) : (
            <div className="admin-image-placeholder">
              <ImagePlus size={22} />
              <span>No image</span>
            </div>
          )}
        </div>

        <div className="admin-image-actions">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="admin-file-input"
            id={inputId}
          />

          {previewSrc && (
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={clearImage}
            >
              <X size={15} /> Remove
            </button>
          )}
        </div>
      </div>

      <p className="admin-hint">
        JPG / PNG / WEBP, max 5MB.{" "}
        {required && "Image is required."}
      </p>
    </div>
  );
}

export default ImageField;
