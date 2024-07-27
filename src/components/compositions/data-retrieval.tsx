import { Manifest } from "@/lib/manifest";
import { PropsWithChildren, ReactNode, createContext, useEffect, useState } from "react";


interface DataContextType {
    data: Manifest | null;
    fetchData: () => Promise<Manifest>;
}

export const DataContext = createContext<DataContextType>({
  data: null,
  fetchData: async () => Promise.reject(),
});

export function DataService({ children }: PropsWithChildren): ReactNode {

  const [data, setData] = useState<Manifest | null>(null);

  const handleFetchData: () => Promise<Manifest> = async () => {
    const dt = await fetch("https://wb5lsudgvpt4f4j4pxomg5z3ui0dcgjt.lambda-url.ap-southeast-2.on.aws/").then((res) => res.json());
    setData(dt);
    return dt;
  };

  const dataContext: DataContextType = {
    data,
    fetchData: handleFetchData,
  }

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <DataContext.Provider value={dataContext}>
      {children}
    </DataContext.Provider>
  );
}