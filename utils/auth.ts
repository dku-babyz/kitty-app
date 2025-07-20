import EncryptedStorage from 'react-native-encrypted-storage';

export const saveToken = async (token: string) => {
  try {
    await EncryptedStorage.setItem("user_token", token);
    console.log('Token saved successfully.');
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await EncryptedStorage.getItem("user_token");
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await EncryptedStorage.removeItem("user_token");
    console.log('Token removed successfully.');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
