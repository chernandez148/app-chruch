import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/user";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import logo from "../assets/images/orange-logo.png";
import loginBackground from "../assets/images/backdrop-login-img.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginForm = () => {
  const dispatch = useDispatch();

  const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "https://21b0-162-233-243-193.ngrok-free.app/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        const data = await response.json();
        console.log("Login response:", data);

        if (response.ok) {
          // Store tokens and user data securely
          await AsyncStorage.setItem("access_token", data.access_token);
          await AsyncStorage.setItem("refresh_token", data.refresh_token);
          await AsyncStorage.setItem("user", JSON.stringify(data.user));

          dispatch(setUser(data.user));
        } else {
          Alert.alert("Login failed", data.message || "Login failed.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        Alert.alert(
          "Error",
          "An error occurred during login. Please try again."
        );
      }
    },
  });

  return (
    <ImageBackground source={loginBackground} style={styles.loginScreen}>
      <View style={styles.overlay}></View>
      <Image source={logo} style={styles.logo} />
      <View style={styles.loginForm}>
        <TextInput
          placeholder="Email"
          onChangeText={formik.handleChange("email")}
          value={formik.values.email}
          autoCapitalize="none"
          textContentType="emailAddress"
          keyboardType="email-address"
          returnKeyType="next"
          style={styles.inputField}
        />
        {formik.touched.email && formik.errors.email ? (
          <Text style={styles.error}>{formik.errors.email}</Text>
        ) : null}
        <TextInput
          placeholder="Password"
          onChangeText={formik.handleChange("password")}
          value={formik.values.password}
          secureTextEntry={true}
          style={styles.inputField}
        />
        {formik.touched.password && formik.errors.password ? (
          <Text style={styles.error}>{formik.errors.password}</Text>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={formik.handleSubmit}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Text style={styles.linkText}>
          Don't have an account? {"\n"}
          Contact your admin here.
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loginScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  linkText: {
    marginTop: 20,
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  loginForm: {
    marginTop: 20,
    alignItems: "center",
  },
  inputField: {
    height: 45,
    width: 300,
    marginBottom: 10,
    backgroundColor: "#fdfdfde0",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: 300,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default LoginForm;
