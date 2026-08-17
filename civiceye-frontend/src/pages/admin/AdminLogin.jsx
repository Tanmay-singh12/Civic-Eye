import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEMO_ADMIN = {
  email: "admin@civiceye.in",
  password: "Admin@123",
};

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    // Temporary authentication for frontend development.
    // This will be replaced by the backend JWT authentication.
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (
      email === DEMO_ADMIN.email &&
      password === DEMO_ADMIN.password
    ) {
      localStorage.setItem("civiceye_admin_auth", "true");

      localStorage.setItem(
        "civiceye_admin_user",
        JSON.stringify({
          name: "CivicEye Admin",
          email: DEMO_ADMIN.email,
          role: "Administrator",
        })
      );

      navigate("/admin", { replace: true });
    } else {
      setError("Invalid admin credentials.");
    }

    setIsLoading(false);
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-background" />

      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-brand">
          <div className="admin-brand-mark" aria-hidden="true">
            <ShieldCheck size={25} strokeWidth={2.2} />
          </div>

          <div>
            <p className="admin-brand-name">CivicEye</p>
            <p className="admin-brand-label">Civic Intelligence Platform</p>
          </div>
        </div>

        <div className="admin-login-heading">
          <p className="admin-eyebrow">ADMIN PORTAL</p>

          <h1 id="admin-login-title">Command Center</h1>

          <p>
            Sign in to monitor, prioritize and manage civic complaints
            across Nagpur.
          </p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-form-field">
            <label htmlFor="admin-email">Email address</label>

            <div className="admin-input-wrapper">
              <Mail size={18} aria-hidden="true" />

              <input
                id="admin-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@civiceye.in"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="admin-form-field">
            <label htmlFor="admin-password">Password</label>

            <div className="admin-input-wrapper">
              <LockKeyhole size={18} aria-hidden="true" />

              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isLoading}
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="admin-spinner" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              "Sign in to Command Center"
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <LockKeyhole size={14} aria-hidden="true" />
          <span>Authorized municipal access only</span>
        </div>
      </section>
    </main>
  );
}

export default AdminLogin;