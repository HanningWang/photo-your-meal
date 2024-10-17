export function getInitialNutrients() {
  return [
    { name: "碳水化合物", current: 0, goal: 200, icon_url: '../../images/rice.svg' },
    { name: "蛋白质", current: 0, goal: 100, icon_url: '../../images/meat.svg' },
    { name: "脂肪", current: 0, goal: 50, icon_url: '../../images/avocado.svg' },
  ];
}

export function getNutrients(data: any) {
  return [
    { name: "碳水化合物", current: data.foodCarb, goal: data.carbGoal, icon_url: '../../images/rice.svg' },
    { name: "蛋白质", current: data.foodProtein, goal: data.proteinGoal, icon_url: '../../images/meat.svg' },
    { name: "脂肪", current: data.foodFat, goal: data.fatGoal, icon_url: '../../images/avocado.svg' },
  ];
}

export function getMockMeals() {
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