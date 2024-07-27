export interface Package {
    description: string;
    name: string;
    author: string;
    license: string;
    versions: {
      [version: string]: string[];
    };
  }
  
  export interface Manifest {
    v: number;
    packages: Package[];
  }