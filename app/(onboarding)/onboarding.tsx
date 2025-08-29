import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { Button } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing } from '@/constants/Layout';
import { useApp } from '@/context/AppContext';

const { width } = Dimensions.get('window');

interface OnboardingPageProps {
  title: string;
  headline: string;
  body: string;
  imageSource: any;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({
  title,
  headline,
  body,
  imageSource,
}) => (
  <View style={styles.page}>
    <Text style={styles.title}>{title}</Text>
    
    <View style={styles.imageContainer}>
      <Image 
        source={imageSource} 
        style={styles.illustration}
        resizeMode="contain"
      />
    </View>
    
    <View style={styles.textContainer}>
      <Text style={styles.headline}>{headline}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  </View>
);

const CarouselDots: React.FC<{ activeIndex: number; total: number }> = ({
  activeIndex,
  total,
}) => (
  <View style={styles.dotsContainer}>
    {Array.from({ length: total }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          index === activeIndex ? styles.activeDot : styles.inactiveDot,
        ]}
      />
    ))}
  </View>
);

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const { dispatch } = useApp();

  const onboardingData: OnboardingPageProps[] = [
    {
      title: 'Shopper',
      headline: 'Shopping Lists',
      body: '...made easy and convenient',
      imageSource: require('@/assets/images/onboarding.png'),
    },
    {
      title: 'Shopper',
      headline: 'Never forget anything on your list',
      body: '...no need to memorize',
      imageSource: require('@/assets/images/onboarding2.png'),
    },
    {
      title: 'Shopper',
      headline: 'Use shopper for your online shopping too!',
      body: '...make a list now, buy it later',
      imageSource: require('@/assets/images/onbording3.png'),
    },
  ];

  const handleStartUsingShopper = () => {
    dispatch({ type: 'SET_ONBOARDING_COMPLETE' });
    router.replace('/(app)/lists');
  };

  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {onboardingData.map((data, index) => (
          <OnboardingPage key={index} {...data} />
        ))}
      </PagerView>
      
      <View style={styles.footer}>
        <CarouselDots activeIndex={currentPage} total={onboardingData.length} />
        <Button
          title="Start using Shopper"
          onPress={handleStartUsingShopper}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  pager: {
    flex: 1,
  },
  
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  
  title: {
    ...Typography.textStyles.largeTitle,
    color: Colors.text,
    position: 'absolute',
    top: Spacing.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  
  imageContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xxxl,
    width: width * 0.8,
    height: width * 0.6,
  },
  
  illustration: {
    width: '100%',
    height: '100%',
  },
  
  textContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  
  headline: {
    ...Typography.textStyles.title,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  body: {
    ...Typography.textStyles.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  footer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
  },
  
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  
  activeDot: {
    backgroundColor: Colors.primary,
  },
  
  inactiveDot: {
    backgroundColor: Colors.inactive,
  },
});