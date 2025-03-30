import React, { useState } from "react";

function ByIngredients() {
    const [ingredients, setIngredients] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Ingredients entered:", ingredients);
    };

    return (
        <div className="input-form">
            <h2>Search Recipes by Ingredients</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter Ingredients (comma-separated):
                    <input
                        type="text"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="e.g., tomatoes, basil, garlic"
                    />
                </label>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

export default ByIngredients;
