import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  content: { flex: 1 },

  username: { fontWeight: "700", fontSize: 14 },

  text: { color: "#444", marginTop: 2 },

  time: { fontSize: 12, color: "#999", marginTop: 6 },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },

  emptyTitle: { fontSize: 20, color: "#777", marginTop: 14 },

  emptyText: { color: "#aaa", textAlign: "center", marginTop: 6 },
});
