import React, { memo, useMemo } from 'react';
import { View, StyleSheet, Text, useColorScheme } from 'react-native';
import { useCalendarContext } from '../../calendar-context';
import type { HeaderProps, NavigationProps } from './types';
import PrevButton from './prev-button';
import NextButton from './next-button';
import ViewToggle from './time-view-toggle';
import Selectors from './selectors';
import { isEqual } from 'lodash';
import { getYearRange } from '../../utils';
import { COLORS } from '../../theme';

const createDefaultStyles = (isRTL: boolean) =>
  StyleSheet.create({
    headerContainer: {
      paddingVertical: 3,
    },
    container: {
      padding: 5,
      gap: 20,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navigation: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
  });

const NavigationButtons = ({ styles, classNames, isRTL }: NavigationProps) => {
  const style = useMemo(() => createDefaultStyles(isRTL), [isRTL]);

  return (
    <View style={style.navigation}>
      <PrevButton
        style={styles?.button_prev}
        imageStyle={styles?.button_prev_image}
        className={classNames?.button_prev}
        imageClassName={classNames?.button_prev_image}
      />
      <NextButton
        style={styles?.button_next}
        imageStyle={styles?.button_next_image}
        className={classNames?.button_next}
        imageClassName={classNames?.button_next_image}
      />
    </View>
  );
};

const Header: React.FC<HeaderProps> = () => {
  const {
    styles = {},
    classNames = {},
    isRTL,
    navigationPosition = 'center',
    yearPickerOnly,
    currentYear,
    minDate,
    maxDate,
    calendarView,
    showViewToggleHeader,
  } = useCalendarContext();
  const colorScheme = useColorScheme();
  const theme = (colorScheme ?? 'light') as 'light' | 'dark';
  const style = useMemo(() => createDefaultStyles(isRTL), [isRTL]);
  
  // Show navigation/selectors based on mode
  const shouldShowNavigation = yearPickerOnly
    ? calendarView === 'year'
    : !(showViewToggleHeader && calendarView === 'time');
    
  return (
    <View
      style={[style.headerContainer, styles?.header]}
      className={classNames?.header}
    >
       {showViewToggleHeader && <ViewToggle />}
       
       {/* Year-only mode: show navigation with year range */}
       {yearPickerOnly && calendarView === 'year' && (
         <View style={[style.container, { justifyContent: 'space-between' }]}>
           <View style={style.navigation}>
             <PrevButton
               style={styles?.button_prev}
               imageStyle={styles?.button_prev_image}
               className={classNames?.button_prev}
               imageClassName={classNames?.button_prev_image}
             />
             <NextButton
               style={styles?.button_next}
               imageStyle={styles?.button_next_image}
               className={classNames?.button_next}
               imageClassName={classNames?.button_next_image}
             />
           </View>
           <View style={{ flex: 1, alignItems: 'center' }}>
             <Text style={{ 
               fontSize: 16, 
               fontWeight: '500',
               color: COLORS[theme].foreground 
             }}>
               {(() => {
                 const years = getYearRange(currentYear, minDate, maxDate);
                 if (years.length === 0) return '';
                 return `${years[0]} - ${years[years.length - 1]}`;
               })()}
             </Text>
           </View>
           <View style={{ width: 60 }} />
         </View>
       )}
       
       {/* Normal mode: show full navigation/selectors */}
       {!yearPickerOnly && shouldShowNavigation && (
      <View style={style.container}>
        {navigationPosition === 'left' ? (
          <>
            <NavigationButtons
              styles={styles}
              classNames={classNames}
              isRTL={isRTL}
            />
            <Selectors position="left" />
          </>
        ) : navigationPosition === 'right' ? (
          <>
            <Selectors position="right" />
            <NavigationButtons
              styles={styles}
              classNames={classNames}
              isRTL={isRTL}
            />
          </>
        ) : (
          <>
            <PrevButton
              style={styles?.button_prev}
              imageStyle={styles?.button_prev_image}
              className={classNames?.button_prev}
              imageClassName={classNames?.button_prev_image}
            />
            <Selectors position="around" />
            <NextButton
              style={styles?.button_next}
              imageStyle={styles?.button_next_image}
              className={classNames?.button_next}
              imageClassName={classNames?.button_next_image}
            />
          </>
        )}
      </View>
      )}
    </View>
  );
};

const customComparator = (
  prev: Readonly<HeaderProps>,
  next: Readonly<HeaderProps>
) => {
  const areEqual =
    prev.PrevIcon === next.PrevIcon &&
    prev.NextIcon === next.NextIcon &&
    prev.navigationPosition === next.navigationPosition &&
    prev.isRTL === next.isRTL &&
    isEqual(prev.styles, next.styles) &&
    isEqual(prev.classNames, next.classNames);

  return areEqual;
};

export default memo(Header, customComparator);
