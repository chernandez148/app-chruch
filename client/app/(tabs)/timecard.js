import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { setTimesheetForm } from "../../redux/slices/timesheet";
import { setDate } from "../../redux/slices/date";
import { Picker } from "@react-native-picker/picker";
import HorizontalLine from "../../components/HorizontalLine";
import TimesheetForm from "../../components/TimesheetForm";
import moment from "moment";

const WeeklyCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(moment());
  const timesheetForm = useSelector((state) => state.timesheet.timesheetForm);
  const timecard = useSelector((state) => state.timecard.timecard);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  console.log("User: ", timecard);

  const getWeekDates = () => {
    let weekStart = currentWeek.clone().startOf("week");
    let dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(weekStart.clone().add(i, "days"));
    }
    return dates;
  };

  const handleTimeRecord = (date) => {
    dispatch(setTimesheetForm(true));
    dispatch(setDate(date));
    console.log(date);
  };

  const renderWeekDays = () => {
    const dates = getWeekDates();
    return dates.map((date, index) => (
      <View key={index} style={styles.dayContainer}>
        <HorizontalLine />
        <Text style={styles.date}>{date.format("MMM")}</Text>
        <Text style={styles.date}>{date.format("D")}</Text>
        <Text style={styles.date}>{date.format("ddd")}</Text>
        <HorizontalLine />
        <TouchableOpacity
          onPress={() => handleTimeRecord(date.format().slice(0, 10))}
        >
          <Text>+</Text>
        </TouchableOpacity>
        {timecard
          ? timecard?.map((timecard, index) =>
              timecard.date === date.format().slice(0, 10) ? (
                <View style={styles.timecard} key={index}>
                  <Text>Clocked in: {timecard.clocked_in}</Text>
                  <Text>Clocked out: {timecard.clocked_out}</Text>
                </View>
              ) : null
            )
          : user.timecards.map((timecard, index) =>
              timecard.date === date.format().slice(0, 10) ? (
                <Text key={index}>Clocked Out: {timecard.clocked_in}</Text>
              ) : null
            )}
      </View>
    ));
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(currentWeek.clone().subtract(1, "week"));
  };

  const goToNextWeek = () => {
    setCurrentWeek(currentWeek.clone().add(1, "week"));
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Timecard</Text>
          <View style={styles.headerMonth}>
            <Button
              style={styles.directions}
              type="clear"
              title="<"
              onPress={goToPreviousWeek}
            />
            <Text style={styles.weekTitle}>
              {currentWeek.format("MMM YYYY")}
            </Text>
            <Button
              style={styles.directions}
              type="clear"
              title=">"
              onPress={goToNextWeek}
            />
          </View>
          {user.role === "Admin" && (
            <View>
              <Picker style={styles.picker}>
                {user.subordinates.map((subordinate, index) => (
                  <Picker.Item
                    key={index}
                    label={subordinate.first_name + " " + subordinate.last_name}
                    value={subordinate.id}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
        <View style={styles.weekDaysContainer}>{renderWeekDays()}</View>
        {timesheetForm && <TimesheetForm />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#4e4e4e",
  },
  headerMonth: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 3,
    backgroundColor: "#f4f4f4",
    borderRadius: 50,
  },
  directions: {
    backgroundColor: "#e8e8e8",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  weekTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4e4e4e",
  },
  weekDaysContainer: {
    flexDirection: "column", // Changed to column direction
    alignItems: "center", // Center items vertically
    paddingTop: 50,
    marginHorizontal: 10,
  },
  dayContainer: {
    flexWrap: "wrap", //
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20, // Add space between days
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 2.5,
  },
  punchRecord: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 5,
    overflow: "scroll",
  },
  timecard: {
    margin: 5,
    borderLeftWidth: 10,
    borderRadius: 15,
    borderColor: "#a9e9af",
    width: "100%",
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
});

export default WeeklyCalendar;
