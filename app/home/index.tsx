import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import React, {
  FC,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import MapView, {
  Marker,
  MarkerSelectEvent,
  Polyline,
} from "react-native-maps";
import GlobalStyle from "@/src/styles/Global";
import { getEquipment, parseActivity } from "@/src/hooks/MapsHooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Activite } from "@/src/models/Activite";
import { mapInitialSettings } from "@/src/constants/Map";
import { FilterButton } from "@/src/components/FilterButton";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Parking } from "@/src/models/Parking";
import { BottomSheetFilter } from "@/src/components/BottomSheetFilter";
import { BottomSheetPin } from "@/src/components/BottomSheetPin";
import { calculateDistance } from "@/src/utils/map";
import { IndicatorPin } from "@/src/components/IndicatorPin";
import { ModalInfo } from "@/src/components/ModalInfo";
import Pin from "@/src/components/icons/Pin";
import { SearchBar } from "@/src/components/SearchBar";
import { updateFavoriteIndexEquip, updateFavoriteIndexSport } from "@/src/store/user/User";

const Index = () => {
  /* LOGIQUE */
  const user = useSelector((state: RootState) => state.user);
  const data = useSelector((state: RootState) => state.data);
  const dispatch = useDispatch();
  const [activite, setActivite] = useState<Activite[]>([]);
  const [parking, setParking] = useState<Parking[]>([]);
  const [equipments, setEquipements] = useState<{ title: string }[]>([]);
  const [dataActivite, setDataActivite] = useState<Activite | null>(null);
  const [dataParking, setDataParking] = useState<Parking | null>(null);
  const [nearParking, setNearParking] = useState<Parking | null>(null);
  const [modalInfoVisible, setModalInfoVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const mapRef = useRef<MapView | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetPinRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    const handle = async () => {
      const equip = await getEquipment(user);
      const activite = await parseActivity(data.activite, user, search);
      setEquipements(equip);
      setActivite(activite);
      setParking(data.parking);
    };
    handle();
  }, [user.favoriteIndexSport, search]);

  const textChange = (data: string) => {
    setSearch(data);
  };

  const handleDeleteFilter = () => {
    dispatch(updateFavoriteIndexSport(null));
    dispatch(updateFavoriteIndexEquip(null))
  };

  const handleSelect = (
    e: MarkerSelectEvent,
    activite?: Activite,
    parkingData?: Parking
  ) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      });
      bottomSheetModalRef.current?.close();
      bottomSheetPinRef.current?.present();

      if (activite) {
        setDataActivite(activite);
        setDataParking(null);

        let minDistance = 99999999999999;
        let indexParking = -1;
        parking.forEach((item, index) => {
          const distance = calculateDistance(
            activite.geo_point_2d.lat,
            activite.geo_point_2d.lon,
            item.geo_point_2d.lat,
            item.geo_point_2d.lon
          );
          if (minDistance > distance) {
            minDistance = distance;
            indexParking = index;
          }
        });
        setNearParking(parking[indexParking]);
      }

      if (parkingData) {
        setDataParking(parkingData);
        setDataActivite(null);
      }
    }
  };

  const handleDismiss = () => {
    if (mapRef.current) {
      if (dataActivite) {
        mapRef.current.animateToRegion({
          latitude: dataActivite?.geo_point_2d.lat,
          longitude: dataActivite?.geo_point_2d.lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }

      if (dataParking) {
        mapRef.current.animateToRegion({
          latitude: dataParking?.geo_point_2d.lat,
          longitude: dataParking?.geo_point_2d.lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }

      setDataActivite(null);
      setDataParking(null);
      setNearParking(null);
    }
  };

  const toogleModalInfo = () => {
    setModalInfoVisible(!modalInfoVisible);
  };

  const handlePressNearParking = () => {
    if (mapRef.current && nearParking) {
      mapRef.current.animateToRegion({
        latitude: nearParking?.geo_point_2d.lat,
        longitude: nearParking?.geo_point_2d.lon,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      });
    }
    setDataParking(nearParking);
    //setDataActivite(null);
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
                  onSelect={(e) => handleSelect(e, item)}
                  key={index}
                  coordinate={{
                    latitude: item.geo_shape.geometry.coordinates[1],
                    longitude: item.geo_shape.geometry.coordinates[0],
                  }}
                />
              );
            })}
            {parking.map((item, index) => {
              return (
                <Marker
                  onSelect={(e) => handleSelect(e, undefined, item)}
                  key={index}
                  coordinate={{
                    latitude: item.geo_shape.geometry.coordinates[1],
                    longitude: item.geo_shape.geometry.coordinates[0],
                  }}
                  pinColor="blue"
                >
                  <Pin />
                </Marker>
              );
            })}
            {dataActivite && nearParking && (
              <Polyline
                coordinates={[
                  {
                    latitude: dataActivite.geo_point_2d.lat,
                    longitude: dataActivite.geo_point_2d.lon,
                  },
                  {
                    latitude: nearParking.geo_point_2d.lat,
                    longitude: nearParking.geo_point_2d.lon,
                  },
                ]}
                strokeColor="#000"
                strokeWidth={2}
              />
            )}
          </MapView>
          <FilterButton onPress={handlePresentModalPress} />
          <IndicatorPin onPress={toogleModalInfo} />
          <SearchBar onChange={textChange} />
          <ModalInfo visible={modalInfoVisible} onPress={toogleModalInfo} />
          <BottomSheetFilter
            onDeleteFilter={handleDeleteFilter}
            equipments={equipments}
            data={activite}
            bottomSheetModalRef={bottomSheetModalRef}
          />
          <BottomSheetPin
            onDismiss={handleDismiss}
            onPress={handlePressNearParking}
            refBS={bottomSheetPinRef}
            activite={dataActivite}
            parking={dataParking}
          />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Index;
