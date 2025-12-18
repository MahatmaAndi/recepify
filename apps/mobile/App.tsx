import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { mockRecipes } from "@recepify/shared/lib/mock-data";

export default function App() {
  const featuredRecipe = mockRecipes[0];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recepify Mobile</Text>
      <Text style={styles.subtitle}>{featuredRecipe.title}</Text>
      <Text style={styles.body}>{featuredRecipe.description}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 12
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8
  },
  body: {
    fontSize: 16,
    textAlign: "center",
    color: "#555"
  }
});
