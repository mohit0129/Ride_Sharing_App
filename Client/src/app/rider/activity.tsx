import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { MMKV } from 'react-native-mmkv';
import { BASE_URL } from '@/service/config';
import { tokenStorage } from '@/store/storage';
import { appAxios } from '@/service/apiInterceptors';

// Initialize MMKV storage
const storage = new MMKV();

// Define interface for ride data based on your API response
interface RideData {
  _id: string;
  vehicle: string;
  pickup: {
    address: string;
  };
  drop: {
    address: string;
  };
  fare: number;
  status: string;
  createdAt: string;
}

// Map backend status to UI-friendly status
const mapStatus = (status: string) => {
  switch(status) {
    case 'COMPLETED': return 'Completed';
    case 'CANCELLED': return 'Cancelled';
    case 'SEARCHING_FOR_RIDER': return 'Searching';
    case 'START': return 'Started';
    case 'ARRIVED': return 'Arrived';
    default: return status;
  }
};

// Format date and time from ISO string
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  
  // Format date (e.g., "9 Feb")
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const formattedDate = `${day} ${month}`;
  
  // Format time (e.g., "14:57")
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  
  return { date: formattedDate, time: formattedTime };
};

// Map vehicle type from backend to UI
const mapVehicleType = (vehicle: string) => {
  if (vehicle === 'auto') return 'auto';
  if (vehicle === 'bike') return 'bike';
  return 'car'; // Default for cabEconomy and cabPremium
};

const VehicleIcon = ({ type }: { type: string }) => {
  if (type === 'auto') {
    return (
      <View style={[styles.vehicleIconContainer, { backgroundColor: '#333' }]}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/509/509999.png' }}
          style={styles.autoIcon}
        />
      </View>
    );
  } else if (type === 'bike') {
    return (
      <View style={[styles.vehicleIconContainer, { backgroundColor: '#333' }]}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png' }}
          style={styles.bikeIcon}
        />
      </View>
    );
  } else {
    return (
      <View style={[styles.vehicleIconContainer, { backgroundColor: '#333' }]}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/744/744465.png' }}
          style={styles.carIcon}
        />
      </View>
    );
  }
};

interface RideItemProps {
  item: {
    id: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    price: string;
    status: string;
    vehicleType: string;
  };
  onRebook: (id: string) => void;
}

const RideItem = ({ item, onRebook }: RideItemProps) => {
  return (
    <View style={styles.rideItem}>
      <VehicleIcon type={item.vehicleType} />
      
      <View style={styles.rideDetails}>
        <View style={styles.locationContainer}>
          <View style={styles.routeInfo}>
            <View style={styles.dotLineContainer}>
              <View style={styles.dot} />
              <View style={styles.verticalLine} />
              <View style={[styles.dot, styles.destinationDot]} />
            </View>
            
            <View style={styles.addressContainer}>
              <Text style={styles.pickup}>{item.pickup}</Text>
              <Text style={styles.dropoff}>{item.dropoff}</Text>
            </View>
          </View>
          
          <Text style={styles.dateTime}>{item.date} • {item.time}</Text>
          <Text style={[
            styles.price, 
            item.status === 'Cancelled' ? styles.cancelledPrice : styles.completedPrice
          ]}>
            {item.price} • {item.status}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.rebookButton} onPress={() => onRebook(item.id)}>
          <Ionicons name="refresh-outline" size={18} color="#fff" />
          <Text style={styles.rebookText}>Rebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Divider = () => <View style={styles.divider} />;

const Activity = () => {
  const [rides, setRides] = useState<RideItemProps['item'][]>([]);
  const [allRides, setAllRides] = useState<RideItemProps['item'][]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      
      // Get the access token from the dedicated token storage
      const token = tokenStorage.getString('access_token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      // Use the pre-configured axios instance with auth interceptors
      const response = await appAxios.get('/ride/rides');
      
      const ridesData = response.data.rides;

      // Transform API data to match the UI component structure
      const formattedRides = ridesData.map((ride: RideData) => {
        const { date, time } = formatDateTime(ride.createdAt);
        return {
          id: ride._id,
          pickup: ride.pickup.address,
          dropoff: ride.drop.address,
          date,
          time,
          price: ride.fare === 0 ? '₹0.00' : `₹${ride.fare.toFixed(2)}`,
          status: mapStatus(ride.status),
          vehicleType: mapVehicleType(ride.vehicle),
        };
      });

      setAllRides(formattedRides);
      applyFilter(activeFilter, formattedRides);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch rides:', err);
      // Provide more specific error message if available
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load rides. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  // Apply filter to rides
  const applyFilter = (filter: 'all' | 'completed' | 'cancelled', ridesData = allRides) => {
    switch (filter) {
      case 'all':
        setRides(ridesData);
        break;
      case 'completed':
        setRides(ridesData.filter(ride => ride.status === 'Completed'));
        break;
      case 'cancelled':
        setRides(ridesData.filter(ride => ride.status === 'Cancelled'));
        break;
    }
    setActiveFilter(filter);
  };

  const handleRebook = (id: string) => {
    // Implement rebooking logic here
    console.log(`Rebooking ride with ID: ${id}`);
    // You might navigate to booking screen with prefilled data
  };

  // Filter tabs component
  const FilterTabs = () => (
    <View style={styles.filterTabsContainer}>
      <TouchableOpacity
        style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
        onPress={() => applyFilter('all')}
      >
        <Text style={[styles.filterTabText, activeFilter === 'all' && styles.activeFilterText]}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterTab, activeFilter === 'completed' && styles.activeFilterTab]}
        onPress={() => applyFilter('completed')}
      >
        <Text style={[styles.filterTabText, activeFilter === 'completed' && styles.activeFilterText]}>Completed</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.filterTab, activeFilter === 'cancelled' && styles.activeFilterTab]}
        onPress={() => applyFilter('cancelled')}
      >
        <Text style={[styles.filterTabText, activeFilter === 'cancelled' && styles.activeFilterText]}>Cancelled</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>
      
      <FilterTabs />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333" />
          <Text style={styles.loadingText}>Loading your rides...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          
          <View style={styles.debugButtonsContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={fetchRides}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : rides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={60} color="#888" />
          <Text style={styles.emptyText}>No rides found</Text>
          <Text style={styles.emptySubText}>
            {activeFilter === 'all' 
              ? 'Your past and upcoming rides will appear here' 
              : `No ${activeFilter} rides found`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          renderItem={({ item }) => <RideItem item={item} onRebook={handleRebook} />}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={Divider}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchRides}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
  },
  filterTabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeFilterTab: {
    backgroundColor: '#333',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  activeFilterText: {
    color: 'white',
  },
  rideItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  vehicleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  autoIcon: {
    width: 40,
    height: 40,
    tintColor: 'white',
  },
  carIcon: {
    width: 40,
    height: 40,
    tintColor: 'white',
  },
  bikeIcon: {
    width: 40,
    height: 40,
    tintColor: 'white',
  },
  rideDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flex: 1,
  },
  routeInfo: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dotLineContainer: {
    width: 14,
    alignItems: 'center',
    marginRight: 8,
    marginTop: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'black',
  },
  destinationDot: {
    borderRadius: 0,
    backgroundColor: 'black',
  },
  verticalLine: {
    width: 1,
    height: 16,
    backgroundColor: '#555',
    marginVertical: 2,
  },
  addressContainer: {
    flex: 1,
  },
  pickup: {
    fontSize: 15,
    color: 'black',
    marginBottom: 4,
  },
  dropoff: {
    fontSize: 15,
    color: 'black',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
  },
  completedPrice: {
    color: '#008000',
  },
  cancelledPrice: {
    color: '#FF0000',
  },
  rebookButton: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    alignSelf: 'flex-start',
  },
  rebookText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  debugButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  retryButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    flexGrow: 1,
  },
});

export default Activity;