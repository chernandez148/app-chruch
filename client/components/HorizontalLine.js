import React from "react";
import { View, StyleSheet } from "react-native";

const HorizontalLine = () => <View style={styles.line}></View>;

const styles = StyleSheet.create({
  line: {
    height: 1,
    flex: 1,
    margin: 10,
    backgroundColor: "#c7c7c7",
  },
});

export default HorizontalLine;
