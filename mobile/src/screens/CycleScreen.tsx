import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Droplet, 
  Sparkles, 
  Baby, 
  ShieldCheck,
  AlertCircle,
  Zap,
  Moon,
  Info
} from 'lucide-react-native';
import api from '../lib/api';
import { format, addDays, differenceInDays, isSameDay } from 'date-fns';

const { width } = Dimensions.get('window');

export default function CycleScreen() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: logs, isLoading } = useQuery<any[]>({
    queryKey: ["/api/cycle-logs"],
    queryFn: async () => {
        const res = await api.get('/api/cycle-logs');
        return res.data;
    }
  });

  const logMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/api/cycle/log', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cycle"] });
    }
  });

  const insights = useMemo(() => {
    if (!logs || logs.length === 0 || !logs[0].startDate) return null;
    
    const lastPeriod = new Date(logs[0].startDate);
    if (isNaN(lastPeriod.getTime())) return null;

    const cycleLength = 28;
    
    const nextPeriod = addDays(lastPeriod, cycleLength);
    const daysUntilNext = differenceInDays(nextPeriod, new Date());
    
    const ovulationDay = addDays(nextPeriod, -14);
    const isFertile = new Date() >= addDays(ovulationDay, -5) && new Date() <= addDays(ovulationDay, 1);

    return {
      daysUntilNext,
      ovulationDay,
      isFertile,
      lastPeriod,
      nextPeriod
    };
  }, [logs]);

  const handleLog = (symptom: string) => {
    logMutation.mutate({
      startDate: selectedDate,
      symptoms: [symptom],
      flowIntensity: "medium",
    });
  };

  if (isLoading) return <View style={styles.center}><ActivityIndicator color="#f43f5e" /></View>;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Reproductive <Text style={styles.primaryText}>Health</Text>
            </Text>
            <Text style={styles.tagline}>SMART CYCLE & FERTILITY LOGIC</Text>
          </View>

          {/* Rapid Insight Cards */}
          <View style={styles.insightRow}>
            <View style={[styles.card, styles.insightCard]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardLabel}>NEXT CYCLE IN</Text>
                    <Sparkles size={16} color="#f43f5e" />
                </View>
                <Text style={styles.bigNumber}>
                    {insights ? insights.daysUntilNext : '--'} <Text style={styles.unitText}>DAYS</Text>
                </Text>
                <Text style={styles.predictionText}>
                    Predicted for {(() => {
                        if (!insights?.nextPeriod) return '...';
                        const d = new Date(insights.nextPeriod);
                        return isNaN(d.getTime()) ? '...' : format(d, 'MMMM do');
                    })()}
                </Text>
            </View>

            <View style={[styles.card, styles.insightCard, insights?.isFertile && styles.fertileCard]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardLabel}>FERTILITY STATUS</Text>
                    <Baby size={16} color={insights?.isFertile ? "#f43f5e" : "rgba(255,255,255,0.2)"} />
                </View>
                <Text style={styles.statusHeader}>
                    {insights?.isFertile ? 'HIGH FERTILITY' : 'LOW RISK'}
                </Text>
                <Text style={[styles.predictionText, insights?.isFertile && { color: '#f43f5e' }]}>
                    {insights?.isFertile ? 'High chance of conception.' : 'Ideal for protected exploration.'}
                </Text>
            </View>
          </View>

          {/* Date Selector Placeholder (Simple version for mobile) */}
          <View style={styles.calendarSection}>
              <View style={[styles.card, styles.fullCard]}>
                 <View style={styles.fullCardHeader}>
                    <Info size={18} color="#f43f5e" />
                    <Text style={styles.fullCardTitle}>Biological Insights</Text>
                 </View>
                 <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>PEAK OVULATION</Text>
                        <Text style={styles.statValue}>
                            {(() => {
                                if (!insights?.ovulationDay) return '--';
                                const d = new Date(insights.ovulationDay);
                                return isNaN(d.getTime()) ? '--' : format(d, 'MMM d');
                            })()}
                        </Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>CYCLE REGULARITY</Text>
                        <Text style={styles.statValue}>STABLE (28D)</Text>
                    </View>
                 </View>
              </View>
          </View>

          {/* Symptoms Logging */}
          <View style={styles.loggingHeader}>
             <Text style={styles.sectionTitle}>Log Symptoms</Text>
          </View>
          <View style={styles.symptomsGrid}>
              {[
                { icon: Droplet, label: "Started Period", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
                { icon: Zap, label: "High Libido", color: "#facc15", bg: "rgba(250, 204, 21, 0.1)" },
                { icon: Moon, label: "Cramps", color: "#c084fc", bg: "rgba(192, 132, 252, 0.1)" },
                { icon: AlertCircle, label: "Mood Swings", color: "#60a5fa", bg: "rgba(96, 165, 250, 0.1)" },
              ].map((item) => (
                <TouchableOpacity 
                    key={item.label} 
                    style={[styles.symptomBtn, { backgroundColor: item.bg }]}
                    onPress={() => handleLog(item.label)}
                >
                    <item.icon size={24} color={item.color} />
                    <Text style={styles.symptomText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
          </View>

          {/* Education Center */}
          <View style={styles.eduSection}>
              <Text style={styles.eduTitle}>Biological Intelligence Center</Text>
              <Text style={styles.eduSubtitle}>SCIENTIFIC LOGIC & SAFE PRACTICES</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eduScroll}>
                  <View style={styles.eduCard}>
                      <ShieldCheck size={20} color="#4ade80" />
                      <Text style={styles.eduCardTitle}>Safe Day Forecasting</Text>
                      <Text style={styles.eduCardDesc}>
                        Our algorithm predicts the lowest risk windows for natural activity. High confidence safe window: Days 1-7.
                      </Text>
                  </View>
                  <View style={styles.eduCard}>
                      <Droplet size={20} color="#60a5fa" />
                      <Text style={styles.eduCardTitle}>Pregnancy Prevention</Text>
                      <Text style={styles.eduCardDesc}>
                        During High Fertility (Day 10-16), we recommend combined barrier methods for terminal safety.
                      </Text>
                  </View>
              </ScrollView>
          </View>

          <View style={styles.disclaimer}>
              <AlertCircle size={14} color="#f87171" style={{ marginTop: 2 }} />
              <Text style={styles.disclaimerText}>
                MEDICAL DISCLAIMER: INTIMA∞ provides educational logic only. Our tracking is not a substitute for clinical diagnostics.
              </Text>
          </View>

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    marginBottom: 32,
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
  insightRow: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 20,
  },
  insightCard: {
    flex: 1,
    height: 160,
    justifyContent: 'space-between',
  },
  fertileCard: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bigNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  unitText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  predictionText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
  },
  statusHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  calendarSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  fullCard: {
    width: '100%',
  },
  fullCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  fullCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loggingHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontStyle: 'italic',
  },
  symptomsGrid: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  symptomBtn: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  symptomText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eduSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  eduTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontStyle: 'italic',
  },
  eduSubtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: 20,
  },
  eduScroll: {
    flexDirection: 'row',
  },
  eduCard: {
    width: 280,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  eduCardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  eduCardDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  disclaimer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 20,
  },
  disclaimerText: {
    flex: 1,
    color: 'rgba(248, 113, 113, 0.4)',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    lineHeight: 14,
  }
});
