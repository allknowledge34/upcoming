import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../assets/styles/notifications.styles";

export default function NoNotificationsFound() {
  return (
    <View style={styles.emptyWrap}>
      <Feather name="bell" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>No notifications yet</Text>
      <Text style={styles.emptyText}>
        Likes and comments will appear here
      </Text>
    </View>
  );
}
