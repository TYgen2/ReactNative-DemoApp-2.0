import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { getStorage, ref } from "firebase/storage";
import ArtItem from "../components/artItem";
import { Icon } from "@rneui/themed";
import { auth } from "../firebaseConfig";
import { useTheme } from "../context/themeProvider";
import { UpdateContext } from "../context/updateArt";

const storage = getStorage();

const randomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Random = () => {
  const { colors } = useTheme();

  const { artList } = useContext(UpdateContext);
  const [random, setRandom] = useState(0);
  const [isGuest, setGuest] = useState();

  useEffect(() => {
    setGuest(auth.currentUser.isAnonymous);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.artContainer, { backgroundColor: colors.background }]}
      >
        {artList.length != 0 ? (
          <ArtItem
            guest={isGuest}
            url={artList[random]["art"]}
            id={artList[random]["artistId"]}
            info={artList[random]["name"]}
            width={undefined}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#483C32" />
          </View>
        )}
      </View>
      <TouchableOpacity
        style={[styles.refresh, , { backgroundColor: colors.background }]}
        onPress={() => {
          // randomly select an art from the artList
          setRandom(randomNumberInRange(0, artList.length - 1));
        }}
      >
        <Icon type="font-awesome" name="refresh" color={colors.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  artContainer: {
    flex: 1,
    marginTop: 80,
    marginBottom: 80,
    paddingHorizontal: 40,
  },
  refresh: {
    position: "absolute",
    alignSelf: "center",
    bottom: 30,
  },
});

export default Random;
