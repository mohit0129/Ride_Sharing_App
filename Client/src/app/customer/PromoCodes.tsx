import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  Clipboard,
  ToastAndroid,
  Platform,
  Alert,
  RefreshControl
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { appAxios } from "@/service/apiInterceptors";
import { useUserStore } from "@/store/userStore";
import { useColorScheme } from "react-native";

// Define PromoCode type
interface PromoCode {
  id: string;
  code: string;
  discount: string;
  expiryDate?: string;
  description?: string;
  isUsed?: boolean;
  isExpired?: boolean;
  isFullyUsed?: boolean;
  usageLimit?: number;
  usageCount?: number;
  minimumOrderValue?: number;
}

// Define props for the component
interface PromoCodesProps {
  isVisible: boolean;
  onClose: () => void;
}

const PromoCodes: React.FC<PromoCodesProps> = ({ isVisible, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const user = useUserStore((state) => state.user);

  // Theme colors for dark/light mode
  const themeColors = {
    background: isDarkMode ? "#1E1E1E" : "#FFFFFF",
    text: isDarkMode ? "#F1F5F9" : "#1E293B",
    textLight: isDarkMode ? "#94A3B8" : "#64748B",
    border: isDarkMode ? "#2C3440" : "#E2E8F0",
    handle: isDarkMode ? "#444" : "#ccc",
    primary: "#2563EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  };

  // Fetch promo codes from API
  const fetchPromoCodes = useCallback(async (showRefreshing: boolean = false): Promise<void> => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Make API call to get promo codes - include user ID to get personalized codes
      const response = await appAxios.get('/promotions/available', {
        params: {
          userId: user?.id
        }
      });
      
      // Process and sort the promo codes (valid, non-expired codes first)
      const processedCodes = response.data.map((code: PromoCode) => {
        // Check if code is expired
        const isExpired = code.expiryDate ? new Date(code.expiryDate) < new Date() : false;
        
        // Check if code is fully used
        const isFullyUsed = code.usageLimit && code.usageCount 
          ? code.usageCount >= code.usageLimit 
          : false;
          
        return {
          ...code,
          isExpired,
          isFullyUsed
        };
      });
      
      // Sort: active codes first, then expired or fully used codes
      const sortedCodes = processedCodes.sort((a: any, b: any) => {
        if ((a.isExpired || a.isFullyUsed) && !(b.isExpired || b.isFullyUsed)) return 1;
        if (!(a.isExpired || a.isFullyUsed) && (b.isExpired || b.isFullyUsed)) return -1;
        return 0;
      });
      
      setPromoCodes(sortedCodes);
      
    } catch (err) {
      console.error("Failed to fetch promo codes:", err);
      setError("Unable to load promo codes at this time");
      
      // Use sample data as fallback if API fails
      setPromoCodes([
        { id: "1", code: "SAVE10", discount: "10% off", expiryDate: "2023-12-31", description: "Save 10% on your next ride" },
        { id: "2", code: "FREESHIP", discount: "Free Shipping", expiryDate: "2023-11-15", description: "Free delivery on your next order" },
        { id: "3", code: "WELCOME15", discount: "15% off for new users", expiryDate: "2023-12-31", description: "Welcome discount for new customers" },
        { id: "4", code: "SUMMER20", discount: "20% off", expiryDate: new Date(Date.now() - 864000000).toISOString(), description: "Summer special discount", isExpired: true },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  // Initial fetch on modal open
  useEffect(() => {
    if (isVisible) {
      fetchPromoCodes();
    }
  }, [isVisible, fetchPromoCodes]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    fetchPromoCodes(true);
  }, [fetchPromoCodes]);

  const copyToClipboard = (code: string): void => {
    Clipboard.setString(code);
    setCopiedCode(code);
    
    // Reset copied state after 3 seconds
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
    
    // Show notification based on platform
    if (Platform.OS === 'android') {
      ToastAndroid.show('Promo code copied to clipboard!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Promo code copied to clipboard!');
    }
  };

  // Format expiry date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining until expiry
  const getDaysRemaining = (dateString: string): number => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get expiry text with appropriate styling
  const getExpiryInfo = (item: PromoCode): { text: string; color: string } => {
    if (!item.expiryDate) return { text: "No expiration date", color: themeColors.textLight };
    
    const daysRemaining = getDaysRemaining(item.expiryDate);
    
    if (daysRemaining < 0) {
      return { text: "Expired", color: themeColors.error };
    } else if (daysRemaining === 0) {
      return { text: "Expires today", color: themeColors.warning };
    } else if (daysRemaining <= 3) {
      return { text: `Expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`, color: themeColors.warning };
    } else {
      return { text: `Expires: ${formatDate(item.expiryDate)}`, color: themeColors.textLight };
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
    >
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Drag Handle */}
        <View style={[styles.handle, { backgroundColor: themeColors.handle }]} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Available Promo Codes</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={themeColors.text} />
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={themeColors.primary} />
            <Text style={[styles.message, { color: themeColors.textLight }]}>
              Loading promo codes...
            </Text>
          </View>
        )}

        {/* Error State */}
        {!loading && error && (
          <View style={styles.centerContent}>
            <Ionicons name="alert-circle-outline" size={48} color={themeColors.error} />
            <Text style={[styles.message, { color: themeColors.text }]}>{error}</Text>
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
              onPress={() => fetchPromoCodes()}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && promoCodes.length === 0 && (
          <View style={styles.centerContent}>
            <Ionicons name="pricetag-outline" size={48} color={themeColors.textLight} />
            <Text style={[styles.message, { color: themeColors.text }]}>
              No promo codes available right now
            </Text>
          </View>
        )}

        {/* Promo Codes List */}
        {!loading && !error && promoCodes.length > 0 && (
          <FlatList
            data={promoCodes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isExpired = item.isExpired || (item.expiryDate && new Date(item.expiryDate) < new Date());
              const isDisabled = isExpired || item.isUsed || item.isFullyUsed;
              const expiryInfo = getExpiryInfo(item);
              
              return (
                <View 
                  style={[
                    styles.promoItem, 
                    { 
                      borderBottomColor: themeColors.border,
                      opacity: isDisabled ? 0.6 : 1
                    }
                  ]}
                >
                  <View style={styles.promoHeader}>
                    <View style={styles.promoLeft}>
                      <Text style={[styles.promoCode, { color: themeColors.text }]}>
                        {item.code}
                      </Text>
                      <Text style={[styles.promoDiscount, { color: isDisabled ? themeColors.textLight : themeColors.success }]}>
                        {item.discount}
                      </Text>
                      
                      {item.minimumOrderValue && (
                        <Text style={[styles.minimumValue, { color: themeColors.textLight }]}>
                          Min. order: ₹{item.minimumOrderValue}
                        </Text>
                      )}
                    </View>
                    
                    {isDisabled ? (
                      <View style={[styles.statusBadge, { backgroundColor: `${themeColors.error}20` }]}>
                        <Text style={[styles.statusText, { color: themeColors.error }]}>
                          {isExpired ? "Expired" : "Used"}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={[
                          styles.copyButton, 
                          { backgroundColor: copiedCode === item.code ? `${themeColors.success}20` : `${themeColors.primary}20` }
                        ]}
                        onPress={() => copyToClipboard(item.code)}
                      >
                        <Ionicons 
                          name={copiedCode === item.code ? "checkmark-outline" : "copy-outline"} 
                          size={18} 
                          color={copiedCode === item.code ? themeColors.success : themeColors.primary} 
                        />
                        <Text 
                          style={[
                            styles.copyText, 
                            { color: copiedCode === item.code ? themeColors.success : themeColors.primary }
                          ]}
                        >
                          {copiedCode === item.code ? "Copied" : "Copy"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {item.description && (
                    <Text style={[styles.promoDescription, { color: themeColors.textLight }]}>
                      {item.description}
                    </Text>
                  )}
                  
                  {item.expiryDate && (
                    <Text style={[styles.expiryDate, { color: expiryInfo.color }]}>
                      {expiryInfo.text}
                    </Text>
                  )}
                  
                  {item.usageLimit && (
                    <View style={styles.usageContainer}>
                      <Text style={[styles.usageText, { color: themeColors.textLight }]}>
                        {item.usageCount || 0} of {item.usageLimit} used
                      </Text>
                      <View style={styles.progressBarContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { 
                              width: `${Math.min(((item.usageCount || 0) / item.usageLimit) * 100, 100)}%`,
                              backgroundColor: themeColors.primary
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  )}
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[themeColors.primary]}
                tintColor={themeColors.primary}
              />
            }
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  message: {
    fontSize: RFValue(14),
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: RFValue(14),
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 16,
  },
  promoItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  promoLeft: {
    flex: 1,
  },
  promoCode: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    marginBottom: 4,
  },
  promoDiscount: {
    fontSize: RFValue(14),
    fontWeight: '500',
    color: "#10B981",
  },
  minimumValue: {
    fontSize: RFValue(12),
    marginTop: 4,
    color: "#64748B",
  },
  promoDescription: {
    fontSize: RFValue(14),
    marginTop: 4,
    color: "#64748B",
  },
  expiryDate: {
    fontSize: RFValue(12),
    marginTop: 8,
    color: "#64748B",
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  copyText: {
    fontSize: RFValue(12),
    fontWeight: '500',
    color: '#2563EB',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: RFValue(11),
    fontWeight: '500',
    color: '#EF4444',
  },
  usageContainer: {
    marginTop: 8,
  },
  usageText: {
    fontSize: RFValue(11),
    color: '#64748B',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563EB',
  }
});

export default PromoCodes;
