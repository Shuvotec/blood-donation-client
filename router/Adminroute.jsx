import React, { useContext } from 'react';
import { AuthContext } from '../src/providers/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const Adminroute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (!user && !loading) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  
  const email = user?.email;
  const { data: userInfo, isLoading, isError } = useQuery(
    ['user', email],
    () =>
      fetch(`http://localhost:5000/userall/${email}`).then(res => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      }),
    { enabled: !!email }
  );

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  if (isError || !userInfo || userInfo.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default Adminroute;
