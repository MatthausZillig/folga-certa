import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    // Ignore
  }
};

export const getStorageKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    return [];
  }
};

