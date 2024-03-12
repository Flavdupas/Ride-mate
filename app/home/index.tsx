import { Text, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker, MarkerSelectEvent } from 'react-native-maps';
import GlobalStyle from '@/src/styles/Global';
import { getActivity } from '@/src/hooks/MapsHooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { Activite } from '@/src/models/Activite';

const Index = () => {
    /* LOGIQUE */
    const user = useSelector((state: RootState) => state.user)
    const [activite, setActivite] = useState<Activite[]>([]);
    const [mapSettings, setMapSettings] = useState<{ longitude: number, latitude: number, latitudeDelta: number, longitudeDelta: number }>({
        latitude: 47.4667,
        longitude: -0.55,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const mapRef = useRef(null);

    useEffect(() => {
        const handle = async () => {
            const data = await getActivity(user)
            setActivite(data);
        }
        handle();
    }, [])

    const handleSelect = (e: MarkerSelectEvent) => {
        setMapSettings({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        })
    }

    /* STYLES */
    const styles = StyleSheet.create({
        map: {
            flex: 1
        }
    })

    return (
        <View style={[GlobalStyle.body]}>
            <MapView style={styles.map} initialRegion={mapSettings} ref={mapRef}
            >
                {activite.map((item, index) => {
                    return (
                        <Marker onSelect={(e) => handleSelect(e)} key={index} coordinate={{ latitude: item.geo_shape.geometry.coordinates[1], longitude: item.geo_shape.geometry.coordinates[0] }} title={item.activite} />
                    )
                })}
            </MapView>
        </View>
    )
}

export default Index;