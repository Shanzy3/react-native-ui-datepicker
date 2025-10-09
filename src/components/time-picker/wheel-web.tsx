import React, { memo, useMemo, useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  Platform,
  Text,
} from 'react-native';
import { sin } from './animated-math';
import { CONTAINER_HEIGHT } from '../../enums';
import { ClassNames, Styles, PickerOption } from '../../types';
import { isEqual } from 'lodash';

interface WheelProps {
  value: number | string;
  setValue?: (value: any) => void;
  items: PickerOption[];
  styles?: Styles;
  classNames?: ClassNames;
}

const ITEM_HEIGHT = 44;

const WheelWeb = ({
  value,
  setValue = () => {},
  items,
  styles = {},
  classNames = {},
}: WheelProps) => {
  const displayCount = 5;
  const translateY = useRef(new Animated.Value(0)).current;
  const height = 140;
  const radius = height / 2;

  // Add padding to items like native implementation
  const paddedItems = useMemo(() => {
    const padding = Math.max(0, Math.floor(displayCount / 2));
    const array: (PickerOption | null)[] = [...items];
    for (let i = 0; i < padding; i++) {
      array.unshift(null);
      array.push(null);
    }
    return array;
  }, [items, displayCount]);

  const renderCount =
    displayCount * 2 < paddedItems.length ? displayCount * 8 : displayCount * 2 - 1;
  const circular = items.length >= displayCount;

  const valueIndex = useMemo(() => {
    const padding = Math.max(0, Math.floor(displayCount / 2));
    const rawIndex = items.findIndex((item) => item.value === value);
    return rawIndex >= 0 ? rawIndex + padding : padding;
  }, [items, value, displayCount]);

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        translateY.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        translateY.setValue(gestureState.dy);
        evt.stopPropagation();
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.extractOffset();
        const padding = Math.max(0, Math.floor(displayCount / 2));
        let newValueIndex =
          valueIndex -
          Math.round(gestureState.dy / ((radius * 2) / displayCount));
        
        // Adjust for padding
        if (circular) {
          newValueIndex = (newValueIndex + paddedItems.length) % paddedItems.length;
        } else {
          newValueIndex = Math.max(padding, Math.min(newValueIndex, paddedItems.length - padding - 1));
        }
        
        const newValue = paddedItems[newValueIndex];
        if (newValue?.value === value) {
          translateY.setOffset(0);
          translateY.setValue(0);
        } else if (newValue?.value !== undefined && newValue?.value !== null) {
          setValue(newValue.value);
        } else {
          // If we landed on a null (padding), find the nearest real value
          const realIndex = newValueIndex < padding ? padding : paddedItems.length - padding - 1;
          const realValue = paddedItems[realIndex];
          if (realValue?.value !== undefined && realValue?.value !== null) {
            setValue(realValue.value);
          }
        }
      },
    });
  }, [
    circular,
    displayCount,
    radius,
    setValue,
    value,
    valueIndex,
    paddedItems,
    translateY,
  ]);

  const displayValues = useMemo(() => {
    const centerIndex = Math.floor(renderCount / 2);

    return Array.from({ length: renderCount }, (_, index) => {
      let targetIndex = valueIndex + index - centerIndex;
      if (circular) {
        targetIndex =
          ((targetIndex % paddedItems.length) + paddedItems.length) % paddedItems.length;
      } else {
        targetIndex = Math.max(0, Math.min(targetIndex, paddedItems.length - 1));
      }
      return paddedItems[targetIndex] || null;
    });
  }, [renderCount, valueIndex, paddedItems, circular]);

  const animatedAngles = useMemo(() => {
    //translateY.setValue(0);
    translateY.setOffset(0);
    const currentIndex = displayValues.findIndex(
      (item) => item?.value === value
    );
    return displayValues && displayValues.length > 0
      ? displayValues.map((_, index) =>
          translateY
            .interpolate({
              inputRange: [-radius, radius],
              outputRange: [
                -radius +
                  ((radius * 2) / displayCount) * (index - currentIndex),
                radius + ((radius * 2) / displayCount) * (index - currentIndex),
              ],
              extrapolate: 'extend',
            })
            .interpolate({
              inputRange: [-radius, radius],
              outputRange: [-Math.PI / 2, Math.PI / 2],
              extrapolate: 'clamp',
            })
        )
      : [];
  }, [displayValues, radius, value, displayCount, translateY]);

  return (
    <View style={[defaultStyles.container]} {...panResponder.panHandlers}>
      <View
        style={[
          styles.time_selected_indicator,
          defaultStyles.selectedIndicator,
          {
            transform: [{ translateY: -ITEM_HEIGHT / 2 }],
            height: ITEM_HEIGHT,
          },
        ]}
        className={classNames.time_selected_indicator}
      />
      {displayValues?.map((displayValue, index) => {
        const animatedAngle = animatedAngles[index];
        return (
          <Animated.View
            key={displayValue ? `${displayValue.value}-${displayValue.text}-${index}` : `null-${index}`}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              position: 'absolute',
              height: ITEM_HEIGHT - 10,
              transform: animatedAngle
                ? [
                    {
                      translateY: Animated.multiply(radius, sin(animatedAngle)),
                    },
                    {
                      rotateX: animatedAngle.interpolate({
                        inputRange: [-Math.PI / 2, Math.PI / 2],
                        outputRange: ['-89deg', '89deg'],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]
                : [],
              opacity: displayValue?.value !== value ? 0.3 : 1,
            }}
          >
            <Text style={styles?.time_label} className={classNames?.time_label}>
              {displayValue?.text}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    minWidth: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    height: CONTAINER_HEIGHT / 2,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  contentContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    width: '100%',
    top: '50%',
  },
});

const customComparator = (
  prev: Readonly<WheelProps>,
  next: Readonly<WheelProps>
) => {
  const areEqual =
    prev.value === next.value &&
    prev.setValue === next.setValue &&
    isEqual(prev.styles, next.styles) &&
    isEqual(prev.classNames, next.classNames) &&
    isEqual(prev.items, next.items);

  return areEqual;
};

export default memo(WheelWeb, customComparator);
