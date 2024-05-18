import { createDrawerNavigator } from "@react-navigation/drawer";
import { Icon } from "@rneui/themed";
import HomeScreen from "../pages/home";
import About from "../pages/about";
import CustomDrawer from "../components/customDrawer";
import Random from "../pages/random";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "../context/themeProvider";
import Search from "../pages/search";
import Upload from "../pages/upload";
import { ArtContextProvider } from "../context/updateArt";

const NavDrawer = () => {
  const { colors } = useTheme();

  const Drawer = createDrawerNavigator();
  return (
    <ArtContextProvider>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "white",
          drawerActiveBackgroundColor: "#483C32", // brown when selected
          drawerLabelStyle: {
            fontSize: 18,
            fontWeight: "normal",
          },
          drawerStyle: {
            overflow: "hidden",
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
            backgroundColor: "#fff",
          },
          headerTransparent: true,
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerBackgroundContainerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.icon,
            headerTitleStyle: { color: "transparent" },
            drawerIcon: () => (
              <Icon type="material" name="home" color="white" />
            ),
          }}
        />
        <Drawer.Screen
          name="About"
          component={About}
          options={{
            headerTitleStyle: { color: "transparent" },
            drawerIcon: () => (
              <Icon type="material" name="info" color="white" />
            ),
          }}
        />
        <Drawer.Screen
          name="Search"
          component={Search}
          options={{
            headerTintColor: colors.icon,
            headerTitleStyle: { color: colors.title },
            drawerIcon: () => (
              <Icon type="material" name="search" color="white" />
            ),
          }}
        />
        <Drawer.Screen
          name="Random"
          component={Random}
          options={{
            headerTitleAlign: "center",
            headerBackgroundContainerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.icon,
            headerTitle: () => (
              <Text style={[styles.title, { color: colors.title }]}>
                Random art 🎲
              </Text>
            ),
            drawerIcon: () => (
              <Icon type="font-awesome" name="random" color="white" />
            ),
          }}
        />
        <Drawer.Screen
          name="Upload"
          component={Upload}
          options={{
            headerTitleAlign: "center",
            headerBackgroundContainerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.icon,
            headerTitle: () => (
              <Text style={[styles.title, { color: colors.title }]}>
                Upload 💭
              </Text>
            ),
            drawerIcon: () => (
              <Icon type="material" name="upload" color="white" />
            ),
          }}
        />
      </Drawer.Navigator>
    </ArtContextProvider>
  );
};

export default NavDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
  },
});
