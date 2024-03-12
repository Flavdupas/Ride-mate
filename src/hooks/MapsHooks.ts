import { Activite } from '@/src/models/Activite';
import { User } from "../models/UserModel";
import { ListSport } from '../constants/Sport';

export const getActivity = async (user?: User) => {
    const res = await fetch('https://angersloiremetropole.opendatasoft.com/api/explore/v2.1/catalog/datasets/equipements-sportifs-angers/records?limit=100', {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    let data = await res.json();
    let finalData: Activite[] = data.results;
    let result: Activite[] = [];
    if (user) {
        //Filtre les données par rapport aux sports choisis de l'utilisateur
        finalData.forEach(element => {
            if (element.activite) {
                const activity = element.activite.toLowerCase();
                user.favoriteSports.forEach(index => {
                    const name = ListSport[index].title.toLowerCase();
                    if (activity.includes(name)) {
                        result.push(element)
                    }
                });
            }
        });
        return result;
    }

    return finalData;
}