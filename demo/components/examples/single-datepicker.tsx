import { useState, useMemo } from 'react';
import { View } from 'react-native';
import { Calendar, DateType } from '../ui/calendar';
import dayjs from 'dayjs';
import { DateInput } from '../date-input';

export default function SingleDatePicker() {
  const [date, setDate] = useState<DateType>();

  // Test styles to verify time_wheel_label vs time_label distinction
  const testStyles = useMemo(
    () => ({
      // The colon separator - large font is fine here
      time_label: {
        fontSize: 30,
        fontWeight: '600' as const,
      },
      // The wheel picker items - should be smaller for proper display
      time_wheel_label: {
        fontSize: 30,
        lineHeight: 34,
        fontWeight: '500' as const,
      },
      // The "window" that highlights the selected value
      time_selected_indicator: {
        backgroundColor: 'rgba(0, 122, 255, 0.1)', // Light blue background
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 122, 255, 0.3)', // Blue border
        borderRadius: 8,
      },
    }),
    []
  );

  return (
    <View className="flex-1 gap-4">
      <Calendar
        mode="single"
        date={date}
        onChange={({ date }) => setDate(date)}
        timePicker
        minuteInterval={15}
        timeButtonPlaceholder="Set Time"
        //use12Hours
        minDate={new Date()}
        showViewToggleHeader
        toggleHeaderLabel={"Start Date"}
        navigationPosition="right"
        styles={testStyles}
        //maxDate={new Date(new Date().getFullYear(), 11, 31)} // end of the year
      />
      <DateInput
        value={date ? dayjs(date).format('MMMM DD, YYYY HH:mm') : null}
        placeholder="Pick a date"
      />
    </View>
  );
}
