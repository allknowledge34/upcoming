import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Animated,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { Image } from "expo-image";
import { Feather, AntDesign } from "@expo/vector-icons";
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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [error, setError] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const controllerRef = useRef(null);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");

    return () => controllerRef.current?.abort();
  }, []);

  const fetchBook = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(false);

      controllerRef.current = new AbortController();

      const res = await fetch(`${API_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controllerRef.current.signal,
      });

      if (!res.ok) throw new Error("API Error");

      const data = await res.json();

      setBook({
        ...data,
        likes: data.likes || [],
        comments: data.comments || [],
        isLiked: data.likes?.includes(userId),
      });
    } catch (err) {
      if (err.name !== "AbortError") setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBook(true);
  }, []);

  const handleLike = async () => {
    if (likeLoading) return;

    setLikeLoading(true);

    setBook((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked
        ? prev.likes.filter((i) => i !== userId)
        : [...prev.likes, userId],
    }));

    try {
      await fetch(`${API_URL}/books/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      fetchBook();
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    const tempComment = {
      _id: Date.now().toString(),
      content: comment,
      user: user,
    };

    setBook((prev) => ({
      ...prev,
      comments: [...prev.comments, tempComment],
    }));

    setComment("");

    try {
      const res = await fetch(`${API_URL}/books/${id}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: tempComment.content }),
      });

      if (!res.ok) throw new Error();
      fetchBook();
    } catch {
      fetchBook();
    }
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
        <Text>Something went wrong</Text>
        <TouchableOpacity onPress={fetchBook}>
          <Text style={{ color: COLORS.primary, marginTop: 10 }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );

  const imageTranslate = scrollY.interpolate({
    inputRange: [-150, 0, 200],
    outputRange: [80, 0, -80],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Animated.FlatList
        data={book.comments}
        keyExtractor={(i, index) => i._id || index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT - 40,
          paddingBottom: 120,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Image
              source={{ uri: item.user?.profileImage }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.user}>{item.user?.username}</Text>
              <Text style={styles.comment}>{item.content}</Text>
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.contentBox}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.caption}>{book.caption}</Text>

            <View style={styles.likeRow}>
              <TouchableOpacity onPress={handleLike} disabled={likeLoading}>
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

        <View style={styles.topButtons}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.circleBtn} onPress={handleLike}>
            <AntDesign
              name={book.isLiked ? "heart" : "hearto"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

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
