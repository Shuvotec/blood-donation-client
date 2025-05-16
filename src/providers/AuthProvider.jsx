import { createContext, useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, signInWithPopup } from "firebase/auth";    
import { app } from '../firebase/firebase.config';
import { GoogleAuthProvider } from 'firebase/auth';


const googleProvider = new GoogleAuthProvider();

export const AuthContext = createContext(null);
const auth = getAuth(app);
const AuthProvider = ({children}) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading]= useState(true);

const createuser = (email, password) => {
    setLoading(true);
       return createUserWithEmailAndPassword(auth, email, password);
}

const signIn = (email, password) => {
    setLoading(true);
   return signInWithEmailAndPassword(auth, email, password)

}

const logOut = () => {
    setLoading(true);
    return signOut(auth);


}

const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
        displayName: name, photoURL: photo
    })

}


  useEffect(() => {
  const unsubscribe =  onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

    });
    return () => {
      return unsubscribe();
    }

  }, [])

 const signInWithGoogle = () => {
    setLoading(true)
    return signInWithPopup(auth, googleProvider)


 }


    const authInfo = {
        user,
        loading,
        createuser,
        signIn,
        logOut,
        updateUserProfile,
        signInWithGoogle



    }

    return (
        <AuthContext.Provider value={authInfo}>
             {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;