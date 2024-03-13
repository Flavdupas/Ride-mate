export interface Adresse {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  category: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  address: AddressMore
  boundingbox: string[]
}

export interface AddressMore {
  hamlet: string
  village: string
  municipality: string
  county: string
  "ISO3166-2-lvl6": string
  state: string
  "ISO3166-2-lvl4": string
  region: string
  postcode: string
  country: string
  country_code: string
}
