import jsonData from './index.json';
import { ArrangementData } from '@/common/constants/app';

export const GetRawItems = () => {
  return jsonData as unknown as ArrangementData[];
};

export default GetRawItems;
