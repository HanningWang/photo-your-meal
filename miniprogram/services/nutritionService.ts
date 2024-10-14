export function getNutrients() {
  return [
    { name: "碳水化合物", current: 150, goal: 250, icon_url: '../../images/rice.svg' },
    { name: "蛋白质", current: 100, goal: 150, icon_url: '../../images/meat.svg' },
    { name: "脂肪", current: 50, goal: 70, icon_url: '../../images/avocado.svg' },
  ];
}

export function getMeals() {
  return [
    {
      name: "早餐",
      calories: 400,
      carbs: 50,
      protein: 20,
      fat: 15,
      imageUrl: "../../images/breakfast1.jpg",
      dishes: ["全麦面包", "煎蛋", "牛奶", "橙子"],
    },
    // Add more meals as needed
  ];
}