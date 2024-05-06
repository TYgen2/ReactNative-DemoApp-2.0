import { StyleSheet, Text, View } from "react-native";
import { React, useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { FlatList } from "react-native-gesture-handler";
import ArtItem from "../../components/artItem";
import { auth } from "../../firebaseConfig";
import { useTheme } from "../../theme/themeProvider";

const storage = getStorage();
const artRefs = ref(storage, "arts/");

const Artwork = () => {
  const { colors } = useTheme();

  const [artList, setArtList] = useState([]);
  const [isGuest, setGuest] = useState();

  const getArtList = () => {
    listAll(artRefs).then((res) => {
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          setArtList((prev) => [...prev, { name: itemRef.name, art: url }]);
        });
      });
    });
  };

  useEffect(() => {
    setGuest(auth.currentUser.isAnonymous);

    // if condition here for debugging only
    if (artList.length == 0) {
      getArtList();
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.title }]}>
          Trending Arts 🔥
        </Text>
      </View>
      <View style={styles.artContent}>
        <FlatList
          contentContainerStyle={{ paddingEnd: 20 }}
          overScrollMode="never"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={artList}
          renderItem={({ item }) => {
            return (
              <ArtItem
                guest={isGuest}
                url={item["art"]}
                info={item["name"]}
                width={300}
                left={20}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default Artwork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 24,
  },
  artContent: {
    flex: 12,
    justifyContent: "center",
  },
});
