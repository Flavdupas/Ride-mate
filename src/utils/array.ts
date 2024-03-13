import { Activite } from "../models/Activite";

export function removeDuplicates(arr: Activite[]) {
  const uniqueTitles = new Set(arr.map((item) => item.nom_equip).filter(Boolean));
  return Array.from(uniqueTitles).map((title) => ({ title }));
}
