import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { io } from 'socket.io-client';


const SERVER_URL = (process.env.EXPO_PUBLIC_SERVER_URL ?? 'https://variably-chair-ethics.ngrok-free.dev').replace(/\/$/, '');
const NEW_LEAD_EVENT = 'new_lead';
console.log('SERVER_URL =', SERVER_URL);

const colors = {
  background: '#F1F4F6',
  card: '#FFFFFF',
  ink: '#17232D',
  muted: '#5D6C78',
  live: '#0E7C66',
  border: '#DDE3E8',
  warn: '#B45309',
};

// 3) Adjust these helpers if your backend names things differently
const getId = (lead) => String(lead.id ?? lead.leadgenId ?? lead.leadgen_id ?? lead._id);

function getDisplay(lead) {
  const f = lead.fields ?? {};
  const name = f.full_name || [f.first_name, f.last_name].filter(Boolean).join(' ') || 'Unnamed lead';
  const lines = [f.email, f.phone_number || f.phone].filter(Boolean);
  return { name, lines };
}

function formatTime(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
}

function LeadCard({ lead }) {
  const { name, lines } = getDisplay(lead);
  return (
    <View style={[styles.card, lead.isLive && styles.cardLive]}>
      <Text style={styles.name}>{name}</Text>
      {lines.map((line) => (
        <Text key={line} style={styles.detail}>
          {line}
        </Text>
      ))}
      {lead.detailsFetched === false && (
        <Text style={styles.warning}>Form answers unavailable. Only the lead ID was received.</Text>
      )}
      <Text style={styles.time}>{formatTime(lead.createdAt ?? lead.created_time)}</Text>
    </View>
  );
}

export default function App() {
  const [leads, setLeads] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Loads the saved leads from your backend (GET /leads must return an array)
  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/leads`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setLeads(data);
    } catch (err) {
      console.warn('Could not load leads:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();

    const socket = io(SERVER_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      setConnected(true);
      fetchLeads(); // catch up on anything missed while disconnected
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (err) => console.log('Socket error:', err.message));

    socket.on(NEW_LEAD_EVENT, (lead) => {
      setLeads((prev) =>
        prev.some((l) => getId(l) === getId(lead)) ? prev : [{ ...lead, isLive: true }, ...prev]
      );
    });

    return () => socket.disconnect(); // avoids duplicate connections
  }, [fetchLeads]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeads();
    setRefreshing(false);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Leads</Text>
        <View style={styles.status}>
          <View style={[styles.dot, { backgroundColor: connected ? colors.live : colors.muted }]} />
          <Text style={styles.statusText}>{connected ? 'Listening for new leads' : 'Reconnecting'}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.live} />
      ) : (
        <FlatList
          data={leads}
          keyExtractor={getId}
          renderItem={({ item }) => <LeadCard lead={item} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No leads yet. New form submissions will appear here as they arrive.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  title: { fontSize: 30, fontWeight: '700', color: colors.ink },
  status: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 14, color: colors.muted },
  loader: { marginTop: 40 },
  list: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardLive: { borderLeftWidth: 4, borderLeftColor: colors.live },
  name: { fontSize: 18, fontWeight: '600', color: colors.ink },
  detail: { fontSize: 15, color: colors.ink, marginTop: 4 },
  warning: { fontSize: 13, color: colors.warn, marginTop: 8 },
  time: { fontSize: 13, color: colors.muted, marginTop: 10 },
  empty: { fontSize: 15, color: colors.muted, textAlign: 'center', marginTop: 40, lineHeight: 22 },
});