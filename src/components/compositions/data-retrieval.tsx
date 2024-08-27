import { Manifest } from "@/lib/manifest";
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useEffect,
  useState,
} from "react";

interface DataContextType {
  data: Manifest | null;
  fetchData: () => Promise<Manifest>;
}

// TODO: replace once path added
// const manifestUrl = "https://micropython.org/pi/v2/index.json";
const manifestUrl =
  "https://wb5lsudgvpt4f4j4pxomg5z3ui0dcgjt.lambda-url.ap-southeast-2.on.aws/";

export const DataContext = createContext<DataContextType>({
  data: null,
  fetchData: async () => Promise.reject(),
});

export function DataService({ children }: PropsWithChildren): ReactNode {
  const [data, setData] = useState<Manifest | null>(null);

  const handleFetchData: () => Promise<Manifest> = async () => {
    const dt = await fetch(manifestUrl).then((res) => res.json());
    setData(dt);
    return dt;
  };

  const dataContext: DataContextType = {
    data,
    fetchData: handleFetchData,
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <DataContext.Provider value={dataContext}>{children}</DataContext.Provider>
  );
}
