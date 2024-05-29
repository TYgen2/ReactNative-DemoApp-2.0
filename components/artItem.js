import { Icon } from "@rneui/themed";
import { DelArt, SaveArt } from "../services/fav";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { React, useState, useEffect } from "react";
import { FormatName, FormatArtist, NotifyMessage } from "../utils/tools";
import { auth, db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export default artItem = ({ guest, url, info, id, width, left }) => {
  const navigation = useNavigation();
  const userId = guest ? null : auth.currentUser.uid;

  const art_name = FormatName(info);
  const art_artist = FormatArtist(info);
  const [artistIcon, setArtistIcon] = useState("");
  const [artistSign, setArtistSign] = useState("");

  // state for controlling the fav icon based on Firestore
  const [status, setStatus] = useState(false);

  const getInfo = async () => {
    const artistDocRef = doc(db, "user", id);
    const docSnap = await getDoc(artistDocRef);

    if (docSnap.exists()) {
      setArtistIcon(docSnap.data()["Info"]["icon"]);
      setArtistSign(docSnap.data()["Info"]["sign"]);
    } else {
      console.log("No such document!");
    }
  };

  // things that required by logged in user but not accessible by guest.
  if (guest == false) {
    const docRef = doc(db, "user", userId);

    useEffect(() => {
      getInfo();

      // when user fav or unfav, doc will change
      // according to the Firestore.
      const unsubscribe = onSnapshot(docRef, (doc) => {
        getInfo();
        setStatus(doc.data()["FavArt"].includes(url));
      });

      return () => unsubscribe();

      // for the dependency array, it controls the fav
      // status shown in random function page.
    }, [url]);
  } else {
    useEffect(() => {
      getInfo();
    }, [url]);
  }

  return (
    <View style={[styles.artList, { marginLeft: left }]}>
      <TouchableOpacity
        style={styles.arts}
        activeOpacity={0.8}
        onLongPress={() => {
          navigation.navigate("Full art", {
            name: art_name,
            imgUrl: url,
            fav: status,
            user: guest ? null : userId,
            onGoBack: (updatedStatus) => {
              setStatus(updatedStatus);
            },
          });
        }}
      >
        <Image source={{ uri: url }} style={{ flex: 1, width: width }} />
      </TouchableOpacity>
      <View style={styles.artsInfo}>
        <TouchableOpacity
          onPress={() => {
            navigation.push("Profile", {
              id: id,
              name: art_artist,
              sign: artistSign,
              icon: artistIcon,
            });
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
            paddingLeft: 20,
          }}
        >
          {artistIcon === "" ? (
            <ActivityIndicator size="small" color="#483C32" />
          ) : (
            <Image
              source={{ uri: artistIcon }}
              style={{
                flex: 1,
                resizeMode: "cover",
                width: 50,
                borderRadius: 40,
              }}
            />
          )}
        </TouchableOpacity>
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
            if (guest) {
              NotifyMessage("Sign in to use the Favourite function.");
            } else if (status) {
              DelArt(userId, url);
              setStatus(false);
            } else {
              SaveArt(userId, url);
              setStatus(true);
            }
          }}
        >
          {status === undefined ? (
            <ActivityIndicator size="small" color="#483C32" />
          ) : (
            <Icon
              name={status ? "heart" : "hearto"}
              type="antdesign"
              size={24}
              color="#ff5152"
            />
          )}
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
    alignItems: "center",
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
