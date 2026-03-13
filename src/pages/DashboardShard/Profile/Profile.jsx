import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./Profile.css";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();
  const [updating, setUpdating] = useState(false);

  // ── local display state so UI updates instantly after save
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [displayPhoto, setDisplayPhoto] = useState(user?.photoURL || "");

  const isOrganizer = role === "organizer";
  const accent = isOrganizer ? "teal" : "purple";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: user?.displayName || "",
      photoURL:    user?.photoURL    || "",
      phone:       "",
      location:    "",
    },
  });

  const watchedPhoto = watch("photoURL");

  const onSubmit = async (data) => {
    setUpdating(true);
    try {
      // 1 — update Firebase Auth
      await updateUserProfile(data.displayName, data.photoURL);

      // 2 — force Firebase to reload user so auth.currentUser reflects new values
      await user.reload();

      // 3 — update MongoDB
      await axiosSecure.patch(`/users/profile/${user.email}`, {
        name:     data.displayName,
        photoURL: data.photoURL,
        phone:    data.phone,
        location: data.location,
      });

      // 4 — update local state so identity card re-renders immediately
      setDisplayName(data.displayName);
      setDisplayPhoto(data.photoURL);

      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const avatarLetter = (displayName?.[0] || user?.email?.[0] || "U").toUpperCase();
  const isGoogle = user?.providerData?.[0]?.providerId === "google.com";

  return (
    <div className={`pro pro--${accent}`}>

      {/* page header */}
      <div className="pro__header">
        <div className="pro__tag">
          <span className="pro__tag-line" />
          <span className="pro__tag-text">
            {isOrganizer ? "Organizer Panel" : "Participant Panel"}
          </span>
        </div>
        <h1 className="pro__title">My Profile</h1>
        <p className="pro__sub">Manage your personal information and account settings.</p>
      </div>

      <div className="pro__layout">

        {/* ══ LEFT: identity card */}
        <div className="pro__card pro__card--identity">
          <div className="pro__card-glow" />

          <div className="pro__avatar-wrap">
            <div className={`pro__avatar-ring pro__avatar-ring--${accent}`} />
            <div className="pro__avatar">
              {(watchedPhoto || displayPhoto) ? (
                <img
                  src={watchedPhoto || displayPhoto}
                  alt="avatar"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <span>{avatarLetter}</span>
              )}
            </div>
          </div>

          <div className="pro__iden-name">{displayName || "Your Name"}</div>
          <div className={`pro__iden-role pro__iden-role--${accent}`}>
            {isOrganizer ? "Camp Organizer" : "Participant"}
          </div>

          <div className="pro__divider" />

          <div className="pro__info">
            <div className="pro__info-row">
              <div className="pro__info-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <div className="pro__info-label">Email</div>
                <div className="pro__info-val">{user?.email}</div>
              </div>
            </div>

            <div className="pro__info-row">
              <div className="pro__info-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <div className="pro__info-label">Account Status</div>
                <div className="pro__info-val pro__info-val--active">● Active</div>
              </div>
            </div>

            <div className="pro__info-row">
              <div className="pro__info-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <div>
                <div className="pro__info-label">Sign-in Provider</div>
                <div className="pro__info-val">{isGoogle ? "Google" : "Email & Password"}</div>
              </div>
            </div>
          </div>

          <div className="pro__provider-pill">
            {isGoogle ? (
              <svg width="13" height="13" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            )}
            {isGoogle ? "Signed in with Google" : "Signed in with Email"}
          </div>
        </div>

        {/* ══ RIGHT: edit form */}
        <div className="pro__card pro__card--form">
          <div className="pro__card-glow" />

          <div className="pro__form-head">
            <div className="pro__form-title">Edit Information</div>
            <div className="pro__form-sub">Changes reflect across your account instantly</div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="pro__form">

            <div className="pro__field">
              <label className="pro__label">Display Name</label>
              <input
                className={`pro__input ${errors.displayName ? "pro__input--err" : ""}`}
                placeholder="Your full name"
                {...register("displayName", { required: "Name is required" })}
              />
              {errors.displayName && (
                <span className="pro__field-err">{errors.displayName.message}</span>
              )}
            </div>

            <div className="pro__field">
              <label className="pro__label">Email Address</label>
              <input
                className="pro__input pro__input--ro"
                value={user?.email || ""}
                readOnly
              />
              <span className="pro__field-hint">Email cannot be changed</span>
            </div>

            <div className="pro__field pro__field--full">
              <label className="pro__label">Photo URL</label>
              <div className="pro__photo-row">
                <input
                  className="pro__input"
                  placeholder="https://i.ibb.co/your-photo.jpg"
                  {...register("photoURL")}
                  onChange={(e) => setDisplayPhoto(e.target.value)}
                />
                <div className="pro__photo-thumb">
                  {(watchedPhoto || displayPhoto) ? (
                    <img
                      src={watchedPhoto || displayPhoto}
                      alt="preview"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <span>{avatarLetter}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pro__field">
              <label className="pro__label">Phone Number</label>
              <input
                className="pro__input"
                placeholder="+880 1712 345678"
                {...register("phone")}
              />
            </div>

            <div className="pro__field">
              <label className="pro__label">Location</label>
              <input
                className="pro__input"
                placeholder="Dhaka, Bangladesh"
                {...register("location")}
              />
            </div>

            <div className="pro__form-foot">
              <button
                type="submit"
                disabled={updating}
                className={`pro__save pro__save--${accent}`}
              >
                {updating ? (
                  <><span className="pro__spinner" />Saving...</>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;