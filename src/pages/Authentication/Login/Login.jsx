import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import "./Login.css";
import Logo from "../../../components/shared/Logo/Logo";
import useAuth from "../../../hooks/useAuth";
import SocialLogin from "../SocialLogIn/SocialLogIn";

const Login = () => {
  const { signInUser } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signInUser(data.email, data.password);

      Swal.fire({
        title: "Welcome Back",
        text: "Signed in successfully.",
        icon: "success",
        background: "#10152A",
        color: "#F0F4FF",
        confirmButtonColor: "#116878",
        confirmButtonText: "Continue",
      }).then(() => {
        navigate(from, { replace: true });
      });

    } catch (error) {
      console.error("error →", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="login">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#10152A",
            color: "#F0F4FF",
            border: "1px solid rgba(34,170,204,0.2)",
            fontFamily: "Geologica, sans-serif",
            fontSize: "13px",
          },
        }}
      />

      {/* logo */}
      <div className="login__logo">
        <Logo size="md" />
      </div>

      <h1 className="login__title">WELCOME<br />BACK</h1>
      <p className="login__subtitle">
        Sign in to continue<br />your health journey.
      </p>

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
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>

      </form>

      {/* divider */}
      <div className="login__divider">
        <span className="login__divider-line" />
        <span className="login__divider-text">or</span>
        <span className="login__divider-line" />
      </div>

      {/* google */}
      <SocialLogin></SocialLogin>

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