export interface Parking {
    id_box: number
    equipement: string
    capacite: string
    type: string
    gestion: string
    acces: string
    securise: string
    id_voie: string
    voie: string
    ccocom: string
    intermod: string
    nom_parkng: string
    contexte: string
    date_maj: string
    geo_shape: GeoShape
    geo_point_2d: GeoPoint2d
    code_insee: string
  }
  
  export interface GeoShape {
    type: string
    geometry: Geometry
    properties: Properties
  }
  
  export interface Geometry {
    coordinates: number[]
    type: string
  }
  
  export interface Properties {}
  
  export interface GeoPoint2d {
    lon: number
    lat: number
  }
  