import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { RecipeProvider } from "./context/RecipeContext";
import AllRecipesCards from "./components/AllRecipesCards";
import { UserAuthProvider } from "./context/UserAuthContext";
import Root from "./components/Root";
import Login from "./components/Login";
import { useContext } from "react";
import { IsEditingAndLoadingContext } from "./context/IsLoadingandEditingContext";
import Recipe from "./components/Recipe";
import AddRecipe from "./components/AddRecipe";
import { RecipeValidationProvider } from "./context/RecipeValidationContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditRecipe from "./components/EditRecipe";
import Fav from "./components/Fav";
import { FavouriteProvider } from "./context/FavouriteContext";
import Default from "./components/Default";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/SignUp";
import { ProfileValidationProvider } from "./context/ProfileValidationContext";
import Profile from "./components/Profile";
import { ProfileProvider } from "./context/ProfileContext";
import EditProfile from "./components/EditProfile";
import EditPassword from "./components/EditPassword";
import UserRecipes from "./components/UserRecipes";
import { SearchProvider } from "./context/SearchContext";
import { MapsProvider } from "./context/MapsContext";
import Maps from "./components/Maps";

function App() {
  const {
    setIsLoading,
    setIsEditing,
    setIsFormLoading,
    setIsRecipeLoading,
    setIsFavLoading,
    isFavLoading,
    isMapLoading,
    setIsMapLoading,
  } = useContext(IsEditingAndLoadingContext);
  return (
    <BrowserRouter>
      <UserAuthProvider setIsLoading={setIsLoading}>
        <MapsProvider
          setIsMapLoading={setIsMapLoading}
          isMapLoading={isMapLoading}
        >
          <SearchProvider setIsLoading={setIsLoading}>
            <RecipeProvider
              setIsEditing={setIsEditing}
              setIsFormLoading={setIsFormLoading}
              setIsRecipeLoading={setIsRecipeLoading}
              setIsLoading={setIsLoading}
            >
              <FavouriteProvider
                setIsFavLoading={setIsFavLoading}
                isFavLoading={isFavLoading}
              >
                <Routes>
                  <Route path="/" element={<Root />}>
                    <Route path="*" element={<Default />} />
                    <Route index element={<AllRecipesCards />} />
                    <Route path="login" element={<Login />} />
                    <Route
                      path="signUp"
                      element={
                        <ProfileValidationProvider>
                          <SignUp />
                        </ProfileValidationProvider>
                      }
                    />
                    <Route
                      path="recipe/:id"
                      element={
                        <ProtectedRoute>
                          <Recipe />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="add"
                      element={
                        <RecipeValidationProvider>
                          <ProtectedRoute>
                            <AddRecipe />
                          </ProtectedRoute>
                        </RecipeValidationProvider>
                      }
                    />
                    <Route
                      path="edit"
                      element={
                        <RecipeValidationProvider>
                          <ProtectedRoute>
                            <EditRecipe />
                          </ProtectedRoute>
                        </RecipeValidationProvider>
                      }
                    />
                    <Route
                      path="fav"
                      element={
                        <ProtectedRoute>
                          <Fav />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="profile/:id"
                      element={
                        <ProfileProvider>
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        </ProfileProvider>
                      }
                    />
                    <Route
                      path="editProfile"
                      element={
                        <ProfileProvider
                          setIsLoading={setIsLoading}
                          setIsEditing={setIsEditing}
                        >
                          <ProfileValidationProvider>
                            <ProtectedRoute>
                              <EditProfile />
                            </ProtectedRoute>
                          </ProfileValidationProvider>
                        </ProfileProvider>
                      }
                    />
                    <Route
                      path="editPassword"
                      element={
                        <ProfileProvider
                          setIsLoading={setIsLoading}
                          setIsEditing={setIsEditing}
                        >
                          <ProfileValidationProvider>
                            <ProtectedRoute>
                              <EditPassword />
                            </ProtectedRoute>
                          </ProfileValidationProvider>
                        </ProfileProvider>
                      }
                    />
                    <Route
                      path="/userRecipes/:id"
                      element={
                        <ProfileValidationProvider>
                          <ProtectedRoute>
                            <UserRecipes />
                          </ProtectedRoute>
                        </ProfileValidationProvider>
                      }
                    />
                    <Route
                      path="/map"
                      element={
                        <ProtectedRoute>
                          <Maps />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Routes>
                <ToastContainer position="top-center" autoClose={1000} />
              </FavouriteProvider>
            </RecipeProvider>
          </SearchProvider>
        </MapsProvider>
      </UserAuthProvider>
    </BrowserRouter>
  );
}

export default App;
