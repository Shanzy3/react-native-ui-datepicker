import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'relative',
  },
  selectedIndicator: {
    position: 'absolute',
    width: '100%',
    top: '50%',
  },
  scrollView: {
    overflow: 'hidden',
    flex: 1,
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    minWidth: 40,
    flexShrink: 0,
    zIndex: 100,
  },
});
