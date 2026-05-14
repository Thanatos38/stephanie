import CategoryPage from "./CategoryPages";

export default function StagePage({ darkMode, setDarkMode }) {
  return (
    <CategoryPage
      category="stage"
      title="Stage"
      
      darkMode={darkMode}          // ✅ ADD THIS
      setDarkMode={setDarkMode}    // ✅ ADD THIS
    />
  );
}