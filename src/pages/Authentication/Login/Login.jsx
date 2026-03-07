import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import "./Login.css";
import Logo from "../../../components/shared/Logo/Logo";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // ── TODO: replace with useAuth().signIn(data.email, data.password)
  const onSubmit = (data) => {
    console.log("✅ Login data →", data);
    // navigate(from, { replace: true });
  };

  return (
    <div className="login">
      {/* logo */}
      <div className="login__logo">
        <Logo size="md" />
      </div>
      {/* headline */}
      <h1 className="login__title">
        WELCOME
        <br />
        BACK
      </h1>
      <p className="login__subtitle">
        Sign in to continue
        <br />
        your health journey.
      </p>

      {/* form */}
      <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
        {/* email */}
        <div className="login__field">
          <label className="login__label">Email Address</label>
          <div className="login__input-wrap">
            <input
              className={`login__input ${errors.email ? "login__input--error" : ""}`}
              type="email"
              placeholder="your@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              })}
            />
            <div className="login__input-glow" />
          </div>
          {errors.email && (
            <span className="login__error-msg">{errors.email.message}</span>
          )}
        </div>

        {/* password */}
        <div className="login__field">
          <label className="login__label">Password</label>
          <div className="login__input-wrap">
            <input
              className={`login__input login__input--password ${errors.password ? "login__input--error" : ""}`}
              type={showPass ? "text" : "password"}
              placeholder="••••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            <div className="login__input-glow" />
            <button
              type="button"
              className={`login__show-btn ${showPass ? "login__show-btn--active" : ""}`}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "HIDE" : "SHOW"}
            </button>
          </div>
          {errors.password && (
            <span className="login__error-msg">{errors.password.message}</span>
          )}
        </div>

        {/* forgot */}
        <div className="login__forgot-row">
          <Link to="/forgot-password" className="login__forgot-link">
            Forgot password?
          </Link>
        </div>

        {/* submit */}
        <button type="submit" className="login__submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In →"}
        </button>
      </form>

      {/* divider */}
      <div className="login__divider">
        <span className="login__divider-line" />
        <span className="login__divider-text">or</span>
        <span className="login__divider-line" />
      </div>

      {/* google */}
      <button type="button" className="login__google">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      {/* switch */}
      <p className="login__switch">
        Don't have an account?{" "}
        <Link to="/register" className="login__switch-link">
          Join Medivo
        </Link>
      </p>
    </div>
  );
};

export default Login;
