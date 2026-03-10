import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import "./Registration.css";
import Logo from "../../../components/shared/Logo/Logo";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import SocialLogin from "../SocialLogIn/SocialLogIn";

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
      <SocialLogin></SocialLogin>

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