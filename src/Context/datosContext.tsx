import { createContext, useState, useEffect, PropsWithChildren} from "react";
export { useContext } from "react";

export const DatosContext = createContext<any | null>(null)

export const DatosProvider = ({ children }:PropsWithChildren) => {
    const drawerWidth = 240;
    const [open, setOpen] = useState(true);

    return(
        <DatosContext.Provider value={{
            drawerWidth,
            open,
            setOpen
        }}>
        {children}
        </DatosContext.Provider>
    )

}