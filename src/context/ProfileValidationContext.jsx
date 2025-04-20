import Joi from "joi";
import { createContext, useState } from "react";

// Step 1: Create a context object
export const ProfileValidationContext = createContext();

// Step 2: Create a context provider
export function ProfileValidationProvider({ children }) {
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    profilePicture: "",
    aboutMe: "",
  });

  const schema = {
    username: Joi.string()
      .min(3)
      .message("Username must be at least 3 characters long")
      .max(100)
      .message("Username cannot be more than 100 characters")
      .required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .message("Email is not valid")
      .required(),
    password: Joi.string()
      .min(8)
      .message("Password must be at least 8 characters long")
      .max(100)
      .message("Password cannot be more than 100 characters")
      .required(),
    profilePicture: Joi.string()
      .uri()
      .message("Please insert a valid URL")
      .regex(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
      .message("Invalid image url")
      .optional(),
    aboutMe: Joi.string()
      .min(3)
      .message("About me must be at least 3 characters long")
      .max(200)
      .message("About me  cannot be more than 500 characters")
      .optional(),
  };

  const validateRealTimeField = (e) => {
    const { name, value } = e.target;
    if (!value) return; // Return early if value is null or undefined
    const objToCompare = { [name]: value };
    const fieldSchema = Joi.object({ [name]: schema[name] });
    const result = fieldSchema.validate(objToCompare);
    const { error } = result;
    settingFormErrors(name, error ? error.details[0].message : null);
  };

  const settingFormErrors = (name, errorMessage) => {
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (errorMessage) {
        newErrors[name] = errorMessage;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const validationOnSubmit = (e, newUserDetails) => {
    e.preventDefault();
    const validateResults = {};
    let isValid = true;

    for (const field in newUserDetails) {
      const objToCompare = { [field]: newUserDetails[field] };
      const fieldSchema = Joi.object({ [field]: schema[field] });
      const results = fieldSchema.validate(objToCompare);
      if (results.error) {
        isValid = false;
        validateResults[field] = results.error.details[0].message;
      }
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, ...validateResults }));

    return isValid;
  };

  const contextValue = {
    validateRealTimeField,
    validationOnSubmit,
    formErrors,
    setFormErrors,
  };

  return (
    <ProfileValidationContext.Provider value={contextValue}>
      {children}
    </ProfileValidationContext.Provider>
  );
}
