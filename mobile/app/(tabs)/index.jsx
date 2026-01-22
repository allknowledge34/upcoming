import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAuthStore } from "../../store/authStore";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import styles from "../../assets/styles/home.styles";
import { API_URL } from "../../constants/api";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { formatPublishDate } from "../../lib/utils";
import COLORS from "../../constants/colors";
import Loader from "../../components/Loader";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const { token, user } = useAuthStore();
  const router = useRouter();

  // ⭐ IMPORTANT: single source of truth
  const userId = user?._id || user?.id;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ================= FETCH BOOKS =================
  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(
        `${API_URL}/books?page=${pageNum}&limit=2`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      const merged =
        refresh || pageNum === 1
          ? data.books
          : [...books, ...data.books];

      // remove duplicates
      const uniqueBooks = Array.from(
        new Map(merged.map((b) => [b._id, b])).values()
      );

      // ⭐ VERY IMPORTANT MAPPING
      const mappedBooks = uniqueBooks.map((book) => ({
        ...book,
        likes: book.likes || [],
        comments: book.comments || [],
        isLiked: book.likes?.some(
          (uid) => uid.toString() === userId
        ),
      }));

      setBooks(mappedBooks);
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log("Error fetching books", error);
    } finally {
      if (refresh) {
        await sleep(600);
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ================= LIKE HANDLER =================
  const handleLike = async (bookId) => {
    if (!userId) return;

    try {
      await fetch(`${API_URL}/books/${bookId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // optimistic UI (correct)
      setBooks((prev) =>
        prev.map((book) => {
          if (book._id === bookId) {
            const liked = book.likes.some(
              (uid) => uid.toString() === userId
            );

            return {
              ...book,
              isLiked: !liked,
              likes: liked
                ? book.likes.filter(
                    (uid) => uid.toString() !== userId
                  )
                : [...book.likes, userId],
            };
          }
          return book;
        })
      );
    } catch (error) {
      console.log("Like error", error);
    }
  };

  // ================= LOAD MORE =================
  const handleLoadMore = () => {
    if (hasMore && !loading && !refreshing) {
      fetchBooks(page + 1);
    }
  };

  // ================= RENDER ITEM =================
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/workout/${item._id}`)}
    >
      <View style={styles.bookCard}>
        {/* Header */}
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: item.user.profileImage }}
              style={styles.avatar}
            />
            <View style={styles.userText}>
              <Text style={styles.username}>{item.user.username}</Text>
              <Text style={styles.date}>
                Workout added on {formatPublishDate(item.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Image */}
        <View style={styles.bookImageContainer}>
          <Image
            source={item.image}
            style={styles.bookImage}
            contentFit="cover"
          />
        </View>

        {/* Details */}
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>

          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            {/* Comment */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push(`/workout/${item._id}`)}
            >
              <Feather name="message-circle" size={18} color="#657786" />
              <Text style={styles.actionText}>
                {item.comments.length}
              </Text>
            </TouchableOpacity>

            {/* Repeat */}
            <TouchableOpacity style={styles.actionBtn}>
              <Feather name="repeat" size={18} color="#657786" />
              <Text style={styles.actionText}>0</Text>
            </TouchableOpacity>

            {/* Like */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleLike(item._id)}
            >
              {item.isLiked ? (
                <AntDesign name="heart" size={18} color="#E0245E" />
              ) : (
                <Feather name="heart" size={18} color="#657786" />
              )}
              <Text
                style={[
                  styles.actionText,
                  item.isLiked && { color: "#E0245E" },
                ]}
              >
                {item.likes.length}
              </Text>
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity style={styles.actionBtn}>
              <Feather name="share" size={18} color="#657786" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // ================= RATING =================
  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>DmilFit 💪</Text>
            <Text style={styles.headerSubtitle}>
              Discover workouts shared by the community👇
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
      />
    </View>
  );
}
