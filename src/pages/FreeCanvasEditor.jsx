import { Rnd } from "react-rnd";
import { useState, useEffect } from "react";
import { client } from "../sanity";

export default function FreeCanvasEditor() {
  const [elements, setElements] = useState([]);

  // Load saved layout
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("layout"));
    if (saved) setElements(saved);
  }, []);

  // Save layout
  useEffect(() => {
    localStorage.setItem("layout", JSON.stringify(elements));
  }, [elements]);

  const updateElement = (id, newProps) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, ...newProps } : el
      )
    );
  };

  const saveToSanity = async () => {
  try {
    await client.createOrReplace({
      _id: "homepageLayout", // 🔥 fixed ID (important)
      _type: "layout",
      elements: elements,
    });

    alert("Layout saved successfully!");
  } catch (err) {
    console.error(err);
    alert("Error saving layout");
  }
};

  const addImage = (file) => {
    const url = URL.createObjectURL(file);

    const newElement = {
      id: Date.now(),
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      src: url,
      zIndex: elements.length + 1,
    };

    setElements((prev) => [...prev, newElement]);
  };

  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      

      {/* Top Bar */}
      <div style={{
        padding: "10px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: "10px"
      }}>

        <button
  onClick={saveToSanity}
  style={{
    padding: "8px 16px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
  }}
>
  Save Layout
</button>
        <input
          type="file"
          onChange={(e) => addImage(e.target.files[0])}
        />
      </div>

      {/* Canvas */}
      <div
        style={{
          flex: 1,
          position: "relative",
          background: "#f5f5f5",
          overflow: "hidden",
        }}
      >
        {elements.map((el) => (
          <Rnd
            key={el.id}
            size={{ width: el.width, height: el.height }}
            position={{ x: el.x, y: el.y }}
            style={{ zIndex: el.zIndex }}
            
            onDragStop={(e, d) => {
              updateElement(el.id, { x: d.x, y: d.y });
            }}

            onResizeStop={(e, direction, ref, delta, position) => {
              updateElement(el.id, {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                ...position,
              });
            }}

            onMouseDown={() => {
              // bring to front
              const maxZ = Math.max(...elements.map(e => e.zIndex || 1));
              updateElement(el.id, { zIndex: maxZ + 1 });
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              
              {/* Delete Button */}
              <button
                onClick={() => deleteElement(el.id)}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                ×
              </button>

              <img
                src={el.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}