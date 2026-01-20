import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Image,
  Platform,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  Search, 
  Calendar, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Wallet, 
  Sparkles, 
  TrendingUp,
  Flame, 
  BookOpen, 
  GraduationCap, 
  LifeBuoy, 
  Ghost, 
  Settings, 
  MessageSquare,
  User,
  Activity,
  Bell
} from 'lucide-react-native';
import api from '../lib/api';
import { useAuth } from '../hooks/use-auth';

// Screens
import DiscoveryScreen from './DiscoveryScreen';
import CommunityScreen from './CommunityScreen';
import CoupleScreen from './CoupleScreen';
import CycleScreen from './CycleScreen';
import WalletScreen from './WalletScreen';
import ProfileScreen from './ProfileScreen';
import PreferencesScreen from './PreferencesScreen';
import ResolverScreen from './ResolverScreen';
import NotificationScreen from './NotificationScreen';

const { width, height } = Dimensions.get('window');

type TabRoute = 'home' | 'matching' | 'search' | 'pulse' | 'messages' | 'wallet' | 'profile' | 'preferences' | 'resolver' | 'cycle' | 'notifications';

export default function HomeScreen({ onLogout }: { onLogout: () => void }) {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabRoute>('home');
  const [user, setUser] = useState<any>(null);
  const [activeCouple, setActiveCouple] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/auth/user');
        setUser(response.data);
        
        const couplesResponse = await api.get('/api/couples');
        if (couplesResponse.data && couplesResponse.data.length > 0) {
          setActiveCouple(couplesResponse.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchProfile();
  }, [activeTab]); // Refetch when returning to home

  const renderContent = () => {
    switch (activeTab) {
      case 'matching': return <DiscoveryScreen />;
      case 'pulse': return <CoupleScreen />; // Pulse is the private vault
      case 'messages': return <CommunityScreen />;
      case 'wallet': return <WalletScreen onBack={() => setActiveTab('home')} />;
      case 'profile': return <ProfileScreen onBack={() => setActiveTab('home')} />;
      case 'preferences': return <PreferencesScreen onBack={() => setActiveTab('home')} />;
      case 'resolver': return <ResolverScreen />;
      case 'cycle': return <CycleScreen />;
      case 'notifications': return <NotificationScreen onBack={() => setActiveTab('home')} />;
      default: return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>
            INTIMA<Text style={styles.infinity}>∞</Text>
          </Text>
          <View style={styles.statusRow}>
            <ShieldCheck size={12} color="#f43f5e" />
            <Text style={styles.statusText}>SECURE RELATIONSHIP ECOSYSTEM</Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerIconButton} onPress={() => setActiveTab('notifications')}>
             <Bell color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton} onPress={() => setActiveTab('profile')}>
            <Sparkles color="#a855f7" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* AI Daily Insight */}
      <TouchableOpacity style={styles.aiInsightCard} onPress={() => setActiveTab('resolver')}>
        <View style={styles.aiIconContainer}>
          <Sparkles size={20} color="#f43f5e" />
        </View>
        <View style={styles.aiTextContainer}>
          <Text style={styles.aiLabel}>MORNING INSIGHT</Text>
          <Text style={styles.aiQuote}>
            "Connection isn't just about presence, it's about the quality of the gaps in between. Try a 5-minute deep eye contact session today."
          </Text>
        </View>
      </TouchableOpacity>

      {/* Bond Status */}
      {activeCouple ? (
        <View style={styles.bondCardContainer}>
          <LinearGradient
            colors={['rgba(244, 63, 94, 0.3)', 'rgba(0, 0, 0, 0.4)']}
            style={styles.bondCard}
          >
            <View style={styles.bondHeader}>
              <View>
                <Text style={styles.bondTitle}>Sync Score</Text>
                <Text style={styles.bondValue}>84.3%</Text>
              </View>
              <View style={styles.bondBadge}>
                <Flame size={14} color="#f43f5e" />
                <Text style={styles.bondBadgeText}>LVL 14 JOURNEY</Text>
              </View>
            </View>
            
            <View style={styles.partnerRow}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarChar}>{user?.firstName?.[0]}</Text>
              </View>
              <View style={styles.syncLine}>
                <View style={styles.syncProgress} />
                <View style={styles.syncDot} />
              </View>
              <View style={[styles.avatarMini, styles.partnerAvatar]}>
                <Text style={styles.avatarChar}>{activeCouple.partner?.firstName?.[0]}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.vaultButton} onPress={() => setActiveTab('pulse')}>
              <Text style={styles.vaultButtonText}>ENTER PRIVATE VAULT</Text>
              <ChevronRight size={16} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ) : (
        <TouchableOpacity style={styles.emptyBondCard} onPress={() => setActiveTab('matching')}>
            <Heart size={32} color="rgba(255,255,255,0.1)" />
            <Text style={styles.emptyBondText}>NO ACTIVE BOND DETECTED</Text>
            <Text style={styles.emptyBondSub}>Start discovery to find a match</Text>
        </TouchableOpacity>
      )}

      {/* Main Categories (Web Mirror) */}
      <View style={styles.categoriesGrid}>
        <TouchableOpacity style={styles.categoryCard} onPress={() => setActiveTab('matching')}>
          <Search size={24} color="#f43f5e" />
          <Text style={styles.categoryLabel}>Lust Discovery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryCard} onPress={() => setActiveTab('messages')}>
          <Globe size={24} color="#c084fc" />
          <Text style={styles.categoryLabel}>Discovery Rooms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryCard} onPress={() => setActiveTab('pulse')}>
          <Flame size={24} color="#fbbf24" />
          <Text style={styles.categoryLabel}>Intima Games</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryCard} onPress={() => setActiveTab('cycle')}>
          <Activity size={24} color="#F43F5E" />
          <Text style={styles.categoryLabel}>Health Hub</Text>
        </TouchableOpacity>
      </View>

      {/* Feature Ecosystem */}
      <View style={styles.ecosystemSection}>
        <Text style={styles.sectionHeader}>FEAUTURE ECOSYSTEM</Text>
        <View style={styles.ecosystemGrid}>
            {[
              { id: 'resolver', icon: GraduationCap, label: 'Issue Solver', color: '#60a5fa' },
              { id: 'preferences', icon: Settings, label: 'Section D Preferences', color: '#4ade80' },
              { id: 'ai', icon: Sparkles, label: 'AI Intel', color: '#f43f5e' },
              { id: 'wallet', icon: Wallet, label: 'Credit Wallet', color: '#fbbf24' }
            ].map(item => (
                <TouchableOpacity key={item.id} style={styles.ecoItem} onPress={() => setActiveTab(item.id as any)}>
                    <View style={[styles.ecoIcon, { backgroundColor: item.color + '15' }]}>
                        <item.icon size={20} color={item.color} />
                    </View>
                    <Text style={styles.ecoLabel}>{item.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.glowTop} />
      
      <View style={{ flex: 1 }}>
          {renderContent()}
      </View>

      {/* Global Tabs Container */}
      {['home', 'matching', 'search', 'pulse', 'messages', 'resolver', 'cycle'].includes(activeTab) && (
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('matching')}>
                <Heart size={24} color={activeTab === 'matching' ? '#f43f5e' : 'rgba(255,255,255,0.4)'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('search')}>
                <Search size={24} color={activeTab === 'search' ? '#f43f5e' : 'rgba(255,255,255,0.4)'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mainTabItem} onPress={() => setActiveTab('home')}>
                <View style={styles.logoBtn}>
                    <Text style={styles.logoBtnText}>∞</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('pulse')}>
                <Flame size={24} color={activeTab === 'pulse' ? '#f43f5e' : 'rgba(255,255,255,0.4)'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('messages')}>
                <MessageSquare size={24} color={activeTab === 'messages' ? '#f43f5e' : 'rgba(255,255,255,0.4)'} />
            </TouchableOpacity>
          </View>
      )}
    </View>
  );
}

function Globe({ size, color }: { size: number, color: string }) {
    return <BookOpen size={size} color={color} />; // Using BookOpen as a fallback for Globe
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  glowTop: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 600,
    height: 600,
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
    borderRadius: 300,
    opacity: 0.5,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 120,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -2,
  },
  infinity: {
    color: '#f43f5e',
    letterSpacing: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  statusText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2.5,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIconButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiInsightCard: {
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
    padding: 24,
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTextContainer: {
    flex: 1,
  },
  aiLabel: {
    color: '#f43f5e',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
  },
  aiQuote: {
    color: '#fff',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  bondCardContainer: {
    marginBottom: 40,
    shadowColor: '#f43f5e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 50,
    elevation: 10,
  },
  bondCard: {
    padding: 32,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  bondHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  bondTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bondValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: -2,
  },
  bondBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bondBadgeText: {
    color: '#f43f5e',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  avatarMini: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerAvatar: {
    borderColor: '#f43f5e',
  },
  avatarChar: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  syncLine: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 12,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncProgress: {
    position: 'absolute',
    left: 0,
    width: '84.3%',
    height: '100%',
    backgroundColor: '#f43f5e',
    opacity: 0.5,
  },
  syncDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f43f5e',
    left: '84.3%',
    marginLeft: -6,
  },
  vaultButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  vaultButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 2,
  },
  emptyBondCard: {
    height: 200,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  emptyBondText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 16,
  },
  emptyBondSub: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    marginTop: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 40,
  },
  categoryCard: {
    width: (width - 64) / 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  categoryLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 16,
    fontSize: 14,
  },
  ecosystemSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 20,
  },
  ecosystemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ecoItem: {
    width: (width - 60) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  ecoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecoLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 72,
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabItem: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTabItem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    shadowColor: '#f43f5e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 5,
  },
  logoBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBtnText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  }
});
