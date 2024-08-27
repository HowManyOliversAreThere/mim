export interface Package {
    description: string;
    name: string;
    author: string;
    license: string;
    versions: {
      [version: string]: string[];
    };
    path?: string;
    url?: string;
    version: string;
    tags: string[];
  }
  
  export interface Manifest {
    v: number;
    packages: Package[];
  }