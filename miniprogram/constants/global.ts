export const endpoint = 'http://39.105.187.228'

// Add these exports to the existing global.ts file

export const calorieGoal = 2000
export const caloriesConsumed = 2800

export const macros = {
  carbs: { consumed: 150, goal: 250 },
  protein: { consumed: 100, goal: 150 },
  fat: { consumed: 50, goal: 70 }
}

export const meals = [
  {
    type: "Breakfast",
    image: "../images/breakfast1.jpg",
    calories: 400,
    carbs: 50,
    protein: 20,
    fat: 15,
    ingredients: [
      { name: "Oatmeal", weight: "50g" },
      { name: "Banana", weight: "100g" },
      { name: "Almonds", weight: "25g" }
    ]
  },
  {
    type: "Lunch",
    image: "/images/placeholder.png",
    calories: 600,
    carbs: 60,
    protein: 40,
    fat: 20,
    ingredients: [
      { name: "Chicken Breast", weight: "150g" },
      { name: "Brown Rice", weight: "100g" },
      { name: "Mixed Vegetables", weight: "100g" }
    ]
  },
]