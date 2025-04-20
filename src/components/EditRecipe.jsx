import { useContext, useEffect } from "react";
import styles from "./AddEditRecipe.module.css";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { UserAuthContext } from "../context/UserAuthContext";
import { MapsContext } from "../context/MapsContext";
import { RecipeContext } from "../context/RecipeContext";
import { RecipeValidationContext } from "../context/RecipeValidationContext";
import Icons from "./Icons";
import { PacmanLoader } from "react-spinners";

const EditRecipe = () => {
  const { isFormLoading } = useContext(IsEditingAndLoadingContext);
  const { userProfile } = useContext(UserAuthContext);
  const { location } = useContext(MapsContext);

  const {
    newRecipe,
    setNewRecipe,
    handleCancel,
    handleAddField,
    handleMinusField,
    handleInput,
    handleAddRecipe,
  } = useContext(RecipeContext);

  const { validateRealTimeField, validationOnSubmit, formErrors } = useContext(
    RecipeValidationContext
  );
  useEffect(() => {
    if (
      location.city !== "Unknown city" &&
      location.latitude &&
      location.longitude
    ) {
      setNewRecipe((prevRecipe) => ({
        ...prevRecipe,
        location: location.city,
        latitude: location.latitude,
        longitude: location.longitude,
      }));
    }
  }, [location, setNewRecipe]);
  return (
    <div className={styles.formMainContainer}>
      <div className={styles.formContainer}>
        <div className={styles.mainTitleContainer}>
          <h1 className={styles.mainTitle}>Edit Recipe</h1>
          {isFormLoading ? (
            <PacmanLoader size={10} color="black" />
          ) : (
            <div className={styles.buttonContainer}>
              <button
                className={styles.button}
                onClick={(e) =>
                  handleAddRecipe(e, validationOnSubmit, userProfile.userId)
                }
                disabled={isFormLoading}
              >
                Edit
              </button>
              <button
                className={styles.button}
                type="button"
                onClick={() => handleCancel()}
                disabled={isFormLoading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className={styles.inputMainContainer}>
          <div className={styles.InputColSubContainer}>
            <div className={styles.inputRowSubContainer}>
              <label className={`form-label ${styles.label}`}>Location:</label>
              <input
                className={styles.input}
                name="location"
                type="text"
                value={newRecipe.location || "Getting Location..."}
                disabled
              />
            </div>
          </div>
          <div className={styles.InputColSubContainer}>
            <div className={styles.inputRowSubContainer}>
              <label className={`form-label ${styles.label}`}> Title: </label>
              <input
                className={`form-control ${styles.input}`}
                name="title"
                type="text"
                onChange={(e) => handleInput(e, validateRealTimeField)}
                value={newRecipe.title}
                disabled={isFormLoading}
              />
            </div>
            {formErrors.title && (
              <div className={styles.error}>{formErrors.title}</div>
            )}
          </div>
          <div className={styles.InputColSubContainer}>
            <div className={styles.inputRowSubContainer}>
              <label className={`form-label ${styles.label}`}>
                Description:
              </label>
              <input
                className={`form-control ${styles.input}`}
                name="description"
                type="text"
                onChange={(e) => handleInput(e, validateRealTimeField)}
                value={newRecipe.description}
                disabled={isFormLoading}
              />
            </div>
            {formErrors.description && (
              <div className={styles.error}>{formErrors.description}</div>
            )}
          </div>
          <div className={styles.InputColSubContainer}>
            <div className={styles.inputRowSubContainer}>
              <label className={`form-label ${styles.label}`}>Image URL:</label>
              <input
                className={`form-control ${styles.input}`}
                name="imgSrc"
                type="text"
                onChange={(e) => handleInput(e, validateRealTimeField)}
                value={newRecipe.imgSrc}
                disabled={isFormLoading}
              />
            </div>
            {formErrors.imgSrc && (
              <div className={styles.error}>{formErrors.imgSrc}</div>
            )}
          </div>
        </div>

        <div className={styles.subTitleContainer}>
          <h2 className={styles.subTitle}>Ingredients</h2>
          <button
            className={styles.button}
            type="button"
            onClick={() => handleAddField("ingredients")}
            disabled={isFormLoading}
          >
            {Icons.add}
          </button>
        </div>
        {/* map out the array inside ingredients state and display a text area for user to input */}
        <div className={styles.inputMainContainer}>
          {newRecipe.ingredients.map((ingredient, index) => (
            <div className={styles.InputColSubContainer} key={index}>
              <div className={styles.inputRowSubContainer}>
                <label className={styles.label}>Ingredient {index + 1} :</label>
                <input
                  className={styles.inputWithButton}
                  name="ingredients"
                  type="text"
                  value={ingredient || ""}
                  onChange={(e) => handleInput(e, validateRealTimeField, index)}
                  disabled={isFormLoading}
                />
                <button
                  className={styles.button}
                  type="button"
                  onClick={() => handleMinusField("ingredients", index)}
                  disabled={isFormLoading}
                >
                  {Icons.delete}
                </button>
              </div>
              {formErrors.ingredients && formErrors.ingredients[index] && (
                <div className={styles.error}>
                  {formErrors.ingredients[index]}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* handler to add empty string inside the ingredients array to be map as a new text area field */}
        <div className={styles.subTitleContainer}>
          <h2 className={styles.subTitle}>Steps</h2>
          <button
            className={styles.button}
            type="button"
            onClick={() => handleAddField("steps")}
            disabled={isFormLoading}
          >
            {Icons.add}
          </button>
        </div>
        {/* map out the array inside steps state and display a text area for user to input */}
        <div className={styles.inputMainContainer}>
          {newRecipe.steps.map((step, index) => (
            <div className={styles.InputColSubContainer} key={index}>
              <div className={styles.inputRowSubContainer} key={index}>
                <label className={styles.label}>Step {index + 1} :</label>
                <input
                  className={styles.inputWithButton}
                  name="steps"
                  type="text"
                  value={step || ""}
                  onChange={(e) => handleInput(e, validateRealTimeField, index)}
                  disabled={isFormLoading}
                />
                <button
                  className={styles.button}
                  type="button"
                  onClick={() => handleMinusField("steps", index)}
                  disabled={isFormLoading}
                >
                  {Icons.delete}
                </button>
              </div>
              {formErrors.steps && formErrors.steps[index] && (
                <div className={styles.error}>{formErrors.steps[index]}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditRecipe;
