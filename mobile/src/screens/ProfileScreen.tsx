import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/use-auth';
import api from '../lib/api';
import { LogOut, Save, Camera, ShieldCheck } from 'lucide-react-native';

export default function ProfileScreen({ onBack }: { onBack: () => void }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState("");
  const [goals, setGoals] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
        try {
            const res = await api.get(`/api/profiles/${user?.id}`);
            if (res.data) {
                setBio(res.data.bio || "");
                setGoals(res.data.relationshipGoals || "");
            }
        } catch (e) {
            console.log("Profile not found or error");
        }
    };
    if (user?.id) fetchProfile();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
        await api.patch('/api/users/me', { firstName, lastName });
        await api.put('/api/profiles/update', { bio, relationshipGoals: goals });
        alert("Success: Profile updated");
    } catch (e) {
        alert("Error: Could not save profile");
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={styles.backText}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => logout()}>
                    <LogOut size={20} color="#f43f5e" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>
                        My <Text style={styles.primaryText}>Identity</Text>
                    </Text>
                    <Text style={styles.tagline}>PROFILE & PREFERENCES</Text>
                </View>

                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            {user?.profileImageUrl ? (
                                <Image source={{ uri: user.profileImageUrl }} style={styles.avatarImg} />
                            ) : (
                                <Text style={styles.avatarText}>{firstName?.[0]}</Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Camera size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.nameText}>{firstName} {lastName}</Text>
                    <Text style={styles.emailText}>{user?.email}</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.inputRow}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>FIRST NAME</Text>
                            <TextInput 
                                style={styles.input} 
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>LAST NAME</Text>
                            <TextInput 
                                style={styles.input} 
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>ABOUT ME (BIO)</Text>
                        <TextInput 
                            style={[styles.input, styles.textArea]} 
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            placeholder="Tell us about yourself..."
                            placeholderTextColor="rgba(255,255,255,0.2)"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>RELATIONSHIP GOALS</Text>
                        <TextInput 
                            style={styles.input} 
                            value={goals}
                            onChangeText={setGoals}
                            placeholder="e.g. Seeking serious connection"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.saveBtn, loading && styles.disabledBtn]} 
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Save size={20} color="white" />
                        <Text style={styles.saveBtnText}>{loading ? 'SYNCING...' : 'PUBLISH CHANGES'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <ShieldCheck size={16} color="rgba(255,255,255,0.2)" />
                    <Text style={styles.footerText}>INTIMA SECURITY AUDIT VERIFIED</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 40,
  },
  backText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#f43f5e',
    fontSize: 48,
    fontWeight: 'bold',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f43f5e',
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  emailText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  halfInput: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#f43f5e',
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 40,
    opacity: 0.3,
  },
  footerText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});
