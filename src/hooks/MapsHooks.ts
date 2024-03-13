import { Activite } from "@/src/models/Activite";
import { User } from "../models/UserModel";
import { ListSport } from "../constants/Sport";
import { removeDuplicates } from "../utils/array";
import { Parking } from "../models/Parking";
import { Adresse } from "../models/Adresse";

export const getActivity = async () => {
  const res = await fetch(
    "https://angersloiremetropole.opendatasoft.com/api/explore/v2.1/catalog/datasets/equipements-sportifs-angers/records?limit=100",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  let data = await res.json();
  let finalData: Activite[] = data.results;

  return finalData;
};

export const getAdresse = async (activite: Activite | Parking) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse.php?lat=${activite.geo_point_2d.lat}&lon=${activite.geo_point_2d.lon}&format=jsonv2`
  );
  const data: Adresse = await res.json();
  return data;
};

export const parseActivity: (
  data: Activite[],
  user: User,
  search: string
) => Promise<Activite[]> = async (data, user, search) => {
  let result: Activite[] = [];
  data.forEach((element) => {
    if (element.activite) {
      if (user.favoriteIndexSport !== null) {
        const activity = element.activite.toLowerCase();
        const name = ListSport[user.favoriteIndexSport].title.toLowerCase();
        if (activity.includes(name)) {
          if (search !== "") {
            const searchParsed = search.toLowerCase();
            if (activity.includes(searchParsed)) {
              result.push(element);
            }
          } else {
            result.push(element);
          }
        }
      } else {
        if (search !== "") {
          const activity = element.activite.toLowerCase();
          const searchParsed = search.toLowerCase();
          if (activity.includes(searchParsed)) {
            result.push(element)
          }
        } else {
           result.push(element);
        }
       
      }
    }
  });
  return result;
};

export const getParking = async () => {
  const res = await fetch(
    "https://angersloiremetropole.opendatasoft.com/api/explore/v2.1/catalog/datasets/parking-velo-angers/records?limit=100",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  let data: { results: Parking[] } = await res.json();
  return data.results;
};

export const getEquipment = async (user: User) => {
  const res = await fetch(
    "https://angersloiremetropole.opendatasoft.com/api/explore/v2.1/catalog/datasets/equipements-sportifs-angers/records?limit=100",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  let data = await res.json();
  let finalData: Activite[] = data.results;
  let result: Activite[] = [];
  finalData.forEach((element) => {
    if (element.activite && user.favoriteIndexSport !== null) {
      const activity = element.activite.toLowerCase();
      const name = ListSport[user.favoriteIndexSport].title.toLowerCase();
      if (activity.includes(name)) {
        result.push(element);
      }
    }
  });
  return removeDuplicates(result);
};
