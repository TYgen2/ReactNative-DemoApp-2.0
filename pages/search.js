import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../theme/themeProvider";
import { Dropdown } from "react-native-element-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import SearchItem from "../components/searchItem";
import { Icon } from "@rneui/themed";
import filter from "lodash.filter";

const storage = getStorage();
const artRefs = ref(storage, "arts/");

const Search = () => {
  const { colors } = useTheme();

  const options = [
    { label: "By name", value: "1" },
    { label: "By artist", value: "2" },
  ];

  const [value, setValue] = useState(null);
  const [artList, setArtList] = useState([]);

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
    if (artList.length == 0) {
      getArtList();
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.title, { backgroundColor: colors.background }]}>
        <Text
          style={{
            fontWeight: "bold",
            color: colors.title,
            fontSize: 24,
            paddingLeft: 16,
          }}
        >
          Search for an Artwork
        </Text>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 8,
            top: -16,
          }}
        >
          <Dropdown
            placeholderStyle={{ color: "#0096FF", fontSize: 14 }}
            selectedTextStyle={{ color: "#0096FF", fontSize: 14 }}
            containerStyle={{ borderRadius: 10 }}
            itemContainerStyle={{
              width: 90,
              alignSelf: "center",
            }}
            itemTextStyle={{
              fontSize: 14,
            }}
            data={options}
            labelField="label"
            valueField="value"
            placeholder="By name"
            value={value}
            onChange={(item) => {
              setValue(item.value);
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBar]}>
        <Icon
          name="search"
          type="material"
          style={styles.searchIcon}
          color={colors.subtitle}
        />
        <TextInput
          style={styles.textInput}
          placeholder={value == "1" ? "e.g. chlorine " : "e.g. torino "}
          placeholderTextColor={colors.subtitle}
          fontWeight="bold"
        />
      </View>
      <View style={styles.searchContent}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View
              style={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={[styles.noMatch, { color: colors.subtitle }]}>
                No match found
              </Text>
            </View>
          }
          data={artList}
          overScrollMode="never"
          renderItem={({ item }) => {
            return <SearchItem url={item["art"]} info={item["name"]} />;
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 80,
    backgroundColor: "green",
  },
  searchBar: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  textInput: {
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchContent: {
    flex: 18,
  },
  noMatch: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchIcon: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
  },
});

export default Search;
