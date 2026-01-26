import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../assets/styles/notifications.styles";

export default function NoNotificationsFound({ onReload }) {
  return (
    <View style={styles.emptyWrap}>
      <Feather name="bell" size={80} color="#ddd" />

      <Text style={styles.emptyTitle}>No notifications yet</Text>

      <Text style={styles.emptyText}>
        Likes and comments will appear here
      </Text>

      <TouchableOpacity
        style={styles.reloadBtn}
        onPress={onReload}
        activeOpacity={0.7}
      >
        <Text style={styles.reloadText}>Reload</Text>
      </TouchableOpacity>
    </View>
  );
}
