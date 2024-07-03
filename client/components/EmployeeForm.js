import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useDispatch, useSelector } from "react-redux";
import { setEmployeeForm } from "../redux/slices/employeeForm";
import { useFormik } from "formik";
import * as yup from "yup";

function EmployeeForm() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const validationSchema = yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    role: yup.string().required(),
    email: yup.string().required(),
    phone_number: yup.string().required(),
    _password_hash: yup.string().required(),
    direct_supervisor_id: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      role: "",
      email: "",
      phone_number: "",
      _password_hash: "",
      direct_supervisor_id: user.id,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "https://21b0-162-233-243-193.ngrok-free.app/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.access_token}`,
            },
            body: JSON.stringify(values),
          }
        );
        if (response.ok) {
          dispatch(setEmployeeForm(false));
        } else {
          Alert.alert(
            "Employee creation failed",
            data.message || "Employee creation failed."
          );
        }
      } catch (err) {
        console.error("Error during employee creation:", err);
        Alert.alert(
          "Error",
          "An error occurred during employee creation. Please try again."
        );
      }
    },
  });

  const closeEmployeeForm = () => {
    dispatch(setEmployeeForm(false));
  };

  return (
    <View style={styles.employeeForm}>
      <ScrollView>
        <Text style={styles.headerTitle}>Employee Form</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={formik.values.first_name}
            onChangeText={formik.handleChange("first_name")}
            onBlur={formik.handleBlur("first_name")}
          />
          {formik.touched.first_name && formik.errors.first_name ? (
            <Text style={styles.error}>{formik.errors.first_name}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formik.values.last_name}
            onChangeText={formik.handleChange("last_name")}
            onBlur={formik.handleBlur("last_name")}
          />
          {formik.touched.last_name && formik.errors.last_name ? (
            <Text style={styles.error}>{formik.errors.last_name}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Role"
            value={formik.values.role}
            onChangeText={formik.handleChange("role")}
            onBlur={formik.handleBlur("role")}
          />
          {formik.touched.role && formik.errors.role ? (
            <Text style={styles.error}>{formik.errors.role}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <Text style={styles.error}>{formik.errors.email}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formik.values.phone_number}
            onChangeText={formik.handleChange("phone_number")}
            onBlur={formik.handleBlur("phone_number")}
          />
          {formik.touched.phone_number && formik.errors.phone_number ? (
            <Text style={styles.error}>{formik.errors.phone_number}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formik.values._password_hash}
            onChangeText={formik.handleChange("_password_hash")}
            onBlur={formik.handleBlur("_password_hash")}
            secureTextEntry={true}
          />
          {formik.touched._password_hash && formik.errors._password_hash ? (
            <Text style={styles.error}>{formik.errors._password_hash}</Text>
          ) : null}
          <Picker style={styles.input}>
            {user.subordinates.map((subordinate, index) => (
              <Picker.Item
                key={index}
                label={`${subordinate.first_name} ${subordinate.last_name}`}
                value={subordinate.id}
              />
            ))}
          </Picker>
          {formik.touched.direct_supervisor_id &&
          formik.errors.direct_supervisor_id ? (
            <Text style={styles.error}>
              {formik.errors.direct_supervisor_id}
            </Text>
          ) : null}
          <View style={styles.employeeFormBtns}>
            <TouchableOpacity onPress={formik.handleSubmit}>
              <Text style={styles.submit}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeEmployeeForm}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  employeeForm: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    backgroundColor: "white",
    padding: 20,
  },
  headerTitle: {
    paddingTop: 50,
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#4e4e4e",
  },
  input: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  employeeFormBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submit: {
    color: "black",
    backgroundColor: "#cff1cf",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  cancel: {
    color: "black",
    backgroundColor: "#f7a7a7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default EmployeeForm;
