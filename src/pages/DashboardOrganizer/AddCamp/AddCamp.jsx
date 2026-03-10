import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import "./AddCamp.css";

const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const AddCamp = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return "";

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!data?.success) {
        throw new Error("Image upload failed");
      }

      return data?.data?.url || "";
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
      return "";
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      let finalImageUrl = "";

      if (imageFile) {
        finalImageUrl = await uploadImage();
      }

      const campData = {
        name: data.name,
        fees: parseFloat(data.fees) || 0,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        location: data.location,
        healthcareProfessional: data.healthcareProfessional,
        description: data.description,
        image: finalImageUrl || "",
        participantCount: 0,
        maxParticipants: parseInt(data.maxParticipants), // ← add this
        organizerEmail: user?.email,
        organizerName: user?.displayName,
        createdAt: new Date().toISOString(),
      };

      await axiosSecure.post("/camps", campData);

      await Swal.fire({
        title: "Camp Published",
        text: `${data.name} is now live.`,
        icon: "success",
        background: "#10152A",
        color: "#F0F4FF",
        confirmButtonColor: "#116878",
        confirmButtonText: "Done",
      });

      reset();
      setImageFile(null);

      if (preview) URL.revokeObjectURL(preview);
      setPreview("");

      navigate("/dashboard/manage-camps");
    } catch (error) {
      console.error("error →", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="add-camp">
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

      <div className="add-camp__header">
        <div className="add-camp__tag">
          <span className="add-camp__tag-line" />
          <span className="add-camp__tag-text">Organizer Panel</span>
        </div>

        <h1 className="add-camp__title">Create New Camp</h1>

        <p className="add-camp__subtitle">
          Fill in the details below to publish a new medical camp.
        </p>
      </div>

      <div className="add-camp__card">
        <form
          id="add-camp-form"
          className="add-camp__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="add-camp__field">
            <label className="add-camp__label">Camp Name</label>
            <div className="add-camp__input-wrap">
              <input
                className={`add-camp__input ${errors.name ? "add-camp__input--error" : ""}`}
                placeholder="Free Eye Care Camp — Dhaka"
                {...register("name", { required: "Camp name is required" })}
              />
              <div className="add-camp__input-glow" />
            </div>
            {errors.name && (
              <span className="add-camp__error">{errors.name.message}</span>
            )}
          </div>

          <div className="add-camp__field">
            <label className="add-camp__label">Camp Fees ($)</label>
            <div className="add-camp__input-wrap">
              <input
                className={`add-camp__input ${errors.fees ? "add-camp__input--error" : ""}`}
                type="number"
                min="0"
                placeholder="0 for free camps"
                {...register("fees", { required: "Fees is required" })}
              />
              <div className="add-camp__input-glow" />
            </div>
            {errors.fees && (
              <span className="add-camp__error">{errors.fees.message}</span>
            )}
          </div>

          {/* start date & time */}
          <div className="add-camp__field">
            <label className="add-camp__label">Start Date & Time</label>
            <div className="add-camp__input-wrap">
              <input
                className={`add-camp__input ${errors.startDateTime ? "add-camp__input--error" : ""}`}
                type="datetime-local"
                style={{ colorScheme: "dark" }}
                {...register("startDateTime", {
                  required: "Start date & time is required",
                })}
              />
              <div className="add-camp__input-glow" />
            </div>
            {errors.startDateTime && (
              <span className="add-camp__error">
                {errors.startDateTime.message}
              </span>
            )}
          </div>

          {/* end date & time */}
          <div className="add-camp__field">
            <label className="add-camp__label">End Date & Time</label>
            <div className="add-camp__input-wrap">
              <input
                className={`add-camp__input ${errors.endDateTime ? "add-camp__input--error" : ""}`}
                type="datetime-local"
                style={{ colorScheme: "dark" }}
                {...register("endDateTime", {
                  required: "End date & time is required",
                  validate: (val, formVals) =>
                    val > formVals.startDateTime || "End must be after start",
                })}
              />
              <div className="add-camp__input-glow" />
            </div>
            {errors.endDateTime && (
              <span className="add-camp__error">
                {errors.endDateTime.message}
              </span>
            )}
          </div>

          <div className="add-camp__field">
            <label className="add-camp__label">Location</label>
            <div className="add-camp__input-wrap">
              <input
                className={`add-camp__input ${errors.location ? "add-camp__input--error" : ""}`}
                placeholder="Dhaka Medical College, Ward 3"
                {...register("location", { required: "Location is required" })}
              />
              <div className="add-camp__input-glow" />
            </div>
            {errors.location && (
              <span className="add-camp__error">{errors.location.message}</span>
            )}
          </div>

          <div className="add-camp__field">
            <label className="add-camp__label">Healthcare Professional</label>
            <div className="add-camp__input-wrap">
              <input
                className={`add-camp__input ${errors.healthcareProfessional ? "add-camp__input--error" : ""}`}
                placeholder="Dr. Rahman Karim · Ophthalmologist"
                {...register("healthcareProfessional", {
                  required: "Healthcare professional is required",
                })}
              />
              <div className="add-camp__input-glow" />
            </div>
            {errors.healthcareProfessional && (
              <span className="add-camp__error">
                {errors.healthcareProfessional.message}
              </span>
            )}
          </div>

          <div className="add-camp__field">
            <label className="add-camp__label">Participant Count</label>
            <div className="add-camp__input-wrap">
              <input
                className="add-camp__input"
                type="number"
                value="0"
                readOnly
                tabIndex={-1}
              />
              <div className="add-camp__input-glow" />
            </div>
          </div>

          {/* max participants */}
          <div className="add-camp__field">
            <label className="add-camp__label">Max Participants</label>
            <div className="add-camp__input-wrap">
              <input
                className={`add-camp__input ${errors.maxParticipants ? "add-camp__input--error" : ""}`}
                type="number"
                min="1"
                placeholder="e.g. 100"
                {...register("maxParticipants", {
                  required: "Max participants is required",
                  min: { value: 1, message: "Must be at least 1" },
                })}
              />
              <div className="add-camp__input-glow" />
            </div>
            {errors.maxParticipants && (
              <span className="add-camp__error">
                {errors.maxParticipants.message}
              </span>
            )}
          </div>

          <div className="add-camp__field add-camp__field--full">
            <label className="add-camp__label">Camp Image</label>

            <label
              className={`add-camp__upload ${imageFile ? "add-camp__upload--has-file" : ""}`}
            >
              <input
                type="file"
                accept="image/*"
                className="add-camp__file-input"
                onChange={handleImageSelect}
              />

              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Camp preview"
                    className="add-camp__upload-preview"
                  />
                  <span className="add-camp__upload-title">
                    {uploading ? "Uploading..." : "Click to change"}
                  </span>
                  <span className="add-camp__upload-sub">
                    {imageFile?.name}
                  </span>
                </>
              ) : (
                <>
                  <div className="add-camp__upload-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 16V5M12 5L8 9M12 5L16 9M5 16.5V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V16.5"
                        stroke="#29C4EC"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="add-camp__upload-title">
                    Upload Camp Photo
                  </span>
                  <span className="add-camp__upload-sub">
                    JPG, PNG · Max 5MB · Click or drag
                  </span>
                </>
              )}
            </label>
          </div>

          <div className="add-camp__field add-camp__field--full">
            <label className="add-camp__label">Description</label>
            <textarea
              className={`add-camp__textarea ${errors.description ? "add-camp__textarea--error" : ""}`}
              placeholder="Describe the camp, services offered, eligibility..."
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <span className="add-camp__error">
                {errors.description.message}
              </span>
            )}
          </div>
        </form>

        <div className="add-camp__footer">
          <button
            type="button"
            className="add-camp__btn-cancel"
            onClick={() => navigate("/dashboard/manage-camps")}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-camp-form"
            className="add-camp__btn-submit"
            disabled={isSubmitting || uploading}
          >
            {isSubmitting || uploading ? "Publishing..." : "Publish Camp"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCamp;
