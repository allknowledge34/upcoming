import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { AntDesign, Feather } from "@expo/vector-icons";

import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/workoutDetail.styles";
import COLORS from "../../constants/colors";

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams();
  const { token, user } = useAuthStore();

  const userId = user?._id || user?.id;

  const [book, setBook] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= LIKE ANIMATION ================= */
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* ================= FETCH DATA ================= */
  const fetchBook = async () => {
    try {
      const res = await fetch(`${API_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setBook({
        ...data,
        likes: data.likes || [],
        comments: data.comments || [],
        isLiked: data.likes?.some(
          (uid) => uid.toString() === userId
        ),
      });
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  /* ================= LIKE ================= */
  const handleLike = async () => {
    if (!userId) return;

    animateLike();

    try {
      await fetch(`${API_URL}/books/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setBook((prev) => {
        const liked = prev.likes.some(
          (uid) => uid.toString() === userId
        );

        return {
          ...prev,
          isLiked: !liked,
          likes: liked
            ? prev.likes.filter(
                (uid) => uid.toString() !== userId
              )
            : [...prev.likes, userId],
        };
      });
    } catch (err) {
      console.log("Like error", err);
    }
  };

  /* ================= COMMENT ================= */
  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await fetch(`${API_URL}/books/${id}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      });

      const newComment = await res.json();

      setBook((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }));

      setComment("");
    } catch (err) {
      console.log("Comment error", err);
    }
  };

  if (loading || !book) {
    return (
      <Text style={{ marginTop: 100, textAlign: "center" }}>
        Loading...
      </Text>
    );
  }

  return (
  <View style={{ flex: 1, backgroundColor: "#fff" }}>
    <FlatList
      data={book.comments}
      keyExtractor={(item) => item._id}
      contentInsetAdjustmentBehavior="never"
      contentContainerStyle={{ paddingBottom: 90 }}
      ListHeaderComponent={
        <View>
          {/* IMAGE */}
          <View style={{ width: "100%", height: 260 }}>
            <Image
              source={{ uri: book.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={300}
            />
          </View>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.caption}>{book.caption}</Text>
          </View>

          {/* ACTION ROW */}
          <View style={styles.actionRow}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity onPress={handleLike}>
                {book.isLiked ? (
                  <AntDesign name="heart" size={26} color="#E0245E" />
                ) : (
                  <Feather name="heart" size={26} color="#657786" />
                )}
              </TouchableOpacity>
            </Animated.View>

            <Text style={styles.likeText}>
              {book.likes.length} likes
            </Text>
          </View>

          <Text style={styles.commentTitle}>Comments</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.commentItem}>
          <Image
            source={{ uri: item.user.profileImage }}
            style={styles.commentAvatar}
            contentFit="cover"
          />
          <View style={styles.commentBody}>
            <Text style={styles.commentUser}>
              {item.user.username}
            </Text>
            <Text style={styles.commentText}>
              {item.content}
            </Text>
          </View>
        </View>
      )}
    />

    {/* COMMENT INPUT */}
    <View style={styles.inputRow}>
      <TextInput
        placeholder="Add a comment..."
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleAddComment}>
        <Feather name="send" size={22} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  </View>
);

}
