import React, { useState } from "react";

function ByCuisine() {
    const [cuisine, setCuisine] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Cuisine selected:", cuisine);
    };

    return (
        <div className="input-form">
            <h2>Search Recipes by Cuisine</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Select a Cuisine:
                    <select
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="Italian">Italian</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Indian">Indian</option>
                        <option value="Chinese">Chinese</option>
                    </select>
                </label>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

export default ByCuisine;
