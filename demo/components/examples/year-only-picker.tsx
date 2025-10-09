import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from '@/components/ui/calendar';
import type { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

export default function YearOnlyPicker() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Year Only Picker</Text>
      
      <Calendar
        mode="single"
        yearPickerOnly
        onChange={({ date }: { date: DateType | number }) => {
          // date should now be just the year integer
          console.log('Selected year:', date);
          setSelectedYear(date as number);
        }}
        startYear={1950}
        endYear={2050}
        minDate={dayjs('2019-01-01')}
        maxDate={dayjs('2035-12-31')}
      />
      
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Selected Year: {selectedYear || 'None'}
        </Text>
        <Text style={styles.typeText}>
          Type: {typeof selectedYear} 
        </Text>
        <Text style={styles.noteText}>
          Years 2020-2035 only (minDate/maxDate)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  noteText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    fontStyle: 'italic',
  },
});
