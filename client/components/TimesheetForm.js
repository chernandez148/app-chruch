import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Fontisto } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setTimesheetForm } from "../redux/slices/timesheet";
import { setTimecard } from "../redux/slices/timecard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFormik } from "formik";
import * as yup from "yup";

function TimesheetForm() {
  const date = useSelector((state) => state.date.date);
  const user = useSelector((state) => state.user.user);
  const timecard = useSelector((state) => state.timecard.timecard);
  const dispatch = useDispatch();
  const [clockedInVisible, setClockedInVisible] = useState(false);
  const [clockedOutVisible, setClockedOutVisible] = useState(false);

  const closeTimeSheetForm = () => {
    dispatch(setTimesheetForm(false));
  };

  const validationSchema = yup.object().shape({
    employee_id: yup.number().required(),
    date: yup.string().required(),
    clocked_in: yup.string(),
    clocked_out: yup.string(),
    notes: yup.string(), // New validation for notes field
  });

  const formik = useFormik({
    initialValues: {
      employee_id: user?.id || "", // Handle case when user is not defined
      date: date || "", // Handle case when date is not defined
      clocked_in: "",
      clocked_out: "",
      notes: "", // Initial value for notes field
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "https://21b0-162-233-243-193.ngrok-free.app/timesheet",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          console.error("Server error:", text);
          Alert.alert("Error", "Server error. Please try again later.");
          return;
        }

        const timecardData = await response.json();
        console.log("Timesheet response:", timecardData);

        Alert.alert("Success", "Timesheet created successfully.");
        await AsyncStorage.setItem(
          "timecard",
          JSON.stringify([...timecard, timecardData])
        );
        dispatch(setTimecard([...timecard, timecardData]));
        dispatch(setTimesheetForm(false));
      } catch (error) {
        console.error("Error during timesheet creation:", error);
        Alert.alert(
          "Error",
          "An error occurred during timesheet creation. Please try again."
        );
      }
    },
  });

  const handleDateConfirm = (selectedDate) => {
    if (clockedInVisible) {
      formik.setFieldValue("clocked_in", selectedDate.toString().slice(16, 21));
      setClockedInVisible(false);
    } else if (clockedOutVisible) {
      formik.setFieldValue(
        "clocked_out",
        selectedDate.toString().slice(16, 21)
      );
      setClockedOutVisible(false);
    }
  };

  return (
    <View style={styles.timesheetForm}>
      <Text style={styles.headerTitle}>Add Time Record</Text>
      <View>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setClockedInVisible(true)}
        >
          <Fontisto name="date" size={24} color="black" />
          <Text style={styles.dateInputText}>Clocked In</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={clockedInVisible}
          mode="time"
          onConfirm={handleDateConfirm}
          onCancel={() => setClockedInVisible(false)}
        />
        {formik.touched.clocked_in && formik.errors.clocked_in ? (
          <Text style={styles.errorText}>{formik.errors.clocked_in}</Text>
        ) : null}
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setClockedOutVisible(true)}
        >
          <Fontisto name="date" size={24} color="black" />
          <Text style={styles.dateInputText}>Clocked Out</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={clockedOutVisible}
          mode="time"
          onConfirm={handleDateConfirm}
          onCancel={() => setClockedOutVisible(false)}
        />
        {formik.touched.clocked_out && formik.errors.clocked_out ? (
          <Text style={styles.errorText}>{formik.errors.clocked_out}</Text>
        ) : null}
        <TextInput
          multiline
          style={styles.notesInput}
          placeholder="Notes"
          value={formik.values.notes}
          onChangeText={formik.handleChange("notes")}
          onBlur={formik.handleBlur("notes")}
        />
        {formik.touched.notes && formik.errors.notes ? (
          <Text style={styles.errorText}>{formik.errors.notes}</Text>
        ) : null}
      </View>
      <View style={styles.formButtons}>
        <TouchableOpacity onPress={formik.handleSubmit}>
          <Text style={styles.submit}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={closeTimeSheetForm}>
          <Text style={styles.cancel}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timesheetForm: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    backgroundColor: "white",
    padding: 20,
  },
  headerTitle: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#4e4e4e",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  dateInputText: {
    marginLeft: 10,
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submit: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#cff1cf",
  },
  cancel: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f7a7a7",
  },
});

export default TimesheetForm;
