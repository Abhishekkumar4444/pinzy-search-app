import React from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../utils/constants';

const {width} = Dimensions.get('window');

const SuggestionList = ({
  suggestions,
  onSuggestionPress,
  visible,
  style,
  searchQuery,
}) => {
  const theme = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-20)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, translateY]);

  if (!visible) return null;

  const highlightText = text => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <Text key={i} style={styles.highlightedText}>
          {part}
        </Text>
      ) : (
        <Text key={i}>{part}</Text>
      ),
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: fadeAnim,
          transform: [{translateY}],
        },
      ]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}>
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={item.place_id}
            onPress={() => onSuggestionPress(item)}
            style={[
              styles.suggestionItem,
              index === suggestions.length - 1 && styles.lastItem,
            ]}>
            <View style={styles.iconContainer}>
              <Icon
                name="location-on"
                size={24}
                color={COLORS.primary}
                style={styles.icon}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.mainText} numberOfLines={1}>
                {highlightText(item.structured_formatting?.main_text || '')}
              </Text>
              <Text style={styles.secondaryText} numberOfLines={1}>
                {item.structured_formatting?.secondary_text || ''}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 300,
  },
  scrollView: {
    maxHeight: 300,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    marginLeft: 1,
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  highlightedText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SuggestionList;
