import { Activite } from "@/src/models/Activite";
import { User } from "../models/UserModel";
import { ListSport } from "../constants/Sport";
import { removeDuplicates } from "../utils/array";
import { Parking } from "../models/Parking";
import { Adresse } from "../models/Adresse";
import { TypeParking } from "../constants/TypeParking";

export const getActivity = async () => {
  let offset = 0;
  let url = `https://angersloiremetropole.opendatasoft.com/api/explore/v2.1/catalog/datasets/equipements-sportifs-angers/records?limit=100&offset=${offset}`
  const res = await fetch(
    url,
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
  const nbTotal = data.total_count;
  let done = false;
  while (nbTotal > 100 && done) {
    offset += 100;
    const res = await fetch(
      url,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    finalData.push(data.results)
    if (finalData.length === nbTotal) {
      done = true;
    }
  }

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
            result.push(element);
          }
        } else {
          result.push(element);
        }
      }
    }
  });

  if (user.favoriteIndexEquip !== null) {
    const name = (await getEquipment(user))[user.favoriteIndexEquip];

    result = result.filter((item) => item.nom_equip.includes(name.title));
  }
  return result;
};

export const getParking = async () => {
  let offset = 0;
  let url = `https://angersloiremetropole.opendatasoft.com/api/explore/v2.1/catalog/datasets/parking-velo-angers/records?limit=100&offset=${offset}`
  const res = await fetch(
    url,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const resData = await res.json();
  let finalData: Parking[] = resData.results;
  const nbTotal = resData.total_count;
  let done = false;

  while (nbTotal > 100 && !done) {
    offset += 100;
    url = `https://angersloiremetropole.opendatasoft.com/api/explore/v2.1/catalog/datasets/parking-velo-angers/records?limit=100&offset=${offset}`
    const res = await fetch(
      url,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    finalData.push(...data.results)
    console.log(url)
    if (finalData.length === nbTotal) {
      done = true;
    }
  }

  let data: { results: Parking[] } = { results: finalData };
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

export const parseParking = (favoriteTypeParking: number | null, data: Parking[]) => {
  if (favoriteTypeParking !== null) {
    return data.filter((item) => item.acces === TypeParking[favoriteTypeParking].title)
  }
  return data
}