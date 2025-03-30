import React, { useState } from "react";

function ByImage() {
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Image uploaded:", image);
        // Add logic to process the uploaded image
    };

    return (
        <div className="input-form">
            <h2>Search Recipes by Image</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Upload an Image:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </label>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

export default ByImage;
