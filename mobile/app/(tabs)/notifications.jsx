import {
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";

import NotificationCard from "../../components/NotificationCard";
import NoNotificationsFound from "../../components/NoNotificationsFound";
import styles from "../../assets/styles/notifications.styles";

export default function Notifications() {
  const { token } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (e) {
      console.log("Notification error", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const remove = async (id) => {
    await fetch(`${API_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((p) => p.filter((n) => n._id !== id));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" />
      ) : notifications.length === 0 ? (
        <NoNotificationsFound />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={load} />
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {notifications.map((n) => (
            <NotificationCard
              key={n._id}
              notification={n}
              onDelete={remove}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
