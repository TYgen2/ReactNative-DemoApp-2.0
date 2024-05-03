import { Icon } from "@rneui/themed";
import { delArt, saveArt } from "../services/fav";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { React, useState, useEffect } from "react";
import { FormatName, FormatArtist } from "../tools/formatting";
import { auth, db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot } from "firebase/firestore";

export default artItem = ({ url, info }) => {
  // state for controlling the fav icon based on Firestore
  const [status, setStatus] = useState();

  const userId = auth.currentUser.uid;
  const docRef = doc(db, "user", userId);

  const art_name = FormatName(info);
  const art_artist = FormatArtist(info);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setStatus(doc.data()["art"].includes(url));
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.artList}>
      <TouchableOpacity
        style={styles.arts}
        activeOpacity={0.8}
        onLongPress={() => {
          navigation.navigate("Full art", {
            imgUrl: url,
            fav: status,
            user: userId,
            onGoBack: (updatedStatus) => {
              setStatus(updatedStatus);
            },
          });
        }}
      >
        <Image source={{ uri: url }} style={{ flex: 1, width: 300 }} />
      </TouchableOpacity>
      <View style={styles.artsInfo}>
        <View
          style={{
            flex: 8,
            paddingLeft: 20,
            justifyContent: "center",
          }}
        >
          <Text style={styles.artName}>{art_name}</Text>
          <Text style={styles.artistName}>{art_artist}</Text>
        </View>
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => {
            if (status) {
              delArt(userId, url);
              setStatus(false);
            } else {
              saveArt(userId, url);
              setStatus(true);
            }
          }}
        >
          <Icon
            name={status ? "heart" : "hearto"}
            type="antdesign"
            size={24}
            color="#ff5152"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  artList: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 0,
    marginLeft: 20,
  },
  arts: {
    flex: 7,
  },
  artsInfo: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  artName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  artistName: {
    color: "white",
    fontSize: 14,
  },
  favButton: {
    flex: 2,
    borderRadius: 30,
    marginVertical: 8,
    marginHorizontal: 2,
    justifyContent: "center",
  },
});
