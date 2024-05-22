import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { React, useContext, useEffect, useState, memo } from "react";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { FlatList } from "react-native-gesture-handler";
import ArtItem from "../../components/artItem";
import { auth } from "../../firebaseConfig";
import { useTheme } from "../../context/themeProvider";
import { GetHeaderHeight } from "../../utils/tools";
import { UpdateContext } from "../../context/updateArt";

const storage = getStorage();
const artRefs = ref(storage, "arts/");

const Artwork = () => {
  const { colors } = useTheme();

  const [isGuest, setGuest] = useState();

  const { artList, setArtList } = useContext(UpdateContext);

  const fetchArtList = () => {
    listAll(artRefs).then((res) => {
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          setArtList((prev) => [...prev, { name: itemRef.name, art: url }]);
        });
      });
    });
  };

  const renderItem = ({ item }) => (
    <ArtItem
      guest={isGuest}
      url={item["art"]}
      info={item["name"]}
      width={300}
      left={20}
    />
  );

  useEffect(() => {
    setGuest(auth.currentUser.isAnonymous);
    fetchArtList();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, marginTop: GetHeaderHeight() },
      ]}
    >
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.title }]}>
          Recent Arts 🔥
        </Text>
      </View>
      <View style={styles.artContent}>
        <FlatList
          ListEmptyComponent={
            <View
              style={{
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#483C32" />
            </View>
          }
          contentContainerStyle={{ paddingEnd: 20, flexGrow: 1 }}
          overScrollMode="never"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={artList}
          renderItem={renderItem}
          removeClippedSubviews={true}
          windowSize={10}
        />
      </View>
    </View>
  );
};

export default Artwork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
