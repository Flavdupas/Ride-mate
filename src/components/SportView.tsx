import React, { FC, useState } from "react";
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Sport } from "../models/SportModel";
import { MAIN_COLOR } from "../styles/Color";
import { Svg, SvgUri } from "react-native-svg";

interface SportViewInterface {
  sport: Sport;
  sportChoosen: number[];
  setSportChoosen: (sportChoosen: number[]) => void;
}

export const SportView: FC<SportViewInterface> = ({
  sport,
  sportChoosen,
  setSportChoosen,
}) => {
  /* LOGIQUE */
  const [hasClicked, setHasClicked] = useState<boolean>(false);

  const handleClick = () => {
    const tempSportChoosen = [...sportChoosen];
    if (!hasClicked) {
      tempSportChoosen.push(sport.index);
    } else {
      tempSportChoosen.splice(tempSportChoosen.indexOf(sport.index), 1);
    }
    console.log(tempSportChoosen)
    setSportChoosen(tempSportChoosen);
    setHasClicked(!hasClicked);
  };

  /* STYLES */
  const styles = StyleSheet.create({
    body: {
      height: 100,
      width: 100,
      borderColor: MAIN_COLOR,
      borderWidth: 2,
      backgroundColor: sportChoosen.includes(sport.index) ? MAIN_COLOR : "transparent",
    },
  });

  return (
    <TouchableWithoutFeedback onPress={handleClick}>

      <View style={styles.body}>
        
        <Text>{sport.title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
