export interface Country {
    label: string;
    code: string;
    phonecode:string
  }
export interface Usuarios {
    id: string;
    cedula:string;
  }

export interface Validar {
    error: boolean;
    message: string;
  }