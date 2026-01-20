import React, { useState } from 'react';
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
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  Sparkles, 
  Globe,
  Heart,
  Image as ImageIcon
} from 'lucide-react-native';
import api from '../lib/api';
import { useAuth } from '../hooks/use-auth';

const { width, height } = Dimensions.get('window');

export default function CommunityScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'rooms' | 'feed'>('rooms');

  const { data: rooms, isLoading: loadingRooms } = useQuery<any[]>({
    queryKey: ["/api/community/rooms"],
    queryFn: async () => {
        const res = await api.get('/api/community/rooms');
        return res.data;
    }
  });

  const { data: chatMessages, isLoading: loadingMessages } = useQuery<any[]>({
    queryKey: [`/api/community/rooms/${selectedRoom?.id}/messages`],
    queryFn: async () => {
        const res = await api.get(`/api/community/rooms/${selectedRoom.id}/messages`);
        return res.data;
    },
    enabled: !!selectedRoom,
    refetchInterval: 3000,
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await api.post(`/api/community/rooms/${selectedRoom.id}/messages`, { content });
      return res.data;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: [`/api/community/rooms/${selectedRoom?.id}/messages`] });
    }
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate(message);
  };

  if (loadingRooms) {
    return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#f43f5e" />
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <View>
                    <Text style={styles.headerTitle}>
                        The <Text style={styles.primaryText}>Community</Text>
                    </Text>
                    <Text style={styles.headerTagline}>CONNECT AND SHARE INSIGHTS</Text>
                </View>
                {selectedRoom && (
                    <TouchableOpacity style={styles.backButton} onPress={() => setSelectedRoom(null)}>
                        <ArrowLeft size={16} color="rgba(255,255,255,0.4)" />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                )}
            </View>

            {!selectedRoom && (
                <View style={styles.tabBar}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'rooms' && styles.activeTab]} 
                        onPress={() => setActiveTab('rooms')}
                    >
                        <Text style={[styles.tabText, activeTab === 'rooms' && styles.activeTabText]}>DISCOVERY ROOMS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'feed' && styles.activeTab]} 
                        onPress={() => setActiveTab('feed')}
                    >
                        <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>SOCIAL FEED</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>

        {selectedRoom ? (
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.chatContainer}
            >
                <View style={styles.chatHeader}>
                    <View style={styles.roomIcon}>
                        <Globe size={24} color="#f43f5e" />
                    </View>
                    <View>
                        <Text style={styles.roomName}>{selectedRoom.name}</Text>
                        <View style={styles.liveIndicator}>
                            <Sparkles size={10} color="#f43f5e" />
                            <Text style={styles.liveText}>LIVE COMMUNITY CHAT</Text>
                        </View>
                    </View>
                </View>

                <ScrollView 
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContent}
                    ref={(ref) => ref?.scrollToEnd({ animated: true })}
                >
                    {chatMessages?.map((msg) => (
                        <View key={msg.id} style={styles.messageRow}>
                            <Text style={styles.messageAuthor}>{msg.user?.firstName?.toUpperCase()}</Text>
                            <View style={styles.messageBubble}>
                                <Text style={styles.messageText}>{msg.content}</Text>
                            </View>
                        </View>
                    ))}
                    {(!chatMessages || chatMessages.length === 0) && (
                        <View style={styles.emptyChat}>
                            <Text style={styles.emptyChatText}>No messages yet. Spark a conversation.</Text>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.inputArea}>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input}
                            placeholder="Type a public message..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={message}
                            onChangeText={setMessage}
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                            <Send size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        ) : activeTab === 'rooms' ? (
            <ScrollView contentContainerStyle={styles.roomsList} showsVerticalScrollIndicator={false}>
                {rooms?.map((room) => (
                    <TouchableOpacity 
                        key={room.id} 
                        style={styles.roomCard}
                        onPress={() => setSelectedRoom(room)}
                    >
                        <Globe size={32} color="#f43f5e" />
                        <Text style={styles.roomCardName}>{room.name}</Text>
                        <Text style={styles.roomCardDesc}>{room.description}</Text>
                        <View style={styles.roomBadge}>
                            <Users size={12} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.roomBadgeText}>ACTIVE NOW</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        ) : (
            <SocialFeed />
        )}
      </SafeAreaView>
    </View>
  );
}

function SocialFeed() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [newPost, setNewPost] = useState("");
    const [expandedPost, setExpandedPost] = useState<number | null>(null);

    const { data: posts, isLoading } = useQuery<any[]>({
        queryKey: ["/api/community/posts"],
        queryFn: async () => {
            const res = await api.get('/api/community/posts');
            return res.data;
        }
    });

    const createPostMutation = useMutation({
        mutationFn: async (content: string) => {
            const res = await api.post('/api/community/posts', { content });
            return res.data;
        },
        onSuccess: () => {
            setNewPost("");
            queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
        }
    });

    const likeMutation = useMutation({
        mutationFn: async (postId: number) => {
            const res = await api.post(`/api/community/posts/${postId}/like`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
        }
    });

    if (isLoading) return <ActivityIndicator style={{ marginTop: 50 }} color="#f43f5e" />;

    return (
        <ScrollView contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
            {/* Create Post */}
            <View style={styles.createPostCard}>
                <View style={styles.createPostRow}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{user?.firstName?.[0]}</Text>
                    </View>
                    <TextInput 
                        style={styles.postInput}
                        placeholder="Share an intimacy insight..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        multiline
                        value={newPost}
                        onChangeText={setNewPost}
                    />
                </View>
                <View style={styles.postActions}>
                    <TouchableOpacity style={styles.postActionBtn}>
                        <ImageIcon size={18} color="rgba(255,255,255,0.4)" />
                        <Text style={styles.postActionText}>Add Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.postSubmitBtn, !newPost.trim() && styles.disabledBtn]}
                        onPress={() => createPostMutation.mutate(newPost)}
                        disabled={!newPost.trim() || createPostMutation.isPending}
                    >
                        <Send size={16} color="white" />
                        <Text style={styles.postSubmitText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Posts */}
            {posts?.map((post) => (
                <View key={post.id} style={styles.postCard}>
                    <View style={styles.postHeader}>
                        <View style={styles.postAvatar}>
                            <Text style={styles.avatarMiniText}>{post.user.firstName?.[0]}</Text>
                        </View>
                        <View>
                            <Text style={styles.postUserName}>{post.user.firstName} {post.user.lastName}</Text>
                            <Text style={styles.postDate}>
                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'RECENT'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.postBody}>{post.content}</Text>
                    {post.imageUrl && (
                        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                    )}
                    <View style={styles.postInteraction}>
                        <TouchableOpacity 
                            style={styles.interactionBtn}
                            onPress={() => likeMutation.mutate(post.id)}
                        >
                            <Heart size={20} color={post.likesCount > 0 ? "#f43f5e" : "rgba(255,255,255,0.4)"} fill={post.likesCount > 0 ? "#f43f5e" : "transparent"} />
                            <Text style={[styles.interactionText, post.likesCount > 0 && { color: "#f43f5e" }]}>{post.likesCount}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.interactionBtn}
                            onPress={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        >
                            <MessageSquare size={20} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.interactionText}>{post.commentsCount}</Text>
                        </TouchableOpacity>
                    </View>

                    {expandedPost === post.id && (
                        <PostComments postId={post.id} />
                    )}
                </View>
            ))}
        </ScrollView>
    )
}

function PostComments({ postId }: { postId: number }) {
    const queryClient = useQueryClient();
    const [comment, setComment] = useState("");

    const { data: comments, isLoading } = useQuery<any[]>({
        queryKey: [`/api/community/posts/${postId}/comments`],
        queryFn: async () => {
            const res = await api.get(`/api/community/posts/${postId}/comments`);
            return res.data;
        }
    });

    const commentMutation = useMutation({
        mutationFn: async (content: string) => {
            const res = await api.post(`/api/community/posts/${postId}/comments`, { content });
            return res.data;
        },
        onSuccess: () => {
            setComment("");
            queryClient.invalidateQueries({ queryKey: [`/api/community/posts/${postId}/comments`] });
            queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
        }
    });

    return (
        <View style={styles.commentsSection}>
            <View style={styles.commentInputRow}>
                <TextInput 
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={comment}
                    onChangeText={setComment}
                />
                <TouchableOpacity 
                    style={[styles.commentSendBtn, !comment.trim() && styles.disabledBtn]}
                    onPress={() => commentMutation.mutate(comment)}
                    disabled={!comment.trim() || commentMutation.isPending}
                >
                    <Send size={14} color="white" />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator size="small" color="#f43f5e" />
            ) : (
                <View style={styles.commentsList}>
                    {comments?.map((c) => (
                        <View key={c.id} style={styles.commentItem}>
                            <View style={styles.commentAvatar}>
                                <Text style={styles.commentAvatarText}>{c.user.firstName[0]}</Text>
                            </View>
                            <View style={styles.commentBody}>
                                <Text style={styles.commentAuthor}>{c.user.firstName}</Text>
                                <Text style={styles.commentText}>{c.content}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
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
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -1,
  },
  primaryText: {
    color: '#f43f5e',
    fontStyle: 'italic',
  },
  headerTagline: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#f43f5e',
  },
  tabText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  activeTabText: {
    color: '#fff',
  },
  roomsList: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  roomCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  roomCardName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 16,
    marginBottom: 8,
  },
  roomCardDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  roomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roomBadgeText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 16,
  },
  roomIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  liveText: {
    color: '#f43f5e',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageRow: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  messageAuthor: {
    color: '#f43f5e',
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    maxWidth: '85%',
  },
  messageText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
  },
  inputArea: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 14,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#f43f5e',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChat: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyChatText: {
    color: 'rgba(255,255,255,0.2)',
    fontStyle: 'italic',
    fontSize: 14,
  },
  feedContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  createPostCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 32,
    padding: 20,
    marginBottom: 24,
  },
  createPostRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
  avatarText: {
    color: '#f43f5e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    minHeight: 80,
    paddingTop: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  postActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postActionText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  postSubmitBtn: {
    backgroundColor: '#f43f5e',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  postSubmitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 32,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarMiniText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postUserName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  postDate: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  postBody: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
  },
  postInteraction: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 12,
  },
  interactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  interactionText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
    color: '#fff',
    fontSize: 12,
  },
  commentSendBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#f43f5e',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsList: {
    gap: 12,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 10,
    borderRadius: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    color: '#f43f5e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentBody: {
    flex: 1,
  },
  commentAuthor: {
    color: '#f43f5e',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    lineHeight: 18,
  }
});
