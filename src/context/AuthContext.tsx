import { ReactNode, useState, createContext, useEffect } from "react";
import { UserType } from "../types/customTypes";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

// props
type AuthContextProviderProps = {
  children: ReactNode;
};

// context type
type AuthContextType = {
  user: UserType | null;
  setUser: (a: UserType | null) => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
};

// initial value
const AuthContextInitialValue = {
  user: {} as UserType,
  setUser: () => {
    throw new Error("Context not initialised");
  },
  register: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => {
    throw new Error("Context not initialised");
  },
  refreshUser: () => Promise.resolve(),
};

// Create context
export const AuthContext = createContext<AuthContextType>(
  AuthContextInitialValue
);

// provider of our context (the store)

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);

  // register user
  const register = async (
    userEmail: string,
    password: string,
    name: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        userEmail: user.email,
        name: name,
      });

      console.log("User registered and data saved to Firestore.");
      if (user.email) {
        setUser({ email: user.email, uid: user.uid, name: name });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // login
  const login = async (userEmail: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        password
      );
      const userObject = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", userObject.uid));
      const userData = userDoc.data();

      if (userObject.email && userObject.uid && userData?.name) {
        setUser({
          email: userObject.email,
          uid: userObject.uid,
          name: userData.name,
          favorites: userData.favorites,
          imageUrl: userData.imageUrl,
        });
      } else {
        throw new Error("Email does not exist.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // refresh the user
  const refreshUser = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (userData) {
        console.log("%c user signed in", "color:green", user, user.uid);
        setUser({
          email: user.email ?? "",
          uid: user.uid,
          name: userData.name ?? "",
          favorites: userData.favorites,
          imageUrl: userData.imageUrl,
        });
      } else {
        console.error("No user data found in Firestore.");
        setUser(null);
      }
    }
  };

  // check user status
  const checkUserStatus = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData) {
          console.log("%c user signed in", "color:green", user, user.uid);
          setUser({
            email: user.email ?? "",
            uid: user.uid,
            name: userData.name ?? "",
            favorites: userData.favorites,
            imageUrl: userData.imageUrl,
          });
        } else {
          console.error("No user data found in Firestore.");
          setUser(null);
        }
      } else {
        console.log("%c user signed out", "color:red");
        setUser(null);
      }
    });
  };

  // logout
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("%c user signed out successfully", "color:green");
      setUser(null);
      // Sign-out successful.
    } catch (error) {
      console.log("%c sign-out failed", "color:red");
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        register,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
