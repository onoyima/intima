import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import { 
  Heart, Sparkles, MessageSquare, ShieldAlert, 
  HelpCircle, BrainCircuit, RefreshCw
} from 'lucide-react-native';
import api from '../lib/api';

export default function ResolverScreen() {
  const [issue, setIssue] = useState("");
  const [advice, setAdvice] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post("/api/ai/solve", data);
      return res.data;
    },
    onSuccess: (data) => {
      setAdvice(data);
    }
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Issue <Text style={styles.primaryText}>Solver</Text>
                    </Text>
                    <Text style={styles.tagline}>SECTION J: MARITAL & RELATIONSHIP SUPPORT</Text>
                </View>

                {!advice ? (
                    <View style={styles.inputSection}>
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <BrainCircuit size={24} color="#f43f5e" />
                                <Text style={styles.cardTitle}>Share your challenge</Text>
                            </View>
                            
                            <TextInput 
                                style={styles.textArea}
                                value={issue}
                                onChangeText={setIssue}
                                placeholder="Describe what's on your mind... (e.g., 'We've been feeling distant lately')"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                multiline
                            />

                            <TouchableOpacity 
                                style={[styles.submitBtn, (!issue.trim() || mutation.isPending) && styles.disabledBtn]}
                                onPress={() => mutation.mutate({ issue })}
                                disabled={!issue.trim() || mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <>
                                        <ActivityIndicator color="white" />
                                        <Text style={styles.submitText}>ANALYZING DYNAMICS...</Text>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} color="white" />
                                        <Text style={styles.submitText}>GENERATE AI INSIGHT</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoBox}>
                                <ShieldAlert size={16} color="#fbbf24" />
                                <Text style={styles.infoText}>Uses Section D preferences for tailored advice.</Text>
                            </View>
                            <View style={styles.infoBox}>
                                <HelpCircle size={16} color="#60a5fa" />
                                <Text style={styles.infoText}>Safe, non-judgmental space. All inputs are encrypted.</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.resultSection}>
                        <View style={styles.card}>
                            <View style={styles.resultBadge}>
                                <Text style={styles.resultBadgeText}>AI PERSPECTIVE PLAN</Text>
                            </View>

                            <Text style={styles.resultTitle}>Intimacy Logic: Path to Resolution</Text>
                            <Text style={styles.resultAdvice}>"{advice.advice}"</Text>

                            <View style={styles.metaRow}>
                                <View style={styles.metaBox}>
                                    <Text style={styles.metaLabel}>CONTEXT MODE</Text>
                                    <Text style={styles.metaValue}>{advice.style}</Text>
                                </View>
                                <View style={styles.metaBox}>
                                    <Text style={styles.metaLabel}>INTENSITY SYNC</Text>
                                    <Text style={styles.metaValue}>LEVEL {advice.intensity}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setAdvice(null)}>
                                <Text style={styles.secondaryBtnText}>NEW REQUEST</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.primaryBtn}>
                                <Heart size={18} color="white" />
                                <Text style={styles.primaryBtnText}>APPLY TO VAULT</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
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
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    marginBottom: 32,
    alignItems: 'center',
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
  inputSection: {
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textArea: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    minHeight: 200,
    padding: 20,
    color: '#fff',
    fontSize: 18,
    textAlignVertical: 'top',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  submitBtn: {
    backgroundColor: '#f43f5e',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoRow: {
    gap: 12,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoText: {
    flex: 1,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    lineHeight: 18,
  },
  resultSection: {
    paddingHorizontal: 24,
  },
  resultBadge: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.2)',
    marginBottom: 24,
  },
  resultBadgeText: {
    color: '#f43f5e',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  resultAdvice: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    lineHeight: 28,
    fontStyle: 'italic',
    marginBottom: 32,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  metaBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 16,
    borderRadius: 16,
  },
  metaLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  metaValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  secondaryBtnText: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 'bold',
    fontSize: 14,
  },
  primaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#f43f5e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
