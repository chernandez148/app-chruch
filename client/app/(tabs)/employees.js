import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { setEmployeeForm } from "../../redux/slices/employeeForm";
import EmployeeForm from "../../components/EmployeeForm";

export default function Contacts() {
  const user = useSelector((state) => state.user.user);
  const employeeForm = useSelector((state) => state.employeeForm.employeeForm);
  const dispatch = useDispatch();

  const handleEmployeeForm = () => {
    dispatch(setEmployeeForm(true));
  };

  return (
    <View style={styles.employees}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Employees</Text>
          {user.role === "Admin" && ( // Conditionally render TouchableOpacity based on user.role
            <TouchableOpacity onPress={handleEmployeeForm}>
              <AntDesign name="plus" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.contactsContainer}>
          {user.subordinates.map((subordinates) => {
            return (
              <View style={styles.employeeCard} key={subordinates.id}>
                <Text style={styles.boldText}>
                  {subordinates.first_name} {subordinates.last_name}
                </Text>
                <Text style={styles.contactRole}>{subordinates.role}</Text>
                <View style={styles.contactText}>
                  <Fontisto
                    style={styles.contactIcon}
                    name="email"
                    size={16}
                    color="black"
                  />
                  <Text style={styles.contactText}>{subordinates.email}</Text>
                </View>
                <View style={styles.contactText}>
                  <Entypo
                    style={styles.contactIcon}
                    name="phone"
                    size={16}
                    color="black"
                  />
                  <Text>{subordinates.phone_number}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      {employeeForm && <EmployeeForm />}
    </View>
  );
}

const styles = StyleSheet.create({
  employees: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4e4e4e",
  },
  boldText: {
    fontWeight: "bold",
  },
  contactsContainer: {
    marginTop: 50,
  },
  employeeCard: {
    margin: 5,
    borderLeftWidth: 10,
    borderRadius: 15,
    borderColor: "#a9e9af",
    width: "100%",
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  contactRole: {
    marginBottom: 10,
  },
  contactText: {
    alignItems: "center",
    flexDirection: "row",
  },
  contactIcon: {
    paddingRight: 5,
  },
});
