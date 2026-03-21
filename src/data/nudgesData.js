/**
 * Nudges Data — Grade 1 complete, all subjects, all levels
 * Structure: id, subject, chapter, topic, grades, level, title, icon, iconColor, shortDescription, day
 */

// ── MATH · Grade 1 · Basic ───────────────────────────────────────────────────
const math_g1_basic = [
  {
    id: 'math_g1_b_001',
    subject: 'Math',
    chapter: 'Numbers',
    topic: 'Counting 1–20',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Count with Me',
    icon: 'numeric',
    iconColor: '#3B82F6',
    shortDescription: 'Count objects up to 20 using everyday things at home.',
    day: {
      topic: 'Counting Objects',
      activity: 'Pick any 10–20 small objects (coins, buttons, stones). Count them together out loud, touching each one.',
      question: 'Ask: "Can you count backwards from 10?"',
    },
  },
  {
    id: 'math_g1_b_003',
    subject: 'Math',
    chapter: 'Addition',
    topic: 'Adding Small Numbers',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Adding Fun',
    icon: 'plus-circle',
    iconColor: '#3B82F6',
    shortDescription: 'Add numbers up to 10 using fingers and objects.',
    day: {
      topic: 'Adding with Objects',
      activity: 'Put 3 grapes on one side, 4 on the other. Push them together and count the total.',
      question: 'Ask: "What is 2 + 5?"',
    },
  },
  {
    id: 'math_g1_b_002',
    subject: 'Math',
    chapter: 'Shapes & Patterns',
    topic: 'The Shape Engineer',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Spatial Shapes',
    icon: 'shape',
    iconColor: '#3B82F6',
    shortDescription: 'Analyzing "attributes" like faces (flat sides), edges, and vertices (corners).',
    day: {
      topic: 'Shapes Around Us',
      activity: 'Walk through one room. Find one circle, one square, one triangle, one rectangle. Point and name each.',
      question: 'Ask: "How many corners does a triangle have?"',
    },
  },
];

// ── MATH · Grade 1 · Intermediate ───────────────────────────────────────────
const math_g1_intermediate = [
  {
    id: 'math_g1_i_001',
    subject: 'Math',
    chapter: 'Numbers',
    topic: 'Place Value — Tens & Ones',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Tens & Ones',
    icon: 'numeric-10',
    iconColor: '#6366F1',
    shortDescription: 'Understand that 13 means 1 ten and 3 ones.',
    day: {
      topic: 'Grouping into Tens',
      activity: 'Count out 15 coins. Group 10 together. Say: "1 ten and 5 ones = 15." Try with 12 and 18.',
      question: 'Ask: "How many tens and ones are in 17?"',
    },
  },
  {
    id: 'math_g1_i_002',
    subject: 'Math',
    chapter: 'Addition & Subtraction',
    topic: 'Subtraction up to 20',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Take Away Game',
    icon: 'minus-circle',
    iconColor: '#6366F1',
    shortDescription: 'Learn subtraction by taking objects away.',
    day: {
      topic: 'Taking Away',
      activity: 'Start with 10 blocks. Remove 4. Count what is left. Write: 10 − 4 = 6. Try 3 more examples.',
      question: 'Ask: "If you have 8 sweets and eat 3, how many are left?"',
    },
  },
  {
    id: 'math_g1_i_003',
    subject: 'Math',
    chapter: 'Measurement',
    topic: 'Comparing Length',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Long or Short?',
    icon: 'ruler',
    iconColor: '#6366F1',
    shortDescription: 'Compare objects using longer, shorter, taller.',
    day: {
      topic: 'Measuring with Hands',
      activity: 'Pick 5 objects. Measure each using hand-spans. Order them from shortest to longest.',
      question: 'Ask: "Which is longer — your foot or your hand?"',
    },
  },
  {
    id: 'math_g1_i_004',
    subject: 'Math',
    chapter: 'Shapes & Patterns',
    topic: 'The Shape Engineer',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Spatial Shapes',
    icon: 'cube-outline',
    iconColor: '#6366F1',
    shortDescription: 'Analyzing "attributes" like faces (flat sides), edges, and vertices (corners).',
    day: {
      topic: 'The Shape Engineer',
      activity: 'Pick 3 objects at home. Describe each: how many flat faces? Does it roll or stack?',
      question: 'Ask: "Why can a cylinder roll but a cube cannot?"',
    },
  },
];

// ── MATH · Grade 1 · Advanced ────────────────────────────────────────────────
const math_g1_advanced = [
  {
    id: 'math_g1_a_001',
    subject: 'Math',
    chapter: 'Addition & Subtraction',
    topic: 'Adding & Subtracting up to 50',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Number Challenge',
    icon: 'calculator',
    iconColor: '#EC4899',
    shortDescription: 'Solve addition and subtraction problems up to 50.',
    day: {
      topic: 'Two-Digit Addition',
      activity: 'Write: 23 + 14. Break it: 20+10=30, 3+4=7, so 30+7=37. Try 31+15 and 42+6.',
      question: 'Ask: "What is 25 + 13?"',
    },
  },
  {
    id: 'math_g1_a_002',
    subject: 'Math',
    chapter: 'Patterns',
    topic: 'Number Patterns',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Pattern Finder',
    icon: 'dots-horizontal',
    iconColor: '#EC4899',
    shortDescription: 'Find and continue number patterns like 2, 4, 6, 8...',
    day: {
      topic: 'Skip Counting',
      activity: 'Count by 2s to 20: 2, 4, 6... Then count by 5s to 50: 5, 10, 15... Clap on each number.',
      question: 'Ask: "What comes after 35 when counting by 5s?"',
    },
  },
  {
    id: 'math_g1_a_003',
    subject: 'Math',
    chapter: 'Money',
    topic: 'Counting Money',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Money Master',
    icon: 'cash-multiple',
    iconColor: '#EC4899',
    shortDescription: 'Count coins and make small purchases.',
    day: {
      topic: 'Making Amounts',
      activity: 'Show ₹1, ₹2, ₹5 coins. Ask: "Show me ₹8 using these coins." Try ₹12 and ₹15.',
      question: 'Ask: "How many ₹2 coins make ₹10?"',
    },
  },
  {
    id: 'math_g1_a_004',
    subject: 'Math',
    chapter: 'Shapes & Patterns',
    topic: 'The Shape Engineer',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Spatial Shapes',
    icon: 'cube-outline',
    iconColor: '#EC4899',
    shortDescription: 'Analyzing "attributes" like faces (flat sides), edges, and vertices (corners).',
    day: {
      topic: 'The Shape Engineer',
      activity: 'Find a box at home. Count its faces, edges, and vertices. Then find a composite shape (like a house toy) and identify the simpler shapes inside it.',
      question: 'Ask: "What two shapes make up this object?"',
    },
  },
];

// ── SCIENCE / EVS · Grade 1 · Basic ─────────────────────────────────────────
const science_g1_basic = [
  {
    id: 'sci_g1_b_001',
    subject: 'Science / EVS',
    chapter: 'Plants',
    topic: 'Parts of a Plant',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Plant Detective',
    icon: 'flower',
    iconColor: '#10B981',
    shortDescription: 'Learn the 5 parts of a plant and what each one does.',
    day: {
      topic: 'Roots, Stem, Leaves',
      activity: 'Find a plant at home. Point to roots, stem, leaves, flower. Say what each part does in one word.',
      question: 'Ask: "What would happen if a plant had no leaves?"',
    },
  },
  {
    id: 'sci_g1_b_002',
    subject: 'Science / EVS',
    chapter: 'Animals',
    topic: 'Animals Around Us',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Animal World',
    icon: 'paw',
    iconColor: '#10B981',
    shortDescription: 'Learn about common animals, what they eat and where they live.',
    day: {
      topic: 'Pet vs Wild Animals',
      activity: 'Name 3 pet animals and 3 wild animals. Draw one of each. Talk about what they eat.',
      question: 'Ask: "Where does a lion live? Where does a dog live?"',
    },
  },
  {
    id: 'sci_g1_b_003',
    subject: 'Science / EVS',
    chapter: 'My Body',
    topic: 'Five Senses',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Sense Explorer',
    icon: 'eye',
    iconColor: '#10B981',
    shortDescription: 'Discover your 5 senses and how they help you every day.',
    day: {
      topic: 'Using Our Senses',
      activity: 'Close eyes. Touch 5 objects. Describe each using only touch words: rough, smooth, hard, soft, cold.',
      question: 'Ask: "Which sense do you use most?"',
    },
  },
];

// ── SCIENCE / EVS · Grade 1 · Intermediate ──────────────────────────────────
const science_g1_intermediate = [
  {
    id: 'sci_g1_i_001',
    subject: 'Science / EVS',
    chapter: 'Water',
    topic: 'Water Around Us',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Water Explorer',
    icon: 'water',
    iconColor: '#0EA5E9',
    shortDescription: 'Learn where water comes from and why we must save it.',
    day: {
      topic: 'Where Does Water Come From?',
      activity: 'List 5 places you use water at home. Then list 3 ways to save water. Make a "Water Hero" pledge.',
      question: 'Ask: "What would happen if taps ran dry for one day?"',
    },
  },
  {
    id: 'sci_g1_i_002',
    subject: 'Science / EVS',
    chapter: 'Weather',
    topic: 'Types of Weather',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Weather Watcher',
    icon: 'cloud',
    iconColor: '#0EA5E9',
    shortDescription: 'Observe and describe sunny, rainy, cloudy and windy weather.',
    day: {
      topic: 'Today\'s Weather',
      activity: 'Look outside. Describe the weather in 3 words. Draw a weather symbol for today. Do this for 3 days.',
      question: 'Ask: "What clothes do you wear on a rainy day? A sunny day?"',
    },
  },
  {
    id: 'sci_g1_i_003',
    subject: 'Science / EVS',
    chapter: 'Food',
    topic: 'Healthy Eating',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Food Explorer',
    icon: 'nutrition',
    iconColor: '#0EA5E9',
    shortDescription: 'Learn about food groups and why we need different foods.',
    day: {
      topic: 'My Plate',
      activity: 'Draw a plate. Divide into 4 sections: grains, vegetables, fruits, protein. Draw one food in each.',
      question: 'Ask: "Which food gives you energy to run and play?"',
    },
  },
];

// ── SCIENCE / EVS · Grade 1 · Advanced ──────────────────────────────────────
const science_g1_advanced = [
  {
    id: 'sci_g1_a_001',
    subject: 'Science / EVS',
    chapter: 'Environment',
    topic: 'Caring for the Environment',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Earth Guardian',
    icon: 'earth',
    iconColor: '#059669',
    shortDescription: 'Understand pollution, recycling and how to protect our planet.',
    day: {
      topic: 'Reduce, Reuse, Recycle',
      activity: 'Go through today\'s rubbish. Sort into: can recycle / cannot recycle. Count each pile. Discuss why recycling helps.',
      question: 'Ask: "What happens to plastic that is not recycled?"',
    },
  },
  {
    id: 'sci_g1_a_002',
    subject: 'Science / EVS',
    chapter: 'Animals',
    topic: 'Animal Adaptations',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Animal Superpowers',
    icon: 'paw',
    iconColor: '#059669',
    shortDescription: 'Discover how animals are built to survive in their homes.',
    day: {
      topic: 'Special Features',
      activity: 'Pick 3 animals: fish, camel, penguin. For each, name one special body feature and explain why it helps them survive.',
      question: 'Ask: "Why does a camel have a hump?"',
    },
  },
  {
    id: 'sci_g1_a_003',
    subject: 'Science / EVS',
    chapter: 'Plants',
    topic: 'How Plants Make Food',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Leaf Factory',
    icon: 'leaf',
    iconColor: '#059669',
    shortDescription: 'Learn how leaves use sunlight, water and air to make food.',
    day: {
      topic: 'Photosynthesis Simply',
      activity: 'Draw a leaf. Add arrows: sunlight → leaf, water → leaf, air → leaf, food out. Label each arrow.',
      question: 'Ask: "What do plants give us in return for making food?"',
    },
  },
];

// ── ENGLISH · Grade 1 · Basic ────────────────────────────────────────────────
const english_g1_basic = [
  {
    id: 'eng_g1_b_001',
    subject: 'English',
    chapter: 'Reading',
    topic: 'Letter Sounds (Phonics)',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Sound Safari',
    icon: 'volume-high',
    iconColor: '#F59E0B',
    shortDescription: 'Learn letter sounds and blend them into simple words.',
    day: {
      topic: 'Blending Sounds',
      activity: 'Say sounds slowly: c-a-t. Blend faster: cat. Try: d-o-g, s-u-n, h-a-t. Clap once per sound.',
      question: 'Ask: "What sound does the letter B make?"',
    },
  },
  {
    id: 'eng_g1_b_002',
    subject: 'English',
    chapter: 'Vocabulary',
    topic: 'Sight Words',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Word Flash',
    icon: 'book-open-variant',
    iconColor: '#F59E0B',
    shortDescription: 'Recognise common words like the, is, and, a, to on sight.',
    day: {
      topic: 'Reading Sight Words',
      activity: 'Write on cards: the, is, a, and, to, I, you, we. Flash each card. Read aloud. Repeat 3 times.',
      question: 'Ask: "Can you find the word \'the\' in this sentence?"',
    },
  },
  {
    id: 'eng_g1_b_003',
    subject: 'English',
    chapter: 'Writing',
    topic: 'Writing Simple Sentences',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Sentence Builder',
    icon: 'pencil',
    iconColor: '#F59E0B',
    shortDescription: 'Write short sentences using simple words.',
    day: {
      topic: 'My First Sentence',
      activity: 'Look at a picture. Write one sentence about it. Start with a capital letter. End with a full stop.',
      question: 'Ask: "What does every sentence start with?"',
    },
  },
];

// ── ENGLISH · Grade 1 · Intermediate ────────────────────────────────────────
const english_g1_intermediate = [
  {
    id: 'eng_g1_i_001',
    subject: 'English',
    chapter: 'Reading',
    topic: 'Reading Short Stories',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Story Time',
    icon: 'book',
    iconColor: '#D97706',
    shortDescription: 'Read a short story and answer questions about it.',
    day: {
      topic: 'Who, What, Where',
      activity: 'Read a short story together. Ask: Who is in it? What happened? Where did it happen? Write one answer each.',
      question: 'Ask: "What was the problem in the story?"',
    },
  },
  {
    id: 'eng_g1_i_002',
    subject: 'English',
    chapter: 'Grammar',
    topic: 'Nouns and Verbs',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Word Sorter',
    icon: 'sort-alphabetical-ascending',
    iconColor: '#D97706',
    shortDescription: 'Learn the difference between naming words and action words.',
    day: {
      topic: 'Nouns vs Verbs',
      activity: 'Write 10 words. Sort into two columns: Things (nouns) and Actions (verbs). Example: dog = noun, run = verb.',
      question: 'Ask: "Is \'jump\' a noun or a verb?"',
    },
  },
  {
    id: 'eng_g1_i_003',
    subject: 'English',
    chapter: 'Writing',
    topic: 'Describing Words',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Adjective Adventure',
    icon: 'text',
    iconColor: '#D97706',
    shortDescription: 'Use adjectives to make sentences more interesting.',
    day: {
      topic: 'Adding Describing Words',
      activity: 'Take a plain sentence: "The dog ran." Add 2 adjectives: "The big, fluffy dog ran." Try with 3 more sentences.',
      question: 'Ask: "What colour, size or feeling word can you add?"',
    },
  },
];

// ── ENGLISH · Grade 1 · Advanced ────────────────────────────────────────────
const english_g1_advanced = [
  {
    id: 'eng_g1_a_001',
    subject: 'English',
    chapter: 'Reading',
    topic: 'Story Comprehension',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Deep Reader',
    icon: 'book-open-page-variant',
    iconColor: '#B45309',
    shortDescription: 'Read a story and explain what happened in your own words.',
    day: {
      topic: 'Retelling a Story',
      activity: 'Read a short story. Close the book. Retell it in 4 sentences: beginning, middle, problem, end.',
      question: 'Ask: "Why did the character do that?"',
    },
  },
  {
    id: 'eng_g1_a_002',
    subject: 'English',
    chapter: 'Writing',
    topic: 'Writing a Paragraph',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Paragraph Pro',
    icon: 'file-document',
    iconColor: '#B45309',
    shortDescription: 'Write 3–4 connected sentences about one topic.',
    day: {
      topic: 'My Favourite Animal',
      activity: 'Write 4 sentences about your favourite animal: what it is, what it looks like, what it eats, why you like it.',
      question: 'Ask: "Do all your sentences talk about the same thing?"',
    },
  },
  {
    id: 'eng_g1_a_003',
    subject: 'English',
    chapter: 'Grammar',
    topic: 'Punctuation',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Punctuation Police',
    icon: 'exclamation',
    iconColor: '#B45309',
    shortDescription: 'Use full stops, question marks and capital letters correctly.',
    day: {
      topic: 'Fix the Sentences',
      activity: 'Write 5 sentences with missing punctuation. Fix each one: add capital letters, full stops, question marks.',
      question: 'Ask: "When do we use a question mark instead of a full stop?"',
    },
  },
];

// ── SOCIAL STUDIES · Grade 1 · Basic ────────────────────────────────────────
const social_g1_basic = [
  {
    id: 'soc_g1_b_001',
    subject: 'Social Studies',
    chapter: 'Family & Community',
    topic: 'My Family',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Family Tree',
    icon: 'account-group',
    iconColor: '#EC4899',
    shortDescription: 'Learn about family members and the roles they play.',
    day: {
      topic: 'Who is in My Family?',
      activity: 'Draw a family tree. Write each person\'s name and their relation: mother, father, sister, brother, grandparent.',
      question: 'Ask: "What does each person in your family do to help?"',
    },
  },
  {
    id: 'soc_g1_b_002',
    subject: 'Social Studies',
    chapter: 'Community Helpers',
    topic: 'People Who Help Us',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Community Heroes',
    icon: 'account-hard-hat',
    iconColor: '#EC4899',
    shortDescription: 'Learn about doctors, teachers, police and other helpers.',
    day: {
      topic: 'Who Helps Us?',
      activity: 'Name 5 community helpers. For each, say: what they do, what they wear, what tool they use.',
      question: 'Ask: "Who would you call if there was a fire?"',
    },
  },
  {
    id: 'soc_g1_b_003',
    subject: 'Social Studies',
    chapter: 'Values',
    topic: 'Kindness & Sharing',
    grades: ['Grade 1'],
    level: 'Basic',
    title: 'Kindness Challenge',
    icon: 'heart',
    iconColor: '#EC4899',
    shortDescription: 'Practise acts of kindness and understand why sharing matters.',
    day: {
      topic: 'One Kind Act',
      activity: 'Do one kind act today: help set the table, share a toy, say thank you. Talk about how it felt.',
      question: 'Ask: "How did the other person feel when you were kind?"',
    },
  },
];

// ── SOCIAL STUDIES · Grade 1 · Intermediate ─────────────────────────────────
const social_g1_intermediate = [
  {
    id: 'soc_g1_i_001',
    subject: 'Social Studies',
    chapter: 'Our Country',
    topic: 'India — Our Home',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'My Country',
    icon: 'flag',
    iconColor: '#8B5CF6',
    shortDescription: 'Learn about India — its flag, capital, and national symbols.',
    day: {
      topic: 'National Symbols',
      activity: 'Draw the Indian flag. Name: national animal (tiger), national bird (peacock), national flower (lotus). Write one fact about each.',
      question: 'Ask: "What is the capital of India?"',
    },
  },
  {
    id: 'soc_g1_i_002',
    subject: 'Social Studies',
    chapter: 'Emotions',
    topic: 'Understanding Feelings',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Feelings Explorer',
    icon: 'emoticon',
    iconColor: '#8B5CF6',
    shortDescription: 'Name and understand different emotions and how to handle them.',
    day: {
      topic: 'Emotion Faces',
      activity: 'Draw 6 faces: happy, sad, angry, scared, surprised, proud. Under each, write one thing that makes you feel that way.',
      question: 'Ask: "What do you do when you feel angry?"',
    },
  },
  {
    id: 'soc_g1_i_003',
    subject: 'Social Studies',
    chapter: 'Safety',
    topic: 'Staying Safe',
    grades: ['Grade 1'],
    level: 'Intermediate',
    title: 'Safety First',
    icon: 'shield-check',
    iconColor: '#8B5CF6',
    shortDescription: 'Learn road safety, stranger safety and home safety rules.',
    day: {
      topic: 'Road Safety Rules',
      activity: 'Name 5 road safety rules. Act out crossing the road: stop, look left, look right, look left again, cross.',
      question: 'Ask: "What does a red traffic light mean?"',
    },
  },
];

// ── SOCIAL STUDIES · Grade 1 · Advanced ─────────────────────────────────────
const social_g1_advanced = [
  {
    id: 'soc_g1_a_001',
    subject: 'Social Studies',
    chapter: 'History',
    topic: 'Famous Indians',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Great Indians',
    icon: 'star',
    iconColor: '#7C3AED',
    shortDescription: 'Learn about inspiring Indians who changed the world.',
    day: {
      topic: 'Mahatma Gandhi',
      activity: 'Read or tell the story of Gandhi. Write 3 things he did. Draw him. Discuss: "What can we learn from him?"',
      question: 'Ask: "Why is Gandhi called the Father of the Nation?"',
    },
  },
  {
    id: 'soc_g1_a_002',
    subject: 'Social Studies',
    chapter: 'Geography',
    topic: 'Maps & Directions',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Map Maker',
    icon: 'map',
    iconColor: '#7C3AED',
    shortDescription: 'Draw a simple map of your home or school with directions.',
    day: {
      topic: 'Drawing a Map',
      activity: 'Draw a map of your home. Mark: front door, kitchen, bedroom, bathroom. Add a compass: N, S, E, W.',
      question: 'Ask: "Which direction does the sun rise from?"',
    },
  },
  {
    id: 'soc_g1_a_003',
    subject: 'Social Studies',
    chapter: 'Culture',
    topic: 'Festivals of India',
    grades: ['Grade 1'],
    level: 'Advanced',
    title: 'Festival Fun',
    icon: 'party-popper',
    iconColor: '#7C3AED',
    shortDescription: 'Explore India\'s major festivals and what makes each special.',
    day: {
      topic: 'Three Festivals',
      activity: 'Pick 3 festivals: Diwali, Eid, Christmas. For each write: when it is, how it is celebrated, one special food.',
      question: 'Ask: "Why is it important to celebrate different festivals?"',
    },
  },
];

// ── ALL NUDGES ───────────────────────────────────────────────────────────────
const allNudges = [
  ...math_g1_basic,
  ...math_g1_intermediate,
  ...math_g1_advanced,
  ...science_g1_basic,
  ...science_g1_intermediate,
  ...science_g1_advanced,
  ...english_g1_basic,
  ...english_g1_intermediate,
  ...english_g1_advanced,
  ...social_g1_basic,
  ...social_g1_intermediate,
  ...social_g1_advanced,
];

export default allNudges;

// ── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

export const getNudgeById = (id) => allNudges.find(n => n.id === id);
export const getAllNudges = () => allNudges;
export const getNudgesBySubject = (subject) => allNudges.filter(n => n.subject === subject);
export const getNudgesByChapter = (subject, chapter) =>
  allNudges.filter(n => n.subject === subject && n.chapter === chapter);

export const getAllSubjects = () => {
  const subjects = [...new Set(allNudges.map(n => n.subject))];
  return subjects.map(subject => ({
    name: subject,
    chapters: getChaptersBySubject(subject),
    topicCount: [...new Set(allNudges.filter(n => n.subject === subject).map(n => n.topic))].length,
  }));
};

export const getChaptersBySubject = (subject) => {
  const chapters = [...new Set(allNudges.filter(n => n.subject === subject).map(n => n.chapter))];
  return chapters.map(chapter => ({
    name: chapter,
    topics: getTopicsByChapter(subject, chapter),
  }));
};

export const getTopicsByChapter = (subject, chapter) =>
  allNudges.filter(n => n.subject === subject && n.chapter === chapter);

// ── GRADE + LEVEL FILTER ─────────────────────────────────────────────────────
const SUBJECT_ID_TO_NAME = {
  mathematics: ['Math'],
  science: ['Science / EVS', 'Science'],
  english: ['English'],
  'social-studies': ['Social Studies'],
};

export const getNudgesByGradeAndLevel = (grade, subjectLevels = {}) => {
  if (!grade) return allNudges;
  return allNudges.filter(nudge => {
    if (nudge.grades && !nudge.grades.includes(grade)) return false;
    const matchedSubjectId = Object.entries(SUBJECT_ID_TO_NAME).find(
      ([, names]) => names.includes(nudge.subject)
    )?.[0];
    if (matchedSubjectId) {
      const chosenLevel = subjectLevels[matchedSubjectId];
      if (chosenLevel && nudge.level && nudge.level !== chosenLevel) return false;
    }
    return true;
  });
};

// ── FLASHCARDS DATA ──────────────────────────────────────────────────────────
export const flashcardsData = {
  'math_g1_b_001': [
    { id: 'fc1', title: 'Counting Objects', concept: 'Touch each object as you count. Never skip one or count one twice.', parentOutcome: 'Line up 15 coins. Count together touching each one.' },
    { id: 'fc2', title: 'Numbers Have Order', concept: '1, 2, 3... each number is exactly one more than the one before.', parentOutcome: 'Ask: "What number comes after 9? After 14?"' },
    { id: 'fc3', title: 'Counting Backwards', concept: 'Counting down from 10 to 1 is just as important as counting up.', parentOutcome: 'Countdown together like a rocket launch: 10, 9, 8... blast off!' },
  ],
  'math_g1_b_002': [
    {
      id: 'fc1',
      title: 'Your Conversation Starter-',
      concept: '"Look at this orange. Is it a circle or a sphere?" (Answer: It\'s a sphere because it\'s round like a ball and has thickness, not flat like a drawing on paper.) "What other spheres can you see in this room?" (Answer: Marbles, balls, or round light bulbs.)"',
      section2Title: 'Helpful Way to Explain',
      section2: 'Think of 2D shapes like a sticker on a page—they are flat and have no "body." 3D shapes are like toys—they have "fatness" or depth, and you can hold them in your hand. We call these "Spatial Shapes" because they take up real space around us. Ask: "Can we put this object in a box?" (If yes, it\'s 3D). Ask: "If we turn it around, does it have a back and a front?" This helps them understand that 3D shapes exist in all directions, unlike a flat drawing.',
    },
    {
      id: 'fc2',
      title: 'Concept',
      concept: 'Sphere: Perfectly round, no corners, and no flat sides. It is the best shape for rolling in every direction. Think of a marble, a planet, or a soap bubble!\n\nCube: Like a box with 6 flat square sides that are all the exact same size. Every side looks the same no matter how you turn it. Think of a dice or a sugar cube.',
    },
    {
      id: 'fc3',
      title: 'Concept',
      concept: 'Cylinder: It has a round, curved middle but two flat circles on the ends. It looks like a soda can, a glue stick, or a rolling pin. It can roll like a log or stand still like a tower.\n\nCone: It has one flat circle on the bottom that goes up to a sharp point at the top. It looks exactly like a party hat or an ice cream holder. It is unique because it is both round and pointy.',
    },
    {
      id: 'fc4',
      title: 'Concept',
      concept: 'Rectangular Prism: A long, solid box shape. It has 6 faces, but unlike a cube, its sides can be long rectangles. Think of a cereal box, a brick, or a book.',
    },
    {
      id: 'fc5',
      title: 'Why This Matters?',
      concept: 'Recognising 3D shapes is the first step in "visual literacy," helping kids move from seeing objects as simple items to seeing them as geometric structures. This builds the foundation for spatial reasoning needed in science and art.',
    },
    {
      id: 'fc6',
      title: 'Real-Life Connection',
      concept: 'A basketball is a perfect example of a sphere because it is a solid ball that rolls. A drawing of a ball on a piece of paper is just a circle because it has no depth. When you eat a sandwich, the bread is a rectangular prism, but the crust outline is a rectangle.',
    },
    {
      id: 'fc7',
      title: 'Common Misconception',
      concept: 'Children often call a sphere a "circle." Remind them: "A circle is pancake-flat; a sphere is ball-round!" Use the word "solid" to help them understand the difference between a drawing and a real object.',
    },
  ],
  'math_g1_b_003': [
    { id: 'fc1', title: 'What is Addition?', concept: 'Addition means putting two groups together to find the total.', parentOutcome: 'Put 2 apples and 3 apples together. Count all: that is addition.' },
    { id: 'fc2', title: 'The + Sign', concept: 'The plus sign (+) means "add" or "put together."', parentOutcome: 'Write 2 + 3 = ? together. Say: "2 plus 3 equals 5."' },
    { id: 'fc3', title: 'Adding to Zero', concept: 'Any number plus zero stays the same. 5 + 0 = 5.', parentOutcome: 'Ask: "If you have 7 sweets and I give you 0 more, how many do you have?"' },
  ],
  'math_g1_i_001': [
    { id: 'fc1', title: 'What is Place Value?', concept: 'The position of a digit tells us its value. In 13, the 1 means 10, not 1.', parentOutcome: 'Show 13 coins: group 10 together, leave 3 aside. "1 ten and 3 ones."' },
    { id: 'fc2', title: 'Tens Column', concept: 'The tens column is the second digit from the right. In 25, the 2 means 2 tens = 20.', parentOutcome: 'Write 25. Circle the tens digit. Ask: "What is its value?"' },
    { id: 'fc3', title: 'Ones Column', concept: 'The ones column is the rightmost digit. In 25, the 5 means 5 ones.', parentOutcome: 'Write 18. Ask: "How many tens? How many ones?"' },
  ],
  'math_g1_i_002': [
    { id: 'fc1', title: 'What is Subtraction?', concept: 'Subtraction means taking away from a group to find what is left.', parentOutcome: 'Start with 8 grapes. Eat 3. Count what is left: 8 − 3 = 5.' },
    { id: 'fc2', title: 'The − Sign', concept: 'The minus sign (−) means "take away" or "subtract."', parentOutcome: 'Write 10 − 4 = ? Say: "10 minus 4 equals 6."' },
    { id: 'fc3', title: 'Subtraction and Addition are Linked', concept: 'If 3 + 5 = 8, then 8 − 5 = 3. They are opposites.', parentOutcome: 'Write a sum: 6 + 4 = 10. Now flip it: 10 − 4 = 6.' },
  ],
  'math_g1_i_003': [
    { id: 'fc1', title: 'Measuring Length', concept: 'Length tells us how long or tall something is.', parentOutcome: 'Measure your child\'s hand with a ruler. Write the number in cm.' },
    { id: 'fc2', title: 'Longer and Shorter', concept: 'We compare lengths using: longer, shorter, taller, smaller.', parentOutcome: 'Compare a pencil and a pen. Which is longer? By how much?' },
    { id: 'fc3', title: 'Non-Standard Units', concept: 'Before rulers, people measured with hands, feet, and sticks.', parentOutcome: 'Measure the table in hand-spans. Then in pencil-lengths. Are the numbers different?' },
  ],
  'math_g1_i_004': [
    {
      id: 'fc1',
      title: 'Your Conversation Starter',
      concept: 'Why are car wheels cylinders instead of cubes? Cylinders have curved sides so they roll smoothly. Cubes have flat faces and corners that would make them get stuck.',
      section2Title: 'Helpful Way to Explain',
      section2: 'Ask: "Does it have a flat face?" → "Can it slide?" Ask: "Does it have a curved side?" → "Can it roll?" This helps them link physical features of a shape to how it moves. We use special "math words" to describe 3D shapes. Faces are the flat surfaces you can touch. Edges are the straight lines where two faces meet. Vertices are the pointy corners where the edges come together.',
    },
    { id: 'fc2', title: 'Concept: Faces & Vertices', concept: 'Faces are the flat, smooth "walls" of the shape. A cube has 6 faces, but a sphere has zero flat faces. You can count faces by putting a small sticker on each one as you touch it. Vertices are the "corners" where three or more edges meet. A cube has 8 vertices, while a cone has only 1 vertex at the very top. Spheres have zero vertices because they have no corners.' },
    { id: 'fc3', title: 'Concept: Rolling Shapes', concept: 'Shapes with curved surfaces (spheres, cylinders, cones) can roll. Spheres roll in any direction, while cylinders only roll in one direction. This is why we use cylinders for rolling pins.' },
    { id: 'fc4', title: 'Concept: Stacking', concept: 'To stack, a shape needs a flat top and a flat bottom to balance. Cubes and rectangular prisms are the best for stacking. You cannot stack spheres because they have no flat place to rest.' },
    { id: 'fc5', title: 'Why This Matters', concept: 'At this level, kids start "analytical thinking." They stop looking at the whole object and start identifying its parts. Learning how edges and corners work helps them understand how things are built and how they move.' },
    { id: 'fc6', title: 'Real-Life Connection', concept: 'A brick is a rectangular prism. It has flat faces so it stays still when you build a wall. A wheel is a cylinder so it can move. A funnel is a cone because its shape helps pour liquid into a small hole.' },
    { id: 'fc7', title: 'Common Misconception', concept: 'Thinking a cylinder can only roll. Show them that if you stand a cylinder on its flat end, it can slide just like a block. It is a "multi-talented" shape that can do both.' },
  ],
  'math_g1_a_001': [
    { id: 'fc1', title: 'Two-Digit Numbers', concept: 'Numbers from 10 to 99 are two-digit numbers. They have a tens and ones place.', parentOutcome: 'Write 34. Ask: "How many tens? How many ones? What is 34 + 10?"' },
    { id: 'fc2', title: 'Adding Tens', concept: 'To add tens, just add the tens digits. 30 + 20 = 50 (3 tens + 2 tens = 5 tens).', parentOutcome: 'Try: 40 + 30, 20 + 50, 10 + 60. Use coins grouped in 10s.' },
    { id: 'fc3', title: 'Adding Ones Then Tens', concept: 'For 23 + 14: add ones first (3+4=7), then tens (20+10=30), total = 37.', parentOutcome: 'Work through 31 + 15 step by step on paper together.' },
  ],
  'math_g1_a_002': [
    { id: 'fc1', title: 'Skip Counting by 2', concept: 'Count every second number: 2, 4, 6, 8, 10... These are all even numbers.', parentOutcome: 'Clap and count by 2s to 20. Then write them down.' },
    { id: 'fc2', title: 'Skip Counting by 5', concept: 'Count in fives: 5, 10, 15, 20... The pattern always ends in 0 or 5.', parentOutcome: 'Count fingers in groups of 5. Two hands = 10. Four hands = 20.' },
    { id: 'fc3', title: 'Even and Odd', concept: 'Even numbers end in 0, 2, 4, 6, 8. Odd numbers end in 1, 3, 5, 7, 9.', parentOutcome: 'Write numbers 1–20. Circle even in blue, odd in red.' },
  ],
  'math_g1_a_003': [
    { id: 'fc1', title: 'Coins of India', concept: 'Indian coins: ₹1, ₹2, ₹5, ₹10. Each has a different size and value.', parentOutcome: 'Lay out all coins. Sort by value. Which is worth most?' },
    { id: 'fc2', title: 'Making Amounts', concept: 'You can make the same amount in different ways. ₹5 = five ₹1 coins or one ₹5 coin.', parentOutcome: 'Ask: "Show me ₹8 using only ₹2 coins. Now using ₹1 and ₹5."' },
    { id: 'fc3', title: 'Buying and Change', concept: 'If something costs ₹6 and you pay ₹10, your change is ₹10 − ₹6 = ₹4.', parentOutcome: 'Set up a pretend shop. Price items ₹3–₹9. Practice paying and giving change.' },
  ],
  'math_g1_a_004': [
    {
      id: 'fc1',
      title: 'Your Conversation Starter',
      concept: 'If we want to build a rocket, what shapes should we use? A cylinder for the body because it is tall, and a cone for the top because it is pointy and aerodynamic. What could we use for the engine boosters? Smaller cylinders or cones!',
      section2Title: 'Helpful Way to Explain',
      section2: '3D shapes are like the building blocks of the entire world. You can put them together to make "Composite Shapes" — new objects made of many parts. A house is often a cube with a triangular prism on top. Ask: "What shapes make up this lamp?" Ask: "Compare a cube and a sphere — what is one way they are the same and one way they are different?" This encourages them to look for deep mathematical patterns.',
    },
    { id: 'fc2', title: 'Concept: Attributes', concept: 'Attributes are descriptive words like "round," "flat," "pointy," or "straight." We use these to sort shapes into families. Mathematicians use these rules to organise everything in the universe. Composite Shapes: This is the term for an object made of two or more simple 3D shapes. You can become an architect by learning how these shapes fit together. Think about how Lego bricks are mostly rectangular prisms.' },
    { id: 'fc3', title: 'Concept: Surface Area & Symmetry', concept: 'Surface Area (Simple): Every 3D shape has an "outside" that you can touch or paint. A large box has more surface to paint than a small ball. This helps us understand how much wrapping paper we need for a gift. Symmetry: Many 3D shapes look the same on both sides if you cut them exactly in half. You can see this in a cylinder or a cube. Symmetry is very important in building bridges and airplanes so they stay balanced.' },
    { id: 'fc4', title: 'Concept: Volume', concept: 'Volume (Simple): This is how much "stuff" fits inside a 3D shape. A big bucket has more volume than a small cup, even if they are both the same shape. This is how we measure things like water or sand.' },
    { id: 'fc5', title: 'Why This Matters', concept: 'This develops "spatial reasoning," a skill highly linked to success in engineering and architecture. Understanding that complex objects are made of simpler parts helps children deconstruct and solve difficult problems.' },
    { id: 'fc6', title: 'Real-Life Connection', concept: 'A sharp pencil is a cylinder with a cone on the end. A flashlight is a cylinder with a hemisphere (half-sphere) on top. Even a tree can be seen as a cylinder (trunk) with a sphere (leaves) on top.' },
    { id: 'fc7', title: 'Common Misconception', concept: 'Thinking all boxes are cubes. Most boxes are actually rectangular prisms because their sides are not all equal. A cube is a very special, rare type of box where every single side is a perfect square.' },
  ],
};

// ── QA CARDS DATA ────────────────────────────────────────────────────────────
export const qaCardsData = {
  'math_g1_b_001': [
    { id: 'q1', question: 'What number comes after 9?', answer: '10. After 9 we move to a new group of ten.' },
    { id: 'q2', question: 'Count backwards from 5.', answer: '5, 4, 3, 2, 1. Each step goes one less.' },
  ],
  'math_g1_b_002': [
    { id: 'q1', question: 'If I want to roll something across the floor very fast, which shape should I use?', answer: 'A sphere or a cylinder because they have curved surfaces. A cube would just slide or get stuck!' },
    { id: 'q2', question: 'Which shape has a pointy top like a mountain and a round bottom?', answer: 'That is a cone! It is the only shape that has one flat face and one sharp point at the very top.' },
  ],
  'math_g1_b_003': [
    { id: 'q1', question: 'What does the + sign mean?', answer: 'It means add or put together.' },
    { id: 'q2', question: 'What is 4 + 3?', answer: '7. Count on from 4: 5, 6, 7.' },
  ],
  'math_g1_i_001': [
    { id: 'q1', question: 'In the number 24, what does the 2 mean?', answer: '2 tens, which equals 20.' },
    { id: 'q2', question: 'How many ones are in 17?', answer: '7 ones. The 1 means 1 ten = 10.' },
  ],
  'math_g1_i_002': [
    { id: 'q1', question: 'What is 9 − 4?', answer: '5. Start at 9, count back 4 steps.' },
    { id: 'q2', question: 'If 6 + 3 = 9, what is 9 − 3?', answer: '6. Addition and subtraction are opposites.' },
  ],
  'math_g1_i_003': [
    { id: 'q1', question: 'Which is longer — 5 cm or 8 cm?', answer: '8 cm is longer.' },
    { id: 'q2', question: 'What tool do we use to measure length?', answer: 'A ruler, measuring tape, or metre stick.' },
  ],
  'math_g1_i_004': [
    { id: 'q1', question: 'How many flat faces does a standard tissue box have?', answer: 'It has 6 faces because it is a rectangular prism. You can count the top, bottom, and all four sides to be sure.' },
    { id: 'q2', question: "Why can't we stack two spheres on top of each other?", answer: 'Because they have no flat faces to balance on. They will simply roll off the moment you let go!' },
  ],
  'math_g1_a_001': [
    { id: 'q1', question: 'What is 23 + 14?', answer: '37. Add ones: 3+4=7. Add tens: 20+10=30. Total: 37.' },
    { id: 'q2', question: 'What is 45 − 12?', answer: '33. Subtract ones: 5−2=3. Subtract tens: 40−10=30. Total: 33.' },
  ],
  'math_g1_a_002': [
    { id: 'q1', question: 'What are the first 5 even numbers?', answer: '2, 4, 6, 8, 10.' },
    { id: 'q2', question: 'Count by 5s: 5, 10, 15, __, 25.', answer: '20. The pattern adds 5 each time.' },
  ],
  'math_g1_a_003': [
    { id: 'q1', question: 'How many ₹2 coins make ₹10?', answer: '5 coins. 5 × ₹2 = ₹10.' },
    { id: 'q2', question: 'You pay ₹10 for a ₹7 item. What is your change?', answer: '₹3. ₹10 − ₹7 = ₹3.' },
  ],
  'math_g1_a_004': [
    { id: 'q1', question: 'If you put two identical cubes together side-by-side, what new shape do you make?', answer: 'A rectangular prism! This shows how shapes can change when they are combined.' },
    { id: 'q2', question: 'How is a cylinder different from a sphere?', answer: 'A cylinder has two flat faces and can stand still; a sphere has zero flat faces and is always ready to roll.' },
  ],
  'sci_g1_b_001': [
    { id: 'q1', question: 'What do roots do?', answer: 'They hold the plant in soil and absorb water.' },
    { id: 'q2', question: 'Which part of the plant makes food?', answer: 'The leaves, using sunlight and water.' },
  ],
  'sci_g1_b_002': [
    { id: 'q1', question: 'Name 2 pet animals and 2 wild animals.', answer: 'Pets: dog, cat. Wild: lion, elephant.' },
    { id: 'q2', question: 'What does a cow eat?', answer: 'Grass and hay. Cows are herbivores.' },
  ],
  'sci_g1_b_003': [
    { id: 'q1', question: 'Which sense do you use to hear music?', answer: 'Hearing — using your ears.' },
    { id: 'q2', question: 'Name all 5 senses.', answer: 'Sight, hearing, touch, taste, smell.' },
  ],
  'sci_g1_i_001': [
    { id: 'q1', question: 'Name 3 ways to save water at home.', answer: 'Turn off taps, take short showers, reuse washing water for plants.' },
    { id: 'q2', question: 'Why is water important?', answer: 'We need it to drink, cook, clean, and grow food.' },
  ],
  'sci_g1_i_002': [
    { id: 'q1', question: 'What type of weather is best for flying a kite?', answer: 'Windy weather.' },
    { id: 'q2', question: 'What do you wear on a rainy day?', answer: 'A raincoat and boots to stay dry.' },
  ],
  'sci_g1_i_003': [
    { id: 'q1', question: 'Name the 5 food groups.', answer: 'Grains, vegetables, fruits, protein, dairy.' },
    { id: 'q2', question: 'Which food gives you energy?', answer: 'Grains like rice, bread, and oats give energy.' },
  ],
  'sci_g1_a_001': [
    { id: 'q1', question: 'What does recycling mean?', answer: 'Turning old materials into new products instead of throwing them away.' },
    { id: 'q2', question: 'Name 3 things you can recycle.', answer: 'Paper, plastic bottles, glass jars.' },
  ],
  'sci_g1_a_002': [
    { id: 'q1', question: 'Why does a fish have fins?', answer: 'Fins help it swim and steer through water.' },
    { id: 'q2', question: 'How does a camel survive in the desert?', answer: 'Its hump stores fat for energy, and it can go days without water.' },
  ],
  'sci_g1_a_003': [
    { id: 'q1', question: 'What do plants need to make food?', answer: 'Sunlight, water, and carbon dioxide from the air.' },
    { id: 'q2', question: 'What gas do plants release during photosynthesis?', answer: 'Oxygen — the gas we breathe.' },
  ],
  'eng_g1_b_001': [
    { id: 'q1', question: 'What sound does the letter S make?', answer: '"Sss" like a snake.' },
    { id: 'q2', question: 'Blend these sounds: b-a-g.', answer: 'Bag.' },
  ],
  'eng_g1_b_002': [
    { id: 'q1', question: 'What is a sight word?', answer: 'A common word we recognise instantly without sounding it out, like "the" or "is".' },
    { id: 'q2', question: 'Use "and" in a sentence.', answer: 'Example: "I have a cat and a dog."' },
  ],
  'eng_g1_b_003': [
    { id: 'q1', question: 'What does every sentence start with?', answer: 'A capital letter.' },
    { id: 'q2', question: 'What do we put at the end of a sentence?', answer: 'A full stop (.), question mark (?), or exclamation mark (!).' },
  ],
  'eng_g1_i_001': [
    { id: 'q1', question: 'What is the setting of a story?', answer: 'Where and when the story takes place.' },
    { id: 'q2', question: 'Who are the characters in a story?', answer: 'The people or animals the story is about.' },
  ],
  'eng_g1_i_002': [
    { id: 'q1', question: 'Is "table" a noun or a verb?', answer: 'Noun — it is a thing.' },
    { id: 'q2', question: 'Is "jump" a noun or a verb?', answer: 'Verb — it is an action.' },
  ],
  'eng_g1_i_003': [
    { id: 'q1', question: 'What is an adjective?', answer: 'A word that describes a noun. Example: big, red, happy.' },
    { id: 'q2', question: 'Add an adjective: "The ___ dog barked."', answer: 'Example: "The loud dog barked." or "The small dog barked."' },
  ],
  'eng_g1_a_001': [
    { id: 'q1', question: 'What are the 4 parts of a story?', answer: 'Beginning, middle, problem, and end.' },
    { id: 'q2', question: 'What is the main idea of a story?', answer: 'The most important thing the story is about.' },
  ],
  'eng_g1_a_002': [
    { id: 'q1', question: 'How many sentences are in a paragraph?', answer: 'Usually 3–5 sentences all about the same topic.' },
    { id: 'q2', question: 'What is a topic sentence?', answer: 'The first sentence that tells what the paragraph is about.' },
  ],
  'eng_g1_a_003': [
    { id: 'q1', question: 'When do we use a question mark?', answer: 'At the end of a question. Example: "Where are you going?"' },
    { id: 'q2', question: 'Fix this sentence: "the cat sat on the mat"', answer: '"The cat sat on the mat." — capital T and full stop.' },
  ],
  'soc_g1_b_001': [
    { id: 'q1', question: 'What is a family?', answer: 'People who love and care for each other and live together.' },
    { id: 'q2', question: 'Name 4 family members.', answer: 'Mother, father, sister, brother (or grandparent, uncle, aunt).' },
  ],
  'soc_g1_b_002': [
    { id: 'q1', question: 'What does a doctor do?', answer: 'A doctor helps sick people get better.' },
    { id: 'q2', question: 'Who do you call in an emergency?', answer: 'Police (100), Fire (101), Ambulance (108) in India.' },
  ],
  'soc_g1_b_003': [
    { id: 'q1', question: 'Name one act of kindness you can do today.', answer: 'Help a friend, share food, say thank you, or tidy up without being asked.' },
    { id: 'q2', question: 'Why is sharing important?', answer: 'Sharing makes others happy and builds friendship and trust.' },
  ],
  'soc_g1_i_001': [
    { id: 'q1', question: 'What is the capital of India?', answer: 'New Delhi.' },
    { id: 'q2', question: 'What is India\'s national animal?', answer: 'The Bengal Tiger.' },
  ],
  'soc_g1_i_002': [
    { id: 'q1', question: 'Name 3 emotions.', answer: 'Happy, sad, angry (also: scared, surprised, proud).' },
    { id: 'q2', question: 'What is a healthy way to handle anger?', answer: 'Take deep breaths, count to 10, or talk to someone you trust.' },
  ],
  'soc_g1_i_003': [
    { id: 'q1', question: 'What does a red traffic light mean?', answer: 'Stop.' },
    { id: 'q2', question: 'Name 2 road safety rules.', answer: 'Look both ways before crossing. Use the footpath, not the road.' },
  ],
  'soc_g1_a_001': [
    { id: 'q1', question: 'Why is Gandhi called the Father of the Nation?', answer: 'He led India\'s independence movement peacefully and inspired millions.' },
    { id: 'q2', question: 'What did Gandhi teach us?', answer: 'Non-violence, truth, and standing up for what is right.' },
  ],
  'soc_g1_a_002': [
    { id: 'q1', question: 'What are the 4 cardinal directions?', answer: 'North, South, East, West.' },
    { id: 'q2', question: 'Which direction does the sun rise from?', answer: 'East.' },
  ],
  'soc_g1_a_003': [
    { id: 'q1', question: 'Name 3 festivals of India.', answer: 'Diwali, Eid, Christmas (also: Holi, Pongal, Navratri).' },
    { id: 'q2', question: 'Why do we celebrate festivals?', answer: 'To honour traditions, spend time with family, and share joy with others.' },
  ],
};

// ── PROMPTS DATA ─────────────────────────────────────────────────────────────
export const promptsData = {
  'math_g1_b_001': [
    { id: 'p1', prompt: 'Count all the chairs in your home. How many are there?', hint: 'Walk room to room and count each one.' },
    { id: 'p2', prompt: 'Count backwards from 10 like a rocket launch!', hint: '10, 9, 8... blast off at 1!' },
  ],
  'math_g1_b_002': [
    { id: 'p1', prompt: 'The Feelie Bag: Put a ball, a block, and a can in a bag. Have the child reach in and guess the shape just by touching it. This forces them to think about edges and curves without seeing them.', hint: 'Feel for flat faces, sharp corners, and curved surfaces.' },
    { id: 'p2', prompt: 'Challenging Activity: Find a 3D shape in the house that has both a flat surface and a curved surface. A great example is a glue stick or a battery. Ask them to explain why it is a cylinder and not a sphere.', hint: 'A cylinder has two flat circles on the ends AND a curved middle.' },
    { id: 'p3', prompt: 'Quick Recap Cue: 3D shapes are solid objects that occupy space and have depth, unlike flat 2D drawings. Recognising these solids is the first step in understanding how the physical world is constructed.', hint: 'Ask: "Is this flat like a drawing, or solid like a toy?"' },
  ],
  'math_g1_b_003': [
    { id: 'p1', prompt: 'You have 3 pencils. Your friend gives you 4 more. How many now?', hint: 'Put them together and count all of them.' },
    { id: 'p2', prompt: 'Make up your own addition story using toys.', hint: 'Start with: "I had ___ toys and got ___ more..."' },
  ],
  'math_g1_i_001': [
    { id: 'p1', prompt: 'Show 23 using coins: group 10, then 10, then 3 ones.', hint: '2 groups of 10 = 2 tens. Plus 3 ones = 23.' },
    { id: 'p2', prompt: 'Write the number 19 in tens and ones.', hint: '1 ten and 9 ones.' },
  ],
  'math_g1_i_002': [
    { id: 'p1', prompt: 'You have 10 grapes. Eat 6. How many are left?', hint: 'Start at 10, count back 6 steps.' },
    { id: 'p2', prompt: 'Write a subtraction story about birds flying away from a tree.', hint: 'Start with some birds, then some fly away...' },
  ],
  'math_g1_i_003': [
    { id: 'p1', prompt: 'Measure 5 objects using a pencil as your ruler. Which is longest?', hint: 'Lay the pencil next to each object and count how many pencil-lengths it is.' },
    { id: 'p2', prompt: 'Are you taller or shorter than the door handle? How do you know?', hint: 'Stand next to it and compare.' },
  ],
  'math_g1_i_004': [
    { id: 'p1', prompt: 'The Slide Test: Use a cardboard plank as a ramp. Test which shapes roll down and which ones slide down. Have your child predict what will happen before you let the shape go.', hint: 'Curved surfaces roll. Flat surfaces slide. Ask: "Did it do what you expected?"' },
    { id: 'p2', prompt: 'Challenging Activity: Can you find a shape that rolls in a straight line (cylinder) and one that rolls in a circle (cone)? Ask them to explain why the cone moves in a circle (because one end is smaller than the other).', hint: 'A cylinder rolls straight because both ends are equal. A cone curves because one end is a point.' },
    { id: 'p3', prompt: 'Quick Recap Cue: We identify and group spatial shapes by counting their faces, edges, and vertices. These specific physical traits determine whether a shape is best suited for rolling, sliding, or stacking.', hint: 'Ask: "How many faces, edges, and vertices does this shape have?"' },
  ],
  'math_g1_a_001': [
    { id: 'p1', prompt: 'Add 34 + 25 by breaking into tens and ones.', hint: '30+20=50, 4+5=9, so 50+9=59.' },
    { id: 'p2', prompt: 'Subtract 47 − 13. Show your working.', hint: '40−10=30, 7−3=4, so 30+4=34.' },
  ],
  'math_g1_a_002': [
    { id: 'p1', prompt: 'Write all even numbers from 2 to 20.', hint: 'They end in 0, 2, 4, 6, or 8.' },
    { id: 'p2', prompt: 'Count by 5s from 5 to 50. Clap on each number.', hint: '5, 10, 15, 20... the pattern adds 5 each time.' },
  ],
  'math_g1_a_003': [
    { id: 'p1', prompt: 'Make ₹15 in 3 different ways using coins.', hint: 'Try: three ₹5 coins, or one ₹10 + one ₹5, or fifteen ₹1 coins.' },
    { id: 'p2', prompt: 'You buy a pencil for ₹4 and a rubber for ₹3. You pay ₹10. What is your change?', hint: 'First add ₹4 + ₹3, then subtract from ₹10.' },
  ],
  'math_g1_a_004': [
    { id: 'p1', prompt: 'Shape Building: Use toothpicks and mini-marshmallows (or clay) to build the "skeleton" of a cube. This helps your child see the edges and vertices clearly while realizing that 3D shapes have an empty space inside.', hint: 'Count the toothpicks (edges = 12) and marshmallows (vertices = 8) after building.' },
    { id: 'p2', prompt: 'Challenging Activity: Find an object in the house that is made of three different 3D shapes combined. Have your child point to each part and name it correctly. A toy robot or a fancy lamp are great examples.', hint: 'Look for objects with a clear base, middle, and top that are each different shapes.' },
    { id: 'p3', prompt: 'Quick Recap Cue: Complex real-world structures are often composite shapes created by joining multiple simple solids together. By deconstructing these objects, we can better understand their volume, symmetry, and overall design.', hint: 'Ask: "What simple shapes make up this object? Could you build it with clay?"' },
  ],
  'sci_g1_b_001': [
    { id: 'p1', prompt: 'Find a plant at home. Point to each part and say its job.', hint: 'Roots drink, stem carries, leaves make food, flower makes seeds.' },
    { id: 'p2', prompt: 'Draw a plant and label all 5 parts.', hint: 'Roots, stem, leaves, flower, fruit.' },
  ],
  'sci_g1_b_002': [
    { id: 'p1', prompt: 'Name 3 animals that live in water and 3 that live on land.', hint: 'Water: fish, frog, whale. Land: dog, elephant, rabbit.' },
    { id: 'p2', prompt: 'Draw your favourite animal and write 2 facts about it.', hint: 'What does it eat? Where does it live?' },
  ],
  'sci_g1_b_003': [
    { id: 'p1', prompt: 'Close your eyes. Name 5 things you can hear right now.', hint: 'Listen carefully for quiet sounds too.' },
    { id: 'p2', prompt: 'Touch 5 objects. Describe each using only touch words.', hint: 'Rough, smooth, hard, soft, bumpy, cold, warm.' },
  ],
  'sci_g1_i_001': [
    { id: 'p1', prompt: 'List 5 ways your family uses water in one day.', hint: 'Drinking, cooking, bathing, washing dishes, watering plants.' },
    { id: 'p2', prompt: 'Make a "Water Hero" pledge: 3 things you will do to save water.', hint: 'Turn off taps, shorter showers, reuse water.' },
  ],
  'sci_g1_i_002': [
    { id: 'p1', prompt: 'Look outside right now. Describe today\'s weather in 3 words.', hint: 'Is it sunny, cloudy, windy, rainy, hot, or cold?' },
    { id: 'p2', prompt: 'Draw a weather chart for 3 days. Use symbols: sun, cloud, rain.', hint: 'Check the weather each morning and draw the symbol.' },
  ],
  'sci_g1_i_003': [
    { id: 'p1', prompt: 'Draw your ideal healthy meal on a plate. Label each food.', hint: 'Include something from each food group.' },
    { id: 'p2', prompt: 'Which foods give energy? Which help you grow? Name 2 of each.', hint: 'Energy: rice, bread. Growth: eggs, milk, dal.' },
  ],
  'sci_g1_a_001': [
    { id: 'p1', prompt: 'Sort today\'s rubbish into: can recycle / cannot recycle.', hint: 'Paper, plastic, glass = recycle. Food scraps = compost.' },
    { id: 'p2', prompt: 'Name 3 things you can do to help the environment this week.', hint: 'Plant a seed, pick up litter, use less plastic.' },
  ],
  'sci_g1_a_002': [
    { id: 'p1', prompt: 'Pick 3 animals. For each, name one special body feature and why it helps.', hint: 'Fish: fins to swim. Camel: hump for energy. Penguin: thick feathers for cold.' },
    { id: 'p2', prompt: 'If you could have one animal superpower, what would it be and why?', hint: 'Think about speed, camouflage, flying, or echolocation.' },
  ],
  'sci_g1_a_003': [
    { id: 'p1', prompt: 'Draw a leaf and add arrows showing what goes in and what comes out during photosynthesis.', hint: 'In: sunlight, water, CO₂. Out: food and oxygen.' },
    { id: 'p2', prompt: 'What would happen to animals if all plants disappeared?', hint: 'Think about food chains and oxygen.' },
  ],
  'eng_g1_b_001': [
    { id: 'p1', prompt: 'Say the alphabet. Clap on every vowel: A, E, I, O, U.', hint: 'There are 5 vowels in the alphabet.' },
    { id: 'p2', prompt: 'Sound out these words slowly: cat, dog, sun, hat, big.', hint: 'Say each sound separately, then blend them together.' },
  ],
  'eng_g1_b_002': [
    { id: 'p1', prompt: 'Find the word "the" on any page of a book. How many times does it appear?', hint: '"The" is the most common word in English.' },
    { id: 'p2', prompt: 'Make a sentence using 3 sight words: I, am, happy.', hint: '"I am happy today!"' },
  ],
  'eng_g1_b_003': [
    { id: 'p1', prompt: 'Write 3 sentences about your day. Check: capital letter, full stop.', hint: 'Start with: "Today I..." or "I went to..."' },
    { id: 'p2', prompt: 'Draw a picture and write one sentence describing it.', hint: 'Look at your drawing and describe what you see.' },
  ],
  'eng_g1_i_001': [
    { id: 'p1', prompt: 'Read a short story. Tell it back in 3 sentences: beginning, middle, end.', hint: 'Who was in it? What happened? How did it end?' },
    { id: 'p2', prompt: 'What was the problem in the last story you read? How was it solved?', hint: 'Every good story has a problem and a solution.' },
  ],
  'eng_g1_i_002': [
    { id: 'p1', prompt: 'Write 5 nouns and 5 verbs you can see or do right now.', hint: 'Nouns: chair, book, window. Verbs: sit, read, look.' },
    { id: 'p2', prompt: 'Make a sentence using one noun and one verb.', hint: '"The dog runs." or "The bird sings."' },
  ],
  'eng_g1_i_003': [
    { id: 'p1', prompt: 'Describe your bedroom using 5 adjectives.', hint: 'Think about colours, sizes, and how things feel.' },
    { id: 'p2', prompt: 'Take a plain sentence and add 2 adjectives to make it more interesting.', hint: '"A dog barked." → "A big, brown dog barked."' },
  ],
  'eng_g1_a_001': [
    { id: 'p1', prompt: 'Retell your favourite story in 4 sentences.', hint: 'Sentence 1: who and where. 2: what happened. 3: the problem. 4: the ending.' },
    { id: 'p2', prompt: 'Why did the main character make that choice? Do you agree?', hint: 'Think about what the character wanted and feared.' },
  ],
  'eng_g1_a_002': [
    { id: 'p1', prompt: 'Write a paragraph about your favourite food. Use 4 sentences.', hint: 'What is it? What does it look like? What does it taste like? Why do you love it?' },
    { id: 'p2', prompt: 'Does your paragraph have a topic sentence? Underline it.', hint: 'The topic sentence tells the reader what the paragraph is about.' },
  ],
  'eng_g1_a_003': [
    { id: 'p1', prompt: 'Write 3 questions about your day. Use question marks.', hint: 'Start with: What, Where, When, Why, or How.' },
    { id: 'p2', prompt: 'Fix these sentences: "where are you going" and "i love pizza"', hint: 'Add capital letters and correct punctuation at the end.' },
  ],
  'soc_g1_b_001': [
    { id: 'p1', prompt: 'Draw your family tree. Write each person\'s name and relation.', hint: 'Start with yourself, then add parents, then grandparents.' },
    { id: 'p2', prompt: 'What is one thing each family member does to help at home?', hint: 'Think about cooking, cleaning, earning, caring.' },
  ],
  'soc_g1_b_002': [
    { id: 'p1', prompt: 'Draw a community helper and write 2 things they do.', hint: 'Doctor, teacher, police officer, firefighter, postman.' },
    { id: 'p2', prompt: 'If you could be any community helper, which would you choose and why?', hint: 'Think about what you enjoy doing and how you like to help.' },
  ],
  'soc_g1_b_003': [
    { id: 'p1', prompt: 'Do one kind act today. Write or draw what you did and how it felt.', hint: 'Help someone, share something, or say something kind.' },
    { id: 'p2', prompt: 'How would you feel if someone was unkind to you? What would you do?', hint: 'Think about how words and actions affect others.' },
  ],
  'soc_g1_i_001': [
    { id: 'p1', prompt: 'Draw the Indian flag and label its 3 colours and the symbol in the middle.', hint: 'Saffron, white, green — and the Ashoka Chakra.' },
    { id: 'p2', prompt: 'Name India\'s national animal, bird, and flower.', hint: 'Tiger, peacock, lotus.' },
  ],
  'soc_g1_i_002': [
    { id: 'p1', prompt: 'Draw 4 emotion faces. Under each, write what makes you feel that way.', hint: 'Happy, sad, angry, scared.' },
    { id: 'p2', prompt: 'What do you do when you feel very angry? Is it helpful?', hint: 'Think about deep breathing, talking, or taking a break.' },
  ],
  'soc_g1_i_003': [
    { id: 'p1', prompt: 'Act out crossing the road safely. What are the steps?', hint: 'Stop at the kerb. Look left, right, left again. Cross when clear.' },
    { id: 'p2', prompt: 'Name 3 safety rules for being at home alone.', hint: 'Don\'t open the door to strangers. Don\'t use the stove. Call a trusted adult if scared.' },
  ],
  'soc_g1_a_001': [
    { id: 'p1', prompt: 'Write 3 things Gandhi did and 1 thing you can learn from him.', hint: 'He led peaceful protests, promoted truth, and helped India become free.' },
    { id: 'p2', prompt: 'Who is your personal hero and why?', hint: 'Think about someone who is brave, kind, or works hard for others.' },
  ],
  'soc_g1_a_002': [
    { id: 'p1', prompt: 'Draw a map of your home with a compass rose showing N, S, E, W.', hint: 'Mark the front door, kitchen, and your bedroom.' },
    { id: 'p2', prompt: 'If you face north, what direction is behind you? To your left?', hint: 'Behind = South. Left = West.' },
  ],
  'soc_g1_a_003': [
    { id: 'p1', prompt: 'Pick 3 festivals. For each: when is it, how is it celebrated, one special food.', hint: 'Diwali: October/November, lights and fireworks, sweets. Eid: varies, prayers and feast, biryani.' },
    { id: 'p2', prompt: 'Why is it important to respect festivals of other religions?', hint: 'Think about kindness, learning, and living together peacefully.' },
  ],
};

// ── ACCESSOR FUNCTIONS ───────────────────────────────────────────────────────
export const getFlashcards = (nudgeId) => flashcardsData[nudgeId] || [];
export const getQACards = (nudgeId) => qaCardsData[nudgeId] || [];
export const getPrompts = (nudgeId) => promptsData[nudgeId] || [];
