import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  History, 
  Zap, 
  ShieldCheck 
} from 'lucide-react-native';
import { useAuth } from '../hooks/use-auth';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function WalletScreen({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();

  const creditPackages = [
    { id: "p1", amount: 100, price: "$9.99", bonus: "5%" },
    { id: "p2", amount: 500, price: "$44.99", bonus: "15%", popular: true },
    { id: "p3", amount: 2000, price: "$149.99", bonus: "30%" },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={onBack}>
                <Text style={styles.backText}>BACK</Text>
            </TouchableOpacity>
            <View style={styles.creditBadge}>
                <Zap size={14} color="#f43f5e" />
                <Text style={styles.creditText}>{user?.credits}</Text>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.titleSection}>
              <Text style={styles.title}>
                  Digital <Text style={styles.primaryText}>Wallet</Text>
              </Text>
              <Text style={styles.tagline}>MANAGE YOUR CREDITS & WITHDRAWALS</Text>
          </View>

          {/* Balance Card */}
          <LinearGradient
            colors={['rgba(244, 63, 94, 0.2)', 'rgba(0,0,0,0)']}
            style={styles.balanceCard}
          >
              <View>
                <Text style={styles.cardLabel}>TOTAL ASSETS</Text>
                <Text style={styles.balanceValue}>
                    $ {(((user?.credits || 0) / 10).toFixed(2))} <Text style={styles.estText}>EST.</Text>
                </Text>
                <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.topUpBtn}>
                        <CreditCard size={14} color="black" />
                        <Text style={styles.topUpText}>TOP UP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.withdrawBtn}>
                        <ArrowUpRight size={14} color="white" />
                        <Text style={styles.withdrawText}>WITHDRAW</Text>
                    </TouchableOpacity>
                </View>
              </View>
              <ShieldCheck size={100} color="#f43f5e" style={styles.cardIcon} />
          </LinearGradient>

          {/* Credit Packages */}
          <Text style={styles.sectionTitle}>Purchase Credits</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.packageScroll}>
              {creditPackages.map((pkg) => (
                  <View key={pkg.id} style={[styles.packageCard, pkg.popular && styles.popularCard]}>
                      {pkg.popular && (
                          <View style={styles.popularBadge}>
                              <Text style={styles.popularText}>POPULAR</Text>
                          </View>
                      )}
                      <Text style={styles.pkgAmount}>{pkg.amount}</Text>
                      <Text style={styles.pkgLabel}>CREDITS</Text>
                      <Text style={styles.pkgPrice}>{pkg.price}</Text>
                      <TouchableOpacity style={[styles.buyBtn, pkg.popular && styles.buyBtnPopular]}>
                          <Text style={styles.buyText}>PURCHASE</Text>
                      </TouchableOpacity>
                  </View>
              ))}
          </ScrollView>

          {/* History */}
          <View style={styles.historyHeader}>
              <History size={18} color="#f43f5e" />
              <Text style={styles.historyTitle}>Transaction History</Text>
          </View>
          <View style={styles.historyList}>
              {[
                  { id: 1, type: "GIFT SENT", amount: "-100", label: "Eternal Heart", date: "Today" },
                  { id: 2, type: "RECHARGE", amount: "+500", label: "Credit Pack B", date: "Yesterday" }
              ].map((tx) => (
                  <View key={tx.id} style={styles.historyItem}>
                      <View>
                          <Text style={styles.txType}>{tx.type}</Text>
                          <Text style={styles.txLabel}>{tx.label}</Text>
                      </View>
                      <View style={styles.txRight}>
                          <Text style={[styles.txAmount, tx.amount.startsWith('+') ? styles.plus : styles.minus]}>
                              {tx.amount}
                          </Text>
                          <Text style={styles.txDate}>{tx.date}</Text>
                      </View>
                  </View>
              ))}
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
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  creditText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  balanceCard: {
    marginHorizontal: 24,
    padding: 32,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 40,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -2,
  },
  estText: {
    fontSize: 14,
    color: '#f43f5e',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  topUpBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topUpText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  withdrawBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  withdrawText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardIcon: {
    position: 'absolute',
    right: -20,
    opacity: 0.1,
  },
  sectionTitle: {
    paddingHorizontal: 24,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  packageScroll: {
    paddingLeft: 24,
    marginBottom: 40,
  },
  packageCard: {
    width: 200,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 32,
    padding: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  popularCard: {
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  popularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#f43f5e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  pkgAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  pkgLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: 20,
  },
  pkgPrice: {
    fontSize: 20,
    color: '#f43f5e',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  buyBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyBtnPopular: {
    backgroundColor: '#f43f5e',
  },
  buyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  historyHeader: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  historyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  historyList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  txType: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  txLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  plus: {
    color: '#10b981',
  },
  minus: {
    color: '#f43f5e',
  },
  txDate: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    marginTop: 4,
  }
});
