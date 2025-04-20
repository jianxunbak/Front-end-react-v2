import { useMap } from "react-leaflet";
import Icons from "./Icons";

const MapLocateMeButton = () => {
  const map = useMap();
  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 15 });
  };
  return (
    <button
      onClick={handleLocate}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        padding: "8px 12px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {Icons.locate}
    </button>
  );
};

export default MapLocateMeButton;
