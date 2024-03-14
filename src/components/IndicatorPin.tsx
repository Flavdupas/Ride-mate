import { BlurView } from "expo-blur"
import React, { FC } from "react"
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { GRAY_COLOR } from "../styles/Color"

interface IndicatorPin {
    onPress: () => void;
}

export const IndicatorPin: FC<IndicatorPin> = ({onPress}) => {

    /* STYLES */
    const styles = StyleSheet.create({
        body: {
            position:"absolute",
            right:20,
            top:75,
            width:30,
            height:30,
            overflow:'hidden',
            borderRadius:50,
            backgroundColor: GRAY_COLOR,
            justifyContent:"center",
            alignItems:"center",
        },
        text: {
            color:"#fff",
            fontSize:18,
            fontWeight:"700"
        }
    })

    return (
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.body}>
            <Text style={styles.text}>i</Text>
          </View>
        </TouchableWithoutFeedback>
      
    )
}