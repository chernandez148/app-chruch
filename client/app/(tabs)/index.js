import React from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { useSelector } from "react-redux"; // Import useSelector hook

const HomeScreen = () => {
  const user = useSelector((state) => state.user.user); // Retrieve user data from Redux store
  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log(user.subordinates);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerHeader}>
        <Text style={styles.fullName}>
          Welcome, {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Background color of your screen
  },
  innerHeader: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  fullName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "medium",
  },
});

export default HomeScreen;
