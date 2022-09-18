import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { database } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password, username) {
    auth.createUserWithEmailAndPassword(email, password).then((cred) => {
      console.log("credential: ", cred);
      cred.user.updateProfile({
        displayName: username,
      });
      database.users.doc(cred.user.uid).set({
        currentLevel: 1,
        finishedLevel1: [],
        admin: false,
        vocabReview: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {} },
        streak: 0,
        learningHistory: {}
      });
    });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function deleteUser() {
    return currentUser.delete();
  }

  function updateUsername(username) {
    return currentUser.updateProfile({ displayName: username });
  }

  function updatePic(pic) {
    return currentUser.updateProfile({ photoURL: pic });
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateUsername,
    updateEmail,
    updatePassword,
    updatePic,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
