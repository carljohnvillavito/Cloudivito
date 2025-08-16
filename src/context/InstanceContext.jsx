import React, { createContext, useState, useContext } from 'react';
import api from '../api';
import AuthContext from './AuthContext';

const InstanceContext = createContext();

export const InstanceProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all instances for the logged-in user
  const getInstances = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/instances');
      setInstances(res.data);
    } catch (err) {
      console.error('Failed to fetch instances', err);
      setError('Could not load instances.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new instance
  const createInstance = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Here you would select the correct CPU/memory based on the plan
      const instanceData = {
          name: formData.name,
          cpu: 1, // Mock value, will be based on plan
          memory: '512MiB', // Mock value
      };
      const res = await api.post('/instances', instanceData);
      setInstances([...instances, res.data]);
    } catch (err) {
      console.error('Failed to create instance', err);
      setError('Could not create instance. Check resource limits.');
    } finally {
      setLoading(false);
    }
  };

  // Delete an instance
  const deleteInstance = async (id) => {
    try {
      await api.delete(`/instances/${id}`);
      setInstances(instances.filter((instance) => instance._id !== id));
    } catch (err) {
      console.error('Failed to delete instance', err);
      setError('Could not delete instance.');
    }
  };


  return (
    <InstanceContext.Provider
      value={{
        instances,
        loading,
        error,
        getInstances,
        createInstance,
        deleteInstance,
      }}
    >
      {children}
    </InstanceContext.Provider>
  );
};

export default InstanceContext;
