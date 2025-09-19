import { useState } from "react";
import { motion } from "framer-motion";
import type { ChatbotTheme } from "./ChatWidget";

const InfoCollector: React.FC<{
  onInfoCollected: ({
    name,
    email,
    mobile,
  }: {
    name: string;
    email: string;
    mobile: string;
  }) => void;
  theme: ChatbotTheme;
}> = ({ onInfoCollected, theme }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!/^[0-9]{10}$/.test(formData.mobile))
      newErrors.mobile = "Enter a valid 10-digit number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    localStorage.setItem("userInfo", JSON.stringify(formData));

    setIsSubmitted(true);
    onInfoCollected({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: "20px",
        maxWidth: "100%",
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {/* Heading */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "12px",
          fontSize: "14px",
          fontWeight: "500",
          padding: "10px",
        }}
      >
        <span style={{ color: theme.primaryColor }}>Every story is unique</span>{" "}
        – A few quick details will help us walk this path with you ❤️
      </div>

      {/* Sub CTA */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <button
          type="button"
          style={{
            backgroundColor: `${theme.primaryColor}15`,
            color: theme.primaryColor,
            border: `1px solid ${theme.primaryColor}40`,
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Sign up now! Get your free IVF comic!
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "13px", fontWeight: 500 }}>
            Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: `1px solid ${
                errors.name ? "#ef4444" : theme.primaryColor + "30"
              }`,
              marginTop: "6px",
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              fontSize: "14px",
              outline: "none",
            }}
          />
          {errors.name && (
            <div
              style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}
            >
              {errors.name}
            </div>
          )}
        </div>

        {/* Email */}
        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontSize: "13px", fontWeight: 500 }}>
            Email <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: `1px solid ${
                errors.email ? "#ef4444" : theme.primaryColor + "30"
              }`,
              marginTop: "6px",
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              fontSize: "14px",
              outline: "none",
            }}
          />
          {errors.email && (
            <div
              style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}
            >
              {errors.email}
            </div>
          )}
        </div>

        {/* Mobile */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "13px", fontWeight: 500 }}>
            Mobile Number <span style={{ color: "red" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                borderRadius: "8px",
                border: `1px solid ${theme.primaryColor}30`,
                backgroundColor: `${theme.primaryColor}10`,
                fontSize: "14px",
              }}
            >
              +91
            </span>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "8px",
                border: `1px solid ${
                  errors.mobile ? "#ef4444" : theme.primaryColor + "30"
                }`,
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
          {errors.mobile && (
            <div
              style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}
            >
              {errors.mobile}
            </div>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </form>

      {/* Footer note */}
      <div
        style={{
          fontSize: "11px",
          opacity: 0.6,
          marginTop: "8px",
          textAlign: "center",
          color: theme.textColor,
        }}
      >
        🔒 Your details are safe & encrypted
      </div>
    </motion.div>
  );
};

export default InfoCollector;
