import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
  Text,
  I18nManager,
} from 'react-native';
import { useCalendarContext } from '../calendar-context';
import Wheel from './time-picker/wheel';
import { CONTAINER_HEIGHT } from '../enums';
import { getParsedDate, formatNumber } from '../utils';
import { Numerals, PickerOption } from '../types';
import dayjs from 'dayjs';
import PeriodPicker from './time-picker/period-picker';

export type Period = 'AM' | 'PM';

const createNumberList = (
  total: number,
  numerals: Numerals,
  startFrom: number = 0,
  step: number = 1
): PickerOption[] => {
  const count = Math.ceil((total - startFrom) / step);
  return Array.from({ length: count }, (_, i) => {
    const value = startFrom + i * step;
    const text =
      value < 10
        ? `${formatNumber(0, numerals)}${formatNumber(value, numerals)}`
        : formatNumber(value, numerals);
    return { value, text };
  });
};

const TimePicker = () => {
  const {
    currentDate,
    date,
    onSelectDate,
    styles,
    classNames,
    timeZone,
    numerals = 'latn',
    use12Hours,
    minuteInterval = 1
  } = useCalendarContext();

  const hours = useMemo(
    () => createNumberList(use12Hours ? 12 : 24, numerals, use12Hours ? 1 : 0),
    [numerals, use12Hours]
  );

  const minutes = useMemo(
    () => createNumberList(60, numerals, 0, minuteInterval),
    [numerals, minuteInterval]
  );


  const { hour, hour12, minute, period } = getParsedDate(date || currentDate);

  // Select the nearest minute tick (ensures 00 is recognized)
  const selectedMinute = useMemo(() => {
    // Ensure minute is a number
    const currentMinute = typeof minute === 'number'
      ? minute
      : parseInt(`${minute}`, 10);

    console.log('TimePicker: useMemo selectedMinute compute', {
      rawMinute: minute,
      currentMinute,
      availableTicks: minutes.map(m => m.value),
    });

    // Find the closest available minute option
    if (minutes.length === 0) return 0;
    
    const firstValue = minutes[0]?.value;
    if (firstValue === undefined) return 0;
    
    let closest = Number(firstValue);
    let bestDiff = Math.abs(closest - currentMinute);

    for (const m of minutes) {
      const diff = Math.abs(Number(m.value) - currentMinute);
      if (diff < bestDiff) {
        bestDiff = diff;
        closest = Number(m.value);
      }
    }

    console.log('TimePicker: useMemo closest match', { closest, bestDiff });
    return closest;
  }, [minutes, minute]);

  const handleChangeHour = useCallback(
    (value: number) => {
      let hour24 = value;

      if (use12Hours) {
        if (period === 'PM' && value < 12) {
          hour24 = value + 12;
        } else if (period === 'PM' && value === 12) {
          hour24 = 0;
        }
      }
      const newDate = dayjs.tz(date, timeZone).hour(hour24).minute(minute);
      onSelectDate(newDate);
    },
    [date, onSelectDate, timeZone, use12Hours, period, minute]
  );

  const handleChangeMinute = useCallback(
    (value: number) => {
      console.log('TimePicker: handleChangeMinute value', value);
      const newDate = dayjs.tz(date, timeZone).minute(value);
      onSelectDate(newDate);
    },
    [date, onSelectDate, timeZone]
  );

  const handlePeriodChange = useCallback(
    (newPeriod: Period) => {
      let newHour = hour12;
      if (newPeriod === 'PM' && hour12 < 12) {
        newHour = hour12 + 12;
      } else if (newPeriod === 'AM' && hour12 === 12) {
        newHour = 0;
      } else if (newPeriod === 'AM' && hour >= 12) {
        newHour = hour12;
      }

      const newDate = dayjs.tz(date || currentDate, timeZone).hour(newHour);
      onSelectDate(newDate);
    },
    [date, currentDate, onSelectDate, timeZone, hour, hour12]
  );

  const timePickerContainerStyle: ViewStyle = useMemo(
    () => ({
      ...defaultStyles.timePickerContainer,
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    }),
    [I18nManager.isRTL]
  );

  const timePickerTextStyle: TextStyle = useMemo(
    () => ({ ...defaultStyles.timeSeparator, ...styles?.time_label }),
    [styles?.time_label]
  );

  return (
    <ScrollView
      horizontal={true}
      scrollEnabled={false}
      contentContainerStyle={defaultStyles.container}
      testID="time-selector"
    >
      <View style={timePickerContainerStyle}>
        <View style={defaultStyles.wheelContainer}>
          <Wheel
            value={use12Hours ? hour12 : hour}
            items={hours}
            setValue={handleChangeHour}
            styles={styles}
            classNames={classNames}
          />
        </View>
        <Text style={timePickerTextStyle} className={classNames?.time_label}>
          :
        </Text>
        <View style={defaultStyles.wheelContainer}>
          <Wheel
            value={selectedMinute}
            items={minutes}
            setValue={(value: number) => {
              handleChangeMinute(value);
            }}
            styles={styles}
            classNames={classNames}
          />
        </View>
      </View>
      {use12Hours && period ? (
        <View style={defaultStyles.periodContainer}>
          <PeriodPicker
            value={period}
            setValue={handlePeriodChange}
            styles={styles}
            classNames={classNames}
          />
        </View>
      ) : null}
    </ScrollView>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelContainer: {
    flex: 1,
  },
  timePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: CONTAINER_HEIGHT / 2,
    height: CONTAINER_HEIGHT / 2,
  },
  timeSeparator: {
    marginHorizontal: 5,
  },
  periodContainer: {
    marginLeft: 10,
  },
});

export default TimePicker;
