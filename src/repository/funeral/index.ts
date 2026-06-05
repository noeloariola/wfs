import { ArrangementData } from '@/common/constants/app';
import jsonData from './index.json';

export const GetFuneralAndSympathy = () => {
  const funeralProducts: ArrangementData[] = jsonData as unknown as ArrangementData[];
  return funeralProducts;
}
