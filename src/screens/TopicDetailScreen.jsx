// /**
//  * Topic Detail Screen - Shows daily nudge with calendar, units, and flashcards
//  */

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import LinearGradient from 'react-native-linear-gradient';

// const { width } = Dimensions.get('window');
// const isTablet = width >= 768;

// const TopicDetailScreen = ({ topicData, subjectName, onBack, onNavigate }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date().getDate());
//   const [expandedUnit, setExpandedUnit] = useState(null);
//   const [currentFlashcard, setCurrentFlashcard] = useState(0);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [showArticleModal, setShowArticleModal] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());
//   const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
//   const [learningStatus, setLearningStatus] = useState(null); // 'needs_practice' or 'knew_it'
//   const [topicRelevance, setTopicRelevance] = useState(null); // 'yes' or 'no'

//   // Get current date information
//   const currentDate = new Date();
//   const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
//   const currentYear = currentDate.getFullYear();
//   const currentDayName = currentDate.toLocaleString('en-US', { weekday: 'long' });
//   const currentDay = currentDate.getDate();

//   // Calendar data - generate week around current date
//   const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
//   // Generate dates for the current week
//   const generateWeekDates = () => {
//     const dates = [];
//     const today = new Date();
//     const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    
//     // Calculate the start of the week (Sunday)
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - dayOfWeek);
    
//     // Generate 7 days starting from Sunday
//     for (let i = 0; i < 7; i++) {
//       const date = new Date(startOfWeek);
//       date.setDate(startOfWeek.getDate() + i);
//       dates.push(date.getDate());
//     }
    
//     return dates;
//   };

//   const dates = generateWeekDates();

//   // Define dates with available data (only these dates can be selected)
//   // For now, we have data for the current week only
//   const getAvailableDates = () => {
//     const available = [];
//     const today = new Date();
//     const dayOfWeek = today.getDay();
    
//     // Calculate the start of the week (Sunday)
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - dayOfWeek);
    
//     // Add all dates from Sunday to today (current week up to today)
//     for (let i = 0; i <= dayOfWeek; i++) {
//       const date = new Date(startOfWeek);
//       date.setDate(startOfWeek.getDate() + i);
//       available.push({
//         date: date.getDate(),
//         month: date.getMonth(),
//         year: date.getFullYear(),
//       });
//     }
    
//     return available;
//   };

//   const availableDates = getAvailableDates();

//   // Check if a date has data available
//   const hasDataForDate = (day, month, year) => {
//     return availableDates.some(
//       d => d.date === day && d.month === month && d.year === year
//     );
//   };

//   // Weekly topics schedule - different topics from the same subject for each day
//   const getWeeklyTopics = () => {
//     const subject = topicData?.subject || subjectName;
    
//     // Mathematics topics
//     if (subject === 'Mathematics') {
//       return [
//         { day: 'Sunday', topic: 'Counting Money', icon: 'cash-multiple', color: '#27AE60' },
//         { day: 'Monday', topic: 'Simple Addition', icon: 'plus-circle', color: '#27AE60' },
//         { day: 'Tuesday', topic: 'Basic Shapes', icon: 'shape', color: '#27AE60' },
//         { day: 'Wednesday', topic: 'Patterns', icon: 'dots-horizontal', color: '#27AE60' },
//         { day: 'Thursday', topic: 'Measurement', icon: 'ruler', color: '#27AE60' },
//         { day: 'Friday', topic: 'Number Games', icon: 'numeric', color: '#27AE60' },
//         { day: 'Saturday', topic: 'Math in Daily Life', icon: 'calculator-variant', color: '#27AE60' },
//       ];
//     }
    
//     // Environmental Studies topics
//     if (subject === 'Environmental Studies') {
//       return [
//         { day: 'Sunday', topic: 'Rainwater Harvesting', icon: 'water', color: '#2196F3' },
//         { day: 'Monday', topic: 'Water Cycle', icon: 'water-outline', color: '#00BCD4' },
//         { day: 'Tuesday', topic: 'Saving Water', icon: 'water-pump', color: '#0097A7' },
//         { day: 'Wednesday', topic: 'Parts of a Plant', icon: 'flower', color: '#FF6B9D' },
//         { day: 'Thursday', topic: 'Growing Plants', icon: 'sprout', color: '#8BC34A' },
//         { day: 'Friday', topic: 'Trees & Nature', icon: 'tree', color: '#4CAF50' },
//         { day: 'Saturday', topic: 'Recycling', icon: 'recycle', color: '#27AE60' },
//       ];
//     }
    
//     // Science topics
//     if (subject === 'Science') {
//       return [
//         { day: 'Sunday', topic: 'Amazing Animals', icon: 'paw', color: '#9B59B6' },
//         { day: 'Monday', topic: 'Animal Homes', icon: 'home-variant', color: '#795548' },
//         { day: 'Tuesday', topic: 'Five Senses', icon: 'eye', color: '#00BCD4' },
//         { day: 'Wednesday', topic: 'Healthy Habits', icon: 'heart-pulse', color: '#27AE60' },
//         { day: 'Thursday', topic: 'My Body', icon: 'human', color: '#FF9800' },
//         { day: 'Friday', topic: 'Food & Nutrition', icon: 'food-apple', color: '#4CAF50' },
//         { day: 'Saturday', topic: 'Weather', icon: 'weather-partly-cloudy', color: '#2196F3' },
//       ];
//     }
    
//     // Language Arts topics
//     if (subject === 'Language Arts') {
//       return [
//         { day: 'Sunday', topic: 'Story Time', icon: 'book-open-variant', color: '#E74C3C' },
//         { day: 'Monday', topic: 'Reading Skills', icon: 'book-alphabet', color: '#FF5722' },
//         { day: 'Tuesday', topic: 'Writing Letters', icon: 'pencil', color: '#FF9800' },
//         { day: 'Wednesday', topic: 'Rhyming Words', icon: 'music-note', color: '#9C27B0' },
//         { day: 'Thursday', topic: 'Story Elements', icon: 'book-open-page-variant', color: '#27AE60' },
//         { day: 'Friday', topic: 'Vocabulary', icon: 'alphabetical', color: '#2196F3' },
//         { day: 'Saturday', topic: 'Creative Writing', icon: 'fountain-pen-tip', color: '#00BCD4' },
//       ];
//     }
    
//     // Values & Character topics
//     if (subject === 'Values & Character') {
//       return [
//         { day: 'Sunday', topic: 'Acts of Kindness', icon: 'heart-multiple', color: '#27AE60' },
//         { day: 'Monday', topic: 'Sharing & Caring', icon: 'hand-heart', color: '#FF6B9D' },
//         { day: 'Tuesday', topic: 'Honesty', icon: 'shield-check', color: '#2196F3' },
//         { day: 'Wednesday', topic: 'Respect', icon: 'account-group', color: '#9C27B0' },
//         { day: 'Thursday', topic: 'Empathy', icon: 'emoticon-happy', color: '#FF9800' },
//         { day: 'Friday', topic: 'Gratitude', icon: 'gift', color: '#4CAF50' },
//         { day: 'Saturday', topic: 'Helping Others', icon: 'hand-heart-outline', color: '#00BCD4' },
//       ];
//     }
    
//     // Arts & Creativity topics
//     if (subject === 'Arts & Creativity') {
//       return [
//         { day: 'Sunday', topic: 'Color Mixing', icon: 'palette', color: '#FFB84D' },
//         { day: 'Monday', topic: 'Drawing Fun', icon: 'brush', color: '#FF9800' },
//         { day: 'Tuesday', topic: 'Craft Time', icon: 'scissors-cutting', color: '#27AE60' },
//         { day: 'Wednesday', topic: 'Music & Rhythm', icon: 'music', color: '#9C27B0' },
//         { day: 'Thursday', topic: 'Creative Expression', icon: 'palette-outline', color: '#2196F3' },
//         { day: 'Friday', topic: 'Art Gallery', icon: 'image-multiple', color: '#4CAF50' },
//         { day: 'Saturday', topic: 'Recycled Art', icon: 'recycle', color: '#00BCD4' },
//       ];
//     }
    
//     // Default topics
//     return [
//       { day: 'Sunday', topic: 'Learning Fun', icon: 'school', color: '#2196F3' },
//       { day: 'Monday', topic: 'Discovery Time', icon: 'magnify', color: '#FF9800' },
//       { day: 'Tuesday', topic: 'Exploration', icon: 'compass', color: '#4CAF50' },
//       { day: 'Wednesday', topic: 'Creative Play', icon: 'puzzle', color: '#9C27B0' },
//       { day: 'Thursday', topic: 'Learning Journey', icon: 'map', color: '#27AE60' },
//       { day: 'Friday', topic: 'Fun Activities', icon: 'star', color: '#FFB84D' },
//       { day: 'Saturday', topic: 'Weekend Learning', icon: 'calendar-star', color: '#00BCD4' },
//     ];
//   };

//   const weeklyTopics = getWeeklyTopics();
  
//   // Get today's topic based on current day
//   const todayIndex = currentDate.getDay();
//   const todayTopic = weeklyTopics[todayIndex];

//   // Get the topic for the selected date
//   const getSelectedDayIndex = () => {
//     // Find which day of the week the selected date is
//     const today = new Date();
//     const selectedDateObj = new Date(today);
    
//     // Find the selected date in the current week
//     for (let i = 0; i < dates.length; i++) {
//       if (dates[i] === selectedDate) {
//         return i; // This gives us the day of week (0-6)
//       }
//     }
//     return todayIndex; // Default to today
//   };

//   const selectedDayIndex = getSelectedDayIndex();
//   const selectedDayTopic = weeklyTopics[selectedDayIndex];

//   // Update topic data based on selected date
//   const displayTopic = {
//     ...topicData,
//     topic: selectedDayTopic.topic,
//     title: selectedDayTopic.topic,
//     icon: selectedDayTopic.icon,
//     iconColor: selectedDayTopic.color,
//   };

//   // Generate full calendar for picker
//   const generateFullCalendar = () => {
//     const firstDay = new Date(pickerYear, pickerMonth, 1);
//     const lastDay = new Date(pickerYear, pickerMonth + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();
    
//     const calendar = [];
//     let week = [];
    
//     // Add empty cells for days before month starts
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       week.push(null);
//     }
    
//     // Add all days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       week.push(day);
      
//       if (week.length === 7) {
//         calendar.push(week);
//         week = [];
//       }
//     }
    
//     // Add empty cells for remaining days
//     if (week.length > 0) {
//       while (week.length < 7) {
//         week.push(null);
//       }
//       calendar.push(week);
//     }
    
//     return calendar;
//   };

//   const calendarGrid = generateFullCalendar();
//   const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//   const goToPreviousMonth = () => {
//     if (pickerMonth === 0) {
//       setPickerMonth(11);
//       setPickerYear(pickerYear - 1);
//     } else {
//       setPickerMonth(pickerMonth - 1);
//     }
//   };

//   const goToNextMonth = () => {
//     if (pickerMonth === 11) {
//       setPickerMonth(0);
//       setPickerYear(pickerYear + 1);
//     } else {
//       setPickerMonth(pickerMonth + 1);
//     }
//   };

//   const handleDateSelect = (day) => {
//     if (day) {
//       setSelectedDate(day);
//       setShowDatePicker(false);
//     }
//   };

//   // Get subject color based on subject name
//   const subjectColors = {
//     'Environmental Studies': '#27AE60',
//     'Mathematics': '#27AE60',
//     'Science': '#27AE60',
//     'Language Arts': '#27AE60',
//     'Values & Character': '#27AE60',
//     'Arts & Creativity': '#27AE60',
//   };

//   const subjectColor = subjectColors[subjectName || topicData?.subject] || '#45a578';

//   // Units data - dynamically created based on topic
//   const units = [
//     {
//       id: 1,
//       name: `Unit 1 - All About ${displayTopic?.topic || 'This Topic'}`,
//       concept: displayTopic?.whatYouWillLearn || topicData?.whatYouWillLearn || 'Key concepts and learning objectives for this topic.',
//       parentOutcome: 'Practical applications in daily life and real-world connections.',
//     },
//     {
//       id: 2,
//       name: 'Unit 2 - Questions & Answers related to the topic',
//       description: 'Interactive Q&A session to test your understanding and clarify doubts.',
//     },
//     {
//       id: 3,
//       name: 'Unit 3 - Prompts related to the topic',
//       description: 'Thought-provoking prompts to encourage deeper thinking and conversation.',
//     },
//     {
//       id: 4,
//       name: 'Unit 4 - Vocabulary related to the topic',
//       description: 'Important terms and definitions related to this topic.',
//     },
//   ];

//   // Create prompts for Unit 3
//   const createPrompts = () => {
//     const subject = displayTopic?.subject;
    
//     // Mathematics Prompts
//     if (subject === 'Mathematics') {
//       return [
//         {
//           id: 1,
//           prompt: 'If we\'re fencing our garden, would we need to find the area or perimeter? Why do you think that?',
//         },
//         {
//           id: 2,
//           prompt: 'We know that 1 meter = 100 centimeters. How many millimeters do you think are in 1 meter? Let\'s figure it out together!',
//         },
//         {
//           id: 3,
//           prompt: 'Look around the room. Can you find something that might be about 1 meter long? How could we check if we\'re right?',
//         },
//       ];
//     }
    
//     // Environmental Studies Prompts
//     if (subject === 'Environmental Studies') {
//       return [
//         {
//           id: 1,
//           prompt: 'If we collected rainwater in a bucket, what are 3 different ways we could use it at home?',
//         },
//         {
//           id: 2,
//           prompt: 'Imagine you\'re a plant. What would you need to grow big and strong? How would you get those things?',
//         },
//         {
//           id: 3,
//           prompt: 'What do you think would happen to our planet if everyone saved just one glass of water every day?',
//         },
//       ];
//     }
    
//     // Science Prompts
//     if (subject === 'Science') {
//       return [
//         {
//           id: 1,
//           prompt: 'If you could have any animal\'s special ability (like flying, swimming underwater, or running super fast), which would you choose and why?',
//         },
//         {
//           id: 2,
//           prompt: 'Close your eyes and listen carefully. What sounds can you hear right now? Which sense are you using?',
//         },
//         {
//           id: 3,
//           prompt: 'Why do you think our body needs different types of food? What happens if we only eat one type?',
//         },
//       ];
//     }
    
//     // Language Arts Prompts
//     if (subject === 'Language Arts') {
//       return [
//         {
//           id: 1,
//           prompt: 'If you could change one thing in your favorite story, what would it be? How would that change the ending?',
//         },
//         {
//           id: 2,
//           prompt: 'Think of a character from a book you love. If they came to visit you for a day, what would you do together?',
//         },
//         {
//           id: 3,
//           prompt: 'What makes a story exciting for you? Is it adventure, mystery, funny parts, or something else?',
//         },
//       ];
//     }
    
//     // Values & Character Prompts
//     if (subject === 'Values & Character') {
//       return [
//         {
//           id: 1,
//           prompt: 'Can you remember a time when someone was kind to you? How did it make you feel?',
//         },
//         {
//           id: 2,
//           prompt: 'If you saw someone sitting alone and looking sad, what could you do to help them feel better?',
//         },
//         {
//           id: 3,
//           prompt: 'What\'s one kind thing you could do tomorrow that would make someone smile?',
//         },
//       ];
//     }
    
//     // Arts & Creativity Prompts
//     if (subject === 'Arts & Creativity') {
//       return [
//         {
//           id: 1,
//           prompt: 'If you could paint the sky any color you wanted, what color would you choose? What would that world look like?',
//         },
//         {
//           id: 2,
//           prompt: 'Look at something in the room. Can you draw it using only circles, squares, and triangles?',
//         },
//         {
//           id: 3,
//           prompt: 'If your feelings had colors, what color would happy be? What about excited or calm?',
//         },
//       ];
//     }
    
//     // Default prompts
//     return [
//       {
//         id: 1,
//         prompt: 'What interests you most about this topic? What would you like to learn more about?',
//       },
//       {
//         id: 2,
//         prompt: 'Can you think of a way to use what you learned in your daily life?',
//       },
//       {
//         id: 3,
//         prompt: 'If you could teach this topic to a friend, how would you explain it?',
//       },
//     ];
//   };

//   const prompts = createPrompts();

//   // Create vocabulary for Unit 4
//   const createVocabulary = () => {
//     const subject = displayTopic?.subject;
    
//     // Mathematics Vocabulary
//     if (subject === 'Mathematics') {
//       return [
//         {
//           id: 1,
//           word: 'Dormant',
//           type: 'Adjective',
//           definition: 'Word-Stressed Definition: A seed in a resting stage, not growing until conditions are right.',
//           example: '"The seed is like it\'s sleeping — it waits for the right water and warmth to \'wake up\' and grow."',
//           synonym: 'Inactive, asleep',
//         },
//         {
//           id: 2,
//           word: 'Germination',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: The first time a baby root (the radicle) pokes out of a seed — like the seed is "waking up."',
//           example: '"When you see that tiny white root coming out of the seed, that\'s germination!"',
//           synonym: 'Sprouting',
//         },
//         {
//           id: 3,
//           word: 'Radicle',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: The first tiny root that comes out of a seed during germination.',
//           example: '"The radicle is like the baby root — it\'s the first part to grow out of the seed."',
//           synonym: 'Baby root, first root',
//         },
//       ];
//     }
    
//     // Environmental Studies Vocabulary
//     if (subject === 'Environmental Studies') {
//       return [
//         {
//           id: 1,
//           word: 'Conservation',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: Protecting and saving natural resources like water, plants, and animals.',
//           example: '"Water conservation means using water wisely so we don\'t waste it."',
//           synonym: 'Protection, preservation',
//         },
//         {
//           id: 2,
//           word: 'Photosynthesis',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: The process plants use to make food from sunlight, water, and air.',
//           example: '"Plants use photosynthesis to turn sunlight into energy, just like we eat food for energy."',
//           synonym: 'Plant food-making',
//         },
//         {
//           id: 3,
//           word: 'Ecosystem',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: A community of living things (plants, animals) and their environment working together.',
//           example: '"A pond ecosystem includes fish, plants, water, and all the tiny creatures living together."',
//           synonym: 'Habitat, environment',
//         },
//       ];
//     }
    
//     // Science Vocabulary
//     if (subject === 'Science') {
//       return [
//         {
//           id: 1,
//           word: 'Adaptation',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: Special features that help animals survive in their environment.',
//           example: '"A polar bear\'s thick fur is an adaptation that keeps it warm in the cold Arctic."',
//           synonym: 'Adjustment, special feature',
//         },
//         {
//           id: 2,
//           word: 'Habitat',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: The natural home where an animal or plant lives.',
//           example: '"A fish\'s habitat is water, while a bird\'s habitat might be a tree or nest."',
//           synonym: 'Home, environment',
//         },
//         {
//           id: 3,
//           word: 'Nutrients',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: Substances in food that help our body grow, stay healthy, and have energy.',
//           example: '"Fruits and vegetables have lots of nutrients that make us strong and healthy."',
//           synonym: 'Vitamins, goodness',
//         },
//       ];
//     }
    
//     // Language Arts Vocabulary
//     if (subject === 'Language Arts') {
//       return [
//         {
//           id: 1,
//           word: 'Character',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: A person, animal, or creature in a story.',
//           example: '"Harry Potter is the main character in his story — the story is mostly about him."',
//           synonym: 'Person in story',
//         },
//         {
//           id: 2,
//           word: 'Setting',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: Where and when a story takes place.',
//           example: '"The setting of Cinderella is a kingdom long ago, with a castle and village."',
//           synonym: 'Place, location',
//         },
//         {
//           id: 3,
//           word: 'Plot',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: The sequence of events that happen in a story.',
//           example: '"The plot is what happens in the story — the beginning, middle, and end."',
//           synonym: 'Story events, what happens',
//         },
//       ];
//     }
    
//     // Values & Character Vocabulary
//     if (subject === 'Values & Character') {
//       return [
//         {
//           id: 1,
//           word: 'Empathy',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: Understanding and sharing the feelings of another person.',
//           example: '"When your friend is sad and you feel sad too, that\'s empathy — you understand their feelings."',
//           synonym: 'Understanding, compassion',
//         },
//         {
//           id: 2,
//           word: 'Kindness',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: Being friendly, caring, and helpful to others.',
//           example: '"Sharing your toys or helping someone who fell shows kindness."',
//           synonym: 'Caring, niceness',
//         },
//         {
//           id: 3,
//           word: 'Respect',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: Treating others the way you want to be treated, with care and politeness.',
//           example: '"Listening when someone talks and saying \'please\' and \'thank you\' shows respect."',
//           synonym: 'Politeness, consideration',
//         },
//       ];
//     }
    
//     // Arts & Creativity Vocabulary
//     if (subject === 'Arts & Creativity') {
//       return [
//         {
//           id: 1,
//           word: 'Primary Colors',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: The three basic colors (red, blue, yellow) that can\'t be made by mixing other colors.',
//           example: '"Red, blue, and yellow are primary colors — all other colors come from mixing these!"',
//           synonym: 'Basic colors',
//         },
//         {
//           id: 2,
//           word: 'Texture',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: How something feels when you touch it — smooth, rough, soft, or bumpy.',
//           example: '"Sandpaper has a rough texture, while silk has a smooth texture."',
//           synonym: 'Feel, surface',
//         },
//         {
//           id: 3,
//           word: 'Creativity',
//           type: 'Noun',
//           definition: 'Word-Stressed Definition: Using imagination to make something new and original.',
//           example: '"When you draw a picture from your imagination, you\'re using creativity!"',
//           synonym: 'Imagination, originality',
//         },
//       ];
//     }
    
//     // Default vocabulary
//     return [
//       {
//         id: 1,
//         word: 'Learning',
//         type: 'Noun',
//         definition: 'Word-Stressed Definition: Gaining knowledge or skills through study and experience.',
//         example: '"Every day we do learning when we discover new things!"',
//         synonym: 'Education, discovery',
//       },
//       {
//         id: 2,
//         word: 'Explore',
//         type: 'Verb',
//         definition: 'Word-Stressed Definition: To investigate and discover new things.',
//         example: '"Let\'s explore the garden and see what we can find!"',
//         synonym: 'Discover, investigate',
//       },
//       {
//         id: 3,
//         word: 'Curious',
//         type: 'Adjective',
//         definition: 'Word-Stressed Definition: Wanting to learn and know more about things.',
//         example: '"Being curious means asking questions and wanting to learn!"',
//         synonym: 'Interested, inquisitive',
//       },
//     ];
//   };

//   const vocabulary = createVocabulary();

//   // Create detailed article content based on subject and topic
//   const createArticleContent = () => {
//     const subject = displayTopic?.subject;
//     const topic = displayTopic?.topic;
    
//     // Mathematics articles
//     if (subject === 'Mathematics') {
//       if (topic === 'Counting Money' || topic === 'Simple Addition' || topic === 'Number Games') {
//         return {
//           title: `Understanding ${topic}`,
//           subtitle: 'Building Strong Math Foundations',
//           sections: [
//             {
//               heading: 'What is ' + topic + '?',
//               content: `${topic} is a fundamental mathematical skill that helps children understand numbers and their relationships. It builds the foundation for more complex mathematical concepts and real-world problem-solving.`,
//             },
//             {
//               heading: 'Why is it Important?',
//               content: 'Mastering this concept helps children develop logical thinking, problem-solving abilities, and confidence in handling everyday situations involving numbers. It\'s essential for academic success and daily life activities.',
//             },
//             {
//               heading: 'Practical Applications',
//               content: 'Children use these skills when shopping, sharing items with friends, calculating time, measuring ingredients for cooking, and understanding quantities in various contexts. These real-world applications make learning meaningful and engaging.',
//             },
//             {
//               heading: 'Tips for Parents',
//               content: 'Make learning fun through games, use real objects for counting, relate concepts to daily activities, celebrate small victories, and practice regularly in short, enjoyable sessions. Patience and encouragement are key to building confidence.',
//             },
//           ],
//         };
//       }
      
//       if (topic === 'Basic Shapes' || topic === 'Patterns' || topic === 'Measurement') {
//         return {
//           title: `Exploring ${topic}`,
//           subtitle: 'Visual and Spatial Learning',
//           sections: [
//             {
//               heading: 'Understanding ' + topic,
//               content: `${topic} helps children recognize patterns, understand spatial relationships, and develop visual-spatial intelligence. These skills are crucial for geometry, art, and everyday navigation.`,
//             },
//             {
//               heading: 'Real-World Connections',
//               content: 'Children encounter these concepts everywhere - in architecture, nature, art, and design. Recognizing and understanding them enhances observation skills and creative thinking.',
//             },
//             {
//               heading: 'Learning Through Play',
//               content: 'Use building blocks, puzzles, drawing activities, and outdoor exploration to make learning interactive and fun. Hands-on experiences create lasting understanding.',
//             },
//             {
//               heading: 'Building Skills',
//               content: 'These concepts develop critical thinking, problem-solving, and analytical skills that benefit all areas of learning and daily life.',
//             },
//           ],
//         };
//       }
//     }
    
//     // Environmental Studies articles
//     if (subject === 'Environmental Studies') {
//       return {
//         title: `Understanding ${topic}`,
//         subtitle: 'Caring for Our Planet',
//         sections: [
//           {
//             heading: 'What is ' + topic + '?',
//             content: `${topic} is an important environmental concept that teaches children about nature, conservation, and our responsibility towards the planet. Understanding this helps develop environmental awareness from an early age.`,
//           },
//           {
//             heading: 'Why Does it Matter?',
//             content: 'Our planet needs care and protection. By learning about environmental topics, children become responsible citizens who understand the impact of their actions on nature and future generations.',
//           },
//           {
//             heading: 'Practical Actions',
//             content: 'Children can contribute through simple actions like saving water, planting trees, recycling, reducing waste, and caring for plants and animals. Small actions create big impacts when everyone participates.',
//           },
//           {
//             heading: 'Teaching Sustainability',
//             content: 'Help children understand that every action matters. Encourage curiosity about nature, involve them in eco-friendly practices, and explain how their choices affect the environment.',
//           },
//         ],
//       };
//     }
    
//     // Science articles
//     if (subject === 'Science') {
//       return {
//         title: `Discovering ${topic}`,
//         subtitle: 'The Wonder of Science',
//         sections: [
//           {
//             heading: 'What is ' + topic + '?',
//             content: `${topic} introduces children to scientific concepts through observation, exploration, and discovery. Science helps us understand how the world works and encourages curiosity about everything around us.`,
//           },
//           {
//             heading: 'Scientific Thinking',
//             content: 'Learning science develops critical thinking, observation skills, and the ability to ask questions. Children learn to observe, hypothesize, experiment, and draw conclusions - skills valuable in all areas of life.',
//           },
//           {
//             heading: 'Hands-On Learning',
//             content: 'Science is best learned through experiments, observations, and hands-on activities. Encourage children to touch, explore, ask questions, and discover answers through investigation.',
//           },
//           {
//             heading: 'Everyday Science',
//             content: 'Science is everywhere - in cooking, weather, plants, animals, and our own bodies. Help children see the science in daily life to make learning relevant and exciting.',
//           },
//         ],
//       };
//     }
    
//     // Language Arts articles
//     if (subject === 'Language Arts') {
//       return {
//         title: `Mastering ${topic}`,
//         subtitle: 'The Power of Language',
//         sections: [
//           {
//             heading: 'Understanding ' + topic,
//             content: `${topic} develops communication skills, creativity, and expression. Language arts form the foundation for all learning, as reading and writing are essential for every subject.`,
//           },
//           {
//             heading: 'Building Literacy',
//             content: 'Strong language skills open doors to knowledge, imagination, and self-expression. Reading expands vocabulary, improves comprehension, and develops empathy through stories.',
//           },
//           {
//             heading: 'Making it Fun',
//             content: 'Read together daily, tell stories, play word games, write letters, create books, and encourage creative expression. Make reading and writing enjoyable activities, not chores.',
//           },
//           {
//             heading: 'Lifelong Benefits',
//             content: 'Good language skills enhance academic performance, career opportunities, and personal relationships. They enable clear communication and confident self-expression.',
//           },
//         ],
//       };
//     }
    
//     // Values & Character articles
//     if (subject === 'Values & Character') {
//       return {
//         title: `Building ${topic}`,
//         subtitle: 'Character Development',
//         sections: [
//           {
//             heading: 'What is ' + topic + '?',
//             content: `${topic} is a core value that shapes character and relationships. Teaching values helps children develop into compassionate, responsible, and ethical individuals.`,
//           },
//           {
//             heading: 'Why Values Matter',
//             content: 'Strong character and values guide decision-making, build meaningful relationships, and create a positive impact on society. They form the foundation of a fulfilling life.',
//           },
//           {
//             heading: 'Teaching Through Example',
//             content: 'Children learn values by observing adults. Model the behavior you want to see, discuss moral dilemmas, praise good choices, and explain the impact of actions on others.',
//           },
//           {
//             heading: 'Daily Practice',
//             content: 'Integrate values into daily life through discussions, stories, role-playing, and real-life situations. Consistent practice helps internalize these important principles.',
//           },
//         ],
//       };
//     }
    
//     // Arts & Creativity articles
//     if (subject === 'Arts & Creativity') {
//       return {
//         title: `Exploring ${topic}`,
//         subtitle: 'Unleashing Creativity',
//         sections: [
//           {
//             heading: 'The Importance of ' + topic,
//             content: `${topic} develops creativity, self-expression, and imagination. Art allows children to communicate feelings, ideas, and perspectives in unique ways.`,
//           },
//           {
//             heading: 'Creative Development',
//             content: 'Art enhances fine motor skills, problem-solving abilities, and emotional intelligence. It provides a safe space for experimentation and self-discovery.',
//           },
//           {
//             heading: 'Encouraging Creativity',
//             content: 'Provide diverse materials, allow freedom of expression, avoid criticism, celebrate uniqueness, and display their artwork. Focus on the creative process, not just the final product.',
//           },
//           {
//             heading: 'Benefits Beyond Art',
//             content: 'Creative thinking applies to all areas of life - from solving problems to innovating solutions. Art education builds confidence, resilience, and adaptability.',
//           },
//         ],
//       };
//     }
    
//     // Default article
//     return {
//       title: `Learning About ${topic || 'This Topic'}`,
//       subtitle: 'Educational Insights',
//       sections: [
//         {
//           heading: 'Overview',
//           content: 'This topic provides valuable learning opportunities for children to explore, discover, and grow. Understanding these concepts builds a strong foundation for future learning.',
//         },
//         {
//           heading: 'Key Concepts',
//           content: 'The main ideas help children develop critical thinking, problem-solving skills, and a deeper understanding of the world around them.',
//         },
//         {
//           heading: 'Practical Application',
//           content: 'These concepts can be applied in daily life, making learning meaningful and relevant. Encourage children to observe and practice what they learn.',
//         },
//         {
//           heading: 'Supporting Learning',
//           content: 'Parents can support by providing resources, encouraging questions, celebrating progress, and making learning an enjoyable experience.',
//         },
//       ],
//     };
//   };

//   const articleContent = createArticleContent();

//   // Flashcards data - educational facts and details about the topic
//   const createFlashcards = () => {
//     const cards = [];
    
//     // For Mathematics topics
//     if (displayTopic?.subject === 'Mathematics') {
//       return [
//         { 
//           id: 1, 
//           content: 'Understanding Measurement Units\n\nThe ampere (A) is the SI unit of electric current, measuring how much electricity flows through a wire. Think of it like measuring water flowing through a pipe - the ampere tells us the rate of flow.\n\nKey Points:\n• Named after French physicist André-Marie Ampère\n• One ampere equals one coulomb of charge per second\n• Used in everyday devices from phones to refrigerators\n• Essential for electrical safety and circuit design\n\nReal-World Application: When you see "5A" on a charger, it means 5 amperes of current can flow through it safely.'
//         },
//         { 
//           id: 2, 
//           content: 'The Importance of Measurement\n\nMeasurement is the foundation of science, engineering, and daily life. It allows us to compare, quantify, and understand the world around us with precision.\n\nWhy Measurement Matters:\n• Building Construction: Architects need exact measurements to design safe buildings\n• Cooking: Recipes require precise amounts for consistent results\n• Medicine: Doctors measure doses to ensure patient safety\n• Time Management: We measure time to organize our daily activities\n• Sports: Measurements determine winners and track progress\n\nWithout measurement, modern civilization as we know it would not exist. From the smallest microchip to the tallest skyscraper, everything depends on accurate measurement.'
//         },
//         { 
//           id: 3, 
//           content: 'Standard Units: A Universal Language\n\nStandard units like meters, kilograms, and liters form the International System of Units (SI), used worldwide to ensure everyone measures the same way.\n\nThe Seven Base SI Units:\n1. Meter (m) - Length\n2. Kilogram (kg) - Mass\n3. Second (s) - Time\n4. Ampere (A) - Electric current\n5. Kelvin (K) - Temperature\n6. Mole (mol) - Amount of substance\n7. Candela (cd) - Luminous intensity\n\nBenefits of Standard Units:\n• Global Communication: Scientists worldwide can share findings\n• Trade & Commerce: Fair buying and selling across countries\n• Safety: Consistent standards prevent accidents\n• Education: Students learn the same system everywhere\n\nExample: A meter in India equals a meter in America, Japan, or anywhere else!'
//         },
//         { 
//           id: 4, 
//           content: 'Non-Standard Units: Historical Perspective\n\nBefore standard units were established, people used body parts and everyday objects to measure things. These non-standard units varied from person to person.\n\nCommon Non-Standard Units:\n• Cubit: Length from elbow to fingertip (ancient Egypt)\n• Hand Span: Width of a hand with fingers spread\n• Foot: Length of a human foot (still used in some countries)\n• Pace: Length of one step\n• Stone: Weight measurement (still used in UK for body weight)\n\nProblems with Non-Standard Units:\n- Different sizes for different people\n- Difficult to communicate measurements\n- Inaccurate for precise work\n- Hard to reproduce results\n\nActivity: Try measuring your desk using hand spans, then compare with a friend. Notice how you get different numbers? This is why we need standard units!'
//         },
//         { 
//           id: 5, 
//           content: 'Metric Conversions: Understanding Relationships\n\nThe metric system is based on powers of 10, making conversions simple and logical.\n\nLength Conversions:\n• 1 kilometer (km) = 1,000 meters\n• 1 meter (m) = 100 centimeters\n• 1 centimeter (cm) = 10 millimeters\n• 1 millimeter (mm) = 0.001 meters\n\nMemory Tip: "King Henry Died By Drinking Chocolate Milk"\nKilo - Hecto - Deka - Base - Deci - Centi - Milli\n\nPractical Examples:\n• A door is about 2 meters (200 cm) tall\n• A pencil is about 19 centimeters long\n• Your fingernail is about 1 centimeter wide\n• A grain of rice is about 7 millimeters long\n\nWhy This Matters: Understanding conversions helps us measure both massive objects like buildings and tiny things like insects with the same system.'
//         },
//         { 
//           id: 6, 
//           content: 'Measurement Tools: Choosing the Right Instrument\n\nDifferent measurement tasks require different tools. Using the right tool ensures accuracy and efficiency.\n\nCommon Measurement Tools:\n\n1. Rulers & Tape Measures\n   • Purpose: Measuring length and distance\n   • Best for: Straight lines, fabric, room dimensions\n   • Accuracy: Usually to nearest millimeter\n\n2. Scales & Balances\n   • Purpose: Measuring weight and mass\n   • Best for: Cooking, shipping, body weight\n   • Types: Digital, spring, beam balance\n\n3. Measuring Cups & Spoons\n   • Purpose: Measuring volume of liquids and solids\n   • Best for: Cooking and baking\n   • Common sizes: 1 cup, 1/2 cup, tablespoon, teaspoon\n\n4. Thermometers\n   • Purpose: Measuring temperature\n   • Best for: Weather, cooking, health\n   • Types: Digital, mercury, infrared\n\nPro Tip: Always use the most precise tool available for your task. A ruler is better than hand spans, and a digital scale is more accurate than guessing!'
//         },
//         { 
//           id: 7, 
//           content: 'The Art of Estimation\n\nEstimation is the skill of making educated guesses about measurements before measuring exactly. It\'s a valuable life skill that helps us make quick decisions.\n\nWhen to Use Estimation:\n• Shopping: Will this furniture fit in my room?\n• Cooking: About how much salt should I add?\n• Time Management: How long will this task take?\n• Budgeting: Approximately how much will this cost?\n• Packing: Will all my clothes fit in this suitcase?\n\nEstimation Strategies:\n1. Use Reference Points: Compare to something you know\n2. Round Numbers: Use friendly numbers for quick math\n3. Break It Down: Estimate parts, then add them up\n4. Check Reasonableness: Does your estimate make sense?\n\nPractice Activity:\n• Estimate the height of your classroom door\n• Estimate how many steps from your room to the kitchen\n• Estimate the weight of your backpack\n• Then measure to see how close you were!\n\nRemember: Good estimators become better with practice. The more you estimate and check, the more accurate you become!'
//         },
//         { 
//           id: 8, 
//           content: 'Perimeter: Measuring Around Shapes\n\nPerimeter is the total distance around the outside of a two-dimensional shape. Imagine walking along the edge of a shape - the distance you walk is the perimeter.\n\nHow to Calculate Perimeter:\n\nRectangle: P = 2(length + width)\nExample: A room 5m long and 3m wide\nP = 2(5 + 3) = 2(8) = 16 meters\n\nSquare: P = 4 × side\nExample: A square garden with 4m sides\nP = 4 × 4 = 16 meters\n\nTriangle: P = side₁ + side₂ + side₃\nExample: Triangle with sides 3m, 4m, 5m\nP = 3 + 4 + 5 = 12 meters\n\nReal-World Applications:\n• Fencing: How much fence needed for a yard?\n• Framing: How much frame for a picture?\n• Running Track: Distance around a field\n• Border Decoration: How much trim for a room?\n\nFun Fact: The perimeter of a football field is about 346 meters. Running around it once is great exercise!'
//         },
//         { 
//           id: 9, 
//           content: 'Area: Measuring Space Inside Shapes\n\nArea measures the amount of space inside a two-dimensional shape. Think of it as how much carpet you need to cover a floor, or how much paint to fill a drawing.\n\nArea Formulas:\n\nRectangle: A = length × width\nExample: A room 5m × 3m\nA = 5 × 3 = 15 square meters (m²)\n\nSquare: A = side × side\nExample: A square tile 2m × 2m\nA = 2 × 2 = 4 m²\n\nTriangle: A = ½ × base × height\nExample: Triangle with base 6m, height 4m\nA = ½ × 6 × 4 = 12 m²\n\nCircle: A = π × radius²\nExample: Circle with radius 3m\nA = 3.14 × 3² = 28.26 m²\n\nPractical Uses:\n• Flooring: How many tiles needed?\n• Painting: How much paint for walls?\n• Gardening: How much soil for a garden bed?\n• Land: Measuring property size\n\nImportant: Area is always measured in square units (m², cm², km²) because we\'re measuring two dimensions!'
//         },
//         { 
//           id: 10, 
//           content: 'Measurement in Everyday Life\n\nMeasurement is not just a school subject - it\'s an essential life skill we use constantly without even thinking about it.\n\nDaily Measurement Applications:\n\n1. Cooking & Baking\n   • Measuring ingredients for recipes\n   • Setting oven temperature and time\n   • Portion control for healthy eating\n   • Following nutritional guidelines\n\n2. Construction & DIY\n   • Measuring materials before cutting\n   • Ensuring furniture fits in spaces\n   • Hanging pictures at the right height\n   • Mixing paint or concrete in correct ratios\n\n3. Shopping & Commerce\n   • Comparing prices per unit ($/kg, $/liter)\n   • Measuring fabric or carpet needed\n   • Checking product weights and volumes\n   • Calculating discounts and savings\n\n4. Health & Fitness\n   • Tracking body measurements\n   • Measuring exercise distances and times\n   • Monitoring heart rate and calories\n   • Following medication dosages\n\n5. Travel & Navigation\n   • Calculating distances and travel time\n   • Measuring fuel consumption\n   • Converting currencies\n   • Understanding time zones\n\nConclusion: Mastering measurement skills empowers you to make informed decisions, solve problems efficiently, and understand the world with precision. It\'s truly a superpower for life!'
//         },
//       ];
//     }
    
//     // For Environmental Studies topics
//     if (displayTopic?.subject === 'Environmental Studies') {
//       return [
//         { id: 1, content: 'Rainwater harvesting collects and stores rain for later use. It\'s like nature\'s gift that we can save in tanks and use for watering plants, cleaning, and even drinking after purification.', icon: '💧' },
//         { id: 2, content: 'Plants need water, sunlight, and air to grow healthy. They use sunlight to make their own food through photosynthesis, turning carbon dioxide and water into energy and oxygen.', icon: '🌱' },
//         { id: 3, content: 'Trees give us oxygen, shade, and homes for animals. One large tree can provide enough oxygen for two people for a whole year! They also cool the air and prevent soil erosion.', icon: '🌳' },
//         { id: 4, content: 'Saving water helps protect our planet for the future. Only 1% of Earth\'s water is fresh and available for us to use. Every drop we save ensures water for future generations.', icon: '🌍' },
//         { id: 5, content: 'Roots absorb water and nutrients from the soil. They work like straws, sucking up water and minerals that plants need to grow strong and healthy. Roots also hold plants firmly in the ground.', icon: '🌿' },
//         { id: 6, content: 'Leaves make food for plants using sunlight. The green color comes from chlorophyll, which captures sunlight and converts it into energy. This process is called photosynthesis.', icon: '☀️' },
//         { id: 7, content: 'Recycling reduces waste and saves natural resources. When we recycle paper, we save trees. Recycling plastic saves oil. It also reduces pollution and keeps our environment clean.', icon: '♻️' },
//         { id: 8, content: 'Clean water is essential for all living things. Humans, animals, and plants all need clean water to survive. Polluted water can make us sick and harm ecosystems.', icon: '💦' },
//         { id: 9, content: 'Composting turns food waste into rich soil. Fruit peels, vegetable scraps, and leaves break down naturally to create nutrient-rich compost that helps plants grow better.', icon: '🌾' },
//         { id: 10, content: 'Every drop of water saved makes a difference. Simple actions like turning off taps, fixing leaks, and reusing water can save thousands of liters every year!', icon: '💙' },
//       ];
//     }
    
//     // For Science topics
//     if (displayTopic?.subject === 'Science') {
//       return [
//         { id: 1, content: 'Animals are classified into groups like mammals, birds, and reptiles. Scientists group animals based on their features like body covering, how they have babies, and body temperature.', icon: '🦁' },
//         { id: 2, content: 'The human body has 206 bones that support and protect us. Babies are born with about 270 bones, but some fuse together as we grow. Bones also make blood cells!', icon: '🦴' },
//         { id: 3, content: 'Our heart pumps blood throughout our body every second. It beats about 100,000 times a day, pumping 2,000 gallons of blood! The heart is a powerful muscle that never rests.', icon: '❤️' },
//         { id: 4, content: 'Mammals are warm-blooded and feed milk to their babies. They have hair or fur, and most give birth to live young. Humans, dogs, cats, and whales are all mammals!', icon: '🐘' },
//         { id: 5, content: 'Birds have feathers, wings, and lay eggs. Their hollow bones make them light enough to fly. Not all birds can fly, but all birds have feathers and beaks instead of teeth.', icon: '🦅' },
//         { id: 6, content: 'The brain controls all our thoughts and movements. It has about 86 billion neurons that send messages faster than a race car! The brain also stores memories and helps us learn.', icon: '🧠' },
//         { id: 7, content: 'Lungs help us breathe in oxygen and breathe out carbon dioxide. We have two lungs that expand and contract about 20,000 times a day. Oxygen from air goes into our blood through tiny air sacs.', icon: '🫁' },
//         { id: 8, content: 'Muscles help us move, lift, and stay active. We have over 600 muscles in our body! They work in pairs - when one contracts, the other relaxes. Exercise makes muscles stronger.', icon: '💪' },
//         { id: 9, content: 'Healthy food gives our body energy and nutrients. Fruits and vegetables provide vitamins, proteins build muscles, and carbohydrates give us energy to play and learn.', icon: '🥗' },
//         { id: 10, content: 'Exercise keeps our body strong and healthy. It makes our heart stronger, bones denser, and helps us sleep better. Just 30 minutes of play or exercise daily makes a big difference!', icon: '🏃' },
//       ];
//     }
    
//     // For Language Arts topics
//     if (displayTopic?.subject === 'Language Arts') {
//       return [
//         { id: 1, content: 'Reading helps us learn new words and ideas. Every book we read expands our vocabulary and imagination. Good readers become better writers and thinkers!', icon: '📖' },
//         { id: 2, content: 'Stories have a beginning, middle, and end. The beginning introduces characters and setting, the middle has the main events and problems, and the end shows how problems are solved.', icon: '📚' },
//         { id: 3, content: 'Characters are the people or animals in a story. Main characters are the most important ones the story is about. We learn about characters through their actions, words, and thoughts.', icon: '👥' },
//         { id: 4, content: 'The setting tells us where and when a story happens. It could be a castle long ago, a school today, or even outer space in the future! Setting helps us imagine the story better.', icon: '🏞️' },
//         { id: 5, content: 'A sentence starts with a capital letter and ends with punctuation. Punctuation marks like periods, question marks, and exclamation points tell us how to read sentences correctly.', icon: '✍️' },
//         { id: 6, content: 'Nouns are naming words for people, places, and things. Common nouns name general things like "dog" or "city". Proper nouns name specific things like "Max" or "London" and start with capital letters.', icon: '🏷️' },
//         { id: 7, content: 'Verbs are action words that tell us what someone does. Running, jumping, thinking, and sleeping are all verbs. Every sentence needs a verb to show action or state of being.', icon: '🏃' },
//         { id: 8, content: 'Adjectives describe nouns and make writing more interesting. Instead of saying "dog", we can say "fluffy brown dog" or "tiny playful puppy". Adjectives paint pictures with words!', icon: '🎨' },
//         { id: 9, content: 'Reading every day improves vocabulary and imagination. Just 20 minutes of reading daily can expose you to thousands of new words and ideas. It\'s like exercise for your brain!', icon: '💭' },
//         { id: 10, content: 'Good readers ask questions and make predictions. Before reading, ask "What will happen?" While reading, ask "Why did that happen?" After reading, ask "What did I learn?"', icon: '❓' },
//       ];
//     }
    
//     // For Values & Character topics
//     if (displayTopic?.subject === 'Values & Character') {
//       return [
//         { id: 1, content: 'Kindness means being friendly, caring, and helpful to others. Small acts like smiling, sharing, or helping someone carry books can brighten someone\'s entire day!', icon: '💝' },
//         { id: 2, content: 'Empathy is understanding how someone else feels. Try to imagine yourself in their situation. When we show empathy, we connect with others and build stronger friendships.', icon: '🤗' },
//         { id: 3, content: 'Sharing makes everyone happy and builds friendships. When we share toys, snacks, or time, we show that we care about others. Sharing teaches us that happiness grows when we give.', icon: '🤝' },
//         { id: 4, content: 'Saying "please" and "thank you" shows good manners. These magic words show respect and appreciation. They make people feel valued and create a positive atmosphere around us.', icon: '🙏' },
//         { id: 5, content: 'Honesty means always telling the truth. Even when it\'s hard, being honest builds trust. People respect and believe those who are truthful, and honesty helps us sleep peacefully at night.', icon: '✨' },
//         { id: 6, content: 'Respect means treating others the way you want to be treated. This includes listening when others speak, valuing different opinions, and being polite to everyone regardless of differences.', icon: '🌟' },
//         { id: 7, content: 'Helping others makes the world a better place. Whether it\'s helping a friend with homework, assisting parents with chores, or being kind to animals, every helpful act matters!', icon: '🌈' },
//         { id: 8, content: 'Being patient means waiting calmly without getting upset. Good things take time - like growing plants, learning new skills, or waiting for your turn. Patience makes life less stressful.', icon: '⏰' },
//         { id: 9, content: 'Forgiveness helps us let go of anger and move forward. Everyone makes mistakes. When we forgive, we free ourselves from negative feelings and give others a chance to do better.', icon: '💚' },
//         { id: 10, content: 'Small acts of kindness can make a big difference. Holding a door, complimenting someone, or helping pick up dropped items might seem small, but they create ripples of positivity!', icon: '💫' },
//       ];
//     }
    
//     // For Arts & Creativity topics
//     if (displayTopic?.subject === 'Arts & Creativity') {
//       return [
//         { id: 1, content: 'Art is a way to express feelings and ideas creatively. Through drawing, painting, music, or dance, we can show emotions that are hard to put into words. Art makes us feel alive!', icon: '🎨' },
//         { id: 2, content: 'Primary colors are red, blue, and yellow. These are special because they cannot be made by mixing other colors. All other colors come from mixing these three primary colors!', icon: '🔴' },
//         { id: 3, content: 'Mixing primary colors creates secondary colors. Red + Blue = Purple, Blue + Yellow = Green, Red + Yellow = Orange. Try mixing paints to discover beautiful new colors!', icon: '🌈' },
//         { id: 4, content: 'Drawing helps improve hand-eye coordination. When we draw, our eyes see the object and our hands follow. This skill helps with writing, sports, and many daily activities!', icon: '✏️' },
//         { id: 5, content: 'Creativity means thinking of new and original ideas. There\'s no right or wrong in creativity! Every person\'s creative expression is unique and valuable. Let your imagination run wild!', icon: '💡' },
//         { id: 6, content: 'Music, dance, and painting are all forms of art. Art isn\'t just about drawing - it includes singing, acting, sculpting, photography, and more. Find the art form that makes you happy!', icon: '🎭' },
//         { id: 7, content: 'Recycled materials can be used to create beautiful art. Cardboard boxes become robots, plastic bottles turn into flowers, and old newspapers make colorful collages. Art helps save the planet!', icon: '♻️' },
//         { id: 8, content: 'Every artist has their own unique style. Some like realistic drawings, others prefer abstract art. Your style is what makes your art special - embrace what makes you different!', icon: '🖌️' },
//         { id: 9, content: 'Practice and patience help improve artistic skills. Even famous artists started as beginners! The more you create, the better you become. Mistakes are just part of learning.', icon: '⭐' },
//         { id: 10, content: 'Art allows us to see the world in different ways. Artists notice colors, shapes, and patterns others might miss. Creating art trains our eyes to appreciate beauty everywhere!', icon: '👁️' },
//       ];
//     }
    
//     // Default fallback - use topic data
//     if (topicData?.dayByDay && topicData.dayByDay.length > 0) {
//       topicData.dayByDay.forEach((day, index) => {
//         if (day.activity && cards.length < 10) {
//           cards.push({
//             id: cards.length + 1,
//             content: day.activity,
//             icon: '💡',
//           });
//         }
//       });
//     }
    
//     if (cards.length > 0) return cards;
    
//     // Final fallback
//     return [
//       { id: 1, content: topicData?.whatYouWillLearn || 'Learn key concepts through interactive activities.', icon: '📚' },
//       { id: 2, content: topicData?.shortDescription || 'Explore and discover new knowledge.', icon: '🎯' },
//       { id: 3, content: `Duration: ${topicData?.duration || '20 minutes'}`, icon: '⏱️' },
//       { id: 4, content: `Age Group: ${topicData?.ageGroup || 'All ages'}`, icon: '👥' },
//       { id: 5, content: `Subject: ${topicData?.subject || 'Learning'}`, icon: '📖' },
//     ];
//   };

//   const flashcards = createFlashcards();

//   // Q&A flashcards for Unit 2 - Create based on subject
//   const createQAFlashcards = () => {
//     const subject = displayTopic?.subject;
    
//     // Mathematics Q&A
//     if (subject === 'Mathematics') {
//       return [
//         {
//           id: 1,
//           question: 'Q1/3. What is the difference between area and perimeter?',
//           answer: 'A: Perimeter is the total length around a shape; area is the space inside it. Perimeter is measured in units like cm, while area is in square units like cm².',
//         },
//         {
//           id: 2,
//           question: 'Q2/3. How do we convert between different units?',
//           answer: 'A: We can use conversion factors. For example, 1 meter = 100 centimeters. To convert, multiply or divide by the conversion factor.',
//         },
//         {
//           id: 3,
//           question: 'Q3/3. Why do we need standard units of measurement?',
//           answer: 'A: Standard units ensure everyone measures the same way, making it easier to compare, communicate, and work together accurately.',
//         },
//       ];
//     }
    
//     // Environmental Studies Q&A
//     if (subject === 'Environmental Studies') {
//       return [
//         {
//           id: 1,
//           question: 'Q1/3. How does rainwater harvesting help the environment?',
//           answer: 'A: Rainwater harvesting reduces water waste, conserves groundwater, prevents flooding, and provides clean water for plants and other uses.',
//         },
//         {
//           id: 2,
//           question: 'Q2/3. What are the main parts of a plant and their functions?',
//           answer: 'A: Roots absorb water and anchor the plant, stems transport water and nutrients, leaves make food through photosynthesis, and flowers help in reproduction.',
//         },
//         {
//           id: 3,
//           question: 'Q3/3. Why is it important to save water?',
//           answer: 'A: Only 1% of Earth\'s water is fresh and available for use. Saving water ensures there\'s enough for everyone now and in the future.',
//         },
//       ];
//     }
    
//     // Science Q&A
//     if (subject === 'Science') {
//       return [
//         {
//           id: 1,
//           question: 'Q1/3. How do animals adapt to their environments?',
//           answer: 'A: Animals develop special features like thick fur for cold climates, camouflage for hiding, or long necks for reaching food. These adaptations help them survive.',
//         },
//         {
//           id: 2,
//           question: 'Q2/3. What are the five senses and why are they important?',
//           answer: 'A: The five senses are sight, hearing, touch, smell, and taste. They help us explore and understand the world around us, keeping us safe and informed.',
//         },
//         {
//           id: 3,
//           question: 'Q3/3. Why is exercise important for our body?',
//           answer: 'A: Exercise makes our heart stronger, builds muscles, improves mood, helps us sleep better, and keeps our body healthy and energetic.',
//         },
//       ];
//     }
    
//     // Language Arts Q&A
//     if (subject === 'Language Arts') {
//       return [
//         {
//           id: 1,
//           question: 'Q1/3. What are the main elements of a story?',
//           answer: 'A: Every story has characters (who), setting (where and when), plot (what happens), problem (conflict), and solution (how it\'s resolved).',
//         },
//         {
//           id: 2,
//           question: 'Q2/3. How can we improve our reading skills?',
//           answer: 'A: Read every day, ask questions about the story, predict what will happen next, and discuss what you read with others.',
//         },
//         {
//           id: 3,
//           question: 'Q3/3. Why is reading important?',
//           answer: 'A: Reading expands vocabulary, improves imagination, teaches us new things, and helps us become better writers and thinkers.',
//         },
//       ];
//     }
    
//     // Values & Character Q&A
//     if (subject === 'Values & Character') {
//       return [
//         {
//           id: 1,
//           question: 'Q1/3. What is empathy and why is it important?',
//           answer: 'A: Empathy is understanding how others feel. It helps us be kind, build strong friendships, and create a caring community where everyone feels valued.',
//         },
//         {
//           id: 2,
//           question: 'Q2/3. How can small acts of kindness make a difference?',
//           answer: 'A: Small acts like smiling, helping, or saying kind words can brighten someone\'s day, create positive ripples, and inspire others to be kind too.',
//         },
//         {
//           id: 3,
//           question: 'Q3/3. Why should we practice honesty?',
//           answer: 'A: Honesty builds trust, strengthens relationships, and helps us feel good about ourselves. People respect and believe those who tell the truth.',
//         },
//       ];
//     }
    
//     // Arts & Creativity Q&A
//     if (subject === 'Arts & Creativity') {
//       return [
//         {
//           id: 1,
//           question: 'Q1/3. What are primary colors and why are they special?',
//           answer: 'A: Primary colors are red, blue, and yellow. They\'re special because they can\'t be made by mixing other colors, but all other colors come from mixing them.',
//         },
//         {
//           id: 2,
//           question: 'Q2/3. How does art help us express ourselves?',
//           answer: 'A: Art lets us show feelings and ideas that are hard to put into words. Through colors, shapes, and creativity, we can share our unique perspective.',
//         },
//         {
//           id: 3,
//           question: 'Q3/3. Why is creativity important?',
//           answer: 'A: Creativity helps us solve problems in new ways, express ourselves, think differently, and find joy in making something unique and original.',
//         },
//       ];
//     }
    
//     // Default fallback
//     return [
//       {
//         id: 1,
//         question: `Q1/3. What will you learn in ${topicData?.topic || 'this topic'}?`,
//         answer: `A: ${topicData?.whatYouWillLearn || 'You will learn key concepts and practical applications.'}`,
//       },
//       {
//         id: 2,
//         question: 'Q2/3. What materials do you need?',
//         answer: `A: ${topicData?.whatYouNeed?.join(', ') || 'Basic learning materials and curiosity!'}`,
//       },
//       {
//         id: 3,
//         question: 'Q3/3. How long does this activity take?',
//         answer: `A: ${topicData?.duration || '20 minutes'} of focused learning time.`,
//       },
//     ];
//   };

//   const qaFlashcards = createQAFlashcards();

//   const toggleUnit = (unitId) => {
//     setExpandedUnit(expandedUnit === unitId ? null : unitId);
//   };

//   const nextFlashcard = () => {
//     setShowAnswer(false);
//     setCurrentFlashcard((prev) => (prev + 1) % flashcards.length);
//   };

//   const prevFlashcard = () => {
//     setShowAnswer(false);
//     setCurrentFlashcard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Header with Back Button and Topic Title */}
//         <View style={styles.headerSection}>
//           <TouchableOpacity style={styles.backButton} onPress={onBack}>
//             <Icon name="chevron-back" size={28} color="#333333" />
//           </TouchableOpacity>
//           <View style={styles.headerTitleContainer}>
//             <Text style={styles.headerTitle}>{displayTopic?.topic || 'Nature Detective Walk'}</Text>
//             <Text style={[styles.headerSubtitle, { color: subjectColor }]}>
//               {displayTopic?.subject || 'Environmental Studies'}
//             </Text>
//           </View>
//         </View>

//         {/* Hero Section */}
//         <View style={styles.heroSection}>
//           {/* Calendar */}
//           <View style={[styles.calendarSection, { borderColor: `${subjectColor}40` }]}>
//             <View style={styles.calendarHeader}>
//               <View>
//                 <Text style={styles.calendarMonth}>{currentMonth} {currentYear}</Text>
//                 <Text style={styles.calendarSubtext}>Select a date to view content</Text>
//               </View>
//               <View style={styles.calendarActions}>
//                 <TouchableOpacity 
//                   style={[styles.todayButton, { borderColor: subjectColor, backgroundColor: `${subjectColor}10` }]}
//                   onPress={() => setSelectedDate(currentDay)}
//                 >
//                   <Icon name="time-outline" size={16} color={subjectColor} style={{ marginRight: 6 }} />
//                   <Text style={[styles.todayButtonText, { color: subjectColor }]}>TODAY</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
            
//             <View style={styles.calendarGrid}>
//               {weekDays.map((day, index) => {
//                 const dateValue = dates[index];
//                 const isFutureDate = dateValue > currentDay;
//                 const hasData = hasDataForDate(dateValue, currentDate.getMonth(), currentYear);
//                 const isDisabled = isFutureDate || !hasData;
//                 const isSelected = selectedDate === dateValue;
//                 const isToday = dateValue === currentDay;
                
//                 return (
//                   <View key={index} style={styles.calendarDayColumn}>
//                     <TouchableOpacity
//                       style={[
//                         styles.calendarDate,
//                         isSelected && styles.calendarDateSelected,
//                         isSelected && { backgroundColor: subjectColor, borderWidth: 0 },
//                         isDisabled && styles.calendarDateDisabled,
//                         isToday && !isSelected && [styles.calendarDateToday, { borderColor: subjectColor, backgroundColor: `${subjectColor}10` }],
//                       ]}
//                       onPress={() => {
//                         if (!isDisabled) {
//                           setSelectedDate(dateValue);
//                         }
//                       }}
//                       disabled={isDisabled}
//                     >
//                       <Text
//                         style={[
//                           styles.calendarDayLabel,
//                           isSelected && styles.calendarDayLabelSelected,
//                           isDisabled && styles.calendarDayLabelDisabled,
//                           isToday && !isSelected && { color: subjectColor },
//                         ]}
//                       >
//                         {day}
//                       </Text>
//                       <Text
//                         style={[
//                           styles.calendarDateText,
//                           isSelected && styles.calendarDateTextSelected,
//                           isDisabled && styles.calendarDateTextDisabled,
//                           isToday && !isSelected && { color: subjectColor, fontWeight: '700' },
//                         ]}
//                       >
//                         {dateValue}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                 );
//               })}
//             </View>
//           </View>

//           {/* Topic Card with Enhanced Design */}
//           <View style={styles.topicCard}>
//             <View style={styles.topicHeader}>
//               <View style={styles.subjectBadge}>
//                 <Text style={styles.subjectBadgeText}>
//                   {displayTopic?.subject || 'Learning'}
//                 </Text>
//               </View>
//               <View style={[styles.durationBadge, { backgroundColor: `${subjectColor}20` }]}>
//                 <Icon name="time-outline" size={16} color={subjectColor} />
//                 <Text style={[styles.durationText, { color: subjectColor }]}>{topicData?.duration || '20 min'}</Text>
//               </View>
//             </View>
            
//             {/* Topic Image with Icon or Image */}
//             <View style={styles.topicImageContainer}>
//               {displayTopic?.subject === 'Environmental Studies' ? (
//                 <View style={styles.topicImagePlaceholder}>
//                   <Image 
//                     source={require('../assets/images/Environmental.png')}
//                     style={styles.subjectImage}
//                     resizeMode="cover"
//                   />
//                 </View>
//               ) : displayTopic?.subject === 'Mathematics' ? (
//                 <View style={styles.topicImagePlaceholder}>
//                   <Image 
//                     source={require('../assets/images/Maths.png')}
//                     style={styles.subjectImage}
//                     resizeMode="cover"
//                   />
//                 </View>
//               ) : displayTopic?.subject === 'Science' ? (
//                 <View style={styles.topicImagePlaceholder}>
//                   <Image 
//                     source={require('../assets/images/Science.png')}
//                     style={styles.subjectImage}
//                     resizeMode="cover"
//                   />
//                 </View>
//               ) : displayTopic?.subject === 'Values & Character' ? (
//                 <View style={styles.topicImagePlaceholder}>
//                   <Image 
//                     source={require('../assets/images/values.png')}
//                     style={styles.subjectImage}
//                     resizeMode="cover"
//                   />
//                 </View>
//               ) : displayTopic?.subject === 'Arts & Creativity' ? (
//                 <View style={styles.topicImagePlaceholder}>
//                   <Image 
//                     source={require('../assets/images/art.png')}
//                     style={styles.subjectImage}
//                     resizeMode="cover"
//                   />
//                 </View>
//               ) : (
//                 <LinearGradient
//                   colors={[`${subjectColor}40`, `${subjectColor}20`]}
//                   style={styles.topicImagePlaceholder}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                 >
//                   <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}>
//                     <MaterialIcon name={displayTopic?.icon || 'book-open-variant'} size={70} color={subjectColor} />
//                   </View>
//                 </LinearGradient>
//               )}
//             </View>

//             <Text style={styles.topicTitle}>
//               {displayTopic?.topic || displayTopic?.title || 'Learning Topic'}
//             </Text>
            
//             {topicData?.shortDescription && (
//               <Text style={styles.topicDescription}>
//                 {topicData.shortDescription}
//               </Text>
//             )}
//           </View>
//         </View>

//         {/* Units Section */}
//         <View style={styles.unitsSection}>
//           {units.map((unit, unitIndex) => (
//             <View key={unit.id} style={styles.unitCard}>
//               <TouchableOpacity
//                 style={styles.unitHeader}
//                 onPress={() => toggleUnit(unit.id)}
//               >
//                 <Text style={styles.unitName}>
//                   <Text style={styles.unitNumber}>{unit.name.split(' - ')[0]}</Text>
//                   {unit.name.includes(' - ') && <Text style={styles.unitDescription}> - {unit.name.split(' - ')[1]}</Text>}
//                 </Text>
//                 <Icon
//                   name={expandedUnit === unit.id ? 'chevron-up' : 'chevron-down'}
//                   size={24}
//                   color="#666666"
//                 />
//               </TouchableOpacity>
              
//               {expandedUnit === unit.id && (
//                 <View style={styles.unitContent}>
//                   {unit.id === 1 ? (
//                     <>
//                       <View style={styles.conceptSection}>
//                         <Text style={styles.conceptLabel}>Concept :</Text>
//                         <Text style={styles.conceptText}>{unit.concept}</Text>
//                       </View>
                      
//                       <View style={styles.conceptSection}>
//                         <Text style={styles.conceptLabel}>Parent Outcome :</Text>
//                         <Text style={styles.conceptText}>{unit.parentOutcome}</Text>
//                       </View>
                      
//                       {/* Show flashcards in Unit 1 */}
//                       <TouchableOpacity 
//                         style={styles.openFlashcardsButton}
//                         onPress={() => {
//                           if (onNavigate) {
//                             onNavigate('flashcards', { 
//                               flashcards: flashcards,
//                               topic: displayTopic?.topic,
//                               subject: displayTopic?.subject
//                             });
//                           }
//                         }}
//                       >
//                         <Text style={styles.openFlashcardsButtonText}>Open</Text>
//                         <Icon name="arrow-forward" size={20} color="#FFFFFF" />
//                       </TouchableOpacity>
//                     </>
//                   ) : unit.id === 2 ? (
//                     <>
//                       <Text style={styles.unitDescription}>{unit.description}</Text>
                      
//                       {/* Open Q&A Button */}
//                       <TouchableOpacity 
//                         style={styles.openFlashcardsButton}
//                         onPress={() => {
//                           if (onNavigate) {
//                             onNavigate('qaCards', { 
//                               qaCards: qaFlashcards,
//                               topic: displayTopic?.topic,
//                               subject: displayTopic?.subject
//                             });
//                           }
//                         }}
//                       >
//                         <Text style={styles.openFlashcardsButtonText}>Open Q&A Cards</Text>
//                         <Icon name="arrow-forward" size={20} color="#FFFFFF" />
//                       </TouchableOpacity>
//                     </>
//                   ) : unit.id === 3 ? (
//                     <>
//                       <Text style={styles.unitDescription}>{unit.description}</Text>
                      
//                       {/* Open Prompts Button */}
//                       <TouchableOpacity 
//                         style={styles.openFlashcardsButton}
//                         onPress={() => {
//                           if (onNavigate) {
//                             onNavigate('promptCards', { 
//                               prompts: prompts,
//                               topic: displayTopic?.topic,
//                               subject: displayTopic?.subject
//                             });
//                           }
//                         }}
//                       >
//                         <Text style={styles.openFlashcardsButtonText}>Open Prompts</Text>
//                         <Icon name="arrow-forward" size={20} color="#FFFFFF" />
//                       </TouchableOpacity>
                      
//                       <View style={styles.promptTips}>
//                         <Text style={styles.promptTipBullet}>• Don't expect "right" answers immediately.</Text>
//                         <Text style={styles.promptTipBullet}>• Celebrate their thinking process: "That's an interesting idea!"</Text>
//                         <Text style={styles.promptTipBullet}>• Work together if they get stuck answers — or deepen learning.</Text>
//                       </View>
//                     </>
//                   ) : unit.id === 4 ? (
//                     <>
//                       <Text style={styles.unitDescription}>{unit.description}</Text>
                      
//                       {/* Open Vocabulary Button */}
//                       <TouchableOpacity 
//                         style={styles.openFlashcardsButton}
//                         onPress={() => {
//                           if (onNavigate) {
//                             onNavigate('vocabCards', { 
//                               vocabulary: vocabulary,
//                               topic: displayTopic?.topic,
//                               subject: displayTopic?.subject
//                             });
//                           }
//                         }}
//                       >
//                         <Text style={styles.openFlashcardsButtonText}>Open Vocabulary</Text>
//                         <Icon name="arrow-forward" size={20} color="#FFFFFF" />
//                       </TouchableOpacity>
//                     </>
//                   ) : (
//                     <Text style={styles.unitDescription}>{unit.description}</Text>
//                   )}
//                 </View>
//               )}
//             </View>
//           ))}
//         </View>

//         {/* Topic Relevance Question */}
//         <View style={styles.relevanceSection}>
//           <TouchableOpacity 
//             style={styles.learnInDetailButton}
//             onPress={() => setShowArticleModal(true)}
//           >
//             <MaterialIcon name="book-open-page-variant" size={20} color="#666666" />
//             <Text style={styles.learnInDetailText}>Learn in Detail</Text>
//           </TouchableOpacity>

//           <Text style={styles.relevanceQuestion}>Is the topic relevant?</Text>
//           <View style={styles.relevanceButtons}>
//             <TouchableOpacity 
//               style={[
//                 styles.noButton,
//                 topicRelevance === 'no' && styles.noButtonActive
//               ]}
//               onPress={() => {
//                 const newValue = topicRelevance === 'no' ? null : 'no';
//                 setTopicRelevance(newValue);
//                 if (newValue === 'no') {
//                   Alert.alert(
//                     'Feedback Received',
//                     'Thank you for your feedback! We\'ll work on providing more relevant topics.',
//                     [{ text: 'OK' }]
//                   );
//                 }
//               }}
//             >
//               {topicRelevance === 'no' && (
//                 <Icon name="checkmark-circle" size={16} color="#FF6B6B" style={styles.buttonIcon} />
//               )}
//               <Text style={styles.noButtonText}>No</Text>
//             </TouchableOpacity>
//             <TouchableOpacity 
//               style={[
//                 styles.yesButton,
//                 topicRelevance === 'yes' && styles.yesButtonActive
//               ]}
//               onPress={() => {
//                 const newValue = topicRelevance === 'yes' ? null : 'yes';
//                 setTopicRelevance(newValue);
//                 if (newValue === 'yes') {
//                   Alert.alert(
//                     'Great!',
//                     'We\'re glad this topic is relevant to you. Keep learning!',
//                     [{ text: 'OK' }]
//                   );
//                 }
//               }}
//             >
//               {topicRelevance === 'yes' && (
//                 <Icon name="checkmark-circle" size={16} color="#45a578" style={styles.buttonIcon} />
//               )}
//               <Text style={styles.yesButtonText}>Yes</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.bottomPadding} />
//       </ScrollView>

//       {/* Article Modal with Videos */}
//       {showArticleModal && (
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <TouchableOpacity 
//                 style={styles.modalCloseButton}
//                 onPress={() => setShowArticleModal(false)}
//               >
//                 <Icon name="close" size={28} color="#333333" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
//               <Text style={styles.modalTitle}>{articleContent.title}</Text>
//               <Text style={styles.modalSubtitle}>{articleContent.subtitle}</Text>
              
//               {articleContent.sections.map((section, index) => (
//                 <View key={index}>
//                   <Text style={styles.modalHeading}>{section.heading}</Text>
//                   <Text style={styles.modalText}>{section.content}</Text>
//                 </View>
//               ))}

//               {/* YouTube Videos Section inside Modal */}
//               <View style={styles.modalVideosSection}>
//                 <View style={styles.modalVideosSectionHeader}>
//                   <MaterialIcon name="youtube" size={24} color="#FF0000" />
//                   <Text style={styles.modalVideosSectionTitle}>Videos on this topic</Text>
//                 </View>
//                 <Text style={styles.modalVideosSectionSubtitle}>
//                   2 relevant YouTube videos will be added for all topics
//                 </Text>

//                 <View style={styles.modalVideoCard}>
//                   <View style={styles.modalVideoThumbnail}>
//                     <MaterialIcon name="play-circle" size={48} color="#FFFFFF" />
//                     <Text style={styles.modalVideoThumbnailText}>VOLTS, AMPS, & WATTS EXPLAINED</Text>
//                   </View>
//                   <Text style={styles.modalVideoTitle}>Volts, Amps, and Watts Explained</Text>
//                   <Text style={styles.modalVideoChannel}>Educational Channel</Text>
//                 </View>

//                 <View style={styles.modalVideoCard}>
//                   <View style={styles.modalVideoThumbnail}>
//                     <MaterialIcon name="play-circle" size={48} color="#FFFFFF" />
//                     <Text style={styles.modalVideoThumbnailText}>What are Volts? Amps? Ohms?</Text>
//                   </View>
//                   <Text style={styles.modalVideoTitle}>What are Volts? Amps? Ohms? EXPLAINED</Text>
//                   <Text style={styles.modalVideoChannel}>Science Explained</Text>
//                 </View>
//               </View>

//               <View style={styles.modalBottomPadding} />
//             </ScrollView>
//           </View>
//         </View>
//       )}

//       {/* Date Picker Modal */}
//       {showDatePicker && (
//         <View style={styles.modalOverlay}>
//           <View style={styles.datePickerModal}>
//             {/* Close button - separate row */}
//             <View style={styles.datePickerTopBar}>
//               <TouchableOpacity 
//                 style={styles.datePickerCloseButton}
//                 onPress={() => setShowDatePicker(false)}
//               >
//                 <Icon name="close" size={24} color="#333333" />
//               </TouchableOpacity>
//             </View>

//             {/* Navigation header */}
//             <View style={styles.datePickerHeader}>
//               <TouchableOpacity 
//                 style={styles.datePickerNavButton}
//                 onPress={goToPreviousMonth}
//               >
//                 <Icon name="chevron-back" size={24} color="#333333" />
//               </TouchableOpacity>
//               <Text style={styles.datePickerTitle}>{monthNames[pickerMonth]} {pickerYear}</Text>
//               <TouchableOpacity 
//                 style={styles.datePickerNavButton}
//                 onPress={goToNextMonth}
//               >
//                 <Icon name="chevron-forward" size={24} color="#333333" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.fullCalendarContent}>
//               {/* Day labels */}
//               <View style={styles.calendarDayLabels}>
//                 {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
//                   <Text key={index} style={styles.calendarDayLabel}>{day}</Text>
//                 ))}
//               </View>

//               {/* Calendar grid */}
//               {calendarGrid.map((week, weekIndex) => (
//                 <View key={weekIndex} style={styles.calendarWeekRow}>
//                   {week.map((day, dayIndex) => {
//                     const isToday = day === currentDay && pickerMonth === currentDate.getMonth() && pickerYear === currentYear;
//                     const isSelected = day === selectedDate && pickerMonth === currentDate.getMonth() && pickerYear === currentYear;
//                     const isFuture = pickerYear > currentYear || 
//                                     (pickerYear === currentYear && pickerMonth > currentDate.getMonth()) ||
//                                     (pickerYear === currentYear && pickerMonth === currentDate.getMonth() && day > currentDay);
//                     const hasData = day ? hasDataForDate(day, pickerMonth, pickerYear) : false;
//                     const isDisabled = !day || isFuture || !hasData;
                    
//                     return (
//                       <TouchableOpacity
//                         key={dayIndex}
//                         style={[
//                           styles.fullCalendarDay,
//                           !day && styles.fullCalendarDayEmpty,
//                           isToday && styles.fullCalendarDayToday,
//                           isSelected && styles.fullCalendarDaySelected,
//                           isSelected && { backgroundColor: subjectColor },
//                           isDisabled && styles.fullCalendarDayDisabled,
//                         ]}
//                         onPress={() => !isDisabled && handleDateSelect(day)}
//                         disabled={isDisabled}
//                       >
//                         {day && (
//                           <Text
//                             style={[
//                               styles.fullCalendarDayText,
//                               isToday && styles.fullCalendarDayTextToday,
//                               isSelected && styles.fullCalendarDayTextSelected,
//                               isDisabled && styles.fullCalendarDayTextDisabled,
//                             ]}
//                           >
//                             {day}
//                           </Text>
//                         )}
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               ))}

//               <TouchableOpacity 
//                 style={styles.todayButton}
//                 onPress={() => {
//                   setPickerMonth(currentDate.getMonth());
//                   setPickerYear(currentYear);
//                   setSelectedDate(currentDay);
//                   setShowDatePicker(false);
//                 }}
//               >
//                 <Text style={styles.todayButtonText}>Go to Today</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// export default TopicDetailScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },

//   headerSection: {
//     backgroundColor: '#FFFFFF',
//     paddingTop: 16,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#F0F0F0',
//   },

//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F8F9FA',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },

//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//     marginRight: 52,
//   },

//   headerTitle: {
//     fontSize: isTablet ? 22 : 18,
//     fontWeight: '700',
//     color: '#2C3E50',
//     fontFamily: 'Montserrat-Bold',
//     textAlign: 'center',
//   },

//   headerSubtitle: {
//     fontSize: isTablet ? 16 : 14,
//     fontWeight: '600',
//     fontFamily: 'Montserrat-SemiBold',
//     marginTop: 2,
//     textAlign: 'center',
//   },

//   floatingBackButton: {
//     // position: 'absolute',
//     top: 40,
//     left: 20,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },

//   content: {
    
//   },

//   heroSection: {flex: 1,
//     paddingBottom: 20,
//   },

//   calendarSection: {
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 16,
//     marginTop: 66,
//     // padding: 24,
//     borderRadius: 20,
//   },

//   calendarHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 24,
//   },

//   calendarMonth: {
//     fontSize: isTablet ? 24 : 20,
//     fontWeight: '700',
//     color: '#2C3E50',
//     marginBottom: 6,
//     fontFamily: 'Montserrat-Bold',
//   },

//   calendarSubtext: {
//     fontSize: 13,
//     color: '#95A5A6',
//     fontFamily: 'Montserrat-Regular',
//   },

//   calendarActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },

//   calendarIconButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     backgroundColor: '#FFFFFF',
//   },

//   todayButton: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 20,
//     backgroundColor: '#E8F8F5',
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     borderWidth: 1.5,
//   },

//   todayButtonText: {
//     fontSize: 13,
//     fontWeight: '700',
//     fontFamily: 'Montserrat-Bold',
//     letterSpacing: 0.5,
//   },

//   calendarGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//   },

//   calendarDayColumn: {
//     alignItems: 'center',
//     flex: 1,
//   },

//   calendarDayLabel: {
//     fontSize: 8,
//     color: '#7F8C8D',
//     marginBottom: 2,
//     fontWeight: '600',
//     fontFamily: 'Montserrat-SemiBold',
//     letterSpacing: 0.2,
//     textTransform: 'uppercase',
//   },

//   calendarDayLabelSelected: {
//     color: '#FFFFFF',
//   },

//   calendarDayLabelDisabled: {
//     color: '#BDC3C7',
//   },

//   calendarDate: {
//     width: isTablet ? 50 : 40,
//     height: isTablet ? 56 : 46,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//     position: 'relative',
//     paddingVertical: 4,
//   },

//   calendarDateToday: {
//     borderWidth: 2,
//     backgroundColor: '#FFFFFF',
//   },

//   calendarDateSelected: {
//     backgroundColor: '#27AE60',
//     borderColor: '#27AE60',
//     shadowColor: '#27AE60',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },

//   calendarDateDisabled: {
//     backgroundColor: 'transparent',
//     opacity: 0.4,
//     borderColor: 'transparent',
//   },

//   calendarDateText: {
//     fontSize: isTablet ? 16 : 14,
//     color: '#2C3E50',
//     fontWeight: '500',
//     fontFamily: 'Montserrat-Medium',
//   },

//   calendarDateTextSelected: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },

//   calendarDateTextDisabled: {
//     color: '#BDC3C7',
//   },

//   topicCard: {
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: 16,
//     marginTop: 16,
//     padding: 24,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 4,
//   },

//   topicHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     flexWrap: 'wrap',
//     gap: 10,
//   },

//   subjectBadge: {
//     paddingHorizontal: 0,
//     paddingVertical: 0,
//     flexShrink: 1,
//   },

//   subjectBadgeText: {
//     fontSize: isTablet ? 24 : 20,
//     fontWeight: '700',
//     fontFamily: 'Montserrat-Bold',
//     color: '#000000',
//   },

//   durationBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 18,
//     flexShrink: 0,
//   },

//   durationText: {
//     fontSize: isTablet ? 16 : 14,
//     fontWeight: '700',
//     fontFamily: 'Montserrat-Bold',
//   },

//   topicImageContainer: {
//     marginBottom: 20,
//   },

//   topicImagePlaceholder: {
//     width: '100%',
//     height: 200,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   iconCircle: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   subjectImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 16,
//   },

//   topicTitle: {
//     fontSize: isTablet ? 26 : 20,
//     fontWeight: '700',
//     color: '#1A1A1A',
//     marginBottom: 12,
//     lineHeight: isTablet ? 44 : 36,
//     fontFamily: 'Montserrat-Bold',
//   },

//   topicDescription: {
//     fontSize: isTablet ? 16 : 14,
//     color: '#666666',
//     lineHeight: isTablet ? 26 : 22,
//     marginBottom: 20,
//     fontFamily: 'Montserrat-Regular',
//   },

//   unitsSection: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     marginBottom: 10,
//   },

//   unitCard: {
//     backgroundColor: 'transparent',
//     borderRadius: 12,
//     marginBottom: 12,
//     overflow: 'hidden',
//   },

//   unitHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//   },

//   unitName: {
//     fontSize: isTablet ? 20 : 16,
//     fontWeight: '500',
//     color: '#333333',
//     flex: 1,
//     fontFamily: 'Montserrat-Medium',
//   },

//   unitNumber: {
//     fontWeight: '700',
//     fontFamily: 'Montserrat-Bold',
//   },

//   unitDescription: {
//     fontWeight: '400',
//     fontFamily: 'Montserrat-Regular',
//   },

//   unitContent: {
//     padding: 16,
//     paddingTop: 0,
//   },

//   unitDescription: {
//     fontSize: isTablet ? 16 : 14,
//     color: '#666666',
//     lineHeight: isTablet ? 26 : 22,
//     fontFamily: 'Montserrat-Regular',
//     marginBottom: 16,
//   },

//   conceptSection: {
//     marginBottom: 16,
//   },

//   conceptLabel: {
//     fontSize: isTablet ? 18 : 16,
//     fontWeight: '700',
//     color: '#333333',
//     marginBottom: 6,
//     fontFamily: 'Montserrat-Bold',
//   },

//   conceptText: {
//     fontSize: isTablet ? 16 : 14,
//     color: '#666666',
//     lineHeight: isTablet ? 26 : 22,
//     fontFamily: 'Montserrat-Regular',
//   },

//   flashcardsInUnit: {
//     marginTop: 16,
//   },

//   openFlashcardsButton: {
//     backgroundColor: '#45a578',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 12,
//     marginBottom: 12,
//     gap: 8,
//   },

//   openFlashcardsButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   flashcardsScroll: {
//     marginHorizontal: -16,
//     paddingHorizontal: 16,
//   },

//   miniFlashcard: {
//     width: 280,
//     marginRight: 12,
//   },

//   miniFlashcardInner: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     minHeight: 160,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },

//   miniFlashcardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },

//   flashcardIcon: {
//     fontSize: 24,
//   },

//   miniFlashcardCounter: {
//     fontSize: isTablet ? 16 : 14,
//     color: '#999999',
//     fontWeight: '600',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   miniFlashcardContent: {
//     fontSize: isTablet ? 20 : 17,
//     color: '#333333',
//     lineHeight: isTablet ? 28 : 24,
//     fontFamily: 'Montserrat-Regular',
//   },

//   qaSection: {
//     marginTop: 16,
//   },

//   qaItem: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },

//   qaQuestion: {
//     fontSize: isTablet ? 18 : 16,
//     fontWeight: '600',
//     color: '#333333',
//     marginBottom: 8,
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   qaAnswer: {
//     fontSize: isTablet ? 18 : 15,
//     color: '#666666',
//     lineHeight: isTablet ? 24 : 20,
//     fontFamily: 'Montserrat-Regular',
//   },

//   qaFlashcard: {
//     width: 280,
//     marginRight: 12,
//   },

//   qaFlashcardInner: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     minHeight: 200,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },

//   qaFlashcardHeader: {
//     marginBottom: 12,
//   },

//   qaFlashcardCounter: {
//     fontSize: isTablet ? 14 : 12,
//     color: '#999999',
//     fontWeight: '600',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   qaFlashcardQuestion: {
//     fontSize: isTablet ? 20 : 17,
//     fontWeight: '600',
//     color: '#333333',
//     lineHeight: isTablet ? 26 : 23,
//     marginBottom: 12,
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   qaFlashcardDivider: {
//     height: 1,
//     backgroundColor: '#E0E0E0',
//     marginBottom: 12,
//   },

//   qaFlashcardAnswer: {
//     fontSize: isTablet ? 18 : 15,
//     color: '#666666',
//     lineHeight: isTablet ? 26 : 22,
//     fontFamily: 'Montserrat-Regular',
//   },

//   scrollHint: {
//     fontSize: isTablet ? 16 : 14,
//     color: '#999999',
//     textAlign: 'center',
//     marginTop: 12,
//     fontStyle: 'italic',
//     fontFamily: 'Montserrat-Regular',
//   },

//   promptsHeader: {
//     fontSize: isTablet ? 20 : 18,
//     color: '#333333',
//     lineHeight: isTablet ? 26 : 22,
//     marginBottom: 16,
//     fontFamily: 'Montserrat-Medium',
//     fontWeight: '500',
//   },

//   promptCard: {
//     width: 280,
//     marginRight: 12,
//   },

//   promptCardInner: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 20,
//     minHeight: 140,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     justifyContent: 'center',
//   },

//   promptText: {
//     fontSize: isTablet ? 20 : 17,
//     color: '#333333',
//     lineHeight: isTablet ? 28 : 24,
//     fontFamily: 'Montserrat-Medium',
//     fontWeight: '500',
//   },

//   promptTips: {
//     marginTop: 16,
//     backgroundColor: '#FFFBF0',
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: '#FFE8B3',
//   },

//   promptTipBullet: {
//     fontSize: isTablet ? 18 : 16,
//     color: '#666666',
//     lineHeight: isTablet ? 26 : 22,
//     marginBottom: 6,
//     fontFamily: 'Montserrat-Regular',
//   },

//   vocabCard: {
//     width: 280,
//     marginRight: 12,
//   },

//   vocabCardInner: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 20,
//     minHeight: 240,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },

//   vocabHeader: {
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 2,
//     borderBottomColor: '#E0E0E0',
//   },

//   vocabWord: {
//     fontSize: isTablet ? 22 : 18,
//     fontWeight: '700',
//     color: '#333333',
//     marginBottom: 4,
//     fontFamily: 'Montserrat-Bold',
//   },

//   vocabType: {
//     fontSize: isTablet ? 16 : 14,
//     color: '#999999',
//     fontStyle: 'italic',
//     fontFamily: 'Montserrat-Regular',
//   },

//   vocabDefinition: {
//     fontSize: isTablet ? 18 : 16,
//     color: '#333333',
//     lineHeight: isTablet ? 26 : 23,
//     marginBottom: 12,
//     fontFamily: 'Montserrat-Regular',
//   },

//   vocabExample: {
//     fontSize: isTablet ? 16 : 14,
//     color: '#666666',
//     lineHeight: isTablet ? 23 : 20,
//     marginBottom: 10,
//     fontStyle: 'italic',
//     fontFamily: 'Montserrat-Regular',
//   },

//   vocabSynonym: {
//     fontSize: isTablet ? 16 : 14,
//     color: '#45a578',
//     fontWeight: '600',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   assessmentSection: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     marginBottom: 10,
//   },

//   assessmentButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },

//   buttonIcon: {
//     marginRight: 6,
//   },

//   needsPracticeButton: {
//     flex: 1,
//     backgroundColor: '#FFE5E5',
//     borderRadius: 12,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     shadowColor: '#FF6B6B',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },

//   needsPracticeButtonActive: {
//     borderColor: '#FF6B6B',
//     backgroundColor: '#FFD0D0',
//   },

//   needsPracticeText: {
//     fontSize: isTablet ? 16 : 14,
//     fontWeight: '700',
//     color: '#FF6B6B',
//     fontFamily: 'Montserrat-Bold',
//   },

//   knewItButton: {
//     flex: 1,
//     backgroundColor: '#E8F5E9',
//     borderRadius: 12,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     shadowColor: '#45a578',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },

//   knewItButtonActive: {
//     borderColor: '#45a578',
//     backgroundColor: '#D0F0D8',
//   },

//   knewItText: {
//     fontSize: isTablet ? 16 : 14,
//     fontWeight: '700',
//     color: '#45a578',
//     fontFamily: 'Montserrat-Bold',
//   },

//   relevanceSection: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     marginBottom: 10,
//   },

//   relevanceQuestion: {
//     fontSize: isTablet ? 15 : 14,
//     fontWeight: '600',
//     color: '#333333',
//     marginBottom: 12,
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   relevanceButtons: {
//     flexDirection: 'row',
//     gap: 12,
//   },

//   noButton: {
//     flex: 1,
//     backgroundColor: '#FFE5E5',
//     borderRadius: 10,
//     paddingVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     shadowColor: '#FF6B6B',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.12,
//     shadowRadius: 4,
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },

//   noButtonActive: {
//     borderColor: '#FF6B6B',
//     backgroundColor: '#FFD0D0',
//   },

//   noButtonText: {
//     fontSize: isTablet ? 15 : 13,
//     fontWeight: '700',
//     color: '#FF6B6B',
//     fontFamily: 'Montserrat-Bold',
//   },

//   yesButton: {
//     flex: 1,
//     backgroundColor: '#E8F5E9',
//     borderRadius: 10,
//     paddingVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//     shadowColor: '#45a578',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.12,
//     shadowRadius: 4,
//     elevation: 2,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },

//   yesButtonActive: {
//     borderColor: '#45a578',
//     backgroundColor: '#D0F0D8',
//   },

//   yesButtonText: {
//     fontSize: isTablet ? 15 : 13,
//     fontWeight: '700',
//     color: '#45a578',
//     fontFamily: 'Montserrat-Bold',
//   },

//   articleSection: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     marginBottom: 10,
//   },

//   learnInDetailButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     paddingVertical: 12,
//     gap: 8,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//     elevation: 2,
//   },

//   learnInDetailText: {
//     fontSize: isTablet ? 18 : 16,
//     fontWeight: '600',
//     color: '#666666',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   videosSection: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     marginBottom: 10,
//   },

//   videosSectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     gap: 10,
//   },

//   videosSectionTitle: {
//     fontSize: isTablet ? 20 : 18,
//     fontWeight: '700',
//     color: '#333333',
//     fontFamily: 'Montserrat-Bold',
//   },

//   videosSectionSubtitle: {
//     fontSize: isTablet ? 18 : 16,
//     color: '#666666',
//     marginBottom: 20,
//     fontFamily: 'Montserrat-Regular',
//   },

//   videoCard: {
//     marginBottom: 16,
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },

//   videoThumbnail: {
//     width: '100%',
//     height: 180,
//     backgroundColor: '#000000',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },

//   videoThumbnailText: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     right: 10,
//     fontSize: isTablet ? 20 : 17,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     fontFamily: 'Montserrat-Bold',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 3,
//   },

//   videoTitle: {
//     fontSize: isTablet ? 20 : 18,
//     fontWeight: '600',
//     color: '#333333',
//     padding: 12,
//     paddingBottom: 4,
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   videoChannel: {
//     fontSize: isTablet ? 18 : 16,
//     color: '#666666',
//     paddingHorizontal: 12,
//     paddingBottom: 12,
//     fontFamily: 'Montserrat-Regular',
//   },

//   modalVideosSection: {
//     marginTop: 24,
//     paddingTop: 24,
//     borderTopWidth: 1,
//     borderTopColor: '#E0E0E0',
//   },

//   modalVideosSectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     gap: 10,
//   },

//   modalVideosSectionTitle: {
//     fontSize: isTablet ? 24 : 20,
//     fontWeight: '700',
//     color: '#333333',
//     fontFamily: 'Montserrat-Bold',
//   },

//   modalVideosSectionSubtitle: {
//     fontSize: isTablet ? 18 : 16,
//     color: '#666666',
//     marginBottom: 20,
//     fontFamily: 'Montserrat-Regular',
//   },

//   modalVideoCard: {
//     marginBottom: 16,
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },

//   modalVideoThumbnail: {
//     width: '100%',
//     height: 180,
//     backgroundColor: '#000000',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },

//   modalVideoThumbnailText: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     right: 10,
//     fontSize: isTablet ? 20 : 17,
//     fontWeight: '700',
//     color: '#FFFFFF',
//     fontFamily: 'Montserrat-Bold',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 3,
//   },

//   modalVideoTitle: {
//     fontSize: isTablet ? 20 : 18,
//     fontWeight: '600',
//     color: '#333333',
//     padding: 12,
//     paddingBottom: 4,
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   modalVideoChannel: {
//     fontSize: isTablet ? 18 : 16,
//     color: '#666666',
//     paddingHorizontal: 12,
//     paddingBottom: 12,
//     fontFamily: 'Montserrat-Regular',
//   },

//   modalOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },

//   modalContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     width: '90%',
//     maxHeight: '80%',
//     overflow: 'hidden',
//   },

//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },

//   modalCloseButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   modalContent: {
//     padding: 20,
//   },

//   modalTitle: {
//     fontSize: isTablet ? 20 : 18,
//     fontWeight: '700',
//     color: '#333333',
//     marginBottom: 8,
//     fontFamily: 'Montserrat-Bold',
//   },

//   modalSubtitle: {
//     fontSize: isTablet ? 18 : 16,
//     fontWeight: '600',
//     color: '#666666',
//     marginBottom: 16,
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   modalHeading: {
//     fontSize: isTablet ? 18 : 16,
//     fontWeight: '700',
//     color: '#333333',
//     marginTop: 16,
//     marginBottom: 8,
//     fontFamily: 'Montserrat-Bold',
//   },

//   modalText: {
//     fontSize: isTablet ? 16 : 14,
//     color: '#444444',
//     lineHeight: isTablet ? 24 : 21,
//     marginBottom: 12,
//     fontFamily: 'Montserrat-Regular',
//     textAlign: 'justify',
//   },

//   modalBottomPadding: {
//     height: 40,
//   },

//   datePickerModal: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     width: '90%',
//     maxWidth: 400,
//     overflow: 'hidden',
//   },

//   datePickerTopBar: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingTop: 12,
//     paddingBottom: 4,
//   },

//   datePickerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//     gap: 16,
//   },

//   datePickerNavButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20,
//     backgroundColor: '#F5F5F5',
//   },

//   datePickerTitle: {
//     fontSize: isTablet ? 24 : 20,
//     fontWeight: '700',
//     color: '#333333',
//     fontFamily: 'Montserrat-Bold',
//     flex: 1,
//     textAlign: 'center',
//   },

//   datePickerCloseButton: {
//     width: 36,
//     height: 36,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 18,
//     backgroundColor: '#F5F5F5',
//   },

//   fullCalendarContent: {
//     padding: 16,
//   },

//   calendarDayLabels: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 12,
//   },

//   calendarDayLabel: {
//     width: 40,
//     textAlign: 'center',
//     fontSize: isTablet ? 16 : 14,
//     fontWeight: '600',
//     color: '#999999',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   calendarWeekRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 8,
//   },

//   fullCalendarDay: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//   },

//   fullCalendarDayEmpty: {
//     backgroundColor: 'transparent',
//   },

//   fullCalendarDayToday: {
//     borderWidth: 2,
//     borderColor: '#45a578',
//   },

//   fullCalendarDaySelected: {
//     backgroundColor: '#45a578',
//     borderColor: '#45a578',
//     shadowColor: '#45a578',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 3,
//   },

//   fullCalendarDayDisabled: {
//     backgroundColor: '#E8E8E8',
//     opacity: 0.75,
//     borderColor: 'transparent',
//   },

//   fullCalendarDayText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#333333',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   fullCalendarDayTextToday: {
//     color: '#45a578',
//     fontWeight: '700',
//   },

//   fullCalendarDayTextSelected: {
//     color: '#FFFFFF',
//     fontWeight: '700',
//   },

//   fullCalendarDayTextDisabled: {
//     color: '#999999',
//   },

//   todayButton: {
//     backgroundColor: 'transparent',
//     borderRadius: 12,
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginTop: 2,
//   },

//   todayButtonText: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#45a578',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   datePickerContent: {
//     padding: 16,
//   },

//   datePickerOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#F9F9F9',
//     borderRadius: 12,
//     marginBottom: 12,
//     gap: 12,
//   },

//   datePickerOptionText: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333333',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   flashcardsSection: {
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//     marginBottom: 10,
//   },

//   flashcardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 10,
//   },

//   flashcardTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333333',
//     fontFamily: 'Montserrat-Bold',
//   },

//   flashcardContainer: {
//     marginBottom: 16,
//   },

//   flashcard: {
//     backgroundColor: '#F9F9F9',
//     borderRadius: 16,
//     padding: 20,
//     minHeight: 200,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },

//   flashcardTop: {
//     alignItems: 'flex-end',
//     marginBottom: 12,
//   },

//   flashcardCounter: {
//     fontSize: 12,
//     color: '#999999',
//     fontWeight: '600',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   flashcardContent: {
//     flex: 1,
//   },

//   flashcardQuestion: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333333',
//     lineHeight: 24,
//     marginBottom: 16,
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   flashcardAnswer: {
//     marginTop: 16,
//   },

//   answerDivider: {
//     height: 1,
//     backgroundColor: '#E0E0E0',
//     marginBottom: 16,
//   },

//   flashcardAnswerText: {
//     fontSize: 14,
//     color: '#666666',
//     lineHeight: 22,
//     fontFamily: 'Montserrat-Regular',
//   },

//   showAnswerButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#E8F5E9',
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//     marginTop: 16,
//   },

//   showAnswerText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#45a578',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   flashcardNavigation: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 16,
//   },

//   navButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#F9F9F9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },

//   flashcardDots: {
//     flexDirection: 'row',
//     gap: 8,
//   },

//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#E0E0E0',
//   },

//   dotActive: {
//     backgroundColor: '#45a578',
//     width: 24,
//   },

//   bottomPadding: {
//     height: 40,
//   },
// });  
 
 
/**
 * Topic Detail Screen - Shows daily nudge with calendar, units, and flashcards
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { getFlashcards, getQACards, getPrompts } from '../data/nudgesData';
import { fetchContentSetByTopic, fetchLearnDetailByTopic } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const TopicDetailScreen = ({ topicData, subjectName, allNudges, userData, onBack, onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const [learningStatus, setLearningStatus] = useState(null);
  const [topicRelevance, setTopicRelevance] = useState(null);
  const [currentNudgeIndex, setCurrentNudgeIndex] = useState(0);

  // API content set (flashcards, Q&A, prompts from admin panel)
  const [apiContentSet, setApiContentSet] = useState(null);
  const [apiLearnDetail, setApiLearnDetail] = useState(null);
  const [selectedApiTopic, setSelectedApiTopic] = useState(
    topicData?.apiTopics?.[0] || null
  );

  // Fetch content set and learn detail when an API topic is selected
  useEffect(() => {
    if (selectedApiTopic?._id) {
      fetchContentSetByTopic(selectedApiTopic._id)
        .then(set => setApiContentSet(set))
        .catch(() => setApiContentSet(null));
      fetchLearnDetailByTopic(selectedApiTopic._id)
        .then(detail => setApiLearnDetail(detail))
        .catch(() => setApiLearnDetail(null));
    }
  }, [selectedApiTopic?._id]);

  // Fix localhost URLs in content
  const fixUrl = (url) => url ? url.replace('http://localhost:5000', 'http://192.168.1.29:5000') : url;

  // Use allNudges if available, otherwise use topicData
  const nudgesToDisplay = allNudges && allNudges.length > 0 ? allNudges : [topicData];
  const currentNudge = nudgesToDisplay[currentNudgeIndex] || topicData;

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const currentDayName = currentDate.toLocaleString('en-US', { weekday: 'long' });
  const currentDay = currentDate.getDate();

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.getDate());
    }
    return dates;
  };

  const dates = generateWeekDates();

  const getAvailableDates = () => {
    const available = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    for (let i = 0; i <= dayOfWeek; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      available.push({
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
      });
    }
    return available;
  };

  const availableDates = getAvailableDates();

  const hasDataForDate = (day, month, year) => {
    return availableDates.some(
      d => d.date === day && d.month === month && d.year === year
    );
  };

  const getWeeklyTopics = () => {
    const subject = currentNudge?.subject || subjectName;

    if (subject === 'Math') {
      return [
        { day: 'Sunday', topic: 'Counting Money', icon: 'cash-multiple', color: '#3B82F6' },
        { day: 'Monday', topic: 'Simple Addition', icon: 'plus-circle', color: '#3B82F6' },
        { day: 'Tuesday', topic: 'Basic Shapes', icon: 'shape', color: '#3B82F6' },
        { day: 'Wednesday', topic: 'Patterns', icon: 'dots-horizontal', color: '#3B82F6' },
        { day: 'Thursday', topic: 'Measurement', icon: 'ruler', color: '#3B82F6' },
        { day: 'Friday', topic: 'Number Games', icon: 'numeric', color: '#3B82F6' },
        { day: 'Saturday', topic: 'Spatial Shapes', icon: 'cube-outline', color: '#3B82F6' },
      ];
    }

    if (subject === 'Science / EVS') {
      return [
        { day: 'Sunday', topic: 'Water Conservation', icon: 'water', color: '#10B981' },
        { day: 'Monday', topic: 'Water Cycle', icon: 'water-outline', color: '#10B981' },
        { day: 'Tuesday', topic: 'Saving Water', icon: 'water-pump', color: '#10B981' },
        { day: 'Wednesday', topic: 'Parts of a Plant', icon: 'flower', color: '#10B981' },
        { day: 'Thursday', topic: 'Growing Plants', icon: 'sprout', color: '#10B981' },
        { day: 'Friday', topic: 'Trees & Nature', icon: 'leaf', color: '#10B981' },
        { day: 'Saturday', topic: 'Recycling', icon: 'recycle', color: '#10B981' },
      ];
    }

    if (subject === 'English') {
      return [
        { day: 'Sunday', topic: 'Story Time', icon: 'book-open-variant', color: '#F59E0B' },
        { day: 'Monday', topic: 'Reading Skills', icon: 'book-alphabet', color: '#F59E0B' },
        { day: 'Tuesday', topic: 'Writing Letters', icon: 'pencil', color: '#F59E0B' },
        { day: 'Wednesday', topic: 'Rhyming Words', icon: 'music-note', color: '#F59E0B' },
        { day: 'Thursday', topic: 'Story Elements', icon: 'book-open-page-variant', color: '#F59E0B' },
        { day: 'Friday', topic: 'Vocabulary', icon: 'alphabetical', color: '#F59E0B' },
        { day: 'Saturday', topic: 'Creative Writing', icon: 'fountain-pen-tip', color: '#F59E0B' },
      ];
    }

    if (subject === 'Social Studies') {
      return [
        { day: 'Sunday', topic: 'Acts of Kindness', icon: 'heart-multiple', color: '#EC4899' },
        { day: 'Monday', topic: 'Sharing & Caring', icon: 'hand-heart', color: '#EC4899' },
        { day: 'Tuesday', topic: 'Honesty', icon: 'shield-check', color: '#EC4899' },
        { day: 'Wednesday', topic: 'Respect', icon: 'account-group', color: '#EC4899' },
        { day: 'Thursday', topic: 'Empathy', icon: 'emoticon-happy', color: '#EC4899' },
        { day: 'Friday', topic: 'Gratitude', icon: 'gift', color: '#EC4899' },
        { day: 'Saturday', topic: 'Helping Others', icon: 'hand-heart-outline', color: '#EC4899' },
      ];
    }

    if (subject === 'Artificial Intelligence') {
      return [
        { day: 'Sunday', topic: 'What is AI?', icon: 'brain', color: '#8B5CF6' },
        { day: 'Monday', topic: 'AI in Your Phone', icon: 'smartphone', color: '#8B5CF6' },
        { day: 'Tuesday', topic: 'AI in Games', icon: 'gamepad-variant', color: '#8B5CF6' },
        { day: 'Wednesday', topic: 'AI Helps Us', icon: 'robot', color: '#8B5CF6' },
        { day: 'Thursday', topic: 'Machine Learning', icon: 'brain-outline', color: '#8B5CF6' },
        { day: 'Friday', topic: 'AI in Future', icon: 'rocket', color: '#8B5CF6' },
        { day: 'Saturday', topic: 'AI Ethics', icon: 'scale-balance', color: '#8B5CF6' },
      ];
    }

    if (subject === 'Financial Literacy') {
      return [
        { day: 'Sunday', topic: 'Where Money Comes From', icon: 'cash-multiple', color: '#10B981' },
        { day: 'Monday', topic: 'Saving Money', icon: 'piggy-bank', color: '#10B981' },
        { day: 'Tuesday', topic: 'Spending Wisely', icon: 'shopping-cart', color: '#10B981' },
        { day: 'Wednesday', topic: 'Earning Money', icon: 'briefcase', color: '#10B981' },
        { day: 'Thursday', topic: 'Money Goals', icon: 'target', color: '#10B981' },
        { day: 'Friday', topic: 'Banking Basics', icon: 'bank', color: '#10B981' },
        { day: 'Saturday', topic: 'Financial Planning', icon: 'chart-line', color: '#10B981' },
      ];
    }

    if (subject === 'Sex & Safety') {
      return [
        { day: 'Sunday', topic: 'My Body, My Rules', icon: 'heart-check', color: '#EF4444' },
        { day: 'Monday', topic: 'Safe & Unsafe Touches', icon: 'shield-alert', color: '#EF4444' },
        { day: 'Tuesday', topic: 'Private Parts', icon: 'information', color: '#EF4444' },
        { day: 'Wednesday', topic: 'Saying No', icon: 'hand-raised', color: '#EF4444' },
        { day: 'Thursday', topic: 'Asking for Help', icon: 'phone', color: '#EF4444' },
        { day: 'Friday', topic: 'Trusted Adults', icon: 'account-multiple', color: '#EF4444' },
        { day: 'Saturday', topic: 'Safety Tips', icon: 'shield-check', color: '#EF4444' },
      ];
    }

    // Default topics
    return [
      { day: 'Sunday', topic: 'Learning Fun', icon: 'school', color: '#2196F3' },
      { day: 'Monday', topic: 'Discovery Time', icon: 'magnify', color: '#FF9800' },
      { day: 'Tuesday', topic: 'Exploration', icon: 'compass', color: '#4CAF50' },
      { day: 'Wednesday', topic: 'Creative Play', icon: 'puzzle', color: '#9C27B0' },
      { day: 'Thursday', topic: 'Learning Journey', icon: 'map', color: '#27AE60' },
      { day: 'Friday', topic: 'Fun Activities', icon: 'star', color: '#FFB84D' },
      { day: 'Saturday', topic: 'Weekend Learning', icon: 'calendar-star', color: '#00BCD4' },
    ];
  };

  // If we have API topics, use them as the topic list instead of hardcoded weekly topics
  const apiTopics = topicData?.apiTopics || [];
  const hasApiTopics = apiTopics.length > 0;

  const weeklyTopics = getWeeklyTopics();
  const todayIndex = currentDate.getDay();
  const todayTopic = weeklyTopics[todayIndex];

  const getSelectedDayIndex = () => {
    for (let i = 0; i < dates.length; i++) {
      if (dates[i] === selectedDate) {
        return i;
      }
    }
    return todayIndex;
  };

  const selectedDayIndex = getSelectedDayIndex();
  const selectedDayTopic = weeklyTopics[selectedDayIndex];

  const displayTopic = hasApiTopics && selectedApiTopic ? {
    ...topicData,
    topic: selectedApiTopic.title,
    title: selectedApiTopic.title,
    subject: subjectName || topicData?.subject,
    description: selectedApiTopic.description,
    imageUrl: fixUrl(selectedApiTopic.imageUrl),
  } : {
    ...topicData,
    topic: topicData?.topic || topicData?.title || subjectName || '',
    title: topicData?.title || topicData?.topic || subjectName || '',
    subject: subjectName || topicData?.subject,
  };

  const generateFullCalendar = () => {
    const firstDay = new Date(pickerYear, pickerMonth, 1);
    const lastDay = new Date(pickerYear, pickerMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const calendar = [];
    let week = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      week.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }
    return calendar;
  };

  const calendarGrid = generateFullCalendar();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const goToPreviousMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear(pickerYear - 1);
    } else {
      setPickerMonth(pickerMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear(pickerYear + 1);
    } else {
      setPickerMonth(pickerMonth + 1);
    }
  };

  const handleDateSelect = (day) => {
    if (day) {
      setSelectedDate(day);
      setShowDatePicker(false);
    }
  };

  const subjectColors = {
    'Environmental Studies': '#27AE60',
    'Mathematics': '#27AE60',
    'Science': '#27AE60',
    'Language Arts': '#27AE60',
    'Values & Character': '#27AE60',
    'Arts & Creativity': '#27AE60',
  };

  const subjectColor = subjectColors[subjectName || topicData?.subject] || '#45a578';

  const units = [
    {
      id: 1,
      name: `Unit 1 — All About the Topic`,
      concept: displayTopic?.whatYouWillLearn || topicData?.whatYouWillLearn || 'Key concepts and learning objectives for this topic.',
      parentOutcome: 'Practical applications in daily life and real-world connections.',
    },
    {
      id: 2,
      name: 'Unit 2 — Questions & Answers',
      description: 'Interactive Q&A session to test your understanding, spark, curiosity and clarify doubts.',
    },
    {
      id: 3,
      name: 'Unit 3 — Conversation Prompts',
      description: 'Thought-provoking prompts to encourage deeper thinking and meaningful parent-child conversation.',
    },
  ];

  const createPrompts = () => {
    if (apiContentSet?.prompts?.length > 0) {
      return apiContentSet.prompts.map((p, i) => ({ id: p._id || i, prompt: p.prompt, hint: p.hint }));
    }
    return []; // No admin data
  };

  const prompts = createPrompts();

  const createVocabulary = () => {
    const subject = displayTopic?.subject;
    if (subject === 'Mathematics') {
      return [
        { id: 1, word: 'Dormant', type: 'Adjective', definition: 'Word-Stressed Definition: A seed in a resting stage, not growing until conditions are right.', example: '"The seed is like it\'s sleeping — it waits for the right water and warmth to \'wake up\' and grow."', synonym: 'Inactive, asleep' },
        { id: 2, word: 'Germination', type: 'Noun', definition: 'Word-Stressed Definition: The first time a baby root (the radicle) pokes out of a seed — like the seed is "waking up."', example: '"When you see that tiny white root coming out of the seed, that\'s germination!"', synonym: 'Sprouting' },
        { id: 3, word: 'Radicle', type: 'Noun', definition: 'Word-Stressed Definition: The first tiny root that comes out of a seed during germination.', example: '"The radicle is like the baby root — it\'s the first part to grow out of the seed."', synonym: 'Baby root, first root' },
      ];
    }
    if (subject === 'Environmental Studies') {
      return [
        { id: 1, word: 'Conservation', type: 'Noun', definition: 'Word-Stressed Definition: Protecting and saving natural resources like water, plants, and animals.', example: '"Water conservation means using water wisely so we don\'t waste it."', synonym: 'Protection, preservation' },
        { id: 2, word: 'Photosynthesis', type: 'Noun', definition: 'Word-Stressed Definition: The process plants use to make food from sunlight, water, and air.', example: '"Plants use photosynthesis to turn sunlight into energy, just like we eat food for energy."', synonym: 'Plant food-making' },
        { id: 3, word: 'Ecosystem', type: 'Noun', definition: 'Word-Stressed Definition: A community of living things (plants, animals) and their environment working together.', example: '"A pond ecosystem includes fish, plants, water, and all the tiny creatures living together."', synonym: 'Habitat, environment' },
      ];
    }
    if (subject === 'Science') {
      return [
        { id: 1, word: 'Adaptation', type: 'Noun', definition: 'Word-Stressed Definition: Special features that help animals survive in their environment.', example: '"A polar bear\'s thick fur is an adaptation that keeps it warm in the cold Arctic."', synonym: 'Adjustment, special feature' },
        { id: 2, word: 'Habitat', type: 'Noun', definition: 'Word-Stressed Definition: The natural home where an animal or plant lives.', example: '"A fish\'s habitat is water, while a bird\'s habitat might be a tree or nest."', synonym: 'Home, environment' },
        { id: 3, word: 'Nutrients', type: 'Noun', definition: 'Word-Stressed Definition: Substances in food that help our body grow, stay healthy, and have energy.', example: '"Fruits and vegetables have lots of nutrients that make us strong and healthy."', synonym: 'Vitamins, goodness' },
      ];
    }
    if (subject === 'Language Arts') {
      return [
        { id: 1, word: 'Character', type: 'Noun', definition: 'Word-Stressed Definition: A person, animal, or creature in a story.', example: '"Harry Potter is the main character in his story — the story is mostly about him."', synonym: 'Person in story' },
        { id: 2, word: 'Setting', type: 'Noun', definition: 'Word-Stressed Definition: Where and when a story takes place.', example: '"The setting of Cinderella is a kingdom long ago, with a castle and village."', synonym: 'Place, location' },
        { id: 3, word: 'Plot', type: 'Noun', definition: 'Word-Stressed Definition: The sequence of events that happen in a story.', example: '"The plot is what happens in the story — the beginning, middle, and end."', synonym: 'Story events, what happens' },
      ];
    }
    if (subject === 'Values & Character') {
      return [
        { id: 1, word: 'Empathy', type: 'Noun', definition: 'Word-Stressed Definition: Understanding and sharing the feelings of another person.', example: '"When your friend is sad and you feel sad too, that\'s empathy — you understand their feelings."', synonym: 'Understanding, compassion' },
        { id: 2, word: 'Kindness', type: 'Noun', definition: 'Word-Stressed Definition: Being friendly, caring, and helpful to others.', example: '"Sharing your toys or helping someone who fell shows kindness."', synonym: 'Caring, niceness' },
        { id: 3, word: 'Respect', type: 'Noun', definition: 'Word-Stressed Definition: Treating others the way you want to be treated, with care and politeness.', example: '"Listening when someone talks and saying \'please\' and \'thank you\' shows respect."', synonym: 'Politeness, consideration' },
      ];
    }
    if (subject === 'Arts & Creativity') {
      return [
        { id: 1, word: 'Primary Colors', type: 'Noun', definition: 'Word-Stressed Definition: The three basic colors (red, blue, yellow) that can\'t be made by mixing other colors.', example: '"Red, blue, and yellow are primary colors — all other colors come from mixing these!"', synonym: 'Basic colors' },
        { id: 2, word: 'Texture', type: 'Noun', definition: 'Word-Stressed Definition: How something feels when you touch it — smooth, rough, soft, or bumpy.', example: '"Sandpaper has a rough texture, while silk has a smooth texture."', synonym: 'Feel, surface' },
        { id: 3, word: 'Creativity', type: 'Noun', definition: 'Word-Stressed Definition: Using imagination to make something new and original.', example: '"When you draw a picture from your imagination, you\'re using creativity!"', synonym: 'Imagination, originality' },
      ];
    }
    return [
      { id: 1, word: 'Learning', type: 'Noun', definition: 'Word-Stressed Definition: Gaining knowledge or skills through study and experience.', example: '"Every day we do learning when we discover new things!"', synonym: 'Education, discovery' },
      { id: 2, word: 'Explore', type: 'Verb', definition: 'Word-Stressed Definition: To investigate and discover new things.', example: '"Let\'s explore the garden and see what we can find!"', synonym: 'Discover, investigate' },
      { id: 3, word: 'Curious', type: 'Adjective', definition: 'Word-Stressed Definition: Wanting to learn and know more about things.', example: '"Being curious means asking questions and wanting to learn!"', synonym: 'Interested, inquisitive' },
    ];
  };

  const vocabulary = createVocabulary();

  const createArticleContent = () => {
    if (apiLearnDetail) {
      return {
        title: selectedApiTopic?.title || displayTopic?.topic || 'Topic',
        subtitle: selectedApiTopic?.description || '',
        sections: [
          apiLearnDetail.overview             && { heading: 'Overview',               content: apiLearnDetail.overview },
          apiLearnDetail.keyConcepts          && { heading: 'Key Concepts',           content: apiLearnDetail.keyConcepts },
          apiLearnDetail.practicalApplication && { heading: 'Practical Application',  content: apiLearnDetail.practicalApplication },
          apiLearnDetail.supportingLearning   && { heading: 'Supporting Learning',    content: apiLearnDetail.supportingLearning },
        ].filter(Boolean),
        videoUrl: apiLearnDetail.videoUrl || null,
      };
    }
    return null; // No admin data — don't show article
  };

  const articleContent = createArticleContent();

  const createFlashcards = () => {
    if (apiContentSet?.flashcards?.length > 0) {
      return apiContentSet.flashcards.map((fc, i) => ({
        id: fc._id || i,
        title: fc.title, description: fc.description,
        subtitle: fc.subtitle, subdescription: fc.subdescription,
        concept: fc.description, parentOutcome: fc.subtitle, section2: fc.subdescription,
      }));
    }
    return []; // No admin data — show nothing
  };

  const flashcards = createFlashcards();

  const createQAFlashcards = () => {
    if (apiContentSet?.qaCards?.length > 0) {
      return apiContentSet.qaCards.map((qa, i) => ({ id: qa._id || i, question: qa.question, answer: qa.answer }));
    }
    return []; // No admin data
  };

  const qaFlashcards = createQAFlashcards();

  const toggleUnit = (unitId) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  const childGrade = userData?.children?.[0]?.grade;
  const topicGrade = topicData?.grades?.[0];
  const gradeMismatch = childGrade && topicGrade && childGrade !== topicGrade;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── HEADER: back arrow + centered title + subject subtitle ── */}
      <View style={styles.screenHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {subjectName || topicData?.subject || 'Learning Topic'}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {gradeMismatch ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Icon name="book-outline" size={48} color="#9CA3AF" />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 16, textAlign: 'center' }}>
            Content coming soon
          </Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center', lineHeight: 22 }}>
            We're preparing topics for {childGrade}.{'\n'}Check back soon!
          </Text>
        </View>
      ) : (

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── CALENDAR — only show for local/static content, hide for API topics ── */}
        {!hasApiTopics && <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <View>
              <Text style={styles.calendarMonth}>{currentMonth} {currentYear}</Text>
              <Text style={styles.calendarSubtext}>Select a date to view content</Text>
            </View>
            <View style={styles.calendarActions}>
              <TouchableOpacity
                style={[styles.calendarIconButton, { borderColor: subjectColor, backgroundColor: `${subjectColor}10` }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Icon name="calendar-outline" size={18} color={subjectColor} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.todayButton, { borderColor: subjectColor, backgroundColor: `${subjectColor}10` }]}
                onPress={() => setSelectedDate(currentDay)}
              >
                <Icon name="time-outline" size={16} color={subjectColor} style={{ marginRight: 6 }} />
                <Text style={[styles.todayButtonText, { color: subjectColor }]}>TODAY</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.calendarGrid}>
            {weekDays.map((day, index) => {
              const dateValue = dates[index];
              const isFutureDate = dateValue > currentDay;
              const hasData = hasDataForDate(dateValue, currentDate.getMonth(), currentYear);
              const isDisabled = isFutureDate || !hasData;
              const isSelected = selectedDate === dateValue;
              const isToday = dateValue === currentDay;

              return (
                <View key={index} style={styles.calendarDayColumn}>
                  <TouchableOpacity
                    style={[
                      styles.calendarDate,
                      isSelected && [styles.calendarDateSelected, { backgroundColor: subjectColor }],
                      !isSelected && isToday && [styles.calendarDateToday, { borderColor: subjectColor, backgroundColor: `${subjectColor}10` }],
                      isDisabled && !isSelected && styles.calendarDateDisabled,
                    ]}
                    onPress={() => { if (!isDisabled) setSelectedDate(dateValue); }}
                    disabled={isDisabled}
                  >
                    <Text
                      style={[
                        styles.calendarDayLabel,
                        isSelected && styles.calendarLabelSelected,
                        !isSelected && isToday && { color: subjectColor },
                        isDisabled && !isSelected && styles.calendarLabelDisabled,
                      ]}
                    >
                      {day}
                    </Text>
                    <Text
                      style={[
                        styles.calendarDateText,
                        isSelected && styles.calendarDateTextSelected,
                        !isSelected && isToday && { color: subjectColor, fontWeight: '700' },
                        isDisabled && !isSelected && styles.calendarDateTextDisabled,
                      ]}
                    >
                      {dateValue}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>}

        {/* ── TOPIC CARD ── */}
        <View style={styles.topicCard}>
          

          <View style={styles.topicImageContainer}>
            {displayTopic?.imageUrl ? (
              <View style={styles.topicImagePlaceholder}>
                <Image
                  source={{ uri: fixUrl(displayTopic.imageUrl) }}
                  style={styles.subjectImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <View style={[styles.durationBadge, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
                    <Icon name="time-outline" size={16} color={subjectColor} />
                    <Text style={[styles.durationText, { color: subjectColor }]}>{topicData?.duration || '20 min'}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <LinearGradient
                colors={[`${subjectColor}40`, `${subjectColor}20`]}
                style={styles.topicImagePlaceholder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                  <MaterialIcon name="book-open-variant" size={70} color={subjectColor} />
                </View>
                <View style={styles.imageOverlay}>
                  <View style={[styles.durationBadge, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
                    <Icon name="time-outline" size={16} color={subjectColor} />
                    <Text style={[styles.durationText, { color: subjectColor }]}>{topicData?.duration || '20 min'}</Text>
                  </View>
                </View>
              </LinearGradient>
            )}
          </View>
          
          {/* Topic Info Section - Subject, Title, Description */}
          <View style={styles.topicInfoSection}>
            <View style={styles.subjectBadgeContainer}>
              <Text style={styles.subjectLabel}>
                {displayTopic?.subject || 'Learning'}
              </Text>
            </View>
            
            <Text style={styles.topicTitle}>
              {displayTopic?.topic || displayTopic?.title || 'Learning Topic'}
            </Text>

            {topicData?.shortDescription && (
              <Text style={styles.topicDescription}>{topicData.shortDescription}</Text>
            )}
          </View>
        </View>

        {/* ── UNITS ── */}
        <View style={styles.unitsSection}>
          {units.map((unit) => {
            const getUnitIcon = (unitId) => {
              switch(unitId) {
                case 1: return 'book-open-page-variant';
                case 2: return 'help-circle-outline';
                case 3: return 'message-text-outline';
                default: return 'book-outline';
              }
            };
            const getCardCount = (unitId) => {
              switch(unitId) {
                case 1: return flashcards.length;
                case 2: return qaFlashcards.length;
                case 3: return prompts.length;
                default: return 0;
              }
            };
            const getUnitDescription = (unitId) => {
              switch(unitId) {
                case 1: return 'Build your own understanding first - Quick, clear explanations with real-life connections so you can guide your child with confidence.';
                case 2: return 'Check understanding through conversation - Thoughtfully designed questions that go beyond right or wrong answers to build thinking skills.';
                case 3: return 'Bring learning into everyday life - Simple prompts that turn daily moments into meaningful learning and bonding experiences. the app should have this content ';
                default: return '';
              }
            };
            return (
              <View key={unit.id} style={styles.unitCard}>
                <View style={styles.unitIconContainer}>
                  <MaterialIcon name={getUnitIcon(unit.id)} size={22} color="#6B7280" />
                </View>
                <View style={styles.unitTextContainer}>
                  <Text style={styles.unitName}>{unit.name.split(' — ')[1] || unit.name}</Text>
                  <Text style={styles.unitBodyText}>{getUnitDescription(unit.id)}</Text>
                </View>
                <Text style={styles.cardCountText}>{getCardCount(unit.id)} cards</Text>
              </View>
            );
          })}
        </View>

        {/* ── START FLASHCARDS BUTTON ── */}
        <View style={styles.startFlashcardsSection}>
          <TouchableOpacity
            style={styles.startFlashcardsButton}
            onPress={() => {
              const allCards = [
                ...flashcards.map(c => ({ ...c, type: 'about' })),
                ...qaFlashcards.map(c => ({ ...c, type: 'qa' })),
                ...prompts.map(p => ({ id: `p-${p.id}`, type: 'prompt', question: p.prompt, answer: p.hint })),
              ];
              onNavigate && onNavigate('flashcards', { flashcards: allCards, topic: displayTopic?.topic, subject: displayTopic?.subject });
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.startFlashcardsText}>Start Flashcards</Text>
            <Icon name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.startFlashcardsHint}>Swipe through cards at your own pace</Text>
          <Text style={styles.startFlashcardsCount}>{flashcards.length + qaFlashcards.length + prompts.length} cards total · ~5 min</Text>
        </View>

        {/* ── LEARNING STATUS ── */}
        <View style={styles.learningStatusSection}>
          <View style={styles.learningStatusContainer}>
            <TouchableOpacity
              style={[styles.needsPracticeButton, learningStatus === 'needs_practice' && styles.needsPracticeButtonActive]}
              onPress={() => setLearningStatus(learningStatus === 'needs_practice' ? null : 'needs_practice')}
            >
              <Text style={[styles.needsPracticeText, learningStatus === 'needs_practice' && styles.needsPracticeTextActive]}>Needs Practice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.knewItButton, learningStatus === 'knew_it' && styles.knewItButtonActive]}
              onPress={() => setLearningStatus(learningStatus === 'knew_it' ? null : 'knew_it')}
            >
              <Text style={[styles.knewItText, learningStatus === 'knew_it' && styles.knewItTextActive]}>Knew It ✓</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── RELEVANCE ── */}
        <View style={styles.relevanceSection}>
          <TouchableOpacity style={styles.learnInDetailButton} onPress={() => setShowArticleModal(true)}>
            <MaterialIcon name="book-open-page-variant" size={20} color="#666666" />
            <Text style={styles.learnInDetailText}>Learn in Detail</Text>
          </TouchableOpacity>

          <Text style={styles.relevanceQuestion}>Is the topic relevant?</Text>
          <View style={styles.relevanceButtons}>
            <TouchableOpacity
              style={[styles.noButton, topicRelevance === 'no' && styles.noButtonActive]}
              onPress={() => {
                const v = topicRelevance === 'no' ? null : 'no';
                setTopicRelevance(v);
                if (v === 'no') Alert.alert('Feedback Received', 'Thank you! We\'ll work on more relevant topics.', [{ text: 'OK' }]);
              }}
            >
              {topicRelevance === 'no' && <Icon name="checkmark-circle" size={16} color="#FF6B6B" style={{ marginRight: 6 }} />}
              <Text style={styles.noButtonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.yesButton, topicRelevance === 'yes' && styles.yesButtonActive]}
              onPress={() => {
                const v = topicRelevance === 'yes' ? null : 'yes';
                setTopicRelevance(v);
                if (v === 'yes') Alert.alert('Great!', 'We\'re glad this topic is relevant to you. Keep learning!', [{ text: 'OK' }]);
              }}
            >
              {topicRelevance === 'yes' && <Icon name="checkmark-circle" size={16} color="#45a578" style={{ marginRight: 6 }} />}
              <Text style={styles.yesButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      )}

      {/* ── ARTICLE MODAL ── */}
      {showArticleModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowArticleModal(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{articleContent.title}</Text>
              <Text style={styles.modalSubtitle}>{articleContent.subtitle}</Text>
              {articleContent.sections.map((section, index) => (
                <View key={index}>
                  <Text style={styles.modalHeading}>{section.heading}</Text>
                  <Text style={styles.modalText}>{section.content}</Text>
                </View>
              ))}
              <View style={styles.modalVideosSection}>
                <View style={styles.modalVideosSectionHeader}>
                  <MaterialIcon name="youtube" size={24} color="#FF0000" />
                  <Text style={styles.modalVideosSectionTitle}>Videos on this topic</Text>
                </View>
                
                <View style={styles.modalVideoCard}>
                  <View style={styles.modalVideoThumbnail}>
                    <MaterialIcon name="play-circle" size={48} color="#FFFFFF" />
                   
                  </View>
                
                </View>
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      )}

      {/* ── DATE PICKER MODAL ── */}
      {showDatePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerTopBar}>
              <TouchableOpacity style={styles.datePickerCloseButton} onPress={() => setShowDatePicker(false)}>
                <Icon name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity style={styles.datePickerNavButton} onPress={goToPreviousMonth}>
                <Icon name="chevron-back" size={24} color="#333333" />
              </TouchableOpacity>
              <Text style={styles.datePickerTitle}>{monthNames[pickerMonth]} {pickerYear}</Text>
              <TouchableOpacity style={styles.datePickerNavButton} onPress={goToNextMonth}>
                <Icon name="chevron-forward" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            <View style={styles.fullCalendarContent}>
              <View style={styles.calendarDayLabelsRow}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <Text key={i} style={styles.calendarDayLabelSmall}>{d}</Text>
                ))}
              </View>
              {calendarGrid.map((week, wi) => (
                <View key={wi} style={styles.calendarWeekRow}>
                  {week.map((day, di) => {
                    const isToday = day === currentDay && pickerMonth === currentDate.getMonth() && pickerYear === currentYear;
                    const isSelected = day === selectedDate && pickerMonth === currentDate.getMonth() && pickerYear === currentYear;
                    const isFuture = pickerYear > currentYear || (pickerYear === currentYear && pickerMonth > currentDate.getMonth()) || (pickerYear === currentYear && pickerMonth === currentDate.getMonth() && day > currentDay);
                    const hasData = day ? hasDataForDate(day, pickerMonth, pickerYear) : false;
                    const isDisabled = !day || isFuture || !hasData;
                    return (
                      <TouchableOpacity
                        key={di}
                        style={[
                          styles.fullCalendarDay,
                          !day && styles.fullCalendarDayEmpty,
                          isToday && styles.fullCalendarDayToday,
                          isSelected && [styles.fullCalendarDaySelected, { backgroundColor: subjectColor }],
                          isDisabled && !isSelected && styles.fullCalendarDayDisabled,
                        ]}
                        onPress={() => !isDisabled && handleDateSelect(day)}
                        disabled={isDisabled}
                      >
                        {day && (
                          <Text style={[
                            styles.fullCalendarDayText,
                            isToday && styles.fullCalendarDayTextToday,
                            isSelected && styles.fullCalendarDayTextSelected,
                            isDisabled && styles.fullCalendarDayTextDisabled,
                          ]}>
                            {day}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
              <TouchableOpacity
                style={styles.goTodayButton}
                onPress={() => { setPickerMonth(currentDate.getMonth()); setPickerYear(currentYear); setSelectedDate(currentDay); setShowDatePicker(false); }}
              >
                <Text style={[styles.goTodayText, { color: subjectColor }]}>Go to Today</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TopicDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ─── HEADER ───────────────────────────────────────────────────────────────
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  headerSubject: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 2,
    textAlign: 'center',
  },
  headerRight: {
    width: 40, // mirrors backButton width to keep title centred
  },

  // ─── SCROLL CONTENT ───────────────────────────────────────────────────────
  content: {
    flex: 1,
  },

  // ─── CALENDAR ─────────────────────────────────────────────────────────────
  calendarSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  calendarMonth: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  calendarSubtext: {
    fontSize: 13,
    color: '#95A5A6',
    fontFamily: 'Montserrat-Regular',
  },
  calendarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calendarIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1.5,
    // backgroundColor: '#FFFFFF',
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
  },
  todayButtonText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarDayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  calendarDate: {
    width: isTablet ? 52 : 43,
    height: isTablet ? 60 : 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 4,
  },
  calendarDateToday: {
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  calendarDateSelected: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  calendarDateDisabled: {
    opacity: 0.35,
  },
  calendarDayLabel: {
    fontSize: 9,
    color: '#7F8C8D',
    marginBottom: 3,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  calendarLabelSelected: {
    color: '#FFFFFF',
  },
  calendarLabelDisabled: {
    color: '#BDC3C7',
  },
  calendarDateText: {
    fontSize: isTablet ? 16 : 15,
    color: '#2C3E50',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  calendarDateTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calendarDateTextDisabled: {
    color: '#BDC3C7',
  },

  // ─── TOPIC CARD ───────────────────────────────────────────────────────────
  topicCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  subjectBadge: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexShrink: 1,
  },
  subjectBadgeText: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  durationText: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },
  topicImageContainer: {
    marginBottom: 0,
    paddingHorizontal: 0,
    marginTop: 0,
  },
  topicImagePlaceholder: {
    width: '100%',
    height: 240,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  topicInfoSection: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  subjectBadgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  subjectLabel: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '600',
    color: '#27AE60',
    fontFamily: 'Montserrat-SemiBold',
  },
  topicTitle: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    lineHeight: isTablet ? 36 : 30,
    fontFamily: 'Montserrat-Bold',
  },
  topicDescription: {
    fontSize: isTablet ? 15 : 14,
    color: '#666666',
    lineHeight: isTablet ? 24 : 22,
    fontFamily: 'Montserrat-Regular',
  },

  // ─── UNITS ────────────────────────────────────────────────────────────────
  unitsSection: {
    backgroundColor: 'transparent',
    padding: 0,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  unitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  unitIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  unitTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  unitName: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  unitNumberText: {
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    color: '#1A1A1A',
  },
  unitDescriptionText: {
    fontWeight: '400',
    fontFamily: 'Montserrat-Regular',
    color: '#1A1A1A',
  },
  cardCountText: {
    fontSize: isTablet ? 13 : 12,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
    flexShrink: 0,
    marginTop: 2,
  },
  unitContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  unitIntroText: {
    fontSize: isTablet ? 15 : 14,
    color: '#7D8A96',
    lineHeight: isTablet ? 24 : 22,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 16,
  },
  unitBodyText: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
    lineHeight: isTablet ? 22 : 18,
    fontFamily: 'Montserrat-Regular',
  },
  startFlashcardsSection: {
    marginHorizontal: isTablet ? 20 : 16,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  startFlashcardsButton: {
    backgroundColor: '#27AE60',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  startFlashcardsText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  startFlashcardsHint: {
    fontSize: isTablet ? 13 : 12,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
    marginTop: 10,
  },
  startFlashcardsCount: {
    fontSize: isTablet ? 13 : 12,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
  conceptBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  conceptBoxLabel: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: '700',
    color: '#5A6C7D',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },
  conceptBoxText: {
    fontSize: isTablet ? 15 : 14,
    color: '#4A5568',
    lineHeight: isTablet ? 24 : 22,
    fontFamily: 'Montserrat-Regular',
  },
  conceptSection: {
    marginBottom: 14,
  },
  conceptLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  conceptText: {
    fontSize: isTablet ? 15 : 13,
    color: '#666666',
    lineHeight: isTablet ? 24 : 20,
    fontFamily: 'Montserrat-Regular',
  },
  parentTipsBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  parentTipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
    letterSpacing: 0.5,
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
  },
  parentTipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  parentTipBullet: {
    fontSize: 16,
    color: '#D97706',
    marginRight: 8,
    marginTop: -2,
    fontFamily: 'Montserrat-Regular',
  },
  parentTipText: {
    flex: 1,
    fontSize: isTablet ? 14 : 13,
    color: '#92400E',
    lineHeight: isTablet ? 22 : 20,
    fontFamily: 'Montserrat-Regular',
  },
  openButton: {
    backgroundColor: '#27AE60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16,
    gap: 8,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  learningStatusSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  learningStatusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  needsPracticeButton: {
    flex: 1,
    backgroundColor: '#FFE5E5',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needsPracticeButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  needsPracticeText: {
    color: '#E74C3C',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  needsPracticeTextActive: {
    color: '#FFFFFF',
  },
  knewItButton: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  knewItButtonActive: {
    backgroundColor: '#27AE60',
  },
  knewItText: {
    color: '#27AE60',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  knewItTextActive: {
    color: '#FFFFFF',
  },
  promptTips: {
    marginTop: 12,
    backgroundColor: '#FFFBF0',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFE8B3',
  },
  promptTipBullet: {
    fontSize: isTablet ? 15 : 13,
    color: '#666666',
    lineHeight: isTablet ? 24 : 20,
    marginBottom: 4,
    fontFamily: 'Montserrat-Regular',
  },

  // ─── RELEVANCE ────────────────────────────────────────────────────────────
  relevanceSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 4,
  },
  learnInDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  learnInDetailText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#666666',
    fontFamily: 'Montserrat-SemiBold',
  },
  relevanceQuestion: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
  relevanceButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  noButton: {
    flex: 1,
    backgroundColor: '#FFE5E5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  noButtonActive: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFD0D0',
  },
  noButtonText: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '700',
    color: '#FF6B6B',
    fontFamily: 'Montserrat-Bold',
  },
  yesButton: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  yesButtonActive: {
    borderColor: '#45a578',
    backgroundColor: '#D0F0D8',
  },
  yesButtonText: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '700',
    color: '#45a578',
    fontFamily: 'Montserrat-Bold',
  },

  // ─── MODALS ───────────────────────────────────────────────────────────────
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { padding: 20 },
  modalTitle: {
    fontSize: isTablet ? 20 : 17,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
    fontFamily: 'Montserrat-Bold',
  },
  modalSubtitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
  modalHeading: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '700',
    color: '#333333',
    marginTop: 14,
    marginBottom: 6,
    fontFamily: 'Montserrat-Bold',
  },
  modalText: {
    fontSize: isTablet ? 15 : 13,
    color: '#444444',
    lineHeight: isTablet ? 23 : 20,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'justify',
  },
  modalVideosSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalVideosSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  modalVideosSectionTitle: {
    fontSize: isTablet ? 20 : 17,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
  },
  modalVideosSectionSubtitle: {
    fontSize: isTablet ? 15 : 13,
    color: '#666666',
    marginBottom: 16,
    fontFamily: 'Montserrat-Regular',
  },
  modalVideoCard: {
    marginBottom: 14,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalVideoThumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalVideoThumbnailText: {
    position: 'absolute',
    bottom: 8, left: 8, right: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  modalVideoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    padding: 10,
    paddingBottom: 4,
    fontFamily: 'Montserrat-SemiBold',
  },
  modalVideoChannel: {
    fontSize: 13,
    color: '#666666',
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },

  // ─── DATE PICKER MODAL ────────────────────────────────────────────────────
  datePickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  datePickerTopBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
  },
  datePickerCloseButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  datePickerNavButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  datePickerTitle: {
    fontSize: isTablet ? 20 : 17,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
    flex: 1,
    textAlign: 'center',
  },
  fullCalendarContent: { padding: 16 },
  calendarDayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  calendarDayLabelSmall: {
    width: 38,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#999999',
    fontFamily: 'Montserrat-SemiBold',
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  fullCalendarDay: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  fullCalendarDayEmpty: { backgroundColor: 'transparent' },
  fullCalendarDayToday: { borderWidth: 2, borderColor: '#45a578' },
  fullCalendarDaySelected: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  fullCalendarDayDisabled: { backgroundColor: '#E8E8E8', opacity: 0.7 },
  fullCalendarDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'Montserrat-SemiBold',
  },
  fullCalendarDayTextToday: { color: '#45a578', fontWeight: '700' },
  fullCalendarDayTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  fullCalendarDayTextDisabled: { color: '#999999' },
  goTodayButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  goTodayText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
});
