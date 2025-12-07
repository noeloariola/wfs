import jsonData from './index.json' with { type: "json" }; // optional in ESM
import { ArrangementData } from '@/common/constants/app';


export const GetBouquets = () => {
  const bouquets: ArrangementData[] = jsonData as unknown as ArrangementData[];
  return bouquets;
}