import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRiderStore } from '@/store/riderStore';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { router } from 'expo-router';

const Earnings = () => {
  // Get user data and earnings from store
  const { user, todayEarning, resetEarning } = useRiderStore();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // State for UI interactions
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawalModalVisible, setWithdrawalModalVisible] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  
  // Sample earnings history
  const [earningsHistory] = useState([
    { id: 1, date: '24 July 2023', amount: 1250.50, status: 'completed' },
    { id: 2, date: '23 July 2023', amount: 890.75, status: 'completed' },
    { id: 3, date: '22 July 2023', amount: 1100.25, status: 'completed' },
    { id: 4, date: '21 July 2023', amount: 750.00, status: 'completed' },
    { id: 5, date: '20 July 2023', amount: 950.50, status: 'completed' },
  ]);
  
  // Sample bank accounts
  const [bankAccounts] = useState([
    { id: 1, name: 'HDFC Bank', accountNumber: '**** 5678', primary: true },
    { id: 2, name: 'SBI Bank', accountNumber: '**** 1234', primary: false },
  ]);

  // Setup theme colors
  const themeColors = {
    background: isDarkMode ? '#121212' : '#F5F7FA',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    primary: '#2563EB', // Consistent primary blue
    accent: isDarkMode ? '#64748B' : '#64748B',
    success: '#10B981', // Green
    warning: '#F59E0B', // Amber
    danger: '#EF4444',  // Red
    text: isDarkMode ? '#F1F5F9' : '#1E293B',
    textLight: isDarkMode ? '#94A3B8' : '#64748B',
    border: isDarkMode ? '#2C3440' : '#E2E8F0',
  };

  // Calculate total available balance (today's earnings + other available earnings)
  const availableBalance = 12500.75; // This would come from API in a real implementation

  // Handle withdrawal request
  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount');
      return;
    }
    
    if (amount > availableBalance) {
      Alert.alert('Insufficient Balance', 'Withdrawal amount exceeds your available balance');
      return;
    }
    
    if (!selectedBank) {
      Alert.alert('Select Bank', 'Please select a bank account for withdrawal');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call for withdrawal
    setTimeout(() => {
      setIsLoading(false);
      setWithdrawalModalVisible(false);
      setWithdrawalAmount('');
      
      Alert.alert(
        'Withdrawal Initiated',
        `Your withdrawal of ₹${amount.toFixed(2)} has been initiated and will be processed within 24 hours.`
      );
    }, 1500);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={RFValue(24)} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Earnings</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Earnings Summary Card */}
      <View style={[styles.earningsCard, { backgroundColor: themeColors.card }]}>
        <View style={styles.earningsSummary}>
          <Text style={[styles.earningsLabel, { color: themeColors.textLight }]}>
            TODAY'S EARNINGS
          </Text>
          <Text style={[styles.earningsAmount, { color: themeColors.success }]}>
            ₹{todayEarning.toFixed(2)}
          </Text>
          
          <View style={styles.divider} />
          
          <Text style={[styles.earningsLabel, { color: themeColors.textLight }]}>
            AVAILABLE BALANCE
          </Text>
          <Text style={[styles.earningsAmount, { color: themeColors.text }]}>
            ₹{availableBalance.toFixed(2)}
          </Text>
          
          <TouchableOpacity
            style={[styles.withdrawButton, { backgroundColor: themeColors.primary }]}
            onPress={() => setWithdrawalModalVisible(true)}
          >
            <Ionicons name="cash-outline" size={RFValue(16)} color="#FFFFFF" />
            <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Earnings Stats */}
      <View style={[styles.statsContainer, { backgroundColor: themeColors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: themeColors.text }]}>₹25,750.50</Text>
          <Text style={[styles.statLabel, { color: themeColors.textLight }]}>This Month</Text>
        </View>
        
        <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: themeColors.text }]}>₹85,210.25</Text>
          <Text style={[styles.statLabel, { color: themeColors.textLight }]}>This Year</Text>
        </View>
      </View>
      
      {/* Earnings History */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Recent Activity</Text>
        <TouchableOpacity onPress={() => router.navigate('./activity')}>
          <Text style={[styles.seeAllText, { color: themeColors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.historyContainer, { backgroundColor: themeColors.card }]}>
        {earningsHistory.map((item) => (
          <View
            key={item.id}
            style={[
              styles.historyItem,
              item.id < earningsHistory.length && { borderBottomWidth: 1, borderBottomColor: themeColors.border }
            ]}
          >
            <View style={styles.historyLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${themeColors.primary}20` }]}>
                <Ionicons name="car-outline" size={RFValue(18)} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.historyTitle, { color: themeColors.text }]}>
                  Daily Earnings
                </Text>
                <Text style={[styles.historyDate, { color: themeColors.textLight }]}>
                  {item.date}
                </Text>
              </View>
            </View>
            <Text style={[styles.historyAmount, { color: themeColors.success }]}>
              +₹{item.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Payment Methods Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Payment Methods</Text>
        <TouchableOpacity onPress={() => Alert.alert('Add Bank', 'Add a new bank account feature coming soon')}>
          <Text style={[styles.seeAllText, { color: themeColors.primary }]}>Add New</Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.banksContainer, { backgroundColor: themeColors.card }]}>
        {bankAccounts.map((bank) => (
          <View
            key={bank.id}
            style={[
              styles.bankItem,
              bank.id < bankAccounts.length && { borderBottomWidth: 1, borderBottomColor: themeColors.border }
            ]}
          >
            <View style={styles.bankLeft}>
              <View style={[styles.iconContainer, { backgroundColor: `${themeColors.primary}20` }]}>
                <Ionicons name="card-outline" size={RFValue(18)} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.bankTitle, { color: themeColors.text }]}>
                  {bank.name}
                </Text>
                <Text style={[styles.bankNumber, { color: themeColors.textLight }]}>
                  {bank.accountNumber}
                </Text>
              </View>
            </View>
            {bank.primary && (
              <View style={[styles.primaryBadge, { backgroundColor: `${themeColors.success}20` }]}>
                <Text style={[styles.primaryText, { color: themeColors.success }]}>Primary</Text>
              </View>
            )}
          </View>
        ))}
      </View>
      
      {/* Withdrawal Modal */}
      <Modal
        visible={withdrawalModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setWithdrawalModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Withdraw Funds</Text>
              <TouchableOpacity onPress={() => setWithdrawalModalVisible(false)}>
                <Ionicons name="close" size={RFValue(24)} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalLabel, { color: themeColors.textLight }]}>
              Available Balance: ₹{availableBalance.toFixed(2)}
            </Text>
            
            <View style={[styles.inputContainer, { borderColor: themeColors.border }]}>
              <Text style={[styles.currencySymbol, { color: themeColors.text }]}>₹</Text>
              <TextInput
                style={[styles.amountInput, { color: themeColors.text }]}
                value={withdrawalAmount}
                onChangeText={setWithdrawalAmount}
                placeholder="0.00"
                placeholderTextColor={themeColors.textLight}
                keyboardType="numeric"
              />
            </View>
            
            <Text style={[styles.modalLabel, { color: themeColors.textLight, marginTop: 20 }]}>
              Select Bank Account
            </Text>
            
            {bankAccounts.map((bank) => (
              <TouchableOpacity
                key={bank.id}
                style={[
                  styles.bankOption,
                  { borderColor: themeColors.border },
                  selectedBank === bank.name && { borderColor: themeColors.primary }
                ]}
                onPress={() => setSelectedBank(bank.name)}
              >
                <View style={styles.bankOptionLeft}>
                  <Ionicons name="card-outline" size={RFValue(18)} color={themeColors.primary} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={[styles.bankOptionTitle, { color: themeColors.text }]}>
                      {bank.name}
                    </Text>
                    <Text style={[styles.bankOptionNumber, { color: themeColors.textLight }]}>
                      {bank.accountNumber}
                    </Text>
                  </View>
                </View>
                
                {selectedBank === bank.name && (
                  <Ionicons name="checkmark-circle" size={RFValue(22)} color={themeColors.primary} />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: themeColors.primary },
                isLoading && { opacity: 0.7 }
              ]}
              onPress={handleWithdrawal}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm Withdrawal</Text>
              )}
            </TouchableOpacity>
            
            <Text style={[styles.withdrawalNote, { color: themeColors.textLight }]}>
              Withdrawals are typically processed within 24 hours to your bank account.
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  earningsCard: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  earningsSummary: {
    padding: 20,
  },
  earningsLabel: {
    fontSize: RFValue(12),
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: RFValue(28),
    fontWeight: '700',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 16,
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(14),
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  statValue: {
    fontSize: RFValue(18),
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: RFValue(12),
    color: '#64748B',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: RFValue(14),
    color: '#2563EB',
    fontWeight: '500',
  },
  historyContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyTitle: {
    fontSize: RFValue(14),
    fontWeight: '500',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: RFValue(12),
    color: '#64748B',
  },
  historyAmount: {
    fontSize: RFValue(16),
    fontWeight: '600',
    color: '#10B981',
  },
  banksContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  bankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  bankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankTitle: {
    fontSize: RFValue(14),
    fontWeight: '500',
    marginBottom: 4,
  },
  bankNumber: {
    fontSize: RFValue(12),
    color: '#64748B',
  },
  primaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#D1FAE5',
  },
  primaryText: {
    fontSize: RFValue(12),
    fontWeight: '500',
    color: '#10B981',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: '600',
  },
  modalLabel: {
    fontSize: RFValue(14),
    marginBottom: 10,
    color: '#64748B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 56,
  },
  currencySymbol: {
    fontSize: RFValue(20),
    fontWeight: '500',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: RFValue(20),
    fontWeight: '500',
  },
  bankOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 16,
    marginVertical: 6,
  },
  bankOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankOptionTitle: {
    fontSize: RFValue(14),
    fontWeight: '500',
  },
  bankOptionNumber: {
    fontSize: RFValue(12),
    color: '#64748B',
  },
  confirmButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(16),
    fontWeight: '600',
  },
  withdrawalNote: {
    fontSize: RFValue(12),
    color: '#64748B',
    textAlign: 'center',
  }
});

export default Earnings;