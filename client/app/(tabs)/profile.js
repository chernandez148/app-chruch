import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    AsyncStorage.removeItem("user");
    dispatch(setUser(null));
  };

  return (
    <View>
      <Text>Profile</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
