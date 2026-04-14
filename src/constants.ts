import { Meal, Workout, Challenge, Gym, ChatMessage } from "./types";

export const MOCK_GYMS: Gym[] = [
  {
    id: "g1",
    name: "Bodyline Fitness & Gym",
    address: "6 Bwari St, Garki, Abuja",
    area: "Garki",
    phone: "+234 803 123 4567",
    hours: "6:00 AM - 9:00 PM",
    description: "A premium fitness center with modern equipment and expert trainers.",
    lat: 9.043,
    lng: 7.489,
    tags: ["Popular", "Abuja", "Premium"]
  },
  {
    id: "g2",
    name: "Curves Abuja",
    address: "Wuse 2, Abuja",
    area: "Wuse 2",
    phone: "+234 805 987 6543",
    hours: "7:00 AM - 8:00 PM",
    description: "Women-only fitness center focusing on 30-minute full-body workouts.",
    lat: 9.076,
    lng: 7.472,
    tags: ["Women-friendly", "Abuja", "Specialized"]
  },
  {
    id: "g3",
    name: "The Gym Abuja",
    address: "Maitama, Abuja",
    area: "Maitama",
    phone: "+234 909 111 2222",
    hours: "24 Hours",
    description: "Affordable and accessible gym with a wide range of equipment.",
    lat: 9.088,
    lng: 7.501,
    tags: ["Affordable", "Abuja", "24/7"]
  },
  {
    id: "g4",
    name: "Lagos Fitness Hub",
    address: "Lekki Phase 1, Lagos",
    area: "Lekki",
    phone: "+234 802 333 4444",
    hours: "6:00 AM - 10:00 PM",
    description: "Top-tier gym in the heart of Lekki with a great community vibe.",
    lat: 6.448,
    lng: 3.473,
    tags: ["Popular", "Lagos", "Community"]
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "ch1",
    userId: "u1",
    userName: "Sarah J.",
    content: "Just finished my morning walk! Feeling so energized. How is everyone else doing today?",
    timestamp: Date.now() - 3600000,
    reactions: { "❤️": 5, "💪": 3 }
  },
  {
    id: "ch2",
    userId: "u2",
    userName: "Mike D.",
    content: "Struggling a bit with my meal plan today, but I'm staying committed!",
    timestamp: Date.now() - 7200000,
    reactions: { "🙌": 4, "🥗": 2 }
  },
  {
    id: "ch3",
    userId: "u3",
    userName: "Emma W.",
    content: "Does anyone have tips for staying hydrated during long workouts?",
    timestamp: Date.now() - 10800000,
    reactions: { "💧": 6, "🤔": 1 },
    replies: [
      {
        id: "ch3-r1",
        userId: "u4",
        userName: "Coach Dave",
        content: "Try drinking small sips every 15 minutes instead of gulping all at once!",
        timestamp: Date.now() - 9000000,
        reactions: { "👍": 3 }
      }
    ]
  }
];

export const MOCK_MEALS: Meal[] = [
  {
    id: "m1",
    name: "Oatmeal with Berries",
    calories: 320,
    ingredients: ["Oats", "Blueberries", "Honey", "Almond Milk"],
    instructions: "Cook oats with milk, top with berries and honey.",
    tags: ["Quick", "Low Sugar", "Vegetarian"],
    type: "breakfast"
  },
  {
    id: "m2",
    name: "Grilled Chicken Salad",
    calories: 450,
    ingredients: ["Chicken Breast", "Mixed Greens", "Cucumber", "Olive Oil"],
    instructions: "Grill chicken, toss with greens and dressing.",
    tags: ["High Protein", "Low Carb"],
    type: "lunch"
  },
  {
    id: "m3",
    name: "Baked Salmon with Quinoa",
    calories: 550,
    ingredients: ["Salmon", "Quinoa", "Asparagus", "Lemon"],
    instructions: "Bake salmon at 200°C for 15 mins. Serve with quinoa.",
    tags: ["High Protein", "Healthy Fats"],
    type: "dinner"
  },
  {
    id: "m4",
    name: "Greek Yogurt with Nuts",
    calories: 200,
    ingredients: ["Greek Yogurt", "Walnuts", "Cinnamon"],
    instructions: "Mix yogurt with walnuts and a pinch of cinnamon.",
    tags: ["Quick", "High Protein"],
    type: "snack"
  }
];

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "w1",
    title: "Morning Stretch",
    duration: 15,
    difficulty: "beginner",
    caloriesBurned: 50,
    instructions: [
      "Neck rolls: Slowly rotate your head in a circular motion for 30 seconds.",
      "Shoulder stretches: Pull one arm across your chest and hold for 20 seconds each side.",
      "Forward fold: Reach for your toes while keeping your knees slightly bent.",
      "Cat-cow: On all fours, alternate between arching and rounding your back."
    ],
    type: "stretching",
    image: "https://picsum.photos/seed/stretch/800/600"
  },
  {
    id: "w2",
    title: "Brisk Walk",
    duration: 30,
    difficulty: "beginner",
    caloriesBurned: 150,
    instructions: [
      "Maintain a steady pace: Walk fast enough that your heart rate increases.",
      "Keep back straight: Look forward, not at your feet.",
      "Swing arms: Let your arms move naturally to help with momentum.",
      "Breathe deeply: Inhale through your nose and exhale through your mouth."
    ],
    type: "walking",
    image: "https://picsum.photos/seed/walk/800/600"
  },
  {
    id: "w3",
    title: "Full Body HIIT",
    duration: 20,
    difficulty: "intermediate",
    caloriesBurned: 250,
    instructions: [
      "Jumping jacks: 45 seconds of continuous motion, then 15 seconds rest.",
      "Pushups: Keep your core tight and lower your chest to the floor.",
      "Squats: Sit back as if into a chair, keeping your weight on your heels.",
      "Plank: Hold a straight line from head to heels for 30-60 seconds."
    ],
    type: "home",
    image: "https://picsum.photos/seed/hiit/800/600"
  },
  {
    id: "w4",
    title: "Core Strength",
    duration: 15,
    difficulty: "intermediate",
    caloriesBurned: 120,
    instructions: [
      "Crunches: Lift your shoulders off the floor using your abs.",
      "Leg raises: Slowly lower your legs without letting your lower back arch.",
      "Russian twists: Rotate your torso from side to side while sitting.",
      "Mountain climbers: Bring your knees to your chest in a plank position."
    ],
    type: "home",
    image: "https://picsum.photos/seed/core/800/600"
  },
  {
    id: "w5",
    title: "Advanced Cardio",
    duration: 45,
    difficulty: "advanced",
    caloriesBurned: 500,
    instructions: [
      "Burpees: From standing, drop to plank, do a pushup, and jump back up.",
      "High knees: Run in place, bringing your knees as high as possible.",
      "Mountain climbers: Fast-paced knee drives in a plank position.",
      "Sprints: 30 seconds of maximum effort followed by 30 seconds rest."
    ],
    type: "gym",
    image: "https://picsum.photos/seed/cardio/800/600"
  }
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Water Warrior",
    description: "Drink 8 glasses of water daily for 7 days.",
    participants: 1240,
    points: 100,
    icon: "Droplets"
  },
  {
    id: "c2",
    title: "Step Master",
    description: "Reach 10,000 steps daily for a week.",
    participants: 850,
    points: 200,
    icon: "Footprints"
  },
  {
    id: "c3",
    title: "Green Eater",
    description: "Have a vegetarian meal every day for 5 days.",
    participants: 560,
    points: 150,
    icon: "Leaf"
  }
];

export const OBESITY_FACTS = [
  "Obesity is a complex health condition, not a personal failure.",
  "Small, consistent changes in lifestyle lead to long-term success.",
  "Hydration plays a key role in metabolic health and appetite regulation.",
  "Quality sleep is essential for hormone balance and weight management.",
  "Physical activity improves mood and energy levels, regardless of weight.",
  "Focusing on nutrient-dense foods supports overall wellness.",
  "Healthy habits are more important than the number on the scale.",
  "Community support can significantly improve consistency and motivation.",
  "Mindful eating helps you recognize true hunger and fullness cues.",
  "Every step counts towards a more active and healthy lifestyle."
];
