import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

const TABS = [
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/foods", label: "Food Items" },
];

function AdminLayout({ title, subtitle, activeTab, actions, children }) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="container admin-topbar-inner">
          <Link to="/" className="admin-brand">
            <span className="admin-brand-icon">
              <UtensilsCrossed size={20} />
            </span>
            <span>
              Foodie<span className="admin-brand-dot">.</span> Admin
            </span>
          </Link>

          <nav className="admin-tabs">
            {TABS.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className={`admin-tab ${activeTab === tab.label ? "active" : ""}`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>

          <Link to="/" className="admin-btn admin-btn-secondary">
            View Site
          </Link>
        </div>
      </header>

      <main className="container admin-main">
        <div className="admin-page-head">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions && <div className="admin-page-actions">{actions}</div>}
        </div>

        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
