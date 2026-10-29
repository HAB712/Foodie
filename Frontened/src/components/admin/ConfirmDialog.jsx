import { AlertTriangle } from "lucide-react";

/**
 * In-app confirmation dialog used before destructive actions.
 * Replaces window.confirm so the flow stays inside the SPA
 * (and can be styled / tested like the rest of the admin UI).
 */
function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  busy = false,
  error = "",
}) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div
        className="admin-modal admin-modal-sm"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <div className="admin-modal-body">
          <div className="admin-confirm">
            <span className="admin-confirm-icon">
              <AlertTriangle size={22} />
            </span>
            <h3 className="admin-confirm-title">{title}</h3>
            <p className="admin-confirm-text">{message}</p>
            {error && <p className="admin-confirm-error">{error}</p>}
          </div>
        </div>

        <div className="admin-modal-foot">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
