import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/user";
import { setTimecard } from "../../redux/slices/timecard";
import { Tabs } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Auth from "../Auth";

export default function TabLayout() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          dispatch(setUser(parsedUserData));
        }
        const timecardData = await AsyncStorage.getItem("timecard");
        if (timecardData) {
          const parsedTimecardData = JSON.parse(timecardData);
          dispatch(setTimecard(parsedTimecardData));
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return user ? (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="org_chart"
        options={{
          title: "Org Chart",
        }}
      />
      <Tabs.Screen
        name="timecard"
        options={{
          title: "Punch In/Out",
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: "Employees",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  ) : (
    <Auth />
  );
}
