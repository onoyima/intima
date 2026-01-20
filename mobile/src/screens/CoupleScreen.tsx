import React, { useState, useRef, useEffect } from 'react';
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
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Send, Heart, Sparkles, Shield, 
  Zap, MessageSquare, Gamepad2, Video, Phone, Info, BookOpen,
  Camera, Eye, Lock, ShieldCheck, AlertCircle, Plus, Trash2, CheckCircle2,
  Flame
} from 'lucide-react-native';
import api from '../lib/api';
import { useAuth } from '../hooks/use-auth';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type ViewState = 'chat' | 'games' | 'memories' | 'media' | 'live';

export default function CoupleScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");
  const [view, setView] = useState<ViewState>('chat');
  const scrollRef = useRef<ScrollView>(null);

  const { data: couples, isLoading: loadingCouples } = useQuery<any[]>({
    queryKey: ['/api/couples'],
    queryFn: async () => {
        const res = await api.get('/api/couples');
        return res.data;
    }
  });

  const activeCouple = couples?.[0];

  const { data: messages, isLoading: loadingMessages } = useQuery<any[]>({
    queryKey: [`/api/couples/${activeCouple?.id}/messages`],
    queryFn: async () => {
        const res = await api.get(`/api/couples/${activeCouple?.id}/messages`);
        return res.data;
    },
    enabled: !!activeCouple && view === 'chat',
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await api.post(`/api/couples/${activeCouple.id}/messages`, { content, type: 'text' });
      return res.data;
    },
    onSuccess: () => {
      setInputText("");
      queryClient.invalidateQueries({ queryKey: [`/api/couples/${activeCouple?.id}/messages`] });
    }
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMutation.mutate(inputText);
  };

  if (loadingCouples) return <View style={styles.center}><ActivityIndicator color="#f43f5e" /></View>;

  if (!activeCouple) {
      return (
          <View style={styles.center}>
              <Heart size={48} color="#f43f5e" />
              <Text style={styles.noCoupleTitle}>Not Paired Yet</Text>
              <Text style={styles.noCoupleSub}>Find your partner in the discovery section.</Text>
          </View>
      );
  }

  const partner = activeCouple.partner;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <View style={styles.partnerInfo}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{partner.firstName?.[0]}</Text>
                    <View style={styles.onlineDot} />
                </View>
                <View>
                    <Text style={styles.partnerName}>{partner.firstName}</Text>
                    <View style={styles.statusRow}>
                        <Shield size={10} color="#f43f5e" />
                        <Text style={styles.statusText}>SECURE BOND</Text>
                    </View>
                </View>
            </View>

            <View style={styles.viewTabs}>
                {[
                  { id: 'chat', icon: MessageSquare },
                  { id: 'games', icon: Gamepad2 },
                  { id: 'memories', icon: BookOpen },
                  { id: 'media', icon: Shield },
                  { id: 'live', icon: Video },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => setView(t.id as any)}
                    style={[styles.tabBtn, view === t.id && styles.activeTabBtn]}
                  >
                    <t.icon size={16} color={view === t.id ? "white" : "rgba(255,255,255,0.3)"} />
                  </TouchableOpacity>
                ))}
            </View>
        </View>

        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View style={styles.mainArea}>
                {view === 'chat' && (
                    <ScrollView 
                        ref={scrollRef}
                        style={styles.chatScroll}
                        contentContainerStyle={styles.chatContent}
                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages?.map((msg, idx) => {
                            const isMe = msg.senderId === user?.id;
                            return (
                                <View key={idx} style={[styles.messageWrapper, isMe ? styles.myMessage : styles.theirMessage]}>
                                    <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                                        <Text style={styles.messageText}>{msg.content}</Text>
                                        <Text style={styles.timeText}>
                                            {(() => {
                                                if (!msg.createdAt) return '--:--';
                                                const d = new Date(msg.createdAt);
                                                return isNaN(d.getTime()) ? '--:--' : format(d, "HH:mm");
                                            })()}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                )}
                {view === 'games' && <GamesModule coupleId={activeCouple.id} />}
                {view === 'memories' && <MemoriesModule coupleId={activeCouple.id} />}
                {view === 'media' && <MediaModule coupleId={activeCouple.id} partner={partner} />}
                {view === 'live' && <LiveModule coupleId={activeCouple.id} partner={partner} />}
            </View>

            {view === 'chat' && (
                <View style={styles.footer}>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.quickBtn} onPress={() => sendMutation.mutate("Tease me...")}>
                            <Text style={styles.quickText}>AI TEASE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickBtn} onPress={() => sendMutation.mutate("I'm ready for a game.")}>
                            <Text style={styles.quickText}>REQUEST GAME</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputArea}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Phone size={20} color="rgba(255,255,255,0.4)" />
                        </TouchableOpacity>
                        <TextInput 
                            style={styles.input}
                            placeholder="Send a whisper..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={inputText}
                            onChangeText={setInputText}
                        />
                        <TouchableOpacity 
                            style={[styles.sendBtn, !inputText.trim() && styles.disabledSend]} 
                            onPress={handleSend}
                            disabled={!inputText.trim()}
                        >
                            <Send size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// Sub-Modules Implementation

function GamesModule({ coupleId }: { coupleId: number }) {
    const queryClient = useQueryClient();
    const games = [
        { id: 'truth', name: 'Intimate Truths', icon: Heart, color: '#f43f5e', desc: 'Discover hidden desires through AI-guided questions.' },
        { id: 'dares', name: 'Playful Dares', icon: Flame, color: '#fbbf24', desc: 'A collection of playful challenges to spark excitement.' },
        { id: 'fantasy', name: 'Fantasy Builder', icon: Sparkles, color: '#c084fc', desc: 'Co-create a personalized intimate scenario.' }
    ];

    const startMutation = useMutation({
        mutationFn: async (gameType: string) => {
            const res = await api.post('/api/games/start', { coupleId, gameType, intensity: 5 });
            return res.data;
        },
        onSuccess: (data) => {
            Alert.alert("Game Started", `The ${data.gameType} session is now active in your shared vault.`);
        }
    });

    return (
        <ScrollView contentContainerStyle={styles.modulePadding}>
            <Text style={styles.moduleTitle}>Intimacy <Text style={styles.primaryText}>Games</Text></Text>
            <Text style={styles.moduleSub}>CHALLENGE YOUR BOND</Text>
            {games.map(game => (
                <TouchableOpacity 
                    key={game.id} 
                    style={styles.gameCard}
                    onPress={() => startMutation.mutate(game.id)}
                >
                    <View style={[styles.gameIcon, { backgroundColor: game.color + '20' }]}>
                        <game.icon size={24} color={game.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.gameName}>{game.name}</Text>
                        <Text style={styles.gameDesc}>{game.desc}</Text>
                    </View>
                    <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

function MemoriesModule({ coupleId }: { coupleId: number }) {
    const { data: memories, isLoading } = useQuery<any[]>({
        queryKey: [`/api/couples/${coupleId}/memories`],
        queryFn: async () => {
            const res = await api.get(`/api/couples/${coupleId}/memories`);
            return res.data;
        }
    });

    return (
        <ScrollView contentContainerStyle={styles.modulePadding}>
            <Text style={styles.moduleTitle}>Memory <Text style={styles.primaryText}>Vault</Text></Text>
            <Text style={styles.moduleSub}>PRESERVING YOUR JOURNEY</Text>
            
            <View style={styles.memoriesGrid}>
                {memories?.map(memory => (
                    <TouchableOpacity key={memory.id} style={styles.memoryItem}>
                        {memory.imageUrl ? (
                            <Image source={{ uri: memory.imageUrl }} style={styles.memoryImg} />
                        ) : (
                            <View style={styles.memoryPlaceholder}>
                                <BookOpen size={24} color="rgba(255,255,255,0.2)" />
                            </View>
                        )}
                        <Text style={styles.memoryTitleText}>{memory.title}</Text>
                        <Text style={styles.memoryDate}>
                            {memory.createdAt ? new Date(memory.createdAt).toLocaleDateString() : 'RECENT'}
                        </Text>
                    </TouchableOpacity>
                ))}
                
                <TouchableOpacity style={styles.addMemoryBtn}>
                    <Plus size={24} color="rgba(255,255,255,0.2)" />
                    <Text style={styles.addMemoryText}>Add Memory</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function MediaModule({ coupleId, partner }: { coupleId: number, partner: any }) {
    const queryClient = useQueryClient();
    const { data: consent, isLoading: loadingConsent } = useQuery<any>({
        queryKey: [`/api/couples/${coupleId}/consent/explicit_media`],
        queryFn: async () => {
            const res = await api.get(`/api/couples/${coupleId}/consent/explicit_media`);
            return res.data;
        }
    });

    const grantMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/api/ai/consent/log', { action: "explicit_media", partnerId: partner.id });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/couples/${coupleId}/consent/explicit_media`] });
        }
    });

    if (loadingConsent) return <ActivityIndicator color="#f43f5e" style={{ marginTop: 100 }} />;

    if (!consent?.isGranted) {
        return (
            <View style={styles.consentGate}>
                <View style={styles.lockSphere}>
                    <Lock size={40} color="#f43f5e" />
                </View>
                <Text style={styles.gateTitle}>Explicit Media Vault</Text>
                <Text style={styles.gateDesc}>
                    Section H Security: This vault contains sensitive content. Both partners must explicitly grant consent.
                </Text>
                <TouchableOpacity style={styles.gateBtn} onPress={() => grantMutation.mutate()}>
                    <ShieldCheck size={20} color="white" />
                    <Text style={styles.gateBtnText}>Authorize Access</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.modulePadding}>
            <View style={styles.mediaHeader}>
                <View>
                    <Text style={styles.moduleTitle}>Encrypted <Text style={styles.primaryText}>Media</Text></Text>
                    <Text style={styles.moduleSub}>SECTION H: PRIVATE GALLERY</Text>
                </View>
                <TouchableOpacity style={styles.cameraCircle}>
                    <Camera size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.mediaGrid}>
                {[1,2,3].map(i => (
                    <TouchableOpacity key={i} style={styles.mediaCard}>
                        <View style={styles.mediaOverlay}>
                            <Eye size={24} color="rgba(255,255,255,0.2)" />
                        </View>
                        <View style={styles.e2eeBadge}>
                            <Text style={styles.e2eeText}>E2EE</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.mediaAddBtn}>
                    <Plus size={24} color="rgba(255,255,255,0.1)" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.privacyNote}>
                <AlertCircle size={14} color="#fbbf24" />
                <Text style={styles.privacyNoteText}>SCREENSHOTS ARE BLOCKED. ATTEMPTING TO CAPTURE WILL BE LOGGED.</Text>
            </View>
        </ScrollView>
    );
}

function LiveModule({ coupleId, partner }: { coupleId: number, partner: any }) {
    const [isCalling, setIsCalling] = useState(false);
    const queryClient = useQueryClient();
    
    const { data: consent } = useQuery<any>({
        queryKey: [`/api/couples/${coupleId}/consent/live_video`],
        queryFn: async () => {
            const res = await api.get(`/api/couples/${coupleId}/consent/live_video`);
            return res.data;
        }
    });

    const grantMutation = useMutation({
        mutationFn: async () => {
            const res = await api.post('/api/ai/consent/log', { action: "live_video", partnerId: partner.id });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/couples/${coupleId}/consent/live_video`] });
        }
    });

    if (isCalling) {
        return (
            <View style={styles.callScreen}>
                <LinearGradient colors={['rgba(244, 63, 94, 0.4)', 'black']} style={styles.callGlow} />
                <View style={styles.callContent}>
                    <View style={styles.callAvatarCont}>
                        <View style={styles.callAvatar}>
                            <Text style={styles.callAvatarText}>{partner.firstName?.[0]}</Text>
                        </View>
                        <View style={styles.pingAnim} />
                    </View>
                    <Text style={styles.callName}>{partner.firstName}</Text>
                    <Text style={styles.callStatus}>SECURE P2P CONNECTION...</Text>
                    
                    <View style={styles.callActions}>
                        <TouchableOpacity style={styles.endCallBtn} onPress={() => setIsCalling(false)}>
                            <Phone size={32} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.giftBtn}>
                            <Zap size={24} color="#fbbf24" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.liveGate}>
            <View style={[styles.avatarLarge, consent?.isGranted && { borderColor: '#f43f5e' }]}>
                <Text style={styles.avatarLargeText}>{partner.firstName?.[0]}</Text>
                <View style={[styles.gateLockIcon, { backgroundColor: consent?.isGranted ? '#10b981' : '#fbbf24' }]}>
                    {consent?.isGranted ? <Shield size={16} color="white" /> : <Lock size={16} color="white" />}
                </View>
            </View>
            
            <Text style={styles.gateTitle}>{consent?.isGranted ? 'Link Established' : 'Secure Consent Gate'}</Text>
            <Text style={styles.gateDesc}>
                {consent?.isGranted 
                    ? "Mutual authorization complete. Initialize your encrypted session below." 
                    : "Section M Security: Both partners must grant consent to enable live interaction."}
            </Text>

            {consent?.isGranted ? (
                <View style={styles.liveActionRow}>
                    <TouchableOpacity style={styles.videoLinkBtn} onPress={() => setIsCalling(true)}>
                        <Video size={24} color="white" />
                        <Text style={styles.liveBtnText}>Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.voiceLinkBtn} onPress={() => setIsCalling(true)}>
                        <Phone size={24} color="white" />
                        <Text style={styles.liveBtnText}>Voice</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.authorizeLiveBtn} onPress={() => grantMutation.mutate()}>
                    <CheckCircle2 size={18} color="white" />
                    <Text style={styles.authorizeLiveText}>Grant Live Access</Text>
                </TouchableOpacity>
            )}
            
            <View style={styles.p2pBadge}>
                <AlertCircle size={10} color="rgba(255,255,255,0.4)" />
                <Text style={styles.p2pText}>PEER-TO-PEER ENCRYPTION ACTIVE</Text>
            </View>
        </View>
    );
}

function ChevronRight({ size, color }: { size: number, color: string }) {
    return (
        <View style={{ transform: [{ rotate: '0deg' }] }}>
            <Text style={{ color, fontSize: size }}>→</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#f43f5e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#000',
  },
  partnerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusText: {
    color: '#f43f5e',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  viewTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 4,
  },
  tabBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  activeTabBtn: {
    backgroundColor: '#f43f5e',
  },
  mainArea: {
    flex: 1,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageWrapper: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  theirMessage: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 24,
  },
  myBubble: {
    backgroundColor: '#f43f5e',
    borderTopRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  timeText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 8,
    marginTop: 4,
    alignSelf: 'flex-end',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  quickBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  quickText: {
    color: '#f43f5e',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 30,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSend: {
    opacity: 0.5,
  },
  noCoupleTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  noCoupleSub: {
    color: 'rgba(255,255,255,0.4)',
    marginTop: 8,
  },
  modulePadding: {
    padding: 24,
    paddingBottom: 60,
  },
  moduleTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -1,
  },
  primaryText: {
    color: '#f43f5e',
    fontStyle: 'italic',
  },
  moduleSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 32,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  gameIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameDesc: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 4,
  },
  memoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  memoryItem: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  memoryImg: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  memoryPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  memoryTitleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  memoryDate: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 8,
    marginTop: 2,
  },
  addMemoryBtn: {
    width: (width - 60) / 2,
    aspectRatio: 1.2,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMemoryText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 8,
  },
  consentGate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  lockSphere: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    marginBottom: 32,
  },
  gateTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  gateDesc: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  gateBtn: {
    backgroundColor: '#f43f5e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 12,
    shadowColor: '#f43f5e',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mediaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  cameraCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f43f5e',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaCard: {
    width: (width - 60) / 2,
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  e2eeBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  e2eeText: {
    color: '#f43f5e',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  mediaAddBtn: {
    width: (width - 60) / 2,
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyNote: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.05)',
    borderRadius: 16,
    gap: 12,
    marginTop: 40,
    alignItems: 'center',
  },
  privacyNoteText: {
    flex: 1,
    color: 'rgba(251, 191, 36, 0.5)',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 14,
  },
  liveGate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  avatarLarge: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  avatarLargeText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  gateLockIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveActionRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  videoLinkBtn: {
    flex: 1,
    height: 64,
    backgroundColor: '#f43f5e',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  voiceLinkBtn: {
    flex: 1,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  liveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorizeLiveBtn: {
    width: '100%',
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  authorizeLiveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  p2pBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 40,
    opacity: 0.5,
  },
  p2pText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  callScreen: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  callContent: {
    alignItems: 'center',
    gap: 24,
  },
  callAvatarCont: {
    position: 'relative',
    marginBottom: 20,
  },
  callAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    zIndex: 10,
  },
  callAvatarText: {
    color: '#fff',
    fontSize: 56,
    fontWeight: 'bold',
  },
  pingAnim: {
    position: 'absolute',
    inset: -20,
    borderRadius: 100,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    zIndex: 0,
  },
  callName: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  callStatus: {
    color: '#f43f5e',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 4,
  },
  callActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 60,
    marginTop: 60,
  },
  endCallBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  giftBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
