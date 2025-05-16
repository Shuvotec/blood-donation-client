import React, { useContext } from 'react';
import { AuthContext } from '../src/providers/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const {user,loading} = useContext(AuthContext);
    const location = useLocation();


    if(loading){
        return <div className='text-center'> <span className="loading loading-spinner loading-xl"></span></div>

    }
    if(user){
        return children;
    }
    return <Navigate to='/login' state={{from: location}} replace />
    
};

export default PrivateRoute;