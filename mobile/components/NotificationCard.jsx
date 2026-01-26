import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import styles from "../assets/styles/notifications.styles";

export default function NotificationCard({ notification, onDelete }) {
  const user = notification.from || {};

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: user.profileImage || "https://i.pravatar.cc/100" }}
        style={styles.avatar}
      />

      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.username}>{user.username || "Someone"}</Text>{" "}
          {notification.type === "like" && "liked your workout"}
          {notification.type === "comment" && "commented on your workout"}
        </Text>

        <Text style={styles.time}>
          {new Date(notification.createdAt).toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity onPress={() => onDelete(notification._id)}>
        <Feather name="trash-2" size={18} color="#E0245E" />
      </TouchableOpacity>
    </View>
  );
}
