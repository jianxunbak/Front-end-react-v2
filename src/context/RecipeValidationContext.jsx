import Joi from "joi";
import { createContext, useState } from "react";

// Step 1: Create a context object
export const RecipeValidationContext = createContext();

// Step 2: Create a context provider
export function RecipeValidationProvider({ children }) {
  const [formErrors, setFormErrors] = useState({
    imgSrc: "",
    title: "",
    description: "",
    ingredients: [],
    steps: [],
  });

  const schema = {
    imgSrc: Joi.string()
      .uri()
      .message("Please insert a valid URL")
      .regex(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
      .message("Invalid image url")
      .required(),
    title: Joi.string()
      .min(3)
      .message("Title must be at least 3 characters long")
      .max(100)
      .message("Title cannot be more than 100 characters")
      .required(),
    description: Joi.string()
      .min(3)
      .message("Description must be at least 3 characters long")
      .max(200)
      .message("Description cannot be more than 200 characters")
      .required(),
    ingredients: Joi.string()
      .min(3)
      .message("Ingredients must be at least 3 characters long")
      .max(200)
      .message("Ingredients cannot be more than 200 characters")
      .required(),
    steps: Joi.string()
      .min(3)
      .message("Steps must be at least 3 characters long")
      .max(200)
      .message("Steps cannot be more than 200 characters")
      .required(),
    location: Joi.string().allow("").optional(),
    latitude: Joi.number().allow(null).optional(),
    longitude: Joi.number().allow(null).optional(),
  };

  const validateField = (name, value) => {
    const result = schema[name].validate(value);
    return result.error ? result.error.details[0].message : null;
  };

  const validateRealTimeField = (name, value, index) => {
    if (name === "ingredients" || name === "steps") {
      const arrayResults = validateField(name, value);
      setFormErrors((prev) => {
        const updated = [...(prev[name] || [])];
        updated[index] = arrayResults;
        return { ...prev, [name]: updated };
      });
    } else {
      const errorMessage = validateField(name, value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: errorMessage,
      }));
    }
  };

  const validationOnSubmit = (e, newRecipe) => {
    e.preventDefault();
    let isValid = true;
    const allErrors = {
      imgSrc: null,
      title: null,
      description: null,
      ingredients: [],
      steps: [],
    };

    Object.entries(newRecipe).forEach(([key, value]) => {
      if (key === "ingredients" || key === "steps") {
        const arrayErrors = value.map((item) => {
          const arrayResult = validateField(key, item);
          if (arrayResult) isValid = false;
          return arrayResult;
        });
        allErrors[key] = arrayErrors;
      } else if (schema[key]) {
        const errorMessage = validateField(key, value);
        allErrors[key] = errorMessage;
        if (errorMessage) isValid = false;
      }
    });
    console.log(allErrors);
    setFormErrors(allErrors);
    return isValid;
  };

  const contextValue = {
    validateRealTimeField,
    validationOnSubmit,
    formErrors,
    setFormErrors,
  };

  return (
    <RecipeValidationContext.Provider value={contextValue}>
      {children}
    </RecipeValidationContext.Provider>
  );
}
