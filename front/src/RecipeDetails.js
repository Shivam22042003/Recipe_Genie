import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RecipeDetails.css";

const RecipeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe, dishName } = location.state || {};
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    if (!dishName) return;

    const fetchImage = async () => {
      setLoadingImage(true);
      try {
        // Placeholder image used for now
        setImageUrl(`https://via.placeholder.com/1000x400?text=${encodeURIComponent(dishName)}+Image`);
      } catch (error) {
        console.error("Error setting image:", error);
      } finally {
        setLoadingImage(false);
      }
    };

    fetchImage();
  }, [dishName]);

  if (!recipe || !dishName) {
    return (
      <div className="recipe-details">
        <h2>Recipe details unavailable.</h2>
        <button className="recipe-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // Utility to clean a line (removes markdown like **, *, etc.)
  const cleanText = (text) => text.replace(/\*\*/g, "").replace(/\*/g, "").trim();

  const lines = recipe.split("\n").map(line => cleanText(line)).filter(line => line);

  const extract = (label) => {
    const regex = new RegExp(`${label}\\s*:\\s*(.+)`, "i");
    const line = lines.find(l => regex.test(l));
    return line ? line.split(":").slice(1).join(":").trim() : "Not specified";
  };

  const findSection = (section) =>
    lines.findIndex((line) => line.toLowerCase().includes(section));

  const ingredientsStart = findSection("ingredients");
  const instructionsStart = findSection("instructions");

  const ingredients =
    ingredientsStart >= 0 && instructionsStart > ingredientsStart
      ? lines.slice(ingredientsStart + 1, instructionsStart)
      : ["Ingredients not provided."];

  const instructions =
    instructionsStart >= 0
      ? lines.slice(instructionsStart + 1)
      : ["Instructions not provided."];

  return (
    <div className="recipe-details">
      <button className="recipe-button" onClick={() => navigate(-1)}>
        ← Go Back
      </button>

      {/* Image Banner */}
      <div className="recipe-header">
        {loadingImage ? (
          <div className="header-overlay"><p>Loading Image...</p></div>
        ) : (
          <>
            <img src={imageUrl} alt={dishName} className="recipe-image" />
            <div className="header-overlay">
              <h1>{dishName}</h1>
              <p className="description">Enjoy this delicious, customized recipe!</p>
            </div>
          </>
        )}
      </div>

      {/* Info Cards */}
      <div className="recipe-info">
        <div className="info-card">
          <h3>🍽️ Servings</h3>
          <p>{extract("servings")}</p>
        </div>
        <div className="info-card">
          <h3>⏳ Prep Time</h3>
          <p>{extract("prep time")}</p>
        </div>
        <div className="info-card">
          <h3>🍳 Cook Time</h3>
          <p>{extract("cook time")}</p>
        </div>
      </div>

      {/* Ingredients */}
      <div className="recipe-section">
        <h2>🛒 Ingredients</h2>
        <ul>
          {ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="recipe-section">
        <h2>👨‍🍳 Instructions</h2>
        <ol>
          {instructions.map((step, idx) => (
            <li key={idx}>{step.replace(/^\d+\.\s*/, "")}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDetails;
