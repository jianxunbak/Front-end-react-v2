import { createContext, useEffect, useState } from "react";

// Step 1: Create a context object
export const IsEditingAndLoadingContext = createContext();

// Step 2: Set up a Context Provider
export function IsEditingAndLoadingProvider({ children }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isRecipeLoading, setIsRecipeLoading] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [isProfileLoading, setProfileLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);

  useEffect(() => {}, [isEditing, isLoading]);

  const contextValue = {
    isEditing,
    isLoading,
    setIsEditing,
    setIsLoading,
    isFormLoading,
    setIsFormLoading,
    isRecipeLoading,
    setIsRecipeLoading,
    isSubmitting,
    setIsSubmitting,
    isFavLoading,
    setIsFavLoading,
    isProfileLoading,
    setProfileLoading,
    isMapLoading,
    setIsMapLoading,
  };
  return (
    <IsEditingAndLoadingContext.Provider value={contextValue}>
      {children}
    </IsEditingAndLoadingContext.Provider>
  );
}
