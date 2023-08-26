import { createContext, useState, useEffect, PropsWithChildren} from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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

    const LastLogin = async (id:string,lastlogin) => {
        const docRef = doc(db, 'usuarios', id);
       const data = await updateDoc(docRef, {
        lastLogin_at:lastlogin
            
           })
        return data
    }

    useEffect(() => {
    const unsuscribe =onAuthStateChanged(auth, userAuth => {
        if(!userAuth){
            router.push('/login')
            setUser(null)
        }

        if(userAuth){
            LastLogin(userAuth.uid,userAuth.metadata.lastSignInTime) 
            getUserById (userAuth.uid).then((data)=> {
                setUser(data)
            })    
        }else {
            setUser(null)
        }

        
        return () => {
            unsuscribe();
          };
    })  
    }, [router ])

  
    
  
    return(
        <AuthContext.Provider value={{user,login,logout,getUserById}}>
        {children}
        </AuthContext.Provider>
    )

}