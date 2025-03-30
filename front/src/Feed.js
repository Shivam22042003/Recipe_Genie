import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Feed.css";

const dishes = [
  {
    name: "Paneer Tikka",
    type: "veg",
    category: "Indian",
    image: require("./images/img1.jpg"),
    ingredients: ["Paneer", "Yogurt", "Red Chili Powder", "Garam Masala", "Onion", "Lemon Juice", "Salt", "Butter"],
  },
  {
    name: "Chicken Biryani",
    type: "non-veg",
    category: "Indian",
    image: require("./images/img2.jpg"),
    ingredients: ["Basmati Rice", "Chicken", "Yogurt", "Spices", "Saffron", "Onion", "Ghee", "Mint Leaves", "Salt"],
  },
  {
    name: "Palak Paneer",
    type: "veg",
    category: "Indian",
    image: require("./images/img3.jpg"),
    ingredients: ["Spinach", "Paneer", "Garlic", "Ginger", "Onion", "Tomato", "Garam Masala", "Cream", "Salt"]
  },
  {
    name: "Chole Bhature",
    type: "veg",
    category: "Indian",
    image: require("./images/img4.jpg"),
    ingredients: ["Chickpeas", "Onion", "Tomato", "Ginger", "Garlic", "Garam Masala", "Ajwain", "Flour", "Salt"]
  },
  
  {
    name: "Paneer Butter Masala",
    type: "veg",
    category: "Indian",
    image: require("./images/img5.jpg"),
    ingredients: ["Paneer", "Butter", "Tomato", "Cream", "Cashew", "Garam Masala", "Red Chili Powder", "Salt"]
  },
  
  {
    name: "Mutton Rogan Josh",
    type: "non-veg",
    category: "Indian",
    image: require("./images/img6.jpg"),
    ingredients: ["Mutton", "Yogurt", "Ginger", "Garlic", "Onion", "Kashmiri Chili", "Garam Masala", "Mustard Oil", "Salt"]
  },

];

const Feed = () => {
  const navigate = useNavigate();
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const fetchRecipe = async (dishName) => {
    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient.");
      return;
    }

    const prompt = `Provide a detailed recipe for ${dishName} using only these ingredients: ${selectedIngredients.join(", ")}. Clearly include Servings, Prep Time, Cook Time, Ingredients, step-by-step Instructions, and no extra ingredients.`;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data && data.candidates && data.candidates.length > 0) {
        const generatedContent = data.candidates[0].content.parts[0].text;
        navigate("/recipe-details", { state: { recipe: generatedContent, dishName } });
      } else {
        setErrorMessage("No recipe found. Try different ingredients.");
      }
    } catch (error) {
      setErrorMessage("Error fetching recipe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDishes = dishes.filter(
    (dish) =>
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "all" || dish.type === filterType)
  );

  return (
    <div className="feed-container">
      <div className="filters">
        <input
          type="text"
          className="search-bar"
          placeholder="Search dish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="filter-dropdown" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All</option>
          <option value="veg">Vegetarian</option>
          <option value="non-veg">Non-Vegetarian</option>
        </select>
      </div>

      <div className="card-container">
        {filteredDishes.map((dish, index) => (
          <div className="card" key={index}>
            <img src={dish.image} alt={dish.name} className="dish-image" />
            <h2>{dish.name}</h2>
            <p>Type: {dish.type === "veg" ? "Vegetarian" : "Non-Vegetarian"}</p>
            <p>Category: {dish.category}</p>

            <div className="ingredients">
              <h4>Select Ingredients:</h4>
              <div className="ingredient-list">
                {dish.ingredients.map((ingredient, i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(ingredient)}
                      onChange={() => toggleIngredient(ingredient)}
                    />
                    {ingredient}
                  </label>
                ))}
              </div>
            </div>

            <button className="use-ingredients" onClick={() => fetchRecipe(dish.name)}>
              Use Selected Ingredients
            </button>
          </div>
        ))}
      </div>

      {loading && <p className="loading-text">Fetching recipe...</p>}
      {errorMessage && <p className="error-text">{errorMessage}</p>}
    </div>
  );
};

export default Feed;
