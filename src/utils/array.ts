import { Activite } from "../models/Activite";

export function removeDuplicates(arr: Activite[]) {
    let data: { title: string }[] = [];
    arr.forEach((item) => {
        if (item.nom_equip) {
            data.push({ title: item.nom_equip });
        }
    })
    return data;
}