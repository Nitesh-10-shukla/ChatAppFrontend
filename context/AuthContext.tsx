import { createContext, useContext, useState } from "react";

interface AuthState {
  accessToken: string;
  expires: string;
  user: {
    name: string;
    email: string;
    id: string;
  };
}

export const initialAuthState: AuthState = {
  accessToken: "",
  expires: "",
  user: {
    name: "",
    email: "",
    id: "",
  },
};

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType>({
  auth: initialAuthState,
  setAuth: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState<AuthState>(initialAuthState);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
