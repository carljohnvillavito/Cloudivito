const Instance = require('../models/Instance');
const User = require('../models/User');

// --- Mock Incus Service ---
// In a real application, this would be in its own file (e.g., services/incus.js)
// and would make actual HTTP requests to the Incus API.
const incusAPI = {
  createContainer: async (name, cpu, memory) => {
    console.log(`Mock Incus: Creating container ${name} with ${cpu} vCPU and ${memory} memory.`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate a successful creation with a fake ID and network details
    return {
      id: `incus-${Date.now()}`,
      ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      ssh_port: Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000,
    };
  },
  deleteContainer: async (incusId) => {
    console.log(`Mock Incus: Deleting container ${incusId}.`);
     // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true };
  }
};
// --- End Mock Incus Service ---


// @desc    Create a new instance
// @route   POST /api/instances
// @access  Private
exports.createInstance = async (req, res) => {
    const { name, cpu, memory } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        // TODO: Add logic to check instance limits based on user.plan

        // 1. Call Incus API to create the container
        const incusData = await incusAPI.createContainer(name, cpu, memory);
        if (!incusData) {
            return res.status(500).json({ msg: "Failed to create container in Incus" });
        }

        // 2. Create instance in MongoDB
        const newInstance = new Instance({
            owner: userId,
            name,
            incusId: incusData.id,
            cpu,
            memory,
            ip: incusData.ip,
            ssh_port: incusData.ssh_port,
            status: 'running', // Assume it auto-starts
        });

        const instance = await newInstance.save();
        
        // 3. Link instance to user
        user.instances.push(instance.id);
        await user.save();
        
        res.status(201).json(instance);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all instances for a user
// @route   GET /api/instances
// @access  Private
exports.getInstances = async (req, res) => {
    try {
        const instances = await Instance.find({ owner: req.user.id });
        res.json(instances);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// @desc    Delete an instance
// @route   DELETE /api/instances/:id
// @access  Private
exports.deleteInstance = async (req, res) => {
    try {
        const instance = await Instance.findById(req.params.id);

        if (!instance) {
            return res.status(404).json({ msg: 'Instance not found' });
        }
        
        // Ensure user owns the instance
        if (instance.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // 1. Call Incus API to delete the container
        await incusAPI.deleteContainer(instance.incusId);

        // 2. Remove from MongoDB
        await instance.deleteOne();

        // 3. Unlink from user
        await User.findByIdAndUpdate(req.user.id, { $pull: { instances: instance.id } });

        res.json({ msg: 'Instance removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
