import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import "./Registration.css";
import Logo from "../../../components/shared/Logo/Logo";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const Registration = () => {
  const { createUser, updateUserProfile } = useAuth();
  const axiosPublic = useAxios();

  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageFile,   setImageFile]   = useState(null);
  const [preview,     setPreview]     = useState("");
  const [uploading,   setUploading]   = useState(false);
  const [imageUrl,    setImageUrl]    = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from     = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setImageUrl("");
  };

  const uploadImage = async () => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setImageUrl(data.data.url);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error("Upload failed. Try again.");
      console.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // 1 — create firebase user
      const userCredential = await createUser(data.email, data.password);
      const user = userCredential.user;

      // 2 — update firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: imageUrl || "",
      });

      // 3 — save to mongodb
      const userInfo = {
        uid:       user.uid,
        name:      data.name,
        phone:     data.phone,
        email:     user.email,
        photoURL:  imageUrl || "",
        createdAt: new Date().toISOString(),
      };
      await axiosPublic.post("/users", userInfo);

      // 4 — success
      Swal.fire({
        title: "Account Created",
        text: "Welcome to Medivo.",
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
    <div className="reg">
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
      <div className="reg__logo">
        <Logo size="sm" />
      </div>

      <h1 className="reg__title">CREATE<br />ACCOUNT</h1>
      <p className="reg__subtitle">Begin your health journey today.</p>

      <form className="reg__form" onSubmit={handleSubmit(onSubmit)}>

        {/* photo */}
        <div className="reg__field">
          <label className="reg__label">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="reg__file-input"
          />
          {preview && (
            <img src={preview} alt="preview" className="reg__photo-preview" />
          )}
          {imageFile && (
            <button
              type="button"
              onClick={uploadImage}
              disabled={uploading || !!imageUrl}
              className={`reg__upload-btn ${imageUrl ? "reg__upload-btn--done" : ""}`}
            >
              {uploading ? "Uploading..." : imageUrl ? "Uploaded" : "Upload Photo"}
            </button>
          )}
        </div>

        {/* name + phone */}
        <div className="reg__row">
          <div className="reg__field">
            <label className="reg__label">Full Name</label>
            <div className="reg__input-wrap">
              <input
                className={`reg__input ${errors.name ? "reg__input--error" : ""}`}
                type="text"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
              />
              <div className="reg__input-glow" />
            </div>
            {errors.name && (
              <span className="reg__error-msg">{errors.name.message}</span>
            )}
          </div>

          <div className="reg__field">
            <label className="reg__label">Phone</label>
            <div className="reg__input-wrap">
              <input
                className={`reg__input ${errors.phone ? "reg__input--error" : ""}`}
                type="tel"
                placeholder="+880..."
                {...register("phone", { required: "Phone is required" })}
              />
              <div className="reg__input-glow" />
            </div>
            {errors.phone && (
              <span className="reg__error-msg">{errors.phone.message}</span>
            )}
          </div>
        </div>

        {/* email */}
        <div className="reg__field">
          <label className="reg__label">Email Address</label>
          <div className="reg__input-wrap">
            <input
              className={`reg__input ${errors.email ? "reg__input--error" : ""}`}
              type="email"
              placeholder="your@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email",
                },
              })}
            />
            <div className="reg__input-glow" />
          </div>
          {errors.email && (
            <span className="reg__error-msg">{errors.email.message}</span>
          )}
        </div>

        {/* password + confirm */}
        <div className="reg__row">
          <div className="reg__field">
            <label className="reg__label">Password</label>
            <div className="reg__input-wrap">
              <input
                className={`reg__input reg__input--has-btn ${errors.password ? "reg__input--error" : ""}`}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 chars" },
                })}
              />
              <div className="reg__input-glow" />
              <button
                type="button"
                className={`reg__show-btn ${showPass ? "reg__show-btn--active" : ""}`}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "HIDE" : "SHOW"}
              </button>
            </div>
            {errors.password && (
              <span className="reg__error-msg">{errors.password.message}</span>
            )}
          </div>

          <div className="reg__field">
            <label className="reg__label">Confirm</label>
            <div className="reg__input-wrap">
              <input
                className={`reg__input reg__input--has-btn ${errors.confirmPassword ? "reg__input--error" : ""}`}
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Please confirm",
                  validate: (v) => v === password || "Passwords don't match",
                })}
              />
              <div className="reg__input-glow" />
              <button
                type="button"
                className={`reg__show-btn ${showConfirm ? "reg__show-btn--active" : ""}`}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "HIDE" : "SHOW"}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="reg__error-msg">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <button type="submit" className="reg__submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

      </form>

      {/* divider */}
      <div className="reg__divider">
        <span className="reg__divider-line" />
        <span className="reg__divider-text">or</span>
        <span className="reg__divider-line" />
      </div>

      {/* google */}
      <button type="button" className="reg__google">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign up with Google
      </button>

      <p className="reg__switch">
        Already have an account?{" "}
        <Link to="/login" className="reg__switch-link">
          Sign In
        </Link>
      </p>

    </div>
  );
};

export default Registration;