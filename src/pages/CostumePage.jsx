import CategoryPage from "./CategoryPages";

export default function CostumePage({ darkMode, setDarkMode }) {
  return (
    <CategoryPage
      category="costume"
      title="Costume Showcase"
      darkMode={darkMode}          // ✅ ADD THIS
      setDarkMode={setDarkMode}    // ✅ ADD THIS
    />
  );
}