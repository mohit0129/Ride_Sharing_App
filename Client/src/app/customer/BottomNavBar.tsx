import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Href, useRouter, useSegments } from 'expo-router';
import { Home, Cog, LayoutGrid, User } from 'lucide-react-native';

const BottomNavBar = () => {
  const router = useRouter();
  const segments: string[] = useSegments(); // Explicitly type as string[]

  const navigateTo = (path: Href) => {
    router.push(path);
  };

  const isActive = (path: string) => segments.includes(path);

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      paddingVertical: 10,
      paddingHorizontal: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3
    }}>
      <TouchableOpacity 
        onPress={() => navigateTo('/customer/home')} 
        style={{ alignItems: 'center' }}
      >
        <Home color={isActive('home') ? '#1E90FF' : '#808080'} />
        <Text style={{ 
          color: isActive('home') ? '#1E90FF' : '#808080', 
          fontSize: 13
        }}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigateTo('/customer/services')} 
        style={{ alignItems: 'center' }}
      >
        <LayoutGrid color={isActive('services') ? '#1E90FF' : '#808080'} />
        <Text style={{ 
          color: isActive('services') ? '#1E90FF' : '#808080', 
          fontSize: 13
        }}>
          Services
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigateTo('/customer/activity')} 
        style={{ alignItems: 'center' }}
      >
        <Cog color={isActive('activity') ? '#1E90FF' : '#808080'} />
        <Text style={{ 
          color: isActive('activity') ? '#1E90FF' : '#808080', 
          fontSize: 13
        }}>
          Activity
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigateTo('/customer/account')} 
        style={{ alignItems: 'center' }}
      >
        <User color={isActive('account') ? '#1E90FF' : '#808080'} />
        <Text style={{ 
          color: isActive('account') ? '#1E90FF' : '#808080', 
          fontSize: 13
        }}>
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavBar;
