import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


const PrivateRoute = (props) => {
  const {currentUser} = useAuth();

  return currentUser?props.children:<Navigate to="/login"/>
}

export default PrivateRoute

// export default function PrivateRoute({ component: Component, ...rest }) {
//   const currentUser = useAuth();

//   return (
//     <Route
//       {...rest}
//       render={(props) => {
//         return currentUser ? (
//           <Component {...props} />
//         ) : (
//           <Navigate to="/login" />
//         );
//       }}
//     ></Route>
//   );
// }
