import { useQuery } from "react-query";
import axios from "axios";
import { UserData } from "@/types";

const useFetchData = () => {
  return useQuery<UserData[]>("userData", async () => {
    const response = await axios.get<UserData[]>(
      "https://mocki.io/v1/3361b3fd-79ad-45c2-aba4-3ee66cc9230c"
    );
    return response.data;
  });
};

export default useFetchData;
