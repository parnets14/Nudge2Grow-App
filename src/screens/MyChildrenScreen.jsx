/**
 * My Children Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const MyChildrenScreen = ({ onBack }) => {
  const children = [
    {
      id: 1,
      name: 'Sarah',
      age: 8,
      grade: 'Grade 3',
      avatar: require('../assets/images/A1.jpeg'),
      subjects: ['Mathematics', 'Science', 'English'],
      nudgesCompleted: 45,
      streak: 7,
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      name: 'Alex',
      age: 6,
      grade: 'Grade 1',
      avatar: require('../assets/images/A2.jpeg'),
      subjects: ['Reading', 'Math', 'Art'],
      nudgesCompleted: 28,
      streak: 5,
      lastActivity: 'Yesterday',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Children</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Children List */}
        {children.map((child) => (
          <View key={child.id} style={styles.childCard}>
            <View style={styles.childHeader}>
              <View style={styles.childInfo}>
                <Image source={child.avatar} style={styles.childAvatar} />
                <View style={styles.childDetails}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childMeta}>
                    {child.age} years • {child.grade}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Icon name="create-outline" size={20} color="#45a578" />
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcon name="check-circle" size={24} color="#45a578" />
                <Text style={styles.statNumber}>{child.nudgesCompleted}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <MaterialIcon name="fire" size={24} color="#FF6B35" />
                <Text style={styles.statNumber}>{child.streak} days</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <MaterialIcon name="clock-outline" size={24} color="#4A90E2" />
                <Text style={styles.statNumber}>{child.lastActivity}</Text>
                <Text style={styles.statLabel}>Last Active</Text>
              </View>
            </View>

            {/* Subjects */}
            <View style={styles.subjectsContainer}>
              <Text style={styles.subjectsTitle}>Learning Topics:</Text>
              <View style={styles.subjectTags}>
                {child.subjects.map((subject, index) => (
                  <View key={index} style={styles.subjectTag}>
                    <Text style={styles.subjectText}>{subject}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient
                colors={['#00CED1', '#45a578', '#90EE90']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.viewProgressButton}
              >
                <Text style={styles.viewProgressText}>View Progress Report</Text>
                <Icon name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Child Button */}
        <TouchableOpacity style={styles.addChildCard}>
          <View style={styles.addChildIcon}>
            <Icon name="add" size={32} color="#45a578" />
          </View>
          <Text style={styles.addChildText}>Add Another Child</Text>
          <Text style={styles.addChildSubtext}>
            Track learning for multiple children
          </Text>
        </TouchableOpacity>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Parenting Tips</Text>

          <View style={styles.tipCard}>
            <MaterialIcon name="lightbulb-on" size={20} color="#FFB84D" />
            <Text style={styles.tipText}>
              Celebrate small wins! Every completed nudge is a step toward building lifelong learning habits.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <MaterialIcon name="heart" size={20} color="#E74C3C" />
            <Text style={styles.tipText}>
              Quality over quantity - even 5 minutes of focused conversation can make a big impact.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyChildrenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },

  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
  },

  childCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#45a578',
  },

  childDetails: {
    flex: 1,
  },

  childName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },

  childMeta: {
    fontSize: 14,
    color: '#666666',
  },

  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },

  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginTop: 8,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#666666',
  },

  subjectsContainer: {
    marginBottom: 16,
  },

  subjectsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },

  subjectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  subjectTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },

  subjectText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#45a578',
  },

  viewProgressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    paddingVertical: 12,
    gap: 8,
  },

  viewProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  addChildCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },

  addChildIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  addChildText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  addChildSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },

  tipsSection: {
    margin: 20,
    marginTop: 0,
  },

  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },

  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginLeft: 12,
  },
});
