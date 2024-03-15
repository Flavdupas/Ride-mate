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
import {
  getEquipment,
  parseActivity,
  parseParking,
} from "@/src/hooks/MapsHooks";
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
import {
  updateFavoriteIndexEquip,
  updateFavoriteIndexSport,
  updateFavoriteTypeParking,
} from "@/src/store/user/User";
import { LocationBtn } from "@/src/components/LocationBtn";
import * as Location from "expo-location";
import User from "@/src/components/icons/User";
import { BottomSheetUser } from "@/src/components/BottomSheetUser";
import SportPin from "@/src/components/icons/SportPin";

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
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetPinRef = useRef<BottomSheetModal>(null);
  const bottomSheetuser = useRef<BottomSheetModal>(null);

  useEffect(() => {
    // Fonction asynchrone pour récupérer les données
    const handle = async () => {
      const equip = await getEquipment(user);
      const activite = await parseActivity(data.activite, user, search);
      const parking = await parseParking(
        user.favoriteTypeParking,
        data.parking
      );

      // Mise à jour des données de l'application
      setEquipements(equip);
      setActivite(activite);
      setParking(parking);
    };

    // Lance la récupération des données au montage du composant
    handle();
  }, [
    user.favoriteIndexSport,
    search,
    user.favoriteIndexEquip,
    user.favoriteTypeParking,
  ]);

  const handlePresentModalPress = useCallback(() => {
    // Ouvre le bottom sheet modal
    bottomSheetModalRef.current?.present();
  }, []);

  const textChange = (data: string) => {
    //met a jour le state
    setSearch(data);
  };

  const handleDeleteFilter = () => {
    //delete les donnees du store
    dispatch(updateFavoriteIndexSport(null));
    dispatch(updateFavoriteIndexEquip(null));
    dispatch(updateFavoriteTypeParking(null));
  };

  const handleUserPosition = async () => {
    // Demande la permission d'accéder à la localisation de l'utilisateur
    let { status } = await Location.requestForegroundPermissionsAsync();

    // Si la permission est accordée et que la référence de la carte est disponible
    if (status === "granted" && mapRef.current) {
      // Récupère la position actuelle de l'utilisateur
      let location = await Location.getCurrentPositionAsync({});

      setUserLocation(location);

      // Centre la carte sur la position récupérée
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.008, // Ajuste le zoom sur la carte
        longitudeDelta: 0.008,
      });

      // Présente la bottom sheet
      bottomSheetuser.current?.present();

      // Recherche le parking le plus proche de la position de l'utilisateur
      let minDistance = 99999999999999; // Initialise la distance minimale
      let indexParking = -1;

      // Parcours la liste des parkings
      parking.forEach((item, index) => {
        // Calcule la distance entre la position de l'utilisateur et chaque parking
        const distance = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          item.geo_point_2d.lat,
          item.geo_point_2d.lon
        );

        // Met à jour la distance minimale et l'index du parking le plus proche
        if (minDistance > distance) {
          minDistance = distance;
          indexParking = index;
        }
      });

      // Met à jour le parking le plus proche dans l'état de l'application
      setNearParking(parking[indexParking]);
    }
  };

  const handleSelect = (
    e: MarkerSelectEvent,
    activite?: Activite,
    parkingData?: Parking
  ) => {
    // Vérifie si la référence de la carte est disponible
    if (mapRef.current) {
      // Centre la carte sur le marqueur sélectionné
      mapRef.current.animateToRegion({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.008, // Ajuste le zoom sur la carte (facteur d'échelle)
        longitudeDelta: 0.008, // Ajuste le zoom sur la carte (facteur d'échelle)
      });

      // Ferme le "bottom sheet modal"
      bottomSheetModalRef.current?.close();
      // Ouvre le "bottom sheet pin"
      bottomSheetPinRef.current?.present();

      // Traitement en fonction du type d'élément sélectionné

      // Si un objet Activité est fourni (marqueur d'activité)
      if (activite) {
        // Met à jour l'activité sélectionnée dans l'état de l'application
        setDataActivite(activite);

        // Efface les données de parking et de position de l'utilisateur
        setDataParking(null);
        setUserLocation(null);

        // Recherche le parking le plus proche de l'activité sélectionnée
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

      // Si un objet Parking est fourni (marqueur de parking)
      if (parkingData) {
        // Met à jour le parking sélectionné dans l'état de l'application
        setDataParking(parkingData);

        // Efface les données d'activité
        setDataActivite(null);
      }
    }
  };

  const handleDismiss = () => {
    // Vérifie si la référence de la carte est disponible
    if (mapRef.current) {
      // Traitement en fonction des données sélectionnées
      // Si une activité est sélectionnée
      if (dataActivite) {
        // Centre la carte sur l'activité sélectionnée avec un zoom plus large
        mapRef.current.animateToRegion({
          latitude: dataActivite?.geo_point_2d.lat,
          longitude: dataActivite?.geo_point_2d.lon,
          latitudeDelta: 0.05, // Ajuste le zoom sur la carte (facteur d'échelle plus large)
          longitudeDelta: 0.05, // Ajuste le zoom sur la carte (facteur d'échelle plus large)
        });
      }
      // Si un parking est sélectionné
      if (dataParking) {
        // Centre la carte sur le parking sélectionné avec un zoom plus large
        mapRef.current.animateToRegion({
          latitude: dataParking?.geo_point_2d.lat,
          longitude: dataParking?.geo_point_2d.lon,
          latitudeDelta: 0.05, // Ajuste le zoom sur la carte (facteur d'échelle plus large)
          longitudeDelta: 0.05, // Ajuste le zoom sur la carte (facteur d'échelle plus large)
        });
      }
      // Efface les données de sélection (activité, parking, parking proche)
      setDataActivite(null);
      setDataParking(null);
      setNearParking(null);
    }
  };

  const toogleModalInfo = () => {
    setModalInfoVisible(!modalInfoVisible);
  };

  const handlePressNearParking = () => {
    // Vérifie si la référence de la carte et le parking proche sont disponibles
    if (mapRef.current && nearParking) {
      // Centre la carte sur le parking le plus proche
      mapRef.current.animateToRegion({
        latitude: nearParking?.geo_point_2d.lat,
        longitude: nearParking?.geo_point_2d.lon,
        latitudeDelta: 0.008, // Ajuste le zoom sur la carte (facteur d'échelle)
        longitudeDelta: 0.008, // Ajuste le zoom sur la carte (facteur d'échelle)
      });

      // Met à jour le parking sélectionné avec le parking le plus proche
      setDataParking(nearParking);

      // Ferme le "bottom sheet utilisateur"
      bottomSheetuser.current?.dismiss();
      // Ouvre le "bottom sheet pin"
      bottomSheetPinRef.current?.present();
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
            showsUserLocation
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
                >
                  <SportPin />
                </Marker>
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
            {userLocation && nearParking && (
              <Polyline
                coordinates={[
                  {
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
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
          <LocationBtn onPress={handleUserPosition} />
          <IndicatorPin onPress={toogleModalInfo} />
          <SearchBar onChange={textChange} />
          <ModalInfo visible={modalInfoVisible} onPress={toogleModalInfo} />
          <BottomSheetFilter
            onDeleteFilter={handleDeleteFilter}
            equipments={equipments}
            data={activite}
            bottomSheetModalRef={bottomSheetModalRef}
          />
          <BottomSheetUser
            refBS={bottomSheetuser}
            onPress={handlePressNearParking}
          />
          <BottomSheetPin
            nearParking={nearParking}
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
