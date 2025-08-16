import React, { useContext } from 'react';
import InstanceContext from '../../context/InstanceContext';

const InstanceItem = ({ instance }) => {
  const { deleteInstance } = useContext(InstanceContext);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${instance.name}"?`)) {
        deleteInstance(instance._id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800">{instance.name}</h3>
        <p className="text-sm text-gray-500 mt-1">ID: {instance.incusId}</p>
        <div className="mt-4 space-y-2">
            <p className="text-gray-700"><span className="font-semibold">IP Address:</span> {instance.ip}</p>
            <p className="text-gray-700"><span className="font-semibold">SSH Port:</span> {instance.ssh_port}</p>
            <p className="text-gray-700"><span className="font-semibold">Status:</span> 
                <span className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    instance.status === 'running' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {instance.status.charAt(0).toUpperCase() + instance.status.slice(1)}
                </span>
            </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
         <button 
            onClick={handleDelete}
            className="text-sm font-medium text-red-600 hover:text-red-800"
        >
            Delete
        </button>
      </div>
    </div>
  );
};

export default InstanceItem;
