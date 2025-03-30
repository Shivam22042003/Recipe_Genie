import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [activeOption, setActiveOption] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (activeOption === "ingredients") {
        await handleIngredientsSearch(inputValue);
      } else if (activeOption === "image") {
        await handleImageSearch(imageFile);
      } else if (activeOption === "cuisine") {
        await handleCuisineSearch(inputValue);
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientsSearch = async (ingredients) => {
    await sendRecipeRequest(`Provide a detailed recipe using only these ingredients: ${ingredients}`, ingredients);
  };

  const handleCuisineSearch = async (cuisine) => {
    await sendRecipeRequest(`Provide a traditional ${cuisine} cuisine recipe.`, cuisine);
  };

  const handleImageSearch = async (file) => {
    if (!file) {
      setErrorMessage("Please upload an image.");
      return;
    }

    const base64Image = await convertToBase64(file);
    await sendRecipeRequest("Describe this image and generate a matching recipe.", "Recipe from Image", base64Image);
  };

  const sendRecipeRequest = async (prompt, dishName, imageContent = null) => {
    try {
      const requestBody = { prompt };
      if (imageContent) {
        requestBody.image = imageContent;
      }

      const response = await fetch("http://localhost:5000/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Error Response:", errorDetails);
        throw new Error(`Failed to fetch recipe. Status: ${response.status}`);
      }

      const data = await response.json();
      const generatedContent =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No recipe generated.";

      navigate("/recipe-details", {
        state: { recipe: generatedContent, dishName },
      });
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const renderInputField = () => {
    if (activeOption === "ingredients" || activeOption === "cuisine") {
      return (
        <form className="input-form" onSubmit={handleSubmit}>
          <label>
            {activeOption === "ingredients"
              ? "Enter Ingredients (comma-separated):"
              : "Enter Cuisine:"}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                activeOption === "ingredients"
                  ? "e.g., tomatoes, basil, garlic"
                  : "e.g., Italian"
              }
              required
            />
          </label>
          <button type="submit">Search</button>
        </form>
      );
    } else if (activeOption === "image") {
      return (
        <form className="input-form" onSubmit={handleSubmit}>
          <label>
            Upload an Image:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              required
            />
          </label>
          <button type="submit">Search</button>
        </form>
      );
    }
    return null;
  };

  return (
    <div className="home">
      {loading && (
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      <h1>YOUR INGREDIENTS, OUR RECIPES!</h1>
      <p>How do you want to search?</p>
      <div className="buttons">
        <button
          className={`button ${activeOption === "ingredients" ? "active" : ""}`}
          onClick={() => setActiveOption("ingredients")}
        >
          By Ingredients
        </button>
        <button
          className={`button ${activeOption === "image" ? "active" : ""}`}
          onClick={() => setActiveOption("image")}
        >
          By Image
        </button>
        <button
          className={`button ${activeOption === "cuisine" ? "active" : ""}`}
          onClick={() => setActiveOption("cuisine")}
        >
          By Cuisine
        </button>
      </div>
      {renderInputField()}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Home;
