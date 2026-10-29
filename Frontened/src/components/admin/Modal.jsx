import { X } from "lucide-react";

/**
 * Generic modal shell used by the admin forms.
 */
function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="admin-modal-head">
          <h3>{title}</h3>
          <button
            type="button"
            className="admin-icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-modal-body">{children}</div>

        {footer && <div className="admin-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
