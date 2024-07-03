import LoginForm from "../components/LoginForm";
import React from "react";
import { StyleSheet } from "react-native";

const Auth = () => {
  return <LoginForm />;
};

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

export default Auth;
