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

const manifestUrl = "https://micropython.org/pi/v2/index.json";

export const DataContext = createContext<DataContextType>({
  data: null,
  fetchData: async () => Promise.reject(),
});

export function DataService({ children }: PropsWithChildren): ReactNode {
  const [data, setData] = useState<Manifest | null>(null);

  const handleFetchData: () => Promise<Manifest> = async () => {
    const dt = await fetch(manifestUrl).then((res) => res.json());
    for (const pkg of dt.packages) {
      if (pkg.path) {
        pkg.tags = pkg.path.split("/").slice(0, -1);
      } else {
        pkg.tags = [];
      }
    }
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
