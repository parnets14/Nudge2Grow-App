/**
 * Featured Content Detail Screen
 * Shows detailed view of featured content when user clicks "Start This Nudge"
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { fetchFeaturedContentDetail } from '../api';

const FeaturedContentDetailScreen = ({ route, navigation }) => {
  const { content } = route.params || {};
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (content && content._id) {
      loadDetailData();
    } else {
      setLoading(false);
    }
  }, [content]);

  const loadDetailData = async () => {
    try {
      console.log('[DetailScreen] Fetching detail for:', content._id);
      const data = await fetchFeaturedContentDetail(content._id);
      if (data) {
        console.log('[DetailScreen] Detail data loaded successfully');
        setDetailData(data);
      } else {
        console.log('[DetailScreen] No detail data found');
      }
    } catch (error) {
      console.error('[DetailScreen] Error loading detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!content) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No content available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#45a578" />
      
      {/* Header */}
      <LinearGradient
        colors={['#45a578', '#90EE90']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Featured Content</Text>
        <View style={styles.headerRight} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Badge */}
        <View style={styles.featuredBadge}>
          <MaterialIcon name="star" size={20} color="#FFB84D" />
          <Text style={styles.featuredBadgeText}>Featured Today</Text>
        </View>

        {/* Icon and Title Section */}
        <View style={styles.topSection}>
          <View style={[styles.iconLarge, { backgroundColor: content.iconColor + '20' }]}>
            <MaterialIcon 
              name={content.icon || 'telescope'} 
              size={48} 
              color={content.iconColor || '#4A90E2'} 
            />
          </View>
          <Text style={styles.title}>{content.title}</Text>
          {content.subtitle ? (
            <Text style={styles.subtitle}>{content.subtitle}</Text>
          ) : null}
          
          {/* Meta Chips */}
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Icon name="people-outline" size={16} color="#666666" />
              <Text style={styles.metaChipText}>{content.grade}</Text>
            </View>
            <View style={styles.metaChip}>
              <MaterialIcon name="star" size={16} color="#FFB84D" />
              <Text style={styles.metaChipText}>Popular</Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="text-box-outline" size={20} color="#45a578" />
            <Text style={styles.sectionTitle}>About This Nudge</Text>
          </View>
          <Text style={styles.description}>{content.description}</Text>
        </View>

        {/* Loading or Detail Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#45a578" />
            <Text style={styles.loadingText}>Loading details...</Text>
          </View>
        ) : detailData && detailData.sections && detailData.sections.length > 0 ? (
          <>
            {detailData.sections.map((section, index) => (
              <View key={index} style={styles.sectionContainer}>
                {/* Detail Title */}
                {section.title && (
                  <Text style={styles.detailTitle}>{section.title}</Text>
                )}

                {/* Detail Subtitle */}
                {section.subtitle && (
                  <Text style={styles.detailSubtitle}>{section.subtitle}</Text>
                )}

                {/* Detail Description */}
                {section.description && (
                  <Text style={styles.detailDescription}>{section.description}</Text>
                )}

                {/* Heading (optional) */}
                {section.heading && (
                  <Text style={styles.simpleSectionTitle}>{section.heading}</Text>
                )}

                {/* Points (can exist without heading) */}
                {section.points && section.points.length > 0 && (
                  <View style={styles.simpleList}>
                    {section.points.map((point, pointIndex) => (
                      point && <Text key={pointIndex} style={styles.simpleListItem}>• {point}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        ) : (
          <View style={styles.noDetailContainer}>
            <MaterialIcon name="information-outline" size={48} color="#9CA3AF" />
            <Text style={styles.noDetailText}>No additional details available</Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginTop: 20,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFB84D',
  },
  topSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  iconLarge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  bulletList: {
    gap: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#45a578',
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#45a578',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  phaseEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  phaseContent: {
    flex: 1,
    marginLeft: 8,
  },
  phaseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  phaseDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
  },
  phaseIntro: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  activityBox: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1E40AF',
    marginBottom: 16,
  },
  activitySteps: {
    gap: 8,
  },
  activityStepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginTop: 8,
    marginBottom: 4,
  },
  activityStep: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 19,
  },
  tipBold: {
    fontWeight: '700',
    color: '#1F2937',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
  // Simple section styles (no cards)
  simpleSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  simpleSectionNoBorder: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  simpleSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#45a578',
    marginTop: 12,
    marginBottom: 8,
  },
  simpleList: {
    gap: 8,
    marginTop: 4,
  },
  simpleListItem: {
    fontSize: 15,
    lineHeight: 24,
    color: '#374151',
    paddingLeft: 8,
  },
  simpleStepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 6,
  },
  simpleStepText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    paddingLeft: 8,
  },
  simplePhaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 6,
  },
  simplePhaseText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    paddingLeft: 8,
  },
  simpleDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  noDetailContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDetailText: {
    marginTop: 16,
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    lineHeight: 32,
    marginBottom: 8,
  },
  detailSubtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#6B7280',
    lineHeight: 26,
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 6,
  },
});

export default FeaturedContentDetailScreen;
