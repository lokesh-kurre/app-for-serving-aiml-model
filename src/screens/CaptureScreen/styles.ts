import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  camera: {
    flex: 1,
  },

  noCameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ============================
     TOP CONTROL ROW
     ============================ */
  topControlRow: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',

    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 12,
    marginHorizontal: 20,
  },

  topButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  topButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  /* ============================
     RESOLUTION DROPDOWN
     ============================ */
  resolutionContainer: {
    position: 'absolute',
    top: 40,
    width: '60%',
    alignSelf: 'center',
    zIndex: 20,
  },

  resolutionToggle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 10,
  },

  resolutionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  resolutionList: {
    marginTop: 6,
    backgroundColor: 'rgba(20,20,20,0.95)',
    borderRadius: 10,
    width: '100%',
    maxHeight: 180,
    overflow: 'hidden',
    zIndex: 30,
  },

  resItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },

  resItemText: {
    color: '#fff',
    fontSize: 15,
  },

    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      zIndex: 25,     // must be above camera (5) but below dropdown (30)
    },

  /* ============================
     ZOOM SLIDER
     ============================ */
  zoomSliderContainer: {
    position: 'absolute',
    bottom: 140,
    width: '100%',
    alignItems: 'center',
  },

  zoomSlider: {
    width: '70%',
    height: 40,
  },

  /* ============================
     CAPTURE BUTTON + BOTTOM BAR
     ============================ */
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',

    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
  },

  bottomBtn: {
    padding: 10,
  },

  bottomIcon: {
    fontSize: 26,
    color: '#fff',
  },

  /* Capture Button */
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureInner: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 40,
  },

  /* ============================
     FOCUS INDICATOR
     ============================ */
  focusIndicator: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 8,
    opacity: 0.9,
  },
});
