// Shared state — all other files read and write these variables

let total = 1;

const meals = { default: 0, dairy: 0, veg: 0, vegan: 0 };

const mealNames = {
  default: 'Default',
  dairy: 'Dairy-Free',
  veg: 'Vegetarian',
  vegan: 'Vegan'
};

const mealIcons = {
  default: '🍽️',
  dairy: '🥛',
  veg: '🥗',
  vegan: '🌱'
};
