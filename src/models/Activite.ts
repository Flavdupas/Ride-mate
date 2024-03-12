import { LatLng } from "react-native-maps"

export interface Activite {
    code_equip: string
    nom_equip: string
    nombre: string
    categorie: string
    code_fam_eq: string
    nom_fam_eq: string
    equip_1: string
    equip_2: string
    nat_sol: string
    nat_libe: string
    nb_place: string
    nb_vestiaire: string
    eq_convivial: string
    date_service: string
    date_ref: string
    activite: string
    url: string
    mail: string
    insee: string
    exploit: string
    source: string
    nom: string
    nom_com: string
    angers_stadium: any
    geo_point_2d: GeoPoint2d
    geo_shape: GeoShape
  }
  
  export interface GeoPoint2d {
    lon: number
    lat: number
  }
  
  export interface GeoShape {
    type: string
    geometry: Geometry
  }
  
  export interface Geometry {
    coordinates: number[]
  }
  