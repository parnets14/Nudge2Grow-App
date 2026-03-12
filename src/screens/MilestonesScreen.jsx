/**
 * Milestones Screen - Track child's developmental milestones
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const MilestonesScreen = ({ userData, onBack }) => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'activities', 'detail'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const child = userData?.children?.[0];

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const childAge = child?.dateOfBirth ? calculateAge(child.dateOfBirth) : child?.age;

  const getAvatarSource = (avatarId) => {
    // If no avatar ID, return null to show icon
    if (!avatarId) return null;
    
    // If it's a URI (starts with http or file), return as URI
    if (avatarId.startsWith('http') || avatarId.startsWith('file')) {
      return { uri: avatarId };
    }
    
    // Otherwise, map avatar IDs to local images
    const avatarMap = {
      'A1': require('../assets/images/A1.jpeg'),
      'A2': require('../assets/images/A2.jpeg'),
      'A3': require('../assets/images/A3.jpeg'),
      'A4': require('../assets/images/A4.jpeg'),
      'A5': require('../assets/images/A5.jpeg'),
      'A6': require('../assets/images/A6.jpeg'),
    };
    
    // Return the mapped image or null if not found
    return avatarMap[avatarId] || null;
  };

  // Milestone categories with activities
  const milestones = {
    academic: {
      title: 'Academic',
      icon: 'book',
      color: '#4FC3F7',
      items: [
        { id: 1, title: 'Reads & Summarizes Stories', completed: true },
        { id: 2, title: 'Solves 3-Digit Sums', completed: true },
        { id: 3, title: 'Writes Clear Paragraphs', completed: false },
      ],
      activities: [
        {
          id: 'a1',
          title: 'Story Time',
          time: '20 minutes',
          skills: 'Reading, Comprehension',
          icon: 'book-open',
          iconColor: '#4FC3F7',
          description: 'Embark on a magical journey with your child through the enchanting world of storytelling. This resource offers a curated collection of age-appropriate stories, designed to spark imagination, foster language development, and create cherished moments of connection.\n\nStory time is more than just reading words on a page—it\'s an opportunity to build vocabulary, enhance listening skills, and develop emotional intelligence as children explore different characters and situations. Through regular story sessions, children learn to predict outcomes, understand cause and effect, and develop critical thinking skills.\n\nMake story time interactive by asking questions, encouraging your child to predict what happens next, and discussing the characters\' feelings and motivations. This active engagement transforms passive listening into an enriching learning experience that strengthens the parent-child bond.',
          ageRange: '3-6 years',
          skillTags: ['Language Development', 'Imagination', 'Parent-Child Bonding'],
        },
        {
          id: 'a2',
          title: 'Math Games',
          time: '30 minutes',
          skills: 'Math, Problem Solving',
          icon: 'calculator',
          iconColor: '#FF9800',
          description: 'Transform mathematics from abstract concepts into exciting adventures with fun and interactive math games. These carefully designed activities build number sense, strengthen problem-solving abilities, and develop logical thinking through playful exploration.\n\nMath games help children understand mathematical concepts naturally, without the pressure of formal instruction. Through hands-on activities like counting objects, sorting by size or color, simple addition and subtraction with toys, and pattern recognition, children develop a strong foundation in mathematical thinking.\n\nThe key is to make math relevant to everyday life—count stairs while climbing, measure ingredients while cooking, or identify shapes during walks. This practical approach helps children see math as a useful tool rather than an intimidating subject, building confidence and enthusiasm for learning.',
          ageRange: '5-8 years',
          skillTags: ['Math Skills', 'Logic', 'Critical Thinking'],
        },
        {
          id: 'a3',
          title: 'Art Project',
          time: '45 minutes',
          skills: 'Creativity, Imagination',
          icon: 'color-palette',
          iconColor: '#E91E63',
          description: 'Unleash your child\'s creativity through engaging art projects that encourage self-expression and develop fine motor skills. Art is a powerful medium for children to communicate their thoughts, feelings, and unique perspectives on the world around them.\n\nThese projects go beyond simple coloring—they involve painting, drawing, collage-making, sculpting with clay or playdough, and creating with recycled materials. Each activity is designed to challenge children\'s imagination while building essential skills like hand-eye coordination, spatial awareness, and attention to detail.\n\nArt projects also teach valuable life lessons: patience as they work on detailed pieces, problem-solving when things don\'t go as planned, and pride in their accomplishments. Display their artwork to boost confidence and show that their creative efforts are valued. Remember, the process is more important than the final product—focus on the joy of creation rather than perfection.',
          ageRange: '4-7 years',
          skillTags: ['Creativity', 'Fine Motor Skills', 'Self Expression'],
        },
        {
          id: 'a4',
          title: 'Nature Walk',
          time: '15 minutes',
          skills: 'Science, Observation',
          icon: 'leaf',
          iconColor: '#4CAF50',
          description: 'Step outside and discover the wonders of nature through guided observation activities. Nature walks are perfect opportunities to nurture curiosity, develop scientific thinking, and foster a lifelong appreciation for the environment.\n\nDuring these walks, encourage your child to use all their senses—observe the colors and shapes of leaves, listen to bird songs, feel different textures of tree bark, and smell flowers. This multi-sensory experience enhances learning and creates lasting memories. Bring along a small bag to collect interesting items like leaves, rocks, or pinecones for further exploration at home.\n\nNature walks teach children to slow down and notice details they might otherwise miss. Ask open-ended questions like "Why do you think leaves change color?" or "What do you think this insect is doing?" These questions promote critical thinking and scientific inquiry. Even a short 15-minute walk can be educational—it\'s about quality observation, not distance covered. Regular nature walks also promote physical activity, reduce stress, and strengthen the parent-child connection through shared discovery.',
          ageRange: '3-8 years',
          skillTags: ['Science', 'Observation', 'Physical Activity'],
        },
        {
          id: 'a5',
          title: 'Role Play',
          time: '25 minutes',
          skills: 'Social, Emotional',
          icon: 'people',
          iconColor: '#9C27B0',
          description: 'Develop social skills and emotional intelligence through imaginative role-playing scenarios. Role play allows children to explore different perspectives, practice social interactions, and work through emotions in a safe, supportive environment.\n\nThrough pretend play, children can be doctors, teachers, shopkeepers, or any character they imagine. This type of play helps them understand different roles in society, develop empathy by seeing situations from others\' viewpoints, and practice important social skills like taking turns, sharing, and communicating effectively.\n\nRole play is also therapeutic—children often work through their fears, anxieties, and confusing experiences by acting them out. If your child is nervous about visiting the doctor, playing "doctor" at home can help ease those fears. Provide simple props like dress-up clothes, toy kitchen sets, or doctor kits to enhance the experience.\n\nJoin in the play when invited, but let your child lead the scenarios. This builds their confidence in decision-making and creative thinking. Role play teaches cooperation, negotiation, and conflict resolution—essential skills for building healthy relationships throughout life.',
          ageRange: '4-7 years',
          skillTags: ['Social Skills', 'Empathy', 'Communication'],
        },
      ],
    },
    emotional: {
      title: 'Emotional & Social',
      icon: 'heart',
      color: '#FFB84D',
      items: [
        { id: 4, title: 'Settles into Routines', completed: true },
        { id: 5, title: 'Identifies Peer Emotions', completed: true },
        { id: 6, title: 'Handles Small Conflicts', completed: false },
      ],
      activities: [
        {
          id: 'e1',
          title: 'Emotion Cards',
          time: '15 minutes',
          skills: 'Emotional Intelligence',
          icon: 'happy',
          iconColor: '#FFB84D',
          description: 'Learn to identify and express emotions through interactive card activities. Emotional intelligence is a crucial life skill that helps children understand their own feelings and recognize emotions in others, leading to better relationships and mental well-being.\n\nEmotion cards feature different facial expressions representing various feelings—happy, sad, angry, surprised, scared, and more. Use these cards to help your child name emotions, discuss what might cause these feelings, and explore healthy ways to express them. This activity builds emotional vocabulary and helps children articulate their feelings instead of acting them out.\n\nMake it interactive by playing matching games, acting out emotions, or creating stories about the characters on the cards. Ask questions like "When do you feel this way?" or "What helps you feel better when you\'re sad?" These conversations teach emotional regulation and coping strategies.\n\nRegular practice with emotion cards helps children develop empathy, improve communication, and build stronger social connections. It also gives them tools to navigate challenging situations with greater emotional awareness and resilience.',
          ageRange: '3-6 years',
          skillTags: ['Emotional Awareness', 'Communication', 'Self-Expression'],
        },
        {
          id: 'e2',
          title: 'Friendship Circle',
          time: '20 minutes',
          skills: 'Social Skills, Empathy',
          icon: 'people-circle',
          iconColor: '#4FC3F7',
          description: 'Build friendship skills and learn about cooperation through group activities. The Friendship Circle creates a safe space for children to practice social interactions, develop empathy, and understand the value of teamwork and mutual respect.\n\nThese activities include sharing circles where children take turns talking about their day, cooperative games that require working together to achieve a goal, and problem-solving scenarios that teach conflict resolution. Through these experiences, children learn essential social skills like active listening, taking turns, sharing, and supporting others.\n\nThe Friendship Circle also addresses important topics like kindness, inclusion, and standing up against bullying. Role-playing different social situations helps children practice appropriate responses and build confidence in their social abilities. They learn that everyone has unique strengths and that differences should be celebrated, not feared.\n\nThese activities foster a sense of belonging and teach children that good friendships are built on trust, respect, and mutual care. The skills learned in the Friendship Circle extend beyond childhood, forming the foundation for healthy relationships throughout life.',
          ageRange: '4-7 years',
          skillTags: ['Friendship', 'Cooperation', 'Sharing'],
        },
        {
          id: 'e3',
          title: 'Calm Corner',
          time: '10 minutes',
          skills: 'Self-Regulation',
          icon: 'flower',
          iconColor: '#9C27B0',
          description: 'Practice calming techniques and self-regulation strategies in a dedicated peaceful space. The Calm Corner is a special area where children can go when they feel overwhelmed, angry, or need a moment to reset their emotions—teaching them that it\'s okay to take a break and that they have the power to manage their feelings.\n\nThis space includes calming tools like soft cushions, stress balls, breathing exercise cards, calming jars (glitter bottles), and quiet activities like coloring or reading. The goal is to provide children with healthy coping mechanisms they can use throughout their lives when facing stress or strong emotions.\n\nTeach simple techniques like deep breathing (breathe in for 4 counts, hold for 4, breathe out for 4), progressive muscle relaxation, or mindfulness exercises. Guide your child to recognize their body\'s signals when emotions are building—tight fists, fast heartbeat, or tense shoulders—so they can use these techniques before emotions become overwhelming.\n\nThe Calm Corner isn\'t a punishment; it\'s a positive tool for emotional regulation. Praise your child for recognizing when they need a break and using the space appropriately. These self-regulation skills are invaluable for managing stress, improving focus, and maintaining emotional balance in all areas of life.',
          ageRange: '3-8 years',
          skillTags: ['Self-Control', 'Mindfulness', 'Emotional Regulation'],
        },
      ],
    },
    cognitive: {
      title: 'Cognitive & Life Skills',
      icon: 'bulb',
      color: '#E91E63',
      items: [
        { id: 7, title: 'Sustains Task Focus', completed: true },
        { id: 8, title: 'Follows Multi-Step Instructions', completed: false },
        { id: 9, title: 'Begins Task Prioritizing', completed: false },
      ],
      activities: [
        {
          id: 'c1',
          title: 'Puzzle Time',
          time: '25 minutes',
          skills: 'Problem Solving, Focus',
          icon: 'extension-puzzle',
          iconColor: '#E91E63',
          description: 'Develop concentration and problem-solving skills through age-appropriate puzzles. Puzzles are powerful learning tools that challenge children to think critically, recognize patterns, and persist through challenges—building both cognitive abilities and character traits like patience and determination.\n\nStart with simple puzzles appropriate for your child\'s age and gradually increase complexity as their skills develop. Jigsaw puzzles teach spatial reasoning and visual discrimination, while logic puzzles and brain teasers develop analytical thinking. The process of trial and error teaches children that mistakes are part of learning and that persistence leads to success.\n\nPuzzles also improve fine motor skills as children manipulate small pieces, enhance memory as they remember where pieces fit, and boost confidence with each completed challenge. Working on puzzles together creates opportunities for teaching problem-solving strategies—like sorting pieces by color or edge, working on small sections, or stepping back to see the bigger picture.\n\nCelebrate effort, not just completion. Praise your child for trying different approaches, staying focused, and not giving up when faced with difficulty. These experiences build resilience and teach that complex problems can be solved by breaking them into smaller, manageable parts—a valuable life skill applicable far beyond puzzle-solving.',
          ageRange: '4-8 years',
          skillTags: ['Focus', 'Logic', 'Patience'],
        },
        {
          id: 'c2',
          title: 'Memory Games',
          time: '20 minutes',
          skills: 'Memory, Concentration',
          icon: 'brain',
          iconColor: '#FF5722',
          description: 'Strengthen memory and attention through fun matching and recall games. Memory games are excellent exercises for developing working memory, concentration, and cognitive flexibility—skills essential for academic success and daily life activities.\n\nClassic memory games like matching cards face-down, "I Spy" variations, or remembering sequences of objects help children develop strategies for encoding and retrieving information. These games teach children to focus their attention, resist distractions, and use memory techniques like visualization or creating associations.\n\nMemory games can be adapted to any theme or interest—use pictures of animals, letters, numbers, or family photos to make them more engaging. Start with fewer pairs and gradually increase difficulty as your child\'s skills improve. This progressive challenge keeps the activity engaging without causing frustration.\n\nBeyond cognitive benefits, memory games teach important lessons about fair play, taking turns, and handling both winning and losing gracefully. They also provide insights into how your child approaches challenges—do they rush or take their time? Do they get frustrated easily or persist? Use these observations to guide your support and encouragement.\n\nRegular practice with memory games can improve academic performance, particularly in reading comprehension and math, where working memory plays a crucial role.',
          ageRange: '3-7 years',
          skillTags: ['Memory', 'Attention', 'Cognitive Skills'],
        },
        {
          id: 'c3',
          title: 'Daily Routine Chart',
          time: '15 minutes',
          skills: 'Organization, Independence',
          icon: 'calendar-check',
          iconColor: '#4CAF50',
          description: 'Learn to follow routines and develop independence through visual schedules. A daily routine chart is a powerful tool that helps children understand time management, develop self-discipline, and build the independence needed for school and life success.\n\nCreate a visual chart showing your child\'s daily activities—morning routine (wake up, brush teeth, get dressed, eat breakfast), school/activity time, afternoon routine, and bedtime routine. Use pictures or icons for younger children who can\'t read yet. This visual representation helps children understand what\'s expected and reduces anxiety about transitions.\n\nRoutine charts teach time management by helping children understand the sequence of activities and how long tasks take. They promote independence as children learn to complete tasks without constant reminders. Use a reward system like stickers or checkmarks to celebrate completed tasks, building motivation and a sense of accomplishment.\n\nConsistency is key—follow the routine as closely as possible each day so it becomes automatic. However, also teach flexibility by explaining when changes occur and why. This balance between structure and adaptability prepares children for real-world situations.\n\nRoutine charts reduce power struggles, improve cooperation, and help children develop executive function skills like planning, organizing, and self-monitoring—capabilities that support academic achievement and personal responsibility throughout life.',
          ageRange: '3-6 years',
          skillTags: ['Independence', 'Organization', 'Time Management'],
        },
      ],
    },
  };

  const handleCategoryCardPress = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setCurrentView('activities');
  };

  const handleActivityPress = (activity) => {
    setSelectedActivity(activity);
    setCurrentView('detail');
  };

  const handleBackPress = () => {
    if (currentView === 'detail') {
      setCurrentView('activities');
      setSelectedActivity(null);
    } else if (currentView === 'activities') {
      setCurrentView('list');
      setSelectedCategory(null);
    } else {
      onBack();
    }
  };

  // Milestone List View
  const renderMilestoneList = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          {child?.avatar && getAvatarSource(child.avatar) ? (
            <Image 
              source={getAvatarSource(child.avatar)} 
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.defaultAvatarCircle}>
              <Icon name="person" size={50} color="#FFFFFF" />
            </View>
          )}
        </View>
        <Text style={styles.profileName}>{child?.name}</Text>
        {childAge !== null && childAge !== undefined && <Text style={styles.profileAge}>Age {childAge}</Text>}
      </View>

      {Object.keys(milestones).map((key) => {
        const category = milestones[key];
        return (
          <View key={key} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIconContainer}>
                <Icon name={category.icon} size={20} color={category.color} />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>
            
            {category.items.map((item) => (
              <View key={item.id} style={styles.milestoneItem}>
                <View style={[styles.milestoneDot, item.completed && styles.milestoneDotCompleted]} />
                <Text style={[
                  styles.milestoneText,
                  item.completed && styles.milestoneTextCompleted
                ]}>
                  {item.title}
                </Text>
              </View>
            ))}
          </View>
        );
      })}

      <View style={styles.recommendedSection}>
        <Text style={styles.recommendedTitle}>Recommended Activities</Text>
        <View style={styles.activityGrid}>
          {Object.keys(milestones).map((key) => {
            const cat = milestones[key];
            return (
              <TouchableOpacity
                key={key}
                style={styles.activityCard}
                onPress={() => handleCategoryCardPress(key)}
              >
                <View style={styles.activityIconBox}>
                  <Icon name={cat.icon} size={36} color={cat.color} />
                </View>
                <Text style={styles.activityCardTitle}>{cat.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );

  // Activities List View (Screen 29)
  const renderActivitiesList = () => {
    const category = milestones[selectedCategory];
    if (!category) return null;

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.activitiesTopSpacing} />
        {category.activities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={styles.activityListItem}
            onPress={() => handleActivityPress(activity)}
          >
            <View style={styles.activityListIconBox}>
              <MaterialIcon name={activity.icon} size={40} color={activity.iconColor} />
            </View>
            <View style={styles.activityListInfo}>
              <Text style={styles.activityListTitle}>{activity.title}</Text>
              <Text style={styles.activityListTime}>Time: {activity.time}</Text>
              <Text style={styles.activityListSkills}>Skills: {activity.skills}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  // Activity Detail View
  const renderActivityDetail = () => {
    if (!selectedActivity) return null;

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.detailHeader}>
          <View style={styles.detailIconContainer}>
            <MaterialIcon name={selectedActivity.icon} size={60} color={selectedActivity.iconColor} />
          </View>
          <Text style={styles.detailTitle}>{selectedActivity.title}</Text>
        </View>
        
        <View style={styles.detailContent}>
          <Text style={styles.detailDescription}>{selectedActivity.description}</Text>
          
          <View style={styles.detailInfoSection}>
            <Text style={styles.detailInfoTitle}>Age Range</Text>
            <Text style={styles.detailInfoText}>{selectedActivity.ageRange}</Text>
          </View>
          
          <View style={styles.detailInfoSection}>
            <Text style={styles.detailInfoTitle}>Skills Developed</Text>
            <View style={styles.skillTagsContainer}>
              {selectedActivity.skillTags.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillTagText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <TouchableOpacity style={styles.goBackButton} onPress={handleBackPress}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentView === 'list' 
            ? `Milestones for ${new Date().toLocaleString('default', { month: 'long' })}`
            : currentView === 'activities'
            ? `${milestones[selectedCategory]?.title} Activities`
            : 'Resource'
          }
        </Text>
        <View style={styles.headerRight} />
      </View>

      {currentView === 'list' && renderMilestoneList()}
      {currentView === 'activities' && renderActivitiesList()}
      {currentView === 'detail' && renderActivityDetail()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#45a578',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  defaultAvatarCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  profileAge: {
    fontSize: isTablet ? 16 : 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  categorySection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 12,
    gap: 12,
  },

  milestoneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333333',
  },

  milestoneDotCompleted: {
    backgroundColor: '#333333',
  },

  milestoneText: {
    fontSize: isTablet ? 16 : 14,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
    flex: 1,
  },

  milestoneTextCompleted: {
    color: '#333333',
  },
  recommendedSection: {
    paddingHorizontal: 20,
  },
  recommendedTitle: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    fontFamily: 'Montserrat-Bold',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  activityCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    paddingVertical: 16,
  },
  activityIconBox: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityCardTitle: {
    fontSize: isTablet ? 13 : 11,
    fontWeight: '600',
    color: '#333333',
    paddingHorizontal: 10,
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
  },
  activityListItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  activityListIconBox: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  activityListInfo: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  activityListTitle: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 5,
    fontFamily: 'Montserrat-Bold',
  },
  activityListTime: {
    fontSize: isTablet ? 12 : 11,
    color: '#666666',
    marginBottom: 3,
    fontFamily: 'Montserrat-Regular',
  },
  activityListSkills: {
    fontSize: isTablet ? 12 : 11,
    color: '#2196F3',
    fontFamily: 'Montserrat-SemiBold',
  },
  activitiesTopSpacing: {
    height: 24,
  },
  detailHeader: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailContent: {
    padding: 20,
  },
  detailTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  detailDescription: {
    fontSize: isTablet ? 15 : 14,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'justify',
  },
  detailInfoSection: {
    marginBottom: 20,
  },
  detailInfoTitle: {
    fontSize: isTablet ? 17 : 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
  },
  detailInfoText: {
    fontSize: isTablet ? 15 : 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  skillTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skillTagText: {
    fontSize: isTablet ? 13 : 12,
    color: '#1976D2',
    fontFamily: 'Montserrat-SemiBold',
  },
  startActivityButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startActivityButtonText: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  goBackButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  goBackButtonText: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '600',
    color: '#666666',
    fontFamily: 'Montserrat-SemiBold',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default MilestonesScreen;
