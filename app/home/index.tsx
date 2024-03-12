import {
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import React, {
  FC,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MapView, {
  Marker,
  MarkerSelectEvent,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import GlobalStyle from "@/src/styles/Global";
import { getActivity } from "@/src/hooks/MapsHooks";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Activite } from "@/src/models/Activite";
import { mapInitialSettings } from "@/src/constants/Map";
import { GRAY_COLOR } from "@/src/styles/Color";
import { FilterButton } from "@/src/components/FilterButton";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomModal } from "@/src/components/Modal";

const Index = () => {
  /* LOGIQUE */
  const user = useSelector((state: RootState) => state.user);
  const [activite, setActivite] = useState<Activite[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    const handle = async () => {
      const data = await getActivity(user);
      setActivite(data);
    };
    handle();
  }, []);

  const handleSelect = (e: MarkerSelectEvent) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      });
    }
  };

  /* STYLES */
  const styles = StyleSheet.create({
    map: {
      flex: 1,
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={[GlobalStyle.body]}>
          <MapView
            style={styles.map}
            initialRegion={mapInitialSettings}
            ref={mapRef}
            zoomEnabled
          >
            {activite.map((item, index) => {
              return (
                <Marker
                  onSelect={(e) => handleSelect(e)}
                  key={index}
                  coordinate={{
                    latitude: item.geo_shape.geometry.coordinates[1],
                    longitude: item.geo_shape.geometry.coordinates[0],
                  }}
                  title={item.activite}
                />
              );
            })}
          </MapView>
          <FilterButton onPress={handlePresentModalPress} />
          <CustomBottomSheet
            data={activite}
            bottomSheetModalRef={bottomSheetModalRef}
          />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

interface CustomBottomSheetInterface {
  bottomSheetModalRef: Ref<BottomSheetModal>;
  data: Activite[];
}

const CustomBottomSheet: FC<CustomBottomSheetInterface> = ({
  bottomSheetModalRef,
  data,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const snapPoints = useMemo(() => ["50%", "50%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  /* STYLES */
  const styles = StyleSheet.create({
    body: {
      flex: 1,
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 24,
      color: GRAY_COLOR,
      fontWeight: "800",
      marginTop: 10,
      textAlign: "center",
    },
    category: {
      fontSize: 18,
      color: GRAY_COLOR,
      fontWeight: "800",
      marginTop: 10,
    },
    button: {
      borderColor: GRAY_COLOR,
      borderWidth: 1,
      height: 40,
      borderRadius: 0,
      paddingHorizontal: 10,
      alignItems: "center",
      marginTop: 5,
      flexDirection: "row",
    },
    txtButton: {
      color: GRAY_COLOR,
      fontSize: 12,
      fontWeight: "500",
    },
    
  });

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <CustomModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        <BottomSheetView style={styles.body}>
          {data.length > 0 && (
            <>
              <Text style={styles.title}>Filtres</Text>
              <Text style={styles.category}>Sports</Text>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.txtButton}>{data[0].activite}</Text>
              </TouchableOpacity>
              <Text style={styles.category}>Équipements</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.txtButton}>{data[0].nom_equip}</Text>
              </TouchableOpacity>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default Index;
