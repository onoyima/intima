import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Shield, Flame, Sparkles, Heart, 
  Settings, Lock, Zap, Save, ArrowLeft 
} from 'lucide-react-native';
import api from '../lib/api';

const { width } = Dimensions.get('window');

export default function PreferencesScreen({ onBack }: { onBack: () => void }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [intimacyStyle, setIntimacyStyle] = useState("");
  const [boundaries, setBoundaries] = useState("");

  const { data: preferences, isLoading } = useQuery<any>({
    queryKey: ['/api/preferences'],
    queryFn: async () => {
        const res = await api.get('/api/preferences');
        return res.data;
    }
  });

  useEffect(() => {
    if (preferences) {
        setIntimacyStyle(preferences.intimacyStyle || "");
        setBoundaries(preferences.boundaries || "");
    }
  }, [preferences]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
        const res = await api.put('/api/preferences', data);
        return res.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
        Alert.alert("Success", "Security & Intimacy preferences updated.");
    }
  });

  const handleSave = () => {
    saveMutation.mutate({ intimacyStyle, boundaries });
  };

  if (isLoading) return <View style={styles.center}><ActivityIndicator color="#f43f5e" /></View>;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <ArrowLeft size={20} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.backText}>BACK</Text>
                </TouchableOpacity>
                <View style={styles.secureBadge}>
                    <Lock size={12} color="#f43f5e" />
                    <Text style={styles.secureText}>SECTION D ENCRYPTED</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>
                        Intimacy <Text style={styles.primaryText}>Styles</Text>
                    </Text>
                    <Text style={styles.tagline}>BOUNDARIES & DESIRES</Text>
                </View>

                {/* Intimacy Style Selection */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Primary Style</Text>
                    <Sparkles size={16} color="#f43f5e" />
                </View>
                
                <View style={styles.styleGrid}>
                    {[
                        { id: 'romantic', label: 'Romantic', icon: Heart, color: '#f43f5e' },
                        { id: 'playful', label: 'Playful', icon: Flame, color: '#fbbf24' },
                        { id: 'erotic', label: 'Erotic', icon: Zap, color: '#c084fc' },
                        { id: 'secure', label: 'Secure', icon: Shield, color: '#60a5fa' }
                    ].map(style => (
                        <TouchableOpacity 
                            key={style.id} 
                            style={[
                                styles.styleCard, 
                                intimacyStyle === style.id && { backgroundColor: style.color + '20', borderColor: style.color }
                            ]}
                            onPress={() => setIntimacyStyle(style.id)}
                        >
                            <style.icon size={24} color={intimacyStyle === style.id ? style.color : 'rgba(255,255,255,0.2)'} />
                            <Text style={[styles.styleLabel, intimacyStyle === style.id && { color: style.color }]}>{style.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Boundaries Logic */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Logic Boundaries</Text>
                    <Shield size={16} color="#4ade80" />
                </View>

                <View style={styles.card}>
                    <Text style={styles.inputLabel}>SET RIGID BOUNDARIES</Text>
                    <TextInput 
                        style={styles.textArea}
                        placeholder="List items or themes that are strictly offline..."
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        multiline
                        value={boundaries}
                        onChangeText={setBoundaries}
                    />
                    <View style={styles.warningBox}>
                        <Lock size={14} color="#fbbf24" />
                        <Text style={styles.warningText}>
                            Boundaries are enforced by the AI Guardian during pairing and discovery sessions.
                        </Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.saveBtn, saveMutation.isPending && styles.disabledBtn]} 
                    onPress={handleSave}
                    disabled={saveMutation.isPending}
                >
                    <Save size={20} color="white" />
                    <Text style={styles.saveBtnText}>{saveMutation.isPending ? 'ENCRYPTING...' : 'SAVE PROTOCOLS'}</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                   <Text style={styles.footerText}>INTIMA REPRODUCTIVE & RELATIONSHIP ECOSYSTEM V1.0</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.1)',
  },
  secureText: {
    color: '#f43f5e',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -1,
  },
  primaryText: {
    color: '#f43f5e',
    fontStyle: 'italic',
  },
  tagline: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontStyle: 'italic',
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: 40,
  },
  styleCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  styleLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    marginHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 32,
  },
  inputLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    height: 150,
    padding: 20,
    color: '#fff',
    fontSize: 14,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(251, 191, 36, 0.05)',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    gap: 12,
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    color: 'rgba(251, 191, 36, 0.6)',
    fontSize: 9,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  saveBtn: {
    marginHorizontal: 24,
    backgroundColor: '#f43f5e',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#f43f5e',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 40,
    opacity: 0.2,
  },
  footerText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 14,
  }
});
