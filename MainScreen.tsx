import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image, Pressable, Platform, NativeModules } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaView } from 'react-native-safe-area-context';
// Add this at the top of the file for TypeScript SVG module declaration
// @ts-expect-error: SVG import handled by react-native-svg-transformer
import MPOSIcon from './assets/mpos.svg';

const { EMVPayment } = NativeModules;

const ROYAL_BLUE = '#1a237e';
const LIGHT_BLUE = '#64b5f6';
const WHITE = '#fff';
const SILVER = '#cfd8dc';
const DARK_BG = '#121a2f';

const MainScreen = () => {
    useEffect(() => {
        if (Platform.OS === 'android') {
          const config = {
            merchantID: 'SONNYTAMA35000GP',
            pinPadIPAddress: '127.0.0.1',
            pinPadIPPort: '1235',
            isSandBox: true,
            secureDeviceName: 'EMV_A920PRO_DATACAP_E2E',
            operatorID: 'operator_001',
          };
    
          // This JS object is automatically marshalled into a ReadableMap
          EMVPayment.initPAXConfig(config);
        }
      }, []);
    
      const startTransaction = async () => {
        try {
          const result = await EMVPayment.startEMVTransaction(100.0);
          console.log('Transaction result:', result);
        } catch (e) {
          console.error('Transaction error:', e);
        }
      };
    
      const getCardDetails = async () => {
        try {
          const result = await EMVPayment.getCardDetails();
          console.log('Card details:', result);
        } catch (e) {
          console.error('Card details error:', e);
        }
      };
    
      const cancelTransaction = async () => {
        try {
          const result = await EMVPayment.cancelTransaction();
          console.log('Cancel result:', result);
        } catch (e) {
          console.error('Cancel error:', e);
        }
      };
      
  const [showSheet, setShowSheet] = useState(false);
  // 1. Add state for in-house modal
  const [showInhouseModal, setShowInhouseModal] = useState(false);

  // Add this alias for clarity
  const runTransaction = startTransaction;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
    
        {/* Main CTA Button */}
        <View style={styles.centerContent} pointerEvents={showSheet || showInhouseModal ? 'none' : 'auto'}>
          {/* 1. Add a text label above the main CTAs */}
          <Text style={styles.amountLabel}>Pay $100.24</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={() => setShowSheet(true)}
          >
            {/* 2. Change main CTA text */}
            <Text style={styles.ctaButtonText}>Pay via Credit Card</Text>
          </TouchableOpacity>
          {/* 3. Add a new CTA below */}
          <TouchableOpacity
            style={[styles.ctaButton, styles.secondaryCtaButton]}
            activeOpacity={0.85}
            onPress={() => setShowInhouseModal(true)}
          >
            <Text style={styles.ctaButtonText}>Pay via In-house A/c</Text>
          </TouchableOpacity>
        </View>
        {/* Bottom Sheet */}
        {showSheet && !showInhouseModal && (
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity style={styles.crossButton} onPress={() => setShowSheet(false)}>
                  <Text style={styles.crossText}>×</Text>
                </TouchableOpacity>
              </View>
              <Image source={require('./assets/pos-terminal.png')} style={styles.deviceImage} />
              <Text style={[styles.sheetTitle, { fontSize: 18 }]}>Swipe/Insert/Tap card</Text>
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.85}
                onPress={runTransaction}
              >
                <Text style={styles.secondaryButtonText}>Pay Now</Text>
              </TouchableOpacity>
              <Pressable style={styles.sheetCloseArea} onPress={() => setShowSheet(false)}>
                <View style={styles.sheetCloseBar} />
              </Pressable>
            </View>
          </View>
        )}
        {/* In-house Account Payment Modal */}
        <Modal
          visible={showInhouseModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowInhouseModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>In-house Account Payment</Text>
              <TextInput
                style={styles.disabledInput}
                placeholder="eg. 12345678"
                placeholderTextColor={SILVER}
                editable={false}
              />
              <TouchableOpacity style={styles.payButton} activeOpacity={0.85}>
                <Text style={styles.payButtonText}>Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowInhouseModal(false)} style={styles.closeModalBtn}>
                <Text style={styles.closeModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: ROYAL_BLUE,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 32,
    shadowColor: ROYAL_BLUE,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  ctaButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bottomSheetContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  bottomSheet: {
    backgroundColor: '#18204a',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  deviceImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#222b4d',
  },
  sheetTitle: {
    color: WHITE,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 28,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: LIGHT_BLUE,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: ROYAL_BLUE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sheetCloseArea: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  sheetCloseBar: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: SILVER,
    opacity: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18,26,47,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 320,
    backgroundColor: '#1a237e',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  modalTitle: {
    color: WHITE,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  disabledInput: {
    width: '100%',
    backgroundColor: '#222b4d',
    color: SILVER,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    opacity: 0.7,
  },
  closeModalBtn: {
    marginTop: 4, // Reduce space above Cancel
    padding: 8,
  },
  closeModalText: {
    color: LIGHT_BLUE,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  payButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 0,
    marginTop: 8,
    marginBottom: 0, // Reduce space below Pay
    alignSelf: 'center',
  },
  payButtonText: {
    color: LIGHT_BLUE,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sheetHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: -20,
  },
  crossButton: {
    paddingStart: 40,
    paddingEnd: 5,
    paddingBottom: 30,
    marginRight: 0,
    paddingTop: 0,
  },
  crossText: {
    fontSize: 28,
    color: SILVER,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  amountLabel: {
    color: LIGHT_BLUE,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  secondaryCtaButton: {
    backgroundColor: '#22306a',
    marginTop: 0,
    marginBottom: 0,
  },
});

export default MainScreen; 