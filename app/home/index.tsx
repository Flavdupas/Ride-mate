import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
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
} from "react-native-maps";
import GlobalStyle from "@/src/styles/Global";
import { getEquipment, parseActivity, } from "@/src/hooks/MapsHooks";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Activite } from "@/src/models/Activite";
import { mapInitialSettings,  } from "@/src/constants/Map";
import { GRAY_COLOR } from "@/src/styles/Color";
import { FilterButton } from "@/src/components/FilterButton";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomModal } from "@/src/components/Modal";
import { ListSport } from "@/src/constants/Sport";
import { Parking } from "@/src/models/Parking";

const Index = () => {
  /* LOGIQUE */
  const user = useSelector((state: RootState) => state.user);
  const data = useSelector((state: RootState) => state.data);
  const [activite, setActivite] = useState<Activite[]>([]);
  const [parking, setParking] = useState<Parking[]>([]);
  const [equipments, setEquipements] = useState<{title:string}[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    const handle = async () => {
      const equip = await getEquipment(user);
      const activite = await parseActivity(data.activite, user);
      setEquipements(equip);
      setActivite(activite);
      setParking(data.parking);
    };
    handle();
  }, [user.favoriteIndexSport]);

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
            {parking.map((item, index) => {
              return (
                <Marker
                  onSelect={(e) => handleSelect(e)}
                  key={index}
                  coordinate={{
                    latitude: item.geo_shape.geometry.coordinates[1],
                    longitude: item.geo_shape.geometry.coordinates[0],
                  }}
                  pinColor="blue"
                />
              );
            })}
          </MapView>
          <FilterButton onPress={handlePresentModalPress} />
          <CustomBottomSheet
            equipments={equipments}
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
  equipments:{title:string}[];
}

const CustomBottomSheet: FC<CustomBottomSheetInterface> = ({
  bottomSheetModalRef,
  data,
  equipments,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const snapPoints = useMemo(() => ["50%", "50%"], []);
  const [dataArray, setDataAray] = useState<any[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const [isSportList, setIsSportList] = useState<boolean>(true);

  const handleClick = (visible:boolean, data: any[], isSportList: boolean) => {
    setModalVisible(visible);
    setIsSportList(isSportList);
    setDataAray(data);
  }
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
      >
        <CustomModal modalVisible={modalVisible} setModalVisible={setModalVisible} data={dataArray} user={user} sportList={isSportList}/>
        <BottomSheetView style={styles.body}>
          {data && (
            <>
              <Text style={styles.title}>Filtres</Text>
              <Text style={styles.category}>Sports</Text>
              <TouchableOpacity style={styles.button} onPress={() => handleClick(true, ListSport, true)}>
              <Text style={styles.txtButton}>{user.favoriteIndexSport !== null ? ListSport[user.favoriteIndexSport].title : 'test'}</Text>
              </TouchableOpacity>
              <Text style={styles.category}>Équipements</Text>
              <TouchableOpacity style={styles.button} onPress={() => handleClick(true, equipments, false)}>
                <Text>{user.favoriteIndexEquip ? equipments[user.favoriteIndexEquip].title : ''}</Text>
              </TouchableOpacity>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default Index;
