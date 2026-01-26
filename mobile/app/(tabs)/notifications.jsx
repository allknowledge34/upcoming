import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";

import NotificationCard from "../../components/NotificationCard";
import NoNotificationsFound from "../../components/NoNotificationsFound";
import styles from "../../assets/styles/notifications.styles";
import COLORS from "../../constants/colors";

export default function Notifications() {
  const { token } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const controllerRef = useRef(null);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const load = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(false);

      controllerRef.current = new AbortController();

      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controllerRef.current.signal,
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      setNotifications(data || []);
    } catch (e) {
      if (e.name !== "AbortError") setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load(true);
  }, []);

  const remove = (id) => {
    Alert.alert(
      "Delete notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const backup = notifications;

            setNotifications((prev) =>
              prev.filter((n) => n._id !== id)
            );

            try {
              await fetch(`${API_URL}/notifications/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
            } catch {
              setNotifications(backup);
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Failed to load notifications</Text>
        <TouchableOpacity onPress={load}>
          <Text style={{ color: COLORS.primary, marginTop: 10 }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={[styles.screen]}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {notifications.length === 0 ? (
        <NoNotificationsFound onReload={load} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(i, index) => i._id || index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onDelete={remove}
            />
          )}
          initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews
        />
      )}
    </View>
  );
}
