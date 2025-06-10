import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;

export const getResponsiveFontSize = (size: number) => {
  if (isSmallDevice) {
    return moderateScale(size, 0.3);
  }
  if (isMediumDevice) {
    return moderateScale(size, 0.5);
  }
  return moderateScale(size, 0.7);
};

export const getResponsivePadding = (size: number) => {
  if (isSmallDevice) {
    return moderateScale(size, 0.3);
  }
  if (isMediumDevice) {
    return moderateScale(size, 0.5);
  }
  return moderateScale(size, 0.7);
};

export const getResponsiveMargin = (size: number) => {
  if (isSmallDevice) {
    return moderateScale(size, 0.3);
  }
  if (isMediumDevice) {
    return moderateScale(size, 0.5);
  }
  return moderateScale(size, 0.7);
};

export const getResponsiveHeight = (size: number) => {
  if (isSmallDevice) {
    return verticalScale(size * 0.8);
  }
  if (isMediumDevice) {
    return verticalScale(size * 0.9);
  }
  return verticalScale(size);
};

export const getResponsiveWidth = (size: number) => {
  if (isSmallDevice) {
    return scale(size * 0.8);
  }
  if (isMediumDevice) {
    return scale(size * 0.9);
  }
  return scale(size);
};

export const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  return aspectRatio <= 1.6;
};

export const getBottomTabHeight = () => {
  if (Platform.OS === 'ios') {
    return isTablet() ? 85 : 70;
  }
  return 60;
};

export const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    return isTablet() ? 44 : 20;
  }
  return 24;
};
