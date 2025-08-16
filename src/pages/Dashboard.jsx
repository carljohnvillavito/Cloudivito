import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import InstanceContext from '../context/InstanceContext';
import InstanceItem from '../components/instances/InstanceItem';
import CreateInstanceModal from '../components/instances/CreateInstanceModal';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { instances, loading, getInstances, error } = useContext(InstanceContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getInstances();
    // eslint-disable-next-line
  }, []); // Run only once when the component mounts

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Welcome, {user && user.username}!
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          + Create Instance
        </button>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Instances</h2>
        {loading && <p>Loading instances...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {!loading && instances.length === 0 ? (
          <p className="text-gray-600">You have no instances yet. Click "Create Instance" to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instances.map((instance) => (
              <InstanceItem key={instance._id} instance={instance} />
            ))}
          </div>
        )}
      </div>

      <CreateInstanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
