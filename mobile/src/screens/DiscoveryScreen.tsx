import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Heart, 
  Sparkles, 
  AlertCircle, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react-native';
import api from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DiscoveryScreen() {
  const queryClient = useQueryClient();
  const [matchingUserId, setMatchingUserId] = useState<string | null>(null);

  const { data: profiles, isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/profiles'],
    queryFn: async () => {
      const res = await api.get('/api/profiles');
      return res.data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.post(`/api/profiles/${userId}/like`);
      return res.data;
    },
    onSuccess: (data, userId) => {
      if (data.isMatch) {
        setMatchingUserId(userId);
        queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      }
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f43f5e" />
        <Text style={styles.loadingText}>SCANNING FOR CONNECTIONS...</Text>
      </View>
    );
  }

  if (error || !profiles || profiles.length === 0) {
    return (
      <View style={styles.center}>
        <AlertCircle size={48} color="#666" />
        <Text style={styles.errorTitle}>No one around yet</Text>
        <Text style={styles.errorSub}>Invite someone to the ecosystem!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <Text style={styles.title}>
              Discover <Text style={styles.italic}>Lust & Love</Text>
            </Text>
            <View style={styles.subtitleRow}>
                <Sparkles size={12} color="#f43f5e" />
                <Text style={styles.subtitle}>AI-curated intimacy styles</Text>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {(Array.isArray(profiles) ? profiles : []).map((profile) => (
            <View key={profile.userId} style={styles.card}>
              <Image 
                source={{ uri: profile.user.profileImageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600' }} 
                style={styles.profileImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
                style={styles.overlay}
              />

              {matchingUserId === profile.userId && (
                <View style={styles.matchOverlay}>
                    <Sparkles size={64} color="#f43f5e" />
                    <Text style={styles.matchTitle}>IT'S A MATCH!</Text>
                    <Text style={styles.matchText}>You and {profile.user.firstName} matched.</Text>
                    <TouchableOpacity 
                        style={styles.matchButton}
                        onPress={() => setMatchingUserId(null)}
                    >
                        <Text style={styles.matchButtonText}>SEND MESSAGE</Text>
                    </TouchableOpacity>
                </View>
              )}

              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                    <View>
                        <Text style={styles.name}>{profile.user.firstName}, {profile.user.lastName?.[0]}.</Text>
                        <Text style={styles.bio} numberOfLines={1}>{profile.bio}</Text>
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{profile.gender?.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.interestsRow}>
                    {(Array.isArray(profile.interests) 
                        ? profile.interests 
                        : typeof profile.interests === 'string' 
                            ? profile.interests.split(',').map(i => i.trim()) 
                            : []
                    ).slice(0, 3).map((interest: string) => (
                        <View key={interest} style={styles.interestBadge}>
                            <Text style={styles.interestText}>{interest.toUpperCase()}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity 
                        style={[
                            styles.connectButton,
                            likeMutation.variables === profile.userId && styles.likedButton
                        ]}
                        disabled={likeMutation.isPending}
                        onPress={() => likeMutation.mutate(profile.userId)}
                    >
                        <Heart size={20} color="white" fill={likeMutation.variables === profile.userId ? "white" : "transparent"} />
                        <Text style={styles.connectText}>
                            {likeMutation.variables === profile.userId ? 'LIKED' : 'CONNECT'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.messageButton}>
                        <MessageSquare size={20} color="white" />
                    </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  center: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#666',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -1,
  },
  italic: {
    color: '#f43f5e',
    fontStyle: 'italic',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  subtitle: {
    color: '#666',
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  card: {
    height: 450,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#111',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  profileImage: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  badge: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
  badgeText: {
    color: '#f43f5e',
    fontSize: 10,
    fontWeight: 'bold',
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  interestBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  interestText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  connectButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#f43f5e',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  likedButton: {
    backgroundColor: '#10b981',
  },
  connectText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageButton: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  errorTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  errorSub: {
    color: '#666',
    marginTop: 8,
  },
  matchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(244, 63, 94, 0.95)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    fontStyle: 'italic',
    marginTop: 20,
  },
  matchText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  matchButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchButtonText: {
    color: '#f43f5e',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
