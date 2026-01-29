import { StyleSheet } from "react-native";


export default StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 12,
    color: "#222",
  },

  section: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 22,
    marginLeft: 16,
    marginBottom: 10,
    color: "#222",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "600",
    color: "#333",
  },
});
