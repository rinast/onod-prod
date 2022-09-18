import React, {useEffect, useState} from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../firebase"


const AdminRoute = ({children}) => {
  const {currentUser} = useAuth()
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    database.users.doc(currentUser.uid).get().then(doc => {
      if (doc.data().admin) {
        setIsAdmin(doc.data().admin)
      } else {
        setIsAdmin(false);
      }
      
    })
  }, [])

  return isAdmin?children:<Navigate to="/"/>
}

export default AdminRoute