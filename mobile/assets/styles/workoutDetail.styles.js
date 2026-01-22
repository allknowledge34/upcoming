import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

export default StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
    backgroundColor: "#eee",
  },

  header: {
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  caption: {
    marginTop: 6,
    color: COLORS.gray,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
  },

  likeText: {
    color: COLORS.gray,
  },

  commentTitle: {
    padding: 16,
    fontWeight: "600",
  },

  commentItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: "#ddd",
  },

  commentBody: {
    flex: 1,
  },

  commentUser: {
    fontWeight: "600",
  },

  commentText: {
    color: COLORS.gray,
  },

  inputRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
