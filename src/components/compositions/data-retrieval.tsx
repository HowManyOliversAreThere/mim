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
    const dt = await fetch("https://micropython.org/pi/v2/index.json").then((res) => res.json());
    setData(dt);
    return dt;
  };

  const dataContext: DataContextType = {
    data,
    fetchData: handleFetchData,
  }

  useEffect(() => {
    handleFetchData();
  });

  return (
    <DataContext.Provider value={dataContext}>
      {children}
    </DataContext.Provider>
  );
}