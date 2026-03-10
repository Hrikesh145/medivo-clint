import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import "./UpdateCamp.css";

const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const toInputDateTime = (dt) => {
  if (!dt) return "";
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const UpdateCamp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [imageFile,  setImageFile]  = useState(null);
  const [preview,    setPreview]    = useState("");
  const [uploading,  setUploading]  = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // fetch existing camp
  const { data: camp, isLoading } = useQuery({
    queryKey: ["camp", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/camps/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // pre-fill form when camp loads
  useEffect(() => {
    if (!camp) return;
    reset({
      name:                   camp.name,
      fees:                   camp.fees,
      startDateTime:          toInputDateTime(camp.startDateTime),
      endDateTime:            toInputDateTime(camp.endDateTime),
      location:               camp.location,
      maxParticipants:        camp.maxParticipants,
      healthcareProfessional: camp.healthcareProfessional,
      description:            camp.description,
    });
    if (camp.image) setPreview(camp.image);
  }, [camp, reset]);

  // cleanup blob URL
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return camp?.image || "";
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!data?.success) throw new Error("Image upload failed");
      return data.data.url;
    } catch (err) {
      toast.error("Image upload failed");
      console.error(err);
      return camp?.image || "";
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      let finalImageUrl = camp?.image || "";
      if (imageFile) {
        finalImageUrl = await uploadImage();
      }

      const updatedCamp = {
        name:                   data.name,
        fees:                   parseFloat(data.fees) || 0,
        startDateTime:          data.startDateTime,
        endDateTime:            data.endDateTime,
        location:               data.location,
        maxParticipants:        parseInt(data.maxParticipants),
        healthcareProfessional: data.healthcareProfessional,
        description:            data.description,
        image:                  finalImageUrl,
      };

      await axiosSecure.patch(`/camps/${id}`, updatedCamp);

      await Swal.fire({
        title: "Camp Updated",
        text: `${data.name} has been updated successfully.`,
        icon: "success",
        background: "#10152A",
        color: "#F0F4FF",
        confirmButtonColor: "#116878",
        confirmButtonText: "Done",
      });

      navigate("/dashboard/manage-camps");
    } catch (error) {
      console.error("error →", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="uc">
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

      {/* header */}
      <div className="uc__header">
        <div className="uc__breadcrumb">
          <Link to="/dashboard/manage-camps" className="uc__breadcrumb-link">
            Manage Camps
          </Link>
          <span className="uc__breadcrumb-sep">›</span>
          <span className="uc__breadcrumb-current">Update Camp</span>
        </div>
        <div className="uc__tag">
          <span className="uc__tag-line" />
          <span className="uc__tag-text">Organizer Panel</span>
        </div>
        <h1 className="uc__title">Update Camp</h1>
        <p className="uc__subtitle">
          Edit the details below and save your changes.
        </p>
        {camp && (
          <div className="uc__editing-pill">
            <span className="uc__editing-dot" />
            <span className="uc__editing-text">Editing: {camp.name}</span>
          </div>
        )}
      </div>

      {/* card */}
      <div className="uc__card">
        {isLoading ? (
          <div className="uc__loading">Loading camp...</div>
        ) : (
          <>
            <form
              id="update-camp-form"
              className="uc__form"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* name */}
              <div className="uc__field">
                <label className="uc__label">Camp Name</label>
                <div className="uc__input-wrap">
                  <input
                    className={`uc__input ${errors.name ? "uc__input--error" : ""}`}
                    placeholder="Free Eye Care Camp — Dhaka"
                    {...register("name", { required: "Camp name is required" })}
                  />
                  <div className="uc__input-glow" />
                </div>
                {errors.name && (
                  <span className="uc__error">{errors.name.message}</span>
                )}
              </div>

              {/* fees */}
              <div className="uc__field">
                <label className="uc__label">Camp Fees ($)</label>
                <div className="uc__input-wrap">
                  <input
                    className={`uc__input ${errors.fees ? "uc__input--error" : ""}`}
                    type="number"
                    min="0"
                    placeholder="0 for free"
                    {...register("fees", { required: "Fees is required" })}
                  />
                  <div className="uc__input-glow" />
                </div>
                {errors.fees && (
                  <span className="uc__error">{errors.fees.message}</span>
                )}
              </div>

              {/* start datetime */}
              <div className="uc__field">
                <label className="uc__label">Start Date & Time</label>
                <div className="uc__input-wrap">
                  <input
                    className={`uc__input ${errors.startDateTime ? "uc__input--error" : ""}`}
                    type="datetime-local"
                    style={{ colorScheme: "dark" }}
                    {...register("startDateTime", {
                      required: "Start date & time is required",
                    })}
                  />
                  <div className="uc__input-glow" />
                </div>
                {errors.startDateTime && (
                  <span className="uc__error">{errors.startDateTime.message}</span>
                )}
              </div>

              {/* end datetime */}
              <div className="uc__field">
                <label className="uc__label">End Date & Time</label>
                <div className="uc__input-wrap">
                  <input
                    className={`uc__input ${errors.endDateTime ? "uc__input--error" : ""}`}
                    type="datetime-local"
                    style={{ colorScheme: "dark" }}
                    {...register("endDateTime", {
                      required: "End date & time is required",
                      validate: (val, formVals) =>
                        val > formVals.startDateTime ||
                        "End must be after start",
                    })}
                  />
                  <div className="uc__input-glow" />
                </div>
                {errors.endDateTime && (
                  <span className="uc__error">{errors.endDateTime.message}</span>
                )}
              </div>

              {/* location */}
              <div className="uc__field">
                <label className="uc__label">Location</label>
                <div className="uc__input-wrap">
                  <input
                    className={`uc__input ${errors.location ? "uc__input--error" : ""}`}
                    placeholder="Dhaka Medical College, Ward 3"
                    {...register("location", {
                      required: "Location is required",
                    })}
                  />
                  <div className="uc__input-glow" />
                </div>
                {errors.location && (
                  <span className="uc__error">{errors.location.message}</span>
                )}
              </div>

              {/* max participants */}
              <div className="uc__field">
                <label className="uc__label">Max Participants</label>
                <div className="uc__input-wrap">
                  <input
                    className={`uc__input ${errors.maxParticipants ? "uc__input--error" : ""}`}
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    {...register("maxParticipants", {
                      required: "Max participants is required",
                      min: { value: 1, message: "Must be at least 1" },
                    })}
                  />
                  <div className="uc__input-glow" />
                </div>
                {errors.maxParticipants && (
                  <span className="uc__error">
                    {errors.maxParticipants.message}
                  </span>
                )}
              </div>

              {/* healthcare professional */}
              <div className="uc__field uc__field--full">
                <label className="uc__label">Healthcare Professional</label>
                <div className="uc__input-wrap">
                  <input
                    className={`uc__input ${errors.healthcareProfessional ? "uc__input--error" : ""}`}
                    placeholder="Dr. Rahman Karim · Ophthalmologist"
                    {...register("healthcareProfessional", {
                      required: "Healthcare professional is required",
                    })}
                  />
                  <div className="uc__input-glow" />
                </div>
                {errors.healthcareProfessional && (
                  <span className="uc__error">
                    {errors.healthcareProfessional.message}
                  </span>
                )}
              </div>

              {/* image */}
              <div className="uc__field uc__field--full">
                <label className="uc__label">Camp Image</label>
                <label className="uc__image-area">
                  <input
                    type="file"
                    accept="image/*"
                    className="uc__file-input"
                    onChange={handleImageSelect}
                  />
                  {preview ? (
                    <img
                      src={preview}
                      alt="Camp"
                      className="uc__image-preview"
                    />
                  ) : (
                    <div className="uc__image-placeholder">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="7.5" y="1" width="3" height="16" rx="1.5" fill="rgba(94,200,224,0.3)" />
                        <rect x="1" y="7.5" width="16" height="3" rx="1.5" fill="rgba(94,200,224,0.3)" />
                      </svg>
                    </div>
                  )}
                  <div className="uc__image-info">
                    <div className="uc__image-title">
                      {imageFile ? imageFile.name : "Current Image"}
                    </div>
                    <div className="uc__image-sub">
                      {uploading
                        ? "Uploading..."
                        : imageFile
                        ? "New image selected"
                        : "Click anywhere here to change"}
                    </div>
                  </div>
                  <span className="uc__image-btn">Change</span>
                </label>
              </div>

              {/* description */}
              <div className="uc__field uc__field--full">
                <label className="uc__label">Description</label>
                <textarea
                  className={`uc__textarea ${errors.description ? "uc__textarea--error" : ""}`}
                  placeholder="Describe the camp..."
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <span className="uc__error">{errors.description.message}</span>
                )}
              </div>
            </form>

            {/* footer */}
            <div className="uc__footer">
              <div className="uc__footer-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l2 2" />
                </svg>
                Changes apply immediately after saving
              </div>
              <div className="uc__footer-actions">
                <button
                  type="button"
                  className="uc__btn-cancel"
                  onClick={() => navigate("/dashboard/manage-camps")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="update-camp-form"
                  className="uc__btn-save"
                  disabled={isSubmitting || uploading}
                >
                  {isSubmitting || uploading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateCamp;