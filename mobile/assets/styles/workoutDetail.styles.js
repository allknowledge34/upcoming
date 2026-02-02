import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  headerImageBox: {
    position: "absolute",
    top: -35,
    width,
    overflow: "hidden",
    zIndex: 10,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  headerImage: {
    width: "100%",
    height: "100%",
  },

  gradient: {
    position: "absolute",
    bottom: 0,
    height: 180,
    width: "100%",
  },

  topButtons: {
    position: "absolute",
    top: 100,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  circleBtn: {
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 10,
    borderRadius: 20,
  },

  contentBox: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  caption: {
    marginTop: 10,
    color: "#666",
    lineHeight: 22,
  },

  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 14,
  },

  commentTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: 6,
  },

  commentItem: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },

  user: {
    fontWeight: "600",
  },

  comment: {
    color: "#666",
  },

  inputRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
  },
});