import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Animated,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { Feather, AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { API_URL } from "../../constants/api";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/workoutDetail.styles";
import COLORS from "../../constants/colors";

const HEADER_HEIGHT = Platform.OS === "ios" ? 420 : 380;


export default function WorkoutDetail() {
  const { id } = useLocalSearchParams();
  const { token, user } = useAuthStore();
  const userId = user?._id || user?.id;

  const [book, setBook] = useState(null);
  const [comment, setComment] = useState("");

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");
  }, []);

  const fetchBook = async () => {
    const res = await fetch(`${API_URL}/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    setBook({
      ...data,
      likes: data.likes || [],
      comments: data.comments || [],
      isLiked: data.likes?.includes(userId),
    });
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const handleLike = async () => {
    await fetch(`${API_URL}/books/${id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    setBook((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked
        ? prev.likes.filter((i) => i !== userId)
        : [...prev.likes, userId],
    }));
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

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
  };

  if (!book) return <Text style={{ marginTop: 100 }}>Loading...</Text>;

  const imageTranslate = scrollY.interpolate({
    inputRange: [-150, 0, 200],
    outputRange: [80, 0, -80],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.FlatList
        data={book.comments}
        keyExtractor={(i) => i._id}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT - 40, paddingBottom: 120 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.user}>{item.user.username}</Text>
              <Text style={styles.comment}>{item.content}</Text>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <>
            <View style={styles.contentBox}>
              <Text style={styles.title}>{book.title}</Text>

              {/* Long description auto fit */}
              <Text style={styles.caption}>
                {book.caption}
              </Text>

              <View style={styles.likeRow}>
                <TouchableOpacity onPress={handleLike}>
                  {book.isLiked ? (
                    <AntDesign name="heart" size={26} color="#ff2d55" />
                  ) : (
                    <Feather name="heart" size={26} color="#666" />
                  )}
                </TouchableOpacity>

                <Text style={{ color: "#777" }}>
                  {book.likes.length} likes
                </Text>
              </View>

              <Text style={styles.commentTitle}>Comments</Text>
            </View>
          </>
        }
      />

      {/* IMAGE HEADER */}
      <Animated.View
        style={[
          styles.headerImageBox,
          { transform: [{ translateY: imageTranslate }] },
        ]}
      >
        <Image source={{ uri: book.image }} style={styles.headerImage} />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.85)"]}
          style={styles.gradient}
        />

        {/* FLOATING BUTTONS */}
        <View style={styles.topButtons}>
          <TouchableOpacity style={styles.circleBtn}
          onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleBtn}>
            <AntDesign name="hearto" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* STICKY COMMENT INPUT */}
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