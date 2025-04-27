// CustomerSupport.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Pressable
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { RFValue } from "react-native-responsive-fontsize";
import { useColorScheme } from 'react-native';
import { appAxios } from '@/service/apiInterceptors';
import { useUserStore } from '@/store/userStore';

// Define types for tickets and replies
interface Reply {
  _id: string;
  message: string;
  createdAt: string;
  isAdmin: boolean;
}

interface Ticket {
  _id: string;
  ticketId?: string;
  issueType: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  adminRemarks?: string;
  replies?: Reply[];
}

// Status configuration with colors and icons
const STATUS_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
  open: {
    color: '#FFD700',
    icon: 'alert-circle-outline',
    label: 'Open'
  },
  in_progress: {
    color: '#1E90FF',
    icon: 'time-outline',
    label: 'In Progress'
  },
  resolved: {
    color: '#32CD32',
    icon: 'checkmark-circle-outline',
    label: 'Resolved'
  },
  closed: {
    color: '#808080',
    icon: 'lock-closed-outline',
    label: 'Closed'
  }
};

// Define type for issue types
interface IssueType {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// Issue type options
const ISSUE_TYPES: IssueType[] = [
  { label: 'Payment Issue', value: 'payment', icon: 'card-outline' },
  { label: 'Ride Cancellation', value: 'cancellation', icon: 'car-outline' },
  { label: 'Safety Concern', value: 'safety', icon: 'shield-checkmark-outline' },
  { label: 'Driver Behavior', value: 'driver', icon: 'person-outline' },
  { label: 'App Problem', value: 'app', icon: 'phone-portrait-outline' },
  { label: 'Other', value: 'other', icon: 'help-circle-outline' }
];

const CustomerSupport = () => {
  // Get the user from store
  const user = useUserStore(state => state.user);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Theme colors
  const themeColors = {
    background: isDarkMode ? "#121212" : "#F5F7FA",
    card: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    primary: "#2563EB",
    accent: isDarkMode ? "#64748B" : "#64748B",
    text: isDarkMode ? "#F1F5F9" : "#1E293B",
    textLight: isDarkMode ? "#94A3B8" : "#64748B",
    border: isDarkMode ? "#2C3440" : "#E2E8F0",
    error: "#EF4444",
  };
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [newTicketVisible, setNewTicketVisible] = useState<boolean>(false);
  const [ticketDetailVisible, setTicketDetailVisible] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [issueType, setIssueType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [reply, setReply] = useState<string>('');
  const [issueTypeDropdownVisible, setIssueTypeDropdownVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(300));

  useEffect(() => {
    fetchTickets();
    
    // Fade in animation for the component
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const animateModal = (visible: boolean): void => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const openNewTicketModal = (): void => {
    setNewTicketVisible(true);
    animateModal(true);
  };

  const closeNewTicketModal = (): void => {
    animateModal(false);
    setTimeout(() => {
      setNewTicketVisible(false);
      resetForm();
    }, 300);
  };

  const openTicketDetailModal = (ticket: Ticket): void => {
    setSelectedTicket(ticket);
    setTicketDetailVisible(true);
    animateModal(true);
  };

  const closeTicketDetailModal = (): void => {
    animateModal(false);
    setReply('');
    setTimeout(() => setTicketDetailVisible(false), 300);
  };

  const fetchTickets = async (): Promise<void> => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      // Use our axios instance with authentication
      const response = await appAxios.get('/support/tickets');
      
      if (response.data && response.data.tickets) {
        // Sort tickets by date (newest first)
        const sortedTickets = response.data.tickets.sort((a: Ticket, b: Ticket) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTickets(sortedTickets);
      }
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      setErrorMessage('Failed to load your support tickets. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = (): void => {
    setRefreshing(true);
    fetchTickets();
  };

  const validateForm = (): boolean => {
    if (!issueType) {
      Alert.alert('Error', 'Please select an issue type');
      return false;
    }

    if (!description || description.trim() === '') {
      Alert.alert('Error', 'Please provide a description of your issue');
      return false;
    }

    if (description.length < 10) {
      Alert.alert('Error', 'Please provide a more detailed description (at least 10 characters)');
      return false;
    }

    return true;
  };

  const submitTicket = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setErrorMessage('');
      
      const response = await appAxios.post('/support/tickets', {
        issueType,
        description
      });

      if (response.data && response.data.ticket) {
        // Add the new ticket to the tickets list
        setTickets([response.data.ticket, ...tickets]);
        closeNewTicketModal();
        Alert.alert(
          'Success', 
          'Your support ticket has been submitted successfully. We will respond to your query as soon as possible.'
        );
      }
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      setErrorMessage('Failed to submit your support ticket. Please try again later.');
      Alert.alert('Error', 'Failed to submit your support ticket. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (): Promise<void> => {
    if (!selectedTicket) return;
    
    if (!reply || reply.trim() === '') {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await appAxios.post(`/support/tickets/${selectedTicket._id}/replies`, {
        message: reply
      });

      if (response.data && response.data.ticket) {
        // Update the ticket in the tickets list
        const updatedTickets = tickets.map(t => 
          t._id === response.data.ticket._id ? response.data.ticket : t
        );
        setTickets(updatedTickets);
        setSelectedTicket(response.data.ticket);
        setReply('');
        
        Alert.alert('Success', 'Your reply has been sent successfully');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      Alert.alert('Error', 'Failed to send your reply. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = (): void => {
    setIssueType('');
    setDescription('');
    setErrorMessage('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 60000) {
      const diffMinutes = Math.round(diffMs / 60000);
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffMs < 3600000) {
      const diffHours = Math.round(diffMs / 3600000);
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMs < 86400000) {
      const diffDays = Math.round(diffMs / 86400000);
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const renderStatusBadge = (status: string) => {
    const statusInfo = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.open;
    
    return (
      <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
        <Ionicons name={statusInfo.icon} size={12} color={statusInfo.color} style={styles.statusIcon} />
        <Text style={[styles.statusText, { color: statusInfo.color }]}>
          {statusInfo.label}
        </Text>
      </View>
    );
  };

  const renderTicketItem = ({ item }: { item: Ticket }) => {
    const issueTypeInfo = ISSUE_TYPES.find(type => type.value === item.issueType) || ISSUE_TYPES[5]; // Default to 'Other'
    
    return (
      <TouchableOpacity 
        style={[styles.ticketCard, { backgroundColor: themeColors.card }]} 
        onPress={() => openTicketDetailModal(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.ticketContainer}>
            <Text style={[styles.ticketId, { color: themeColors.text }]}>{item.ticketId || `#${item._id.slice(-6)}`}</Text>
            <Text style={[styles.dateText, { color: themeColors.textLight }]}>{getTimeAgo(item.createdAt)}</Text>
          </View>
          {renderStatusBadge(item.status)}
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.issueTypeContainer}>
            <View style={[styles.issueTypeIconContainer, { backgroundColor: `${themeColors.primary}15` }]}>
              <Ionicons name={issueTypeInfo.icon} size={20} color={themeColors.primary} />
            </View>
            <Text style={[styles.issueTypeText, { color: themeColors.text }]}>{issueTypeInfo.label}</Text>
          </View>
          
          <Text 
            style={[styles.descriptionText, { color: themeColors.text }]} 
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </View>
        
        <View style={[styles.cardFooter, { borderTopColor: themeColors.border }]}>
          <View style={styles.messageIndicator}>
            <Ionicons name="chatbubble-outline" size={14} color={themeColors.textLight} />
            <Text style={[styles.messageCount, { color: themeColors.textLight }]}>
              {item.replies?.length || 0} {item.replies?.length === 1 ? 'Reply' : 'Replies'}
            </Text>
          </View>
          
          <View style={styles.viewDetailsContainer}>
            <Text style={[styles.viewDetailsText, { color: themeColors.primary }]}>View Details</Text>
            <Ionicons name="chevron-forward" size={14} color={themeColors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={themeColors.textLight} />
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>No Support Tickets</Text>
      <Text style={[styles.emptySubtitle, { color: themeColors.textLight }]}>
        You don't have any support tickets yet.
      </Text>
      <TouchableOpacity 
        style={[styles.emptyButton, { backgroundColor: themeColors.primary }]}
        onPress={openNewTicketModal}
      >
        <Text style={styles.emptyButtonText}>Create a New Ticket</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDropdownItem = (item: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) => (
    <TouchableOpacity 
      style={[
        styles.dropdownItem, 
        issueType === item.value && { backgroundColor: `${themeColors.primary}15` }
      ]}
      onPress={() => {
        setIssueType(item.value);
        setIssueTypeDropdownVisible(false);
      }}
    >
      <Ionicons name={item.icon} size={20} color={themeColors.primary} />
      <Text style={[styles.dropdownItemText, { color: themeColors.text }]}>{item.label}</Text>
      {issueType === item.value && (
        <Ionicons name="checkmark" size={20} color={themeColors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Support Tickets</Text>
        <TouchableOpacity 
          style={[styles.newTicketButton, { backgroundColor: themeColors.primary }]}
          onPress={openNewTicketModal}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Error Message */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={themeColors.error} />
          <Text style={[styles.errorText, { color: themeColors.error }]}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Tickets List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColors.primary} />
          <Text style={[styles.loadingText, { color: themeColors.textLight }]}>Loading tickets...</Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={tickets}
            renderItem={renderTicketItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.ticketsList}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}
      
      {/* New Ticket Modal */}
      <Modal
        visible={newTicketVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeNewTicketModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <Animated.View 
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }], backgroundColor: themeColors.card }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>New Support Ticket</Text>
              <TouchableOpacity onPress={closeNewTicketModal}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {/* Issue Type Dropdown */}
              <Text style={[styles.inputLabel, { color: themeColors.text }]}>Issue Type*</Text>
              <TouchableOpacity 
                style={[styles.dropdownButton, { borderColor: themeColors.border }]}
                onPress={() => setIssueTypeDropdownVisible(!issueTypeDropdownVisible)}
              >
                {issueType ? (
                  <View style={styles.selectedType}>
                    <Ionicons 
                      name={ISSUE_TYPES.find(type => type.value === issueType)?.icon || 'help-circle-outline'} 
                      size={20} 
                      color={themeColors.primary} 
                      style={styles.selectedTypeIcon} 
                    />
                    <Text style={[styles.selectedTypeText, { color: themeColors.text }]}>
                      {ISSUE_TYPES.find(type => type.value === issueType)?.label || 'Select issue type'}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.placeholderText, { color: themeColors.textLight }]}>
                    Select issue type
                  </Text>
                )}
                <Ionicons 
                  name={issueTypeDropdownVisible ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color={themeColors.textLight} 
                />
              </TouchableOpacity>
              
              {issueTypeDropdownVisible && (
                <View style={[styles.dropdown, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                  {ISSUE_TYPES.map((item) => renderDropdownItem(item))}
                </View>
              )}
              
              {/* Description Input */}
              <Text style={[styles.inputLabel, { color: themeColors.text }]}>Description*</Text>
              <TextInput
                style={[
                  styles.textarea,
                  { 
                    borderColor: themeColors.border,
                    color: themeColors.text,
                    backgroundColor: isDarkMode ? '#2A2A2A' : '#F9FAFB'
                  }
                ]}
                placeholder="Describe your issue in detail..."
                placeholderTextColor={themeColors.textLight}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
              />
              
              <TouchableOpacity 
                style={[
                  styles.submitButton, 
                  { backgroundColor: themeColors.primary },
                  submitting && { opacity: 0.7 }
                ]}
                onPress={submitTicket}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Ticket</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <Modal
          visible={ticketDetailVisible}
          animationType="none"
          transparent={true}
          onRequestClose={closeTicketDetailModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <Animated.View 
              style={[
                styles.modalContainer, 
                styles.detailModalContainer,
                { transform: [{ translateY: slideAnim }], backgroundColor: themeColors.card }
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.ticketDetailHeader}>
                  <Text style={[styles.modalTitle, { color: themeColors.text }]}>
                    Ticket {selectedTicket.ticketId || `#${selectedTicket._id.slice(-6)}`}
                  </Text>
                  {renderStatusBadge(selectedTicket.status)}
                </View>
                <TouchableOpacity onPress={closeTicketDetailModal}>
                  <Ionicons name="close" size={24} color={themeColors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent}>
                <View style={styles.ticketDetailSection}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: themeColors.textLight }]}>Issue Type:</Text>
                    <View style={styles.issueTypeDetail}>
                      <Ionicons 
                        name={ISSUE_TYPES.find(type => type.value === selectedTicket.issueType)?.icon || 'help-circle-outline'} 
                        size={16} 
                        color={themeColors.primary} 
                      />
                      <Text style={[styles.detailValue, { color: themeColors.text }]}>
                        {ISSUE_TYPES.find(type => type.value === selectedTicket.issueType)?.label || 'Other'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: themeColors.textLight }]}>Created:</Text>
                    <Text style={[styles.detailValue, { color: themeColors.text }]}>
                      {formatDate(selectedTicket.createdAt)}
                    </Text>
                  </View>
                  
                  {selectedTicket.status === 'closed' && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: themeColors.textLight }]}>Closed:</Text>
                      <Text style={[styles.detailValue, { color: themeColors.text }]}>
                        {selectedTicket.closedAt ? formatDate(selectedTicket.closedAt) : 'N/A'}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={[styles.ticketMessageContainer, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F9FAFB' }]}>
                  <View style={styles.ticketMessageHeader}>
                    <Text style={[styles.youLabel, { color: themeColors.text }]}>You</Text>
                    <Text style={[styles.messageDate, { color: themeColors.textLight }]}>
                      {formatDate(selectedTicket.createdAt)}
                    </Text>
                  </View>
                  <Text style={[styles.messageText, { color: themeColors.text }]}>
                    {selectedTicket.description}
                  </Text>
                </View>
                
                {/* Replies Section */}
                {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                  <View style={styles.repliesSection}>
                    <Text style={[styles.repliesTitle, { color: themeColors.text }]}>
                      Replies ({selectedTicket.replies.length})
                    </Text>
                    
                    {selectedTicket.replies.map((reply, index) => (
                      <View 
                        key={reply._id || index}
                        style={[
                          styles.replyContainer, 
                          { 
                            backgroundColor: reply.isAdmin 
                              ? (isDarkMode ? '#2A3A50' : '#EFF6FF') 
                              : (isDarkMode ? '#2A2A2A' : '#F9FAFB') 
                          }
                        ]}
                      >
                        <View style={styles.ticketMessageHeader}>
                          <Text style={[styles.youLabel, { color: themeColors.text }]}>
                            {reply.isAdmin ? 'Support Team' : 'You'}
                          </Text>
                          <Text style={[styles.messageDate, { color: themeColors.textLight }]}>
                            {formatDate(reply.createdAt)}
                          </Text>
                        </View>
                        <Text style={[styles.messageText, { color: themeColors.text }]}>
                          {reply.message}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                
                {/* Reply Input (only show if ticket is not closed) */}
                {selectedTicket.status !== 'closed' && (
                  <View style={styles.replyInputContainer}>
                    <Text style={[styles.replyTitle, { color: themeColors.text }]}>Add a Reply</Text>
                    <TextInput
                      style={[
                        styles.textarea,
                        styles.replyTextarea,
                        { 
                          borderColor: themeColors.border,
                          color: themeColors.text,
                          backgroundColor: isDarkMode ? '#2A2A2A' : '#F9FAFB'
                        }
                      ]}
                      placeholder="Type your reply here..."
                      placeholderTextColor={themeColors.textLight}
                      value={reply}
                      onChangeText={setReply}
                      multiline={true}
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                    
                    <TouchableOpacity 
                      style={[
                        styles.submitButton, 
                        { backgroundColor: themeColors.primary },
                        submitting && { opacity: 0.7 }
                      ]}
                      onPress={submitReply}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.submitButtonText}>Send Reply</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </SafeAreaView>
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
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontWeight: '600',
  },
  newTicketButton: {
    backgroundColor: '#2563EB',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: RFValue(12),
    color: '#EF4444',
    marginLeft: 8,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  loadingText: {
    fontSize: RFValue(14),
    color: '#64748B',
    marginTop: 12,
  },
  ticketsList: {
    padding: 16,
    paddingBottom: 24,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  ticketContainer: {
    flex: 1,
  },
  ticketId: {
    fontSize: RFValue(14),
    fontWeight: '600',
    marginBottom: 2,
  },
  dateText: {
    fontSize: RFValue(11),
    color: '#64748B',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: RFValue(10),
    fontWeight: '500',
  },
  cardBody: {
    padding: 12,
  },
  issueTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueTypeIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  issueTypeText: {
    fontSize: RFValue(13),
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: RFValue(14),
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  messageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageCount: {
    fontSize: RFValue(12),
    marginLeft: 4,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: RFValue(12),
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: RFValue(18),
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: RFValue(14),
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(14),
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  detailModalContainer: {
    maxHeight: '95%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  ticketDetailHeader: {
    flex: 1,
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: RFValue(14),
    fontWeight: '500',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  selectedType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTypeIcon: {
    marginRight: 8,
  },
  selectedTypeText: {
    fontSize: RFValue(14),
  },
  placeholderText: {
    fontSize: RFValue(14),
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dropdownItemIcon: {
    marginRight: 12,
  },
  dropdownItemText: {
    fontSize: RFValue(14),
    flex: 1,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: RFValue(14),
    minHeight: 120,
    textAlignVertical: 'top',
  },
  replyTextarea: {
    minHeight: 100,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(16),
    fontWeight: '600',
  },
  ticketDetailSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: RFValue(12),
    color: '#64748B',
  },
  detailValue: {
    fontSize: RFValue(12),
    fontWeight: '500',
    textAlign: 'right',
  },
  issueTypeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketMessageContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  ticketMessageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  youLabel: {
    fontSize: RFValue(13),
    fontWeight: '600',
  },
  messageDate: {
    fontSize: RFValue(11),
    color: '#64748B',
  },
  messageText: {
    fontSize: RFValue(14),
    lineHeight: 20,
  },
  repliesSection: {
    marginBottom: 16,
  },
  repliesTitle: {
    fontSize: RFValue(16),
    fontWeight: '600',
    marginBottom: 12,
  },
  replyContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  replyInputContainer: {
    marginBottom: 16,
  },
  replyTitle: {
    fontSize: RFValue(16),
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default CustomerSupport;