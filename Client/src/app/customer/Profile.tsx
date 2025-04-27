import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "@/components/shared/CustomText";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors } from "@/utils/Constants";
// import { appAxios } from "@/service/apiInterceptors";
import { format } from "date-fns";
import { logout } from "@/service/authService";
import { useUserStore } from "@/store/userStore";
import { useRiderStore } from "@/store/riderStore";
import { commonStyles } from "@/styles/commonStyles";

// Define user interface based on your User model
interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  birthDate: string;
  role: string;
  status: string;
  createdAt: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [submitting, setSubmitting] = useState(false);

  // Get user from store based on role
  const user = useUserStore((state) => state.user);
  const riderUser = useRiderStore((state) => state.user);
  const currentUser = user || riderUser;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the appAxios instance which already handles auth tokens
      // const response = await appAxios.get("/user/profile");
      // setProfile(response.data);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.message || "Failed to load profile");
      //   Alert.alert('Error', 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Initialize edit form when profile is loaded or changed
  useEffect(() => {
    if (profile) {
      setEditForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        birthDate: profile.birthDate,
      });
    }
  }, [profile]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          // Use the existing logout function
          await logout();
        },
        style: "destructive",
      },
    ]);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy"); // Example: March 16, 2025
    } catch (e) {
      console.error("Invalid date:", dateString, e);
      return "Unknown";
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // If coming out of edit mode without saving, reset the form
      if (profile) {
        setEditForm({
          firstName: profile.firstName,
          lastName: profile.lastName,
          birthDate: profile.birthDate,
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSubmitting(true);
      
      // Validate required fields
      if (!editForm.firstName || !editForm.lastName) {
        Alert.alert("Error", "First name and last name are required");
        setSubmitting(false);
        return;
      }

      // Make the API call to update profile
      // await appAxios.put("/user/profile", editForm);
      
      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          ...editForm
        });
      }
      
      // Exit edit mode
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      Alert.alert(
        "Error", 
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"blue"} />
        <CustomText fontFamily="Medium" style={styles.loadingText}>
          Loading profile...
        </CustomText>
      </View>
    );
  }

  // If we have currentUser from store but API fetch failed, use store data
  const displayProfile = profile || currentUser || null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TouchableOpacity
          style={commonStyles.flexRow}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={Colors.iosColor} />
          <CustomText fontFamily="Regular" style={Colors.iosColor}>
            Back
          </CustomText>
        </TouchableOpacity>
        {/* Header */}
        <View style={styles.header}>
          <CustomText fontFamily="Bold" style={styles.headerTitle}>
            My Profile
          </CustomText>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color={Colors.error} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <CustomText fontFamily="Bold" style={styles.profileInitials}>
                {displayProfile?.firstName?.charAt(0) || ""}
                {displayProfile?.lastName?.charAt(0) || ""}
              </CustomText>
            </View>
            <TouchableOpacity
              style={[styles.editButton, isEditing && styles.activeEditButton]}
              activeOpacity={0.8}
              onPress={toggleEditMode}
            >
              <Ionicons name={isEditing ? "close" : "pencil"} size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <CustomText fontFamily="Bold" style={styles.userName}>
            {displayProfile?.firstName} {displayProfile?.lastName}
          </CustomText>

          {displayProfile?.email && (
            <CustomText fontFamily="Regular" style={styles.userEmail}>
              {displayProfile.email}
            </CustomText>
          )}

          <CustomText fontFamily="Regular" style={styles.userPhone}>
            {displayProfile?.phone || "No phone number"}
          </CustomText>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor:
                    displayProfile?.status === "active" ? "#4CAF50" : "#F44336",
                },
              ]}
            />
            <CustomText fontFamily="Medium" style={styles.statusText}>
              {displayProfile?.status === "active" ? "Active" : "Inactive"}
            </CustomText>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.sectionHeader}>
            <CustomText fontFamily="SemiBold" style={styles.sectionTitle}>
              Account Details
            </CustomText>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailItem}>
              <View style={styles.detailContent}>
                <CustomText fontFamily="Regular" style={styles.detailLabel}>
                  First Name
                </CustomText>
                {isEditing ? (
                  <TextInput
                    style={styles.editDetailInput}
                    value={editForm.firstName}
                    onChangeText={(value) => handleInputChange("firstName", value)}
                    placeholder="First Name"
                  />
                ) : (
                  <CustomText fontFamily="Medium" style={styles.detailValue}>
                    {displayProfile?.firstName}
                  </CustomText>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailContent}>
                <CustomText fontFamily="Regular" style={styles.detailLabel}>
                  Last Name
                </CustomText>
                {isEditing ? (
                  <TextInput
                    style={styles.editDetailInput}
                    value={editForm.lastName}
                    onChangeText={(value) => handleInputChange("lastName", value)}
                    placeholder="Last Name"
                  />
                ) : (
                  <CustomText fontFamily="Medium" style={styles.detailValue}>
                    {displayProfile?.lastName}
                  </CustomText>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailContent}>
                <CustomText fontFamily="Regular" style={styles.detailLabel}>
                  Phone Number
                </CustomText>
                <CustomText fontFamily="Medium" style={styles.detailValue}>
                  {displayProfile?.phone || "Not provided"}
                </CustomText>
              </View>
            </View>

            {displayProfile?.email && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailItem}>
                  <View style={styles.detailContent}>
                    <CustomText fontFamily="Regular" style={styles.detailLabel}>
                      Email Address
                    </CustomText>
                    <CustomText fontFamily="Medium" style={styles.detailValue}>
                      {displayProfile.email}
                    </CustomText>
                  </View>
                </View>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailContent}>
                <CustomText fontFamily="Regular" style={styles.detailLabel}>
                  Birth Date
                </CustomText>
                {isEditing ? (
                  <TextInput
                    style={styles.editDetailInput}
                    value={editForm.birthDate}
                    onChangeText={(value) => handleInputChange("birthDate", value)}
                    placeholder="YYYY-MM-DD"
                  />
                ) : (
                  <CustomText fontFamily="Medium" style={styles.detailValue}>
                    {displayProfile?.birthDate
                      ? formatDate(displayProfile.birthDate)
                      : "Not provided"}
                  </CustomText>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailContent}>
                <CustomText fontFamily="Regular" style={styles.detailLabel}>
                  Member Since
                </CustomText>
                <CustomText fontFamily="Medium" style={styles.detailValue}>
                  {displayProfile?.createdAt
                    ? formatDate(displayProfile.createdAt)
                    : "Unknown"}
                </CustomText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailContent}>
                <CustomText fontFamily="Regular" style={styles.detailLabel}>
                  Account Type
                </CustomText>
                <CustomText fontFamily="Medium" style={styles.detailValue}>
                  {displayProfile?.role === "customer" ? "Customer" : "Rider"}
                </CustomText>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.8}
                onPress={handleSaveProfile}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                    <CustomText fontFamily="SemiBold" style={styles.actionButtonText}>
                      Save Changes
                    </CustomText>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                activeOpacity={0.8}
                onPress={toggleEditMode}
                disabled={submitting}
              >
                <Ionicons name="close-outline" size={20} color="#FFFFFF" />
                <CustomText fontFamily="SemiBold" style={styles.actionButtonText}>
                  Cancel
                </CustomText>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={toggleEditMode}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <CustomText fontFamily="SemiBold" style={styles.actionButtonText}>
                Edit Profile
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 26,
    color: "#222",
  },
  logoutButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    fontSize: 36,
    color: "black",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "black",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  activeEditButton: {
    backgroundColor: Colors.error,
  },
  userName: {
    fontSize: 22,
    color: "#222",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#555",
  },
  detailsContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#222",
  },
  editingIndicator: {
    fontSize: 14,
    color: Colors.iosColor,
    fontStyle: "italic",
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#222",
  },
  editDetailInput: {
    fontSize: 16,
    color: "#222",
    padding: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    backgroundColor: "#F9F9F9",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 2,
  },
  actionButtons: {
    flexDirection: "column",
    gap: 12,
  },
  actionButton: {
    backgroundColor: Colors.iosColor,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: "#9E9E9E",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default Profile;