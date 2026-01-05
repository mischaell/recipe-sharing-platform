"use client";

const cuisines = ["Italian", "Mexican", "Asian", "American", "Mediterranean"];
const diets = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"];
const difficulties = ["Easy", "Medium", "Hard"];

export default function FilterBar() {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700">Cuisine:</span>
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700"
          >
            {cuisine}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700">Diet:</span>
        {diets.map((diet) => (
          <button
            key={diet}
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700"
          >
            {diet}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700">Difficulty:</span>
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700"
          >
            {difficulty}
          </button>
        ))}
      </div>
    </div>
  );
}






