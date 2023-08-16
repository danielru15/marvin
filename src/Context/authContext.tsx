import { createContext, useState, useEffect, PropsWithChildren} from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
export { useContext,useEffect } from "react";


export const AuthContext = createContext<any | null>(null)

export const AuthProvider = ({ children }:PropsWithChildren) => {
    const [user, setUser] = useState<any>(null)
    const router = useRouter();
    
    const login = (email:string,password:string) => {
        const loginUser =signInWithEmailAndPassword(auth, email, password)
        return loginUser
    }

    const logout = async () => {
        setUser(null)
        await signOut(auth)
        router.push('/login')
    }
    const getUserById = async (id:string) => {
        const docRef = doc(db, 'usuarios', id);
        const result = await getDoc(docRef);
        const finalData = result.data()
        return finalData
    }

    useEffect(() => {
    const unsuscribe =onAuthStateChanged(auth, userAuth => {
        if(!userAuth){
            router.push('/login')
        }

        if(userAuth){
            console.log(userAuth)
            getUserById (userAuth.uid).then((data)=> {
                setUser(data)
                console.log(data)
            })
            
        }

        
        return () => {
            unsuscribe();
          };
    })  
    }, [useRouter ])

  
    
  
    return(
        <AuthContext.Provider value={{user,login,logout}}>
        {children}
        </AuthContext.Provider>
    )

}