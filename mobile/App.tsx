import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator, Linking } from 'react-native';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from './src/hooks/use-auth';
import { useNotifications } from './src/hooks/use-notifications';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

const queryClient = new QueryClient();

// This comment is here to force Metro to re-parse the file.
// INTIMA ECOSYSTEM MOBILE ROOT

function AppContent() {
  const { user, isLoading, logout, loginWithGoogle, refetch } = useAuth();
  const queryClient = useQueryClient();

  // Initialize notifications
  useNotifications(user?.id);

  React.useEffect(() => {
    const subscription = Linking.addEventListener('url', () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    });
    return () => {
      if (subscription && subscription.remove) subscription.remove();
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f43f5e" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen onGoogleLogin={loginWithGoogle} onSuccess={refetch} />;
  }

  return <HomeScreen onLogout={() => logout()} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
