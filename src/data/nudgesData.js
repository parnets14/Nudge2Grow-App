/**
 * Nudges Data - Organized by Subject → Chapter → Topics
 * Add new nudges here and they will automatically appear in the app
 */

// ============================================
// SUBJECT: Environmental Studies
// ============================================

// Chapter: Water Conservation
const waterConservationNudges = [
  {
    id: 'env_water_001',
    subject: 'Science / EVS',
    chapter: 'Water Conservation',
    topic: 'Rainwater Harvesting',
    title: 'Nature Detective Walk',
    icon: 'leaf',
    iconColor: '#27AE60',
    shortDescription: 'Learn about nature and water through fun outdoor walks!',
    duration: '20 min',
    ageGroup: 'Ages 6-10',
    whatYouWillLearn: 'Your child will learn about colors in nature, how rainwater helps plants grow, and simple ways to save water at home.',
    whatYouNeed: [
      'Notebook and pencil',
      'Colored crayons',
      'Water bottle',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Colors in Nature',
        activity: 'Go for a walk and count different colors you see. How many shades of green can you find?',
        question: 'Ask: "What color do you see the most in nature?"',
      },
      {
        day: 'Day 2',
        topic: 'Where Does Rain Go?',
        activity: 'After rain, look for puddles. Watch where water flows. Point out drains and wet soil.',
        question: 'Ask: "Where does the rainwater go after it falls?"',
      },
      {
        day: 'Day 3',
        topic: 'Plants Need Water',
        activity: 'Water a plant together. Talk about how plants drink water through their roots.',
        question: 'Ask: "What happens if plants don\'t get water?"',
      },
      {
        day: 'Day 4',
        topic: 'Saving Rainwater',
        activity: 'Show how to collect rainwater in a bucket. Explain we can use it for plants.',
        question: 'Ask: "How can we save water at home?"',
      },
      {
        day: 'Day 5',
        topic: 'Nature Journal',
        activity: 'Draw pictures of what you learned. Color the plants, rain, and water drops.',
        question: 'Ask: "What was your favorite thing you learned?"',
      },
    ],
    quickTips: [
      'Make it fun - splash in puddles!',
      'Let your child lead and explore',
      'Take photos to remember',
    ],
  },
  {
    id: 'env_water_002',
    subject: 'Science / EVS',
    chapter: 'Water Conservation',
    topic: 'Water Cycle',
    title: 'Journey of a Water Drop',
    icon: 'water',
    iconColor: '#2196F3',
    shortDescription: 'Follow a water drop\'s amazing journey from cloud to ocean!',
    duration: '18 min',
    ageGroup: 'Ages 6-10',
    whatYouWillLearn: 'Your child will understand evaporation, condensation, precipitation, and how water travels in nature.',
    whatYouNeed: [
      'Glass of water',
      'Ice cubes',
      'Drawing paper',
      'Blue crayons',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Water Everywhere',
        activity: 'Look for water around your home - tap, plants, clouds. Talk about where water comes from.',
        question: 'Ask: "Where does water live?"',
      },
      {
        day: 'Day 2',
        topic: 'Sun Makes Water Fly',
        activity: 'Put water in sun. Check after few hours. Explain sun makes water go up to sky (evaporation).',
        question: 'Ask: "Where did the water go?"',
      },
      {
        day: 'Day 3',
        topic: 'Clouds Are Water',
        activity: 'Watch clouds. Explain clouds are tiny water drops floating. When heavy, they fall as rain.',
        question: 'Ask: "What are clouds made of?"',
      },
      {
        day: 'Day 4',
        topic: 'Rain Comes Down',
        activity: 'If it rains, watch together. If not, use shower to show how rain falls from clouds.',
        question: 'Ask: "Why does rain fall down?"',
      },
      {
        day: 'Day 5',
        topic: 'Draw Water\'s Journey',
        activity: 'Draw the water cycle: sun, water going up, clouds, rain falling, rivers, ocean.',
        question: 'Ask: "Can you tell me the water drop\'s story?"',
      },
    ],
    quickTips: [
      'Use simple words like "water goes up" instead of evaporation',
      'Make it a story about a water drop character',
      'Do the ice cube experiment - watch it melt and evaporate',
    ],
  },
  {
    id: 'env_water_003',
    subject: 'Science / EVS',
    chapter: 'Water Conservation',
    topic: 'Saving Water at Home',
    title: 'Water Saving Heroes',
    icon: 'water-pump',
    iconColor: '#00BCD4',
    shortDescription: 'Become a water-saving superhero! Learn simple ways to save water every day.',
    duration: '15 min',
    ageGroup: 'Ages 5-9',
    whatYouWillLearn: 'Your child will learn practical ways to save water at home and understand why water conservation is important.',
    whatYouNeed: [
      'Bucket',
      'Timer or clock',
      'Stickers for tracking',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Turn Off the Tap',
        activity: 'Practice turning off tap while brushing teeth. Count how much water we save!',
        question: 'Ask: "How long should we brush our teeth?"',
      },
      {
        day: 'Day 2',
        topic: 'Quick Showers',
        activity: 'Time your shower. Try to make it shorter. Sing a 5-minute song!',
        question: 'Ask: "Can we finish before the song ends?"',
      },
      {
        day: 'Day 3',
        topic: 'Reuse Water',
        activity: 'Collect water from washing vegetables. Use it to water plants.',
        question: 'Ask: "What else can we do with used water?"',
      },
      {
        day: 'Day 4',
        topic: 'Fix the Drips',
        activity: 'Look for leaky taps. Put a bucket under drips. See how much water drips in an hour.',
        question: 'Ask: "Why should we fix leaky taps?"',
      },
      {
        day: 'Day 5',
        topic: 'Water Saving Chart',
        activity: 'Make a chart. Put a sticker each time you save water. Celebrate your success!',
        question: 'Ask: "How many times did you save water today?"',
      },
    ],
    quickTips: [
      'Make it a game with rewards',
      'Lead by example',
      'Celebrate small wins',
    ],
  },
];

// Chapter: Plants & Trees
const plantsTreesNudges = [
  {
    id: 'env_plants_001',
    subject: 'Science / EVS',
    chapter: 'Plants & Trees',
    topic: 'Parts of a Plant',
    title: 'Plant Detective',
    icon: 'flower',
    iconColor: '#FF6B9D',
    shortDescription: 'Discover the amazing parts of plants and what each part does!',
    duration: '20 min',
    ageGroup: 'Ages 5-9',
    whatYouWillLearn: 'Your child will learn about roots, stem, leaves, flowers, and fruits - and what job each part does.',
    whatYouNeed: [
      'A small plant or flower',
      'Magnifying glass (optional)',
      'Drawing paper',
      'Colored pencils',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Roots - The Anchor',
        activity: 'Look at plant roots. Explain they hold the plant in soil and drink water.',
        question: 'Ask: "What happens if a plant has no roots?"',
      },
      {
        day: 'Day 2',
        topic: 'Stem - The Highway',
        activity: 'Touch the stem. Explain it carries water from roots to leaves like a straw.',
        question: 'Ask: "How does water go up to the leaves?"',
      },
      {
        day: 'Day 3',
        topic: 'Leaves - The Food Makers',
        activity: 'Collect different shaped leaves. Explain leaves make food using sunlight.',
        question: 'Ask: "Why are leaves green?"',
      },
      {
        day: 'Day 4',
        topic: 'Flowers - The Pretty Ones',
        activity: 'Look at flowers. Explain they help make seeds and fruits. Smell them!',
        question: 'Ask: "Why do flowers smell nice?"',
      },
      {
        day: 'Day 5',
        topic: 'Draw Your Plant',
        activity: 'Draw a plant with all its parts. Label: roots, stem, leaves, flower.',
        question: 'Ask: "Which part is your favorite?"',
      },
    ],
    quickTips: [
      'Use real plants for hands-on learning',
      'Go on a nature walk to find different plants',
      'Make it colorful and fun',
    ],
  },
  {
    id: 'env_plants_002',
    subject: 'Science / EVS',
    chapter: 'Plants & Trees',
    topic: 'Growing a Plant',
    title: 'Little Gardener',
    icon: 'sprout',
    iconColor: '#8BC34A',
    shortDescription: 'Grow your own plant from a seed and watch the magic happen!',
    duration: '10 min daily',
    ageGroup: 'Ages 4-8',
    whatYouWillLearn: 'Your child will learn how seeds grow into plants and what plants need to stay healthy.',
    whatYouNeed: [
      'Seeds (beans work great)',
      'Small pot or cup',
      'Soil',
      'Water',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Plant the Seed',
        activity: 'Fill pot with soil. Plant seed. Water gently. Put in sunny spot.',
        question: 'Ask: "What do you think will happen?"',
      },
      {
        day: 'Day 2',
        topic: 'Water and Wait',
        activity: 'Check the pot. Water if soil is dry. Be patient - seeds take time!',
        question: 'Ask: "Do you see anything yet?"',
      },
      {
        day: 'Day 3',
        topic: 'First Sprout!',
        activity: 'Look for tiny green sprout. Celebrate! Take a photo. Water gently.',
        question: 'Ask: "What color is the baby plant?"',
      },
      {
        day: 'Day 4',
        topic: 'Growing Bigger',
        activity: 'Measure how tall your plant is. Draw it. Water and give it sunlight.',
        question: 'Ask: "Is it taller than yesterday?"',
      },
      {
        day: 'Day 5',
        topic: 'Plant Care',
        activity: 'Talk about what plants need: water, sunlight, air, love! Make a care schedule.',
        question: 'Ask: "What does your plant need to be happy?"',
      },
    ],
    quickTips: [
      'Bean seeds sprout quickly (3-5 days)',
      'Keep soil moist but not too wet',
      'Make it their special responsibility',
    ],
  },
];

// ============================================
// SUBJECT: Mathematics
// ============================================

// Chapter: Money & Numbers
const moneyAndNumbersNudges = [
  {
    id: 'math_money_001',
    subject: 'Math',
    chapter: 'Money & Numbers',
    topic: 'Counting Money',
    title: 'Money Counting Game',
    icon: 'cash-multiple',
    iconColor: '#27AE60',
    shortDescription: 'Let\'s count our coins together! Learn about money, saving, and making smart choices.',
    duration: '15 min',
    ageGroup: 'Ages 5-10',
    whatYouWillLearn: 'Your child will learn to recognize coins, count money, understand saving, and know the difference between needs and wants.',
    whatYouNeed: [
      'Coins (₹1, ₹2, ₹5, ₹10)',
      'Piggy bank or jar',
      'Small toys or snacks to "buy"',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Know Your Coins',
        activity: 'Show each coin. Let your child hold them. Talk about what each coin is worth.',
        question: 'Ask: "Which coin is worth the most?"',
      },
      {
        day: 'Day 2',
        topic: 'Counting Money',
        activity: 'Count coins together. Start with same coins: five ₹1 coins = ₹5.',
        question: 'Ask: "How many ₹2 coins make ₹10?"',
      },
      {
        day: 'Day 3',
        topic: 'Play Shop',
        activity: 'Set up a pretend shop. Price items (₹5, ₹10). Let your child "buy" things.',
        question: 'Ask: "Do you have enough money to buy this?"',
      },
      {
        day: 'Day 4',
        topic: 'Needs vs Wants',
        activity: 'Talk about things we need (food, clothes) and things we want (toys, candy).',
        question: 'Ask: "Is this something we need or want?"',
      },
      {
        day: 'Day 5',
        topic: 'Start Saving',
        activity: 'Put coins in piggy bank. Set a goal (buy a book, toy). Count savings together.',
        question: 'Ask: "What do you want to save money for?"',
      },
    ],
    quickTips: [
      'Use real coins when possible',
      'Make shopping fun and educational',
      'Praise good money decisions',
    ],
  },
  {
    id: 'math_money_002',
    subject: 'Math',
    chapter: 'Money & Numbers',
    topic: 'Simple Addition',
    title: 'Adding Fun',
    icon: 'plus-circle',
    iconColor: '#27AE60',
    shortDescription: 'Make math fun! Learn to add numbers using toys, snacks, and games.',
    duration: '15 min',
    ageGroup: 'Ages 4-7',
    whatYouWillLearn: 'Your child will understand addition as putting things together and practice adding small numbers.',
    whatYouNeed: [
      'Small toys or blocks',
      'Snacks (grapes, crackers)',
      'Paper and crayons',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Counting Together',
        activity: 'Count toys together. "I have 2 cars, you have 3 cars. How many cars do we have together?"',
        question: 'Ask: "Can you count all the toys?"',
      },
      {
        day: 'Day 2',
        topic: 'Adding with Fingers',
        activity: 'Use fingers to add. Show 2 fingers + 3 fingers = 5 fingers. Practice with different numbers.',
        question: 'Ask: "How many fingers are we holding up?"',
      },
      {
        day: 'Day 3',
        topic: 'Snack Math',
        activity: 'Use snacks to add. "You have 3 grapes, I give you 2 more. How many now?"',
        question: 'Ask: "Do you have more grapes now?"',
      },
      {
        day: 'Day 4',
        topic: 'Drawing Addition',
        activity: 'Draw 2 apples, then draw 3 more. Count all apples. Write: 2 + 3 = 5',
        question: 'Ask: "Can you draw your own addition?"',
      },
      {
        day: 'Day 5',
        topic: 'Addition Stories',
        activity: 'Make up stories: "2 birds on tree, 1 more comes. How many birds?" Act it out!',
        question: 'Ask: "Can you make up an addition story?"',
      },
    ],
    quickTips: [
      'Keep numbers small (under 10)',
      'Use real objects they can touch',
      'Make it playful, not like homework',
    ],
  },
];

// Chapter: Shapes & Patterns
const shapesPatternsNudges = [
  {
    id: 'math_shapes_001',
    subject: 'Math',
    chapter: 'Shapes & Patterns',
    topic: 'Basic Shapes',
    title: 'Shape Hunt Adventure',
    icon: 'shape',
    iconColor: '#27AE60',
    shortDescription: 'Go on a shape hunt! Find circles, squares, triangles, and rectangles all around you.',
    duration: '20 min',
    ageGroup: 'Ages 3-7',
    whatYouWillLearn: 'Your child will learn to recognize and name basic shapes, and find them in everyday objects.',
    whatYouNeed: [
      'Paper and crayons',
      'Shape stickers (optional)',
      'Camera or phone',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Circle Hunt',
        activity: 'Find circles around home: clock, plate, wheel. Draw circles. Count how many you found!',
        question: 'Ask: "What shape is a ball?"',
      },
      {
        day: 'Day 2',
        topic: 'Square Search',
        activity: 'Look for squares: window, book, tile. Trace a square with your finger.',
        question: 'Ask: "How many corners does a square have?"',
      },
      {
        day: 'Day 3',
        topic: 'Triangle Time',
        activity: 'Find triangles: pizza slice, roof, hanger. Make a triangle with your fingers.',
        question: 'Ask: "Can you make a triangle shape?"',
      },
      {
        day: 'Day 4',
        topic: 'Rectangle Race',
        activity: 'Spot rectangles: door, phone, book. Compare with square - what\'s different?',
        question: 'Ask: "Is a door a square or rectangle?"',
      },
      {
        day: 'Day 5',
        topic: 'Shape Collage',
        activity: 'Draw or cut out all 4 shapes. Make a picture using shapes (house, car, robot).',
        question: 'Ask: "Which shape is your favorite?"',
      },
    ],
    quickTips: [
      'Take photos of shapes you find',
      'Make it a game with points',
      'Celebrate each discovery',
    ],
  },
  {
    id: 'math_shapes_002',
    subject: 'Math',
    chapter: 'Shapes & Patterns',
    topic: 'Patterns',
    title: 'Pattern Detective',
    icon: 'dots-horizontal',
    iconColor: '#27AE60',
    shortDescription: 'Discover patterns everywhere! Learn to spot, create, and continue patterns.',
    duration: '15 min',
    ageGroup: 'Ages 4-8',
    whatYouWillLearn: 'Your child will learn to recognize patterns, predict what comes next, and create their own patterns.',
    whatYouNeed: [
      'Colored blocks or toys',
      'Crayons or markers',
      'Stickers',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'What is a Pattern?',
        activity: 'Make simple pattern: red block, blue block, red block, blue block. "What comes next?"',
        question: 'Ask: "Can you see the pattern?"',
      },
      {
        day: 'Day 2',
        topic: 'Color Patterns',
        activity: 'Draw pattern: red circle, yellow circle, red circle, yellow circle. Continue the pattern.',
        question: 'Ask: "What color comes after red?"',
      },
      {
        day: 'Day 3',
        topic: 'Shape Patterns',
        activity: 'Make pattern with shapes: circle, square, circle, square. Let them continue it.',
        question: 'Ask: "Which shape is next?"',
      },
      {
        day: 'Day 4',
        topic: 'Sound Patterns',
        activity: 'Clap a pattern: clap-clap-stomp, clap-clap-stomp. They repeat and continue it.',
        question: 'Ask: "Can you make a sound pattern?"',
      },
      {
        day: 'Day 5',
        topic: 'Create Your Pattern',
        activity: 'Let them create their own pattern using toys, stickers, or drawings. You guess the pattern!',
        question: 'Ask: "Can you teach me your pattern?"',
      },
    ],
    quickTips: [
      'Start with simple AB patterns',
      'Use things they love (toys, snacks)',
      'Let them be the teacher',
    ],
  },
];

// ============================================
// SUBJECT: Science
// ============================================

// Chapter: Animal Kingdom
const animalKingdomNudges = [
  {
    id: 'sci_animal_001',
    subject: 'Science',
    chapter: 'Animal Kingdom',
    topic: 'Amazing Animal Facts',
    title: 'Amazing Animal Facts',
    icon: 'paw',
    iconColor: '#9B59B6',
    shortDescription: 'Discover fascinating facts about animals! Did you know elephants can\'t jump? Let\'s learn more!',
    duration: '12 min',
    ageGroup: 'Ages 4-9',
    whatYouWillLearn: 'Your child will learn interesting facts about different animals, where they live, what they eat, and their special abilities.',
    whatYouNeed: [
      'Picture books or tablet',
      'Paper and crayons',
      'Animal toys (optional)',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Elephants',
        activity: 'Learn: Elephants can\'t jump! They use their trunk to drink water and pick up things.',
        question: 'Ask: "Why do you think elephants have such big ears?"',
      },
      {
        day: 'Day 2',
        topic: 'Butterflies',
        activity: 'Learn: Butterflies taste with their feet! They have 4 wings, not 2.',
        question: 'Ask: "How do butterflies fly?"',
      },
      {
        day: 'Day 3',
        topic: 'Penguins',
        activity: 'Learn: Penguins can\'t fly but they\'re great swimmers! They slide on their bellies.',
        question: 'Ask: "Where do penguins live? Is it hot or cold?"',
      },
      {
        day: 'Day 4',
        topic: 'Giraffes',
        activity: 'Learn: Giraffes have the same number of neck bones as humans - just 7! But theirs are much longer.',
        question: 'Ask: "Why do giraffes have long necks?"',
      },
      {
        day: 'Day 5',
        topic: 'Your Favorite Animal',
        activity: 'Choose your favorite animal. Draw it and write 2 facts you learned this week.',
        question: 'Ask: "If you could be any animal, which would you be?"',
      },
    ],
    quickTips: [
      'Show pictures or videos',
      'Visit a zoo if possible',
      'Make animal sounds together!',
    ],
  },
  {
    id: 'sci_animal_002',
    subject: 'Science',
    chapter: 'Animal Kingdom',
    topic: 'Animal Homes',
    title: 'Where Animals Live',
    icon: 'home-variant',
    iconColor: '#795548',
    shortDescription: 'Explore different animal homes! From nests to burrows, dens to hives.',
    duration: '18 min',
    ageGroup: 'Ages 4-8',
    whatYouWillLearn: 'Your child will learn about different types of animal homes and why animals need shelter.',
    whatYouNeed: [
      'Picture books',
      'Cardboard boxes',
      'Drawing materials',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Birds and Nests',
        activity: 'Look at bird nests. Explain birds build nests with twigs and leaves for their eggs.',
        question: 'Ask: "Where do birds build their nests?"',
      },
      {
        day: 'Day 2',
        topic: 'Bees and Hives',
        activity: 'Learn about beehives. Bees make honeycomb homes. They work together as a team!',
        question: 'Ask: "What do bees make in their hive?"',
      },
      {
        day: 'Day 3',
        topic: 'Rabbits and Burrows',
        activity: 'Rabbits dig holes underground called burrows. It keeps them safe and cool.',
        question: 'Ask: "Why do rabbits live underground?"',
      },
      {
        day: 'Day 4',
        topic: 'Bears and Dens',
        activity: 'Bears sleep in dens during winter. Dens can be in caves or hollow trees.',
        question: 'Ask: "What do bears do in their den in winter?"',
      },
      {
        day: 'Day 5',
        topic: 'Build Animal Homes',
        activity: 'Use boxes to build animal homes. Make a nest, burrow, or den. Play with toy animals!',
        question: 'Ask: "Which animal home would you like to live in?"',
      },
    ],
    quickTips: [
      'Watch nature videos together',
      'Build simple models with household items',
      'Visit a nature center if possible',
    ],
  },
];

// Chapter: My Body
const myBodyNudges = [
  {
    id: 'sci_body_001',
    subject: 'Science',
    chapter: 'My Body',
    topic: 'Five Senses',
    title: 'Sense Explorer',
    icon: 'eye',
    iconColor: '#00BCD4',
    shortDescription: 'Discover your amazing five senses! See, hear, smell, taste, and touch the world.',
    duration: '20 min',
    ageGroup: 'Ages 3-7',
    whatYouWillLearn: 'Your child will learn about the five senses and how we use them to explore the world.',
    whatYouNeed: [
      'Blindfold (scarf)',
      'Different textured items',
      'Safe foods to taste',
      'Items that make sounds',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Sight - I Can See',
        activity: 'Look around. Name colors, shapes, big and small things. Play "I Spy" game.',
        question: 'Ask: "What can you see right now?"',
      },
      {
        day: 'Day 2',
        topic: 'Hearing - I Can Hear',
        activity: 'Close eyes. Listen to sounds: birds, cars, music. Make different sounds together.',
        question: 'Ask: "What sounds do you hear?"',
      },
      {
        day: 'Day 3',
        topic: 'Touch - I Can Feel',
        activity: 'Touch different things: soft pillow, rough wall, smooth glass. Describe how they feel.',
        question: 'Ask: "Is it soft or hard?"',
      },
      {
        day: 'Day 4',
        topic: 'Smell - I Can Smell',
        activity: 'Smell different things: flowers, food, soap. Talk about nice and not-nice smells.',
        question: 'Ask: "What is your favorite smell?"',
      },
      {
        day: 'Day 5',
        topic: 'Taste - I Can Taste',
        activity: 'Taste safe foods: sweet (fruit), salty (chips), sour (lemon). Talk about different tastes.',
        question: 'Ask: "Is it sweet or salty?"',
      },
    ],
    quickTips: [
      'Make it a sensory adventure',
      'Use safe, familiar items',
      'Let them lead the exploration',
    ],
  },
  {
    id: 'sci_body_002',
    subject: 'Science',
    chapter: 'My Body',
    topic: 'Healthy Habits',
    title: 'Healthy Me',
    icon: 'heart-pulse',
    iconColor: '#27AE60',
    shortDescription: 'Learn healthy habits! Washing hands, brushing teeth, eating well, and staying active.',
    duration: '15 min',
    ageGroup: 'Ages 3-8',
    whatYouWillLearn: 'Your child will learn important healthy habits and why they keep us strong and happy.',
    whatYouNeed: [
      'Soap and water',
      'Toothbrush',
      'Healthy snacks',
      'Timer',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Washing Hands',
        activity: 'Practice washing hands properly. Sing ABC song while washing. Make it fun with bubbles!',
        question: 'Ask: "When should we wash our hands?"',
      },
      {
        day: 'Day 2',
        topic: 'Brushing Teeth',
        activity: 'Brush teeth together. Count to 20 for each section. Make silly faces in mirror!',
        question: 'Ask: "How many times a day should we brush?"',
      },
      {
        day: 'Day 3',
        topic: 'Eating Healthy',
        activity: 'Talk about healthy foods: fruits, vegetables, milk. Make a colorful plate together.',
        question: 'Ask: "Which fruits and vegetables do you like?"',
      },
      {
        day: 'Day 4',
        topic: 'Moving and Playing',
        activity: 'Do fun exercises: jump, run, dance! Play active games. Move your body for 10 minutes.',
        question: 'Ask: "How does your body feel after playing?"',
      },
      {
        day: 'Day 5',
        topic: 'Good Sleep',
        activity: 'Talk about bedtime routine. Why sleep is important. Make a bedtime chart with pictures.',
        question: 'Ask: "What helps you sleep well?"',
      },
    ],
    quickTips: [
      'Lead by example',
      'Make healthy habits fun, not a chore',
      'Celebrate good choices',
    ],
  },
];




// ============================================
// SUBJECT: Values & Character
// ============================================

// Chapter: Kindness & Empathy
const kindnessEmpathyNudges = [
  {
    id: 'val_kind_001',
    subject: 'Social Studies',
    chapter: 'Kindness & Empathy',
    topic: 'Acts of Kindness',
    title: 'Kindness Challenge',
    icon: 'heart-multiple',
    iconColor: '#27AE60',
    shortDescription: 'Spread kindness and learn about helping others!',
    duration: '15 min',
    ageGroup: 'Ages 4-10',
    whatYouWillLearn: 'Your child will understand kindness, empathy, and how small actions can make others happy.',
    whatYouNeed: [
      'Paper and markers',
      'Stickers',
      'Small treats or cards',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'What is Kindness?',
        activity: 'Talk about kindness. Share examples: helping, sharing, saying nice words.',
        question: 'Ask: "When did someone show you kindness?"',
      },
      {
        day: 'Day 2',
        topic: 'Kind Words',
        activity: 'Practice saying kind words: "Thank you", "Please", "You\'re awesome!" Make a list together.',
        question: 'Ask: "How do kind words make you feel?"',
      },
      {
        day: 'Day 3',
        topic: 'Help at Home',
        activity: 'Do a kind act at home: help set the table, clean up toys, hug a family member.',
        question: 'Ask: "How can we help each other?"',
      },
      {
        day: 'Day 4',
        topic: 'Make Someone Smile',
        activity: 'Draw a picture or make a card for someone. Give it to them and see their smile!',
        question: 'Ask: "Who would you like to make happy today?"',
      },
      {
        day: 'Day 5',
        topic: 'Kindness Jar',
        activity: 'Create a kindness jar. Every time you do something kind, add a star sticker!',
        question: 'Ask: "What kind thing did you do today?"',
      },
    ],
    quickTips: [
      'Model kindness yourself',
      'Praise kind behavior',
      'Make it a daily practice',
    ],
  },
];

// ============================================
// SUBJECT: Arts & Creativity
// ============================================

// Chapter: Creative Expression
const creativeExpressionNudges = [
  {
    id: 'art_create_001',
    subject: 'English',
    chapter: 'Creative Expression',
    topic: 'Art & Craft',
    title: 'Little Artist',
    icon: 'brush',
    iconColor: '#FFB84D',
    shortDescription: 'Unleash creativity through fun art and craft activities!',
    duration: '25 min',
    ageGroup: 'Ages 3-8',
    whatYouWillLearn: 'Your child will explore colors, textures, and express themselves through art.',
    whatYouNeed: [
      'Paper',
      'Crayons, markers, paints',
      'Glue and scissors',
      'Recyclable materials',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Color Mixing',
        activity: 'Mix colors together. Red + Yellow = Orange! Blue + Yellow = Green! Experiment and discover.',
        question: 'Ask: "What new colors can you make?"',
      },
      {
        day: 'Day 2',
        topic: 'Free Drawing',
        activity: 'Draw anything you want! No rules. Use all the colors. Let imagination flow.',
        question: 'Ask: "Tell me about your drawing!"',
      },
      {
        day: 'Day 3',
        topic: 'Texture Art',
        activity: 'Create art with different textures: cotton balls, sandpaper, fabric, leaves.',
        question: 'Ask: "How does it feel?"',
      },
      {
        day: 'Day 4',
        topic: 'Recycled Craft',
        activity: 'Make something from recyclables: robot from boxes, flowers from bottles, anything creative!',
        question: 'Ask: "What can we make from this?"',
      },
      {
        day: 'Day 5',
        topic: 'Art Gallery',
        activity: 'Display all the art you made this week. Have a mini art show! Take photos.',
        question: 'Ask: "Which is your favorite artwork?"',
      },
    ],
    quickTips: [
      'Focus on process, not perfection',
      'Provide variety of materials',
      'Display their artwork proudly',
    ],
  },
];

// ============================================
// SUBJECT: Artificial Intelligence
// ============================================

// Chapter: AI Basics
const aiBasicsNudges = [
  {
    id: 'ai_basics_001',
    subject: 'Artificial Intelligence',
    chapter: 'AI Basics',
    topic: 'What is AI?',
    title: 'AI All Around Us',
    icon: 'robot',
    iconColor: '#8B5CF6',
    shortDescription: 'Discover AI in everyday life! From phones to games, AI is everywhere.',
    duration: '15 min',
    ageGroup: 'Ages 6-12',
    whatYouWillLearn: 'Your child will learn what AI is, where it\'s used, and how it helps us.',
    whatYouNeed: [
      'Smartphone or tablet',
      'Paper and crayons',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'What is AI?',
        activity: 'Explain: AI is like a smart computer that learns and makes decisions, like a robot brain!',
        question: 'Ask: "What do you think AI can do?"',
      },
      {
        day: 'Day 2',
        topic: 'AI in Your Phone',
        activity: 'Show voice assistant (Siri, Google). It understands what you say! That\'s AI.',
        question: 'Ask: "How does your phone understand you?"',
      },
      {
        day: 'Day 3',
        topic: 'AI in Games',
        activity: 'Play a game with AI opponent. Explain the computer learns your moves!',
        question: 'Ask: "Can the computer beat you?"',
      },
      {
        day: 'Day 4',
        topic: 'AI Helps Us',
        activity: 'Talk about AI helping: doctors, teachers, cars. AI makes life easier!',
        question: 'Ask: "How does AI help people?"',
      },
      {
        day: 'Day 5',
        topic: 'Draw Your AI',
        activity: 'Draw what you think AI looks like. Is it a robot? A brain? Anything you imagine!',
        question: 'Ask: "What would your AI robot do?"',
      },
    ],
    quickTips: [
      'Use real examples they know',
      'Make it fun and not scary',
      'Encourage curiosity',
    ],
  },
];

// ============================================
// SUBJECT: Financial Literacy
// ============================================

// Chapter: Money Basics
const moneyBasicsNudges = [
  {
    id: 'fin_money_001',
    subject: 'Financial Literacy',
    chapter: 'Money Basics',
    topic: 'Understanding Money',
    title: 'Money Matters',
    icon: 'cash-multiple',
    iconColor: '#10B981',
    shortDescription: 'Learn about money, saving, and making smart choices!',
    duration: '15 min',
    ageGroup: 'Ages 6-12',
    whatYouWillLearn: 'Your child will learn about earning, saving, spending wisely, and financial responsibility.',
    whatYouNeed: [
      'Coins and notes',
      'Piggy bank',
      'Paper for tracking',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'Where Money Comes From',
        activity: 'Talk about how parents earn money through work. Money helps us buy things we need.',
        question: 'Ask: "How do people get money?"',
      },
      {
        day: 'Day 2',
        topic: 'Saving Money',
        activity: 'Start a savings goal. Put coins in piggy bank. Track your savings!',
        question: 'Ask: "What do you want to save for?"',
      },
      {
        day: 'Day 3',
        topic: 'Spending Wisely',
        activity: 'Talk about needs vs wants. Make a list of things you need and things you want.',
        question: 'Ask: "Do we need this or just want it?"',
      },
      {
        day: 'Day 4',
        topic: 'Earning Money',
        activity: 'Discuss ways kids can earn money: chores, helping, selling things.',
        question: 'Ask: "How can you earn money?"',
      },
      {
        day: 'Day 5',
        topic: 'Money Goals',
        activity: 'Set a money goal together. Make a plan to reach it. Celebrate when you do!',
        question: 'Ask: "What\'s your money goal?"',
      },
    ],
    quickTips: [
      'Make it practical and real',
      'Involve them in family finances',
      'Praise good money decisions',
    ],
  },
];

// ============================================
// SUBJECT: Sex & Safety
// ============================================

// Chapter: Body Safety
const bodySafetyNudges = [
  {
    id: 'safety_body_001',
    subject: 'Sex & Safety',
    chapter: 'Body Safety',
    topic: 'My Body, My Rules',
    title: 'Body Safety Basics',
    icon: 'shield-heart-outline',
    iconColor: '#EF4444',
    shortDescription: 'Learn about body safety, privacy, and saying no!',
    duration: '15 min',
    ageGroup: 'Ages 5-12',
    whatYouWillLearn: 'Your child will learn about body autonomy, privacy, safe and unsafe touches, and how to ask for help.',
    whatYouNeed: [
      'Picture books about bodies',
      'Paper and crayons',
    ],
    dayByDay: [
      {
        day: 'Day 1',
        topic: 'My Body is Mine',
        activity: 'Teach: Your body belongs to you. No one should touch you without permission.',
        question: 'Ask: "Who can give you a hug?"',
      },
      {
        day: 'Day 2',
        topic: 'Safe and Unsafe Touches',
        activity: 'Explain safe touches (hugs, high-fives) and unsafe touches. It\'s okay to say NO!',
        question: 'Ask: "What should you do if someone touches you in a way that makes you uncomfortable?"',
      },
      {
        day: 'Day 3',
        topic: 'Private Parts',
        activity: 'Use correct names for body parts. Explain which parts are private and should be covered.',
        question: 'Ask: "What are your private parts?"',
      },
      {
        day: 'Day 4',
        topic: 'Saying No',
        activity: 'Practice saying NO firmly and clearly. Role-play scenarios. It\'s okay to say no!',
        question: 'Ask: "Can you say no to someone?"',
      },
      {
        day: 'Day 5',
        topic: 'Asking for Help',
        activity: 'Teach trusted adults to talk to: parents, teachers, counselors. It\'s never your fault.',
        question: 'Ask: "Who can you talk to if you feel unsafe?"',
      },
    ],
    quickTips: [
      'Use age-appropriate language',
      'Be calm and matter-of-fact',
      'Reinforce that it\'s never their fault',
    ],
  },
];

// ============================================
// COMBINE ALL NUDGES
// ============================================

const allNudges = [
  ...waterConservationNudges.slice(0, 1), // First Science / EVS nudge
  ...moneyAndNumbersNudges.slice(0, 1),   // First Math nudge
  ...waterConservationNudges.slice(1),    // Remaining Water Conservation nudges
  ...plantsTreesNudges,                   // Plants & Trees nudges
  ...moneyAndNumbersNudges.slice(1),      // Remaining Money & Numbers nudges
  ...shapesPatternsNudges,                // Shapes & Patterns nudges
  ...kindnessEmpathyNudges,               // Social Studies nudges
  ...creativeExpressionNudges,            // English nudges
  ...aiBasicsNudges,                      // Artificial Intelligence nudges
];

export default allNudges;

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get a nudge by ID
export const getNudgeById = (id) => {
  return allNudges.find(nudge => nudge.id === id);
};

// Get all nudges
export const getAllNudges = () => {
  return allNudges;
};

// Get nudges by subject
export const getNudgesBySubject = (subject) => {
  return allNudges.filter(nudge => nudge.subject === subject);
};

// Get nudges by chapter
export const getNudgesByChapter = (subject, chapter) => {
  return allNudges.filter(nudge => nudge.subject === subject && nudge.chapter === chapter);
};

// Get all unique subjects
export const getAllSubjects = () => {
  const subjects = [...new Set(allNudges.map(nudge => nudge.subject))];
  return subjects.map(subject => {
    const topicCount = [...new Set(
      allNudges
        .filter(nudge => nudge.subject === subject)
        .map(nudge => nudge.topic)
    )].length;
    return {
      name: subject,
      chapters: getChaptersBySubject(subject),
      topicCount: topicCount,
    };
  });
};

// Get chapters by subject
export const getChaptersBySubject = (subject) => {
  const chapters = [...new Set(
    allNudges
      .filter(nudge => nudge.subject === subject)
      .map(nudge => nudge.chapter)
  )];
  return chapters.map(chapter => ({
    name: chapter,
    topics: getTopicsByChapter(subject, chapter),
  }));
};

// Get topics by chapter
export const getTopicsByChapter = (subject, chapter) => {
  return allNudges.filter(nudge => nudge.subject === subject && nudge.chapter === chapter);
};

// ============================================
// FLASHCARDS DATA
// ============================================

export const flashcardsData = {
  'env_water_001': [
    { id: 'fc1', question: 'What is rainwater harvesting?', answer: 'Collecting and storing rainwater for later use, like watering plants or cleaning.' },
    { id: 'fc2', question: 'Why should we save rainwater?', answer: 'Because water is precious and rainwater can be used for many things instead of wasting it.' },
    { id: 'fc3', question: 'Where does rainwater go after it falls?', answer: 'It goes into the ground, rivers, lakes, or drains. Some evaporates back into the sky.' },
    { id: 'fc4', question: 'How can we collect rainwater at home?', answer: 'We can use buckets, barrels, or special tanks to collect rain from roofs.' },
    { id: 'fc5', question: 'What can we use collected rainwater for?', answer: 'Watering plants, washing cars, cleaning floors, and flushing toilets.' },
  ],
  'env_water_002': [
    { id: 'fc1', question: 'What is the water cycle?', answer: 'The journey water takes as it moves from the earth to the sky and back again.' },
    { id: 'fc2', question: 'What is evaporation?', answer: 'When the sun heats water and turns it into vapor that rises into the sky.' },
    { id: 'fc3', question: 'What are clouds made of?', answer: 'Tiny drops of water that have evaporated and gathered together in the sky.' },
    { id: 'fc4', question: 'What is precipitation?', answer: 'When water falls from clouds as rain, snow, or hail.' },
    { id: 'fc5', question: 'Why is the water cycle important?', answer: 'It gives us fresh water to drink and helps plants grow.' },
  ],
  'math_money_001': [
    { id: 'fc1', question: 'How many ₹1 coins make ₹5?', answer: 'Five ₹1 coins make ₹5. (1+1+1+1+1 = 5)' },
    { id: 'fc2', question: 'If you have ₹5 and spend ₹2, how much is left?', answer: '₹3 is left. (5 - 2 = 3)' },
    { id: 'fc3', question: 'How many ₹2 coins make ₹10?', answer: 'Five ₹2 coins make ₹10. (2+2+2+2+2 = 10)' },
    { id: 'fc4', question: 'If a pencil costs ₹3 and an eraser costs ₹2, how much for both?', answer: '₹5 for both. (3 + 2 = 5)' },
    { id: 'fc5', question: 'You have three ₹5 coins. How much money do you have?', answer: '₹15 in total. (5+5+5 = 15)' },
    { id: 'fc6', question: 'If you save ₹2 every day for 5 days, how much will you save?', answer: '₹10 in total. (2+2+2+2+2 = 10)' },
  ],
  'sci_animal_001': [
    { id: 'fc1', question: 'Can elephants jump?', answer: 'No, elephants are the only mammals that cannot jump!' },
    { id: 'fc2', question: 'How do butterflies taste food?', answer: 'Butterflies taste with their feet!' },
    { id: 'fc3', question: 'Can penguins fly?', answer: 'No, penguins cannot fly, but they are excellent swimmers.' },
    { id: 'fc4', question: 'How many neck bones do giraffes have?', answer: 'Giraffes have 7 neck bones, just like humans, but theirs are much longer.' },
    { id: 'fc5', question: 'What do elephants use their trunk for?', answer: 'To drink water, pick up food, spray water, and greet other elephants.' },
  ],
};

// ============================================
// PROMPTS DATA
// ============================================

export const promptsData = {
  'env_water_001': [
    { id: 'p1', prompt: 'Imagine you are a raindrop. Describe your journey from a cloud to the ground and what you see along the way.' },
    { id: 'p2', prompt: 'If you could invent a new way to save water at home, what would it be? Draw or describe your invention.' },
    { id: 'p3', prompt: 'Write a short story about a village that ran out of water and how the children helped save the day.' },
    { id: 'p4', prompt: 'Create a poster showing 5 ways your family can save water every day.' },
    { id: 'p5', prompt: 'Pretend you are teaching your younger sibling about rainwater harvesting. What would you say?' },
  ],
  'env_water_002': [
    { id: 'p1', prompt: 'Draw the water cycle and label each part: evaporation, condensation, precipitation, and collection.' },
    { id: 'p2', prompt: 'Write a diary entry from the perspective of a water drop going through the water cycle.' },
    { id: 'p3', prompt: 'Explain to a friend why we never run out of water on Earth, even though we use it every day.' },
    { id: 'p4', prompt: 'Create a song or poem about the water cycle using simple rhyming words.' },
    { id: 'p5', prompt: 'If the water cycle stopped working, what would happen to plants, animals, and people?' },
  ],
  'math_money_001': [
    { id: 'p1', prompt: 'You have ₹20 to spend at a toy shop. A small car costs ₹8 and a ball costs ₹6. Can you buy both? How much money will you have left?' },
    { id: 'p2', prompt: 'Draw 5 different ways to make ₹10 using ₹1, ₹2, and ₹5 coins. Which way uses the fewest coins?' },
    { id: 'p3', prompt: 'You want to buy a book that costs ₹25. You have ₹15. How much more money do you need to save?' },
    { id: 'p4', prompt: 'Create a shopping list with 4 items. Each item costs between ₹5 and ₹10. What is the total cost?' },
    { id: 'p5', prompt: 'If you earn ₹5 for helping with chores each day, how many days will it take to save ₹30?' },
  ],
  'sci_animal_001': [
    { id: 'p1', prompt: 'If you could be any animal for a day, which would you choose and why? What would you do?' },
    { id: 'p2', prompt: 'Create a fact card about your favorite animal. Include where it lives, what it eats, and one amazing fact.' },
    { id: 'p3', prompt: 'Write a story about a penguin who wants to learn how to fly. What happens?' },
    { id: 'p4', prompt: 'Design a zoo exhibit for giraffes. What would you include to make them happy and healthy?' },
    { id: 'p5', prompt: 'Imagine you discovered a new animal. Describe what it looks like, where it lives, and what makes it special.' },
  ],
};

// ============================================
// Q&A CARDS DATA
// ============================================

export const qaCardsData = {
  'env_water_001': [
    { 
      id: 'qa1', 
      question: 'Q1. Why is water important for all living things?', 
      answer: 'Water is essential for survival. Humans need water to drink, plants need water to grow, and animals need water to stay alive. Our bodies are made up of about 60% water! Without water, nothing can live.' 
    },
    { 
      id: 'qa2', 
      question: 'Q2. How does rainwater harvesting help the environment?', 
      answer: 'Rainwater harvesting reduces the demand on groundwater and helps prevent flooding. It also provides free water for gardens and reduces water bills. When we collect rainwater, we help conserve our precious water resources.' 
    },
    { 
      id: 'qa3', 
      question: 'Q3. What happens if we waste too much water?', 
      answer: 'If we waste water, there might not be enough clean water for everyone. Rivers and lakes can dry up, plants and animals suffer, and people may not have water to drink or grow food. That\'s why saving water is so important!' 
    },
    { 
      id: 'qa4', 
      question: 'Q4. Can rainwater be used for drinking?', 
      answer: 'Rainwater can be used for drinking, but it needs to be filtered and cleaned first to remove dirt and germs. It\'s safer to use collected rainwater for watering plants, washing, and cleaning.' 
    },
  ],
  'math_money_001': [
    { 
      id: 'qa1', 
      question: 'Q1. If you have two ₹5 coins and three ₹2 coins, how much money do you have in total?', 
      answer: 'You have ₹16 in total. Two ₹5 coins = ₹10 (5+5=10). Three ₹2 coins = ₹6 (2+2+2=6). Add them together: ₹10 + ₹6 = ₹16.' 
    },
    { 
      id: 'qa2', 
      question: 'Q2. A chocolate costs ₹5 and a juice costs ₹8. You have ₹20. Can you buy both? How much will be left?', 
      answer: 'Yes, you can buy both! Chocolate (₹5) + Juice (₹8) = ₹13. You have ₹20, so ₹20 - ₹13 = ₹7 left. You will have ₹7 remaining.' 
    },
    { 
      id: 'qa3', 
      question: 'Q3. You want to buy a toy that costs ₹30. You have ₹18. How much more money do you need?', 
      answer: 'You need ₹12 more. The toy costs ₹30 and you have ₹18. So ₹30 - ₹18 = ₹12. You need to save ₹12 more to buy the toy.' 
    },
    { 
      id: 'qa4', 
      question: 'Q4. If you save ₹3 every day, how much will you have after one week (7 days)?', 
      answer: 'You will have ₹21 after one week. ₹3 × 7 days = ₹21. That\'s ₹3 + ₹3 + ₹3 + ₹3 + ₹3 + ₹3 + ₹3 = ₹21!' 
    },
  ],
  'sci_animal_001': [
    { 
      id: 'qa1', 
      question: 'Q1. How do animals survive in different climates?', 
      answer: 'Animals have special adaptations! Polar bears have thick fur for cold weather, camels store water in their humps for deserts, and fish have gills to breathe underwater. Each animal is perfectly designed for where it lives.' 
    },
    { 
      id: 'qa2', 
      question: 'Q2. Why do some animals migrate?', 
      answer: 'Animals migrate to find food, warmer weather, or safe places to have babies. Birds fly south in winter where it\'s warmer and there\'s more food. When spring comes, they fly back north. It\'s like taking a long vacation!' 
    },
    { 
      id: 'qa3', 
      question: 'Q3. How do baby animals learn from their parents?', 
      answer: 'Baby animals watch and copy their parents. Lion cubs learn to hunt by playing and watching their mother. Birds teach their babies to fly by encouraging them to jump from the nest. Practice makes perfect!' 
    },
  ],
};

// ============================================
// VOCABULARY DATA
// ============================================

export const vocabularyData = {
  'env_water_001': [
    { 
      id: 'v1', 
      word: 'Harvest', 
      type: 'verb', 
      definition: 'To collect or gather something, especially crops or natural resources like rainwater.', 
      example: 'We harvest rainwater from our roof to water the garden.', 
      synonym: 'Collect, gather' 
    },
    { 
      id: 'v2', 
      word: 'Conservation', 
      type: 'noun', 
      definition: 'The act of protecting and saving something, especially natural resources like water.', 
      example: 'Water conservation means using less water and not wasting it.', 
      synonym: 'Protection, preservation' 
    },
    { 
      id: 'v3', 
      word: 'Precious', 
      type: 'adjective', 
      definition: 'Very valuable and important; something we should take care of.', 
      example: 'Water is precious because all living things need it to survive.', 
      synonym: 'Valuable, important' 
    },
    { 
      id: 'v4', 
      word: 'Evaporate', 
      type: 'verb', 
      definition: 'When liquid water turns into water vapor (gas) and goes into the air.', 
      example: 'When the sun shines on a puddle, the water evaporates and disappears.', 
      synonym: 'Vaporize, dry up' 
    },
    { 
      id: 'v5', 
      word: 'Groundwater', 
      type: 'noun', 
      definition: 'Water that is stored underground in soil and rocks.', 
      example: 'We get drinking water from groundwater by digging wells.', 
      synonym: 'Underground water' 
    },
  ],
  'math_money_001': [
    { 
      id: 'v1', 
      word: 'Addition', 
      type: 'noun', 
      definition: 'Putting numbers together to find the total. The symbol for addition is +.', 
      example: 'If you have 3 apples and get 2 more, you use addition: 3 + 2 = 5 apples.', 
      synonym: 'Plus, sum, total' 
    },
    { 
      id: 'v2', 
      word: 'Subtraction', 
      type: 'noun', 
      definition: 'Taking away one number from another. The symbol for subtraction is -.', 
      example: 'If you have 10 candies and eat 3, you use subtraction: 10 - 3 = 7 candies left.', 
      synonym: 'Minus, take away, difference' 
    },
    { 
      id: 'v3', 
      word: 'Coin', 
      type: 'noun', 
      definition: 'A small, round piece of metal used as money.', 
      example: 'I have five coins in my pocket: two ₹5 coins and three ₹2 coins.', 
      synonym: 'Change, money' 
    },
    { 
      id: 'v4', 
      word: 'Total', 
      type: 'noun', 
      definition: 'The final amount when you add everything together.', 
      example: 'The total cost of the pencil (₹3) and eraser (₹2) is ₹5.', 
      synonym: 'Sum, whole amount' 
    },
    { 
      id: 'v5', 
      word: 'Change', 
      type: 'noun', 
      definition: 'The money you get back when you pay more than something costs.', 
      example: 'I bought a toy for ₹7 with a ₹10 note. My change is ₹3.', 
      synonym: 'Leftover money, remainder' 
    },
  ],
  'sci_animal_001': [
    { 
      id: 'v1', 
      word: 'Habitat', 
      type: 'noun', 
      definition: 'The natural home or environment where an animal lives.', 
      example: 'A fish\'s habitat is water, while a bird\'s habitat is the sky and trees.', 
      synonym: 'Home, environment' 
    },
    { 
      id: 'v2', 
      word: 'Mammal', 
      type: 'noun', 
      definition: 'A warm-blooded animal that has hair or fur and feeds milk to its babies.', 
      example: 'Dogs, cats, elephants, and humans are all mammals.', 
      synonym: 'Warm-blooded animal' 
    },
    { 
      id: 'v3', 
      word: 'Predator', 
      type: 'noun', 
      definition: 'An animal that hunts and eats other animals for food.', 
      example: 'A lion is a predator that hunts zebras and other animals.', 
      synonym: 'Hunter, carnivore' 
    },
    { 
      id: 'v4', 
      word: 'Herbivore', 
      type: 'noun', 
      definition: 'An animal that only eats plants.', 
      example: 'Cows, elephants, and rabbits are herbivores because they eat grass and leaves.', 
      synonym: 'Plant-eater' 
    },
    { 
      id: 'v5', 
      word: 'Nocturnal', 
      type: 'adjective', 
      definition: 'Active at night and sleeping during the day.', 
      example: 'Owls are nocturnal birds that hunt for food at night.', 
      synonym: 'Night-active' 
    },
  ],
};

// ============================================
// HELPER FUNCTIONS FOR CARDS
// ============================================

export const getFlashcards = (nudgeId) => {
  return flashcardsData[nudgeId] || [];
};

export const getPrompts = (nudgeId) => {
  return promptsData[nudgeId] || [];
};

export const getQACards = (nudgeId) => {
  return qaCardsData[nudgeId] || [];
};

export const getVocabulary = (nudgeId) => {
  return vocabularyData[nudgeId] || [];
};

