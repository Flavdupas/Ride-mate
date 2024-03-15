import { Activite } from "@/src/models/Activite";
import { User } from "../models/UserModel";
import { ListSport } from "../constants/Sport";
import { removeDuplicates } from "../utils/array";
import { Parking } from "../models/Parking";
import { Adresse } from "../models/Adresse";
import { TypeParking } from "../constants/TypeParking";

// Cette fonction récupère les données sur les activités sportives à partir d'une API d'Angers, en France.

export const getActivity = async () => {
  // Initialise le décalage pour la pagination (commence à 0)
  let offset = 0;

  // Construit l'URL de la requête API initiale avec les paramètres de limite et de décalage
  let url = `https://angersloiremetropole.opendatasoft.com/api/explore/v2.1/catalog/datasets/equipements-sportifs-angers/records?limit=100&offset=${offset}`;

  // Récupère les données de l'API en utilisant la méthode GET
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json", // Indique que nous acceptons une réponse JSON
      "Content-Type": "application/json", // Définir l'en-tête du type de contenu (peut être facultatif pour cette API)
    },
  });

  // Analyse la réponse JSON de l'API
  let data = await res.json();

  // Extrait le premier ensemble d'activités des données de réponse
  let finalData: Activite[] = data.results; // On suppose que "results" contient les données sur les activités

  // Obtient le nombre total d'activités disponibles à partir de la réponse de l'API
  const nbTotal = data.total_count;

  // Indicateur pour contrôler la boucle de pagination
  let done = false;

  // Boucle de pagination pour récupérer toutes les données d'activité si le nombre total dépasse 100
  while (nbTotal > 100 && !done) { // Corrige le bug de la condition d'origine
    offset += 100; // Augmente le décalage pour la page suivante de données

    // Construit l'URL pour la page suivante avec le décalage mis à jour
    url = `https://angersloiremetropole.opendatasoft.com/api/explore/v2.1/catalog/datasets/equipements-sportifs-angers/records?limit=100&offset=${offset}`;

    // Récupère les données de la page suivante
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Analyse la réponse JSON pour la page suivante
    let data = await res.json();

    // Ajoute les activités récupérées de la page suivante au tableau final des données
    finalData.push(...data.results); // Utilise le syntaxe spread pour ajouter efficacement des éléments

    // Vérifie si toutes les activités ont été récupérées en comparant la longueur des données récupérées au nombre total
    if (finalData.length === nbTotal) {
      done = true; // Quitte la boucle si toutes les données sont récupérées
    }
  }

  return finalData;
};


// Cette fonction récupère les informations d'adresse pour une activité ou un emplacement de parking donné.

export const getAdresse = async (activite: Activite | Parking) => {
  // Construit l'URL pour la requête de géocodage inversé en utilisant la latitude et la longitude de l'emplacement de l'activité ou du parking
  const url = `https://nominatim.openstreetmap.org/reverse.php?lat=${activite.geo_point_2d.lat}&lon=${activite.geo_point_2d.lon}&format=jsonv2`;

  // Récupère les données de l'API de géocodage inversé en utilisant la méthode GET
  const res = await fetch(url, {
    method: "GET",
  });

  // Analyse la réponse JSON de l'API
  const data: Adresse = await res.json();

  // Renvoie les données d'adresse extraites de la réponse de l'API
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
  // Si l'utilisateur a un type de parking favori :
  if (favoriteTypeParking !== null) {
    // Filtre la liste des parkings pour ne garder que ceux qui correspondent au type favori
    return data.filter((item) => item.acces === TypeParking[favoriteTypeParking].title);
  } else {
    // Sinon, renvoie la liste complète des parkings sans filtre
    return data;
  }
};
