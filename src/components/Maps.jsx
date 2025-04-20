import { useContext, useEffect } from "react";
import { MapsContext } from "../context/MapsContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Make sure Leaflet CSS is imported
import styles from "./Maps.module.css";
import L, { DivIcon } from "leaflet"; // Import leaflet for custom icons
import { useLocation, useNavigate } from "react-router-dom";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useMap } from "react-leaflet";
import { RecipeContext } from "../context/RecipeContext";
import { UserAuthContext } from "../context/UserAuthContext";
import { FavouriteContext } from "../context/FavouriteContext";
import Icons from "./Icons";
import MapLocateMeButton from "./MapLocateMeButton";
import SearchBar from "./SearchBar";
import { SearchContext } from "../context/SearchContext";

const MapEventHandler = ({ selectedRecipe }) => {
  const map = useMap();
  useEffect(() => {
    if (!selectedRecipe) return;
    map.flyTo([selectedRecipe.latitude, selectedRecipe.longitude, 15]);
  }, [selectedRecipe, map]);
};

const Maps = () => {
  const { location, selectedRecipe, setSelectedRecipe } =
    useContext(MapsContext);
  const { isMapLoading, isRecipeLoading } = useContext(
    IsEditingAndLoadingContext
  );
  const { allRecipes = [] } = useContext(RecipeContext);
  const { userProfile, isLoggedIn } = useContext(UserAuthContext);
  const { favouriteList, favButtonClick } = useContext(FavouriteContext);
  const { search, filteredRecipes, setFilteredRecipes } =
    useContext(SearchContext);

  const useLocations = useLocation();
  const navigate = useNavigate();
  // Create a custom icon (adjust the size and image source as needed)
  const currentLocationIcon = new L.DivIcon({
    html: `<div class="${styles.currentLocationIcon}"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: "", // Remove Leaflet default styles
  });
  const customIcon = (imgSrc) =>
    new L.DivIcon({
      html: `<div class=${styles.circleIcon} style="background-image: url('${imgSrc}');"></div>`,
      iconSize: [50, 50], // Size of the icon (in pixels)
      iconAnchor: [25, 50], // Anchor the icon at the bottom center
      popupAnchor: [0, -50], // Adjust popup position
      className: "", // Remove the default Leaflet className to avoid default styling
    });

  const customIconFav = (imgSrc) =>
    new L.DivIcon({
      html: `<div class=${styles.circleIconFav} style="background-image: url('${imgSrc}');"></div>`,
      iconSize: [50, 50], // Size of the icon (in pixels)
      iconAnchor: [25, 50], // Anchor the icon at the bottom center
      popupAnchor: [0, -50], // Adjust popup position
      className: "", // Remove the default Leaflet className to avoid default styling
    });

  const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();

    return L.divIcon({
      html: `<div class="${styles.clusterIcon}">${count}</div>`, // Custom CSS class
      className: "", // Remove default Leaflet styles
      iconSize: [40, 40], // Adjust size
    });
  };

  useEffect(() => {
    if (allRecipes && useLocations.pathname === "/map") {
      const filtered = allRecipes.filter((recipe) => {
        const lowerCaseSearch = search.toLowerCase();
        return (
          recipe.title.toLowerCase().includes(lowerCaseSearch) ||
          recipe.cuisine.toLowerCase().includes(lowerCaseSearch) ||
          recipe.city.toLowerCase().includes(lowerCaseSearch) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(lowerCaseSearch)
          )
        );
      });
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes([]);
    }
  }, [search, allRecipes]);

  return (
    <>
      {isMapLoading ||
        (isRecipeLoading && (
          <div className={styles.loading}>
            <p>Loading Map...</p>
            <PacmanLoader size={10} />
          </div>
        ))}
      {!isMapLoading && !isRecipeLoading && (
        <SearchBar disabled={isMapLoading} />
      )}
      {!isMapLoading && !isRecipeLoading && (
        <div className={styles.MapMainContainer}>
          <div className={styles.container}>
            <div className={styles.imageContainer}>
              {location &&
                location.latitude !== null &&
                location.longitude !== null && (
                  <MapContainer
                    center={[location.latitude, location.longitude]}
                    zoom={15}
                    maxZoom={17} // Prevent zooming in past this level
                    minZoom={2} // Prevent zooming out past this level
                    className={styles.map}
                    attributionControl={false}
                    maxBounds={[
                      [-85, -180], // Southwest corner (bottom-left)
                      [85, 180], // Northeast corner (top-right)
                    ]}
                    maxBoundsViscosity={1.0} // Fully restricts map within bounds
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <MapEventHandler selectedRecipe={selectedRecipe} />
                    <MapLocateMeButton />
                    <Marker
                      position={[location.latitude, location.longitude]}
                      icon={currentLocationIcon}
                    >
                      <Popup>
                        You are at {location.road}, {location.city}
                      </Popup>
                    </Marker>
                    <MarkerClusterGroup
                      key={filteredRecipes.length} // force react to remount the component so it can reflect the correct filtered recipes
                      iconCreateFunction={createClusterCustomIcon}
                      maxClusterRadius={80}
                      spiderfyDistanceMultiplier={2} // Spread markers more when clicked
                      disableClusteringAtZoom={8} // Stops clustering when zoomed in past level 14
                    >
                      {filteredRecipes.map((recipe) => {
                        return (
                          <Marker
                            key={recipe.id}
                            position={[recipe.latitude, recipe.longitude]}
                            icon={
                              favouriteList.some(
                                (fav) => fav.recipe.id === recipe.id
                              )
                                ? customIconFav(recipe.imgSrc)
                                : customIcon(recipe.imgSrc)
                            }
                            eventHandlers={{
                              click: () => {
                                selectedRecipe &&
                                selectedRecipe.id === recipe.id
                                  ? setSelectedRecipe(null)
                                  : setSelectedRecipe(recipe);
                              },
                            }}
                          >
                            {/* <Popup>
                            <div className={styles.markerDetails}>
                              <div className={styles.imgContainer}>
                                <img
                                  src={recipe.imgSrc}
                                  alt={recipe.ti}
                                  className={styles.img}
                                />
                              </div>

                              <div className={styles.textContainer}>
                                <div className={styles.textInnerContainer}>
                                  <p className={styles.title}>{recipe.title}</p>
                                  <p className={styles.text}>{recipe.city}</p>
                                  <p className={styles.text}>
                                    {recipe.description}
                                  </p>
                                </div>
                                <button
                                  className={styles.button}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/recipe/${recipe.id}`);
                                  }}
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          </Popup> */}
                          </Marker>
                        );
                      })}
                    </MarkerClusterGroup>
                  </MapContainer>
                )}
            </div>
            {selectedRecipe && (
              <div className={styles.detailsContainer}>
                <div className={styles.detailsSubContainer}>
                  <div className={styles.listSubContainer}>
                    <h1 className={styles.mainTitle}>
                      {selectedRecipe.title.toUpperCase()}
                    </h1>
                    {isLoggedIn && (
                      <button
                        onClick={() => {
                          favButtonClick(selectedRecipe, userProfile.userId);
                        }}
                      >
                        {favouriteList.some(
                          (fav) => fav.recipe.id === selectedRecipe.id
                        )
                          ? Icons.heartfill
                          : Icons.heart}
                      </button>
                    )}
                  </div>
                  <p className={styles.description}>
                    {selectedRecipe.description}
                  </p>
                  <p className={styles.listSubContainer}>
                    Contributor:
                    <>
                      <button
                        className={styles.button}
                        onClick={() =>
                          navigate(`/profile/${selectedRecipe.user.id}`)
                        }
                      >
                        {Icons.profile}
                      </button>
                    </>
                  </p>
                </div>
                <div className={styles.buttonsContainer}>
                  <button
                    className={styles.button}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(`/recipe/${selectedRecipe.id}`);
                    }}
                    type="button"
                  >
                    {Icons.view}
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => setSelectedRecipe(null)}
                    type="button"
                  >
                    {Icons.clear}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Maps;
