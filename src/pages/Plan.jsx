import React, { useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const plans = [
    { id: 'Basic', name: 'Basic', price: '₱75', instances: 6, vcpu: '2.5', memory: '1 GiB' },
    { id: 'Pro', name: 'Pro', price: '₱175', instances: 12, vcpu: '4.0', memory: '5 GiB' },
    { id: 'Business', name: 'Business', price: '₱250', instances: 35, vcpu: '8.0', memory: '12 GiB' },
];

const PlanCard = ({ plan, onSubscribe }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className={`p-6 rounded-lg shadow-lg border-t-4 ${plan.name === 'Pro' ? 'border-blue-500' : 'border-gray-300'} bg-white flex flex-col`}>
            <h3 className="text-2xl font-bold text-center">{plan.name}</h3>
            <p className="text-4xl font-extrabold text-center my-4">{plan.price}<span className="text-base font-medium text-gray-500">/mo</span></p>
            <ul className="space-y-3 text-gray-600 mb-6 flex-grow">
                <li><span className="font-semibold text-blue-500">✓</span> {plan.instances} Instances</li>
                <li><span className="font-semibold text-blue-500">✓</span> {plan.vcpu} vCPU / instance</li>
                <li><span className="font-semibold text-blue-500">✓</span> {plan.memory} Memory / instance</li>
            </ul>
            <button
                onClick={() => onSubscribe(plan.id)}
                disabled={user && user.plan === plan.id}
                className="w-full mt-auto py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {user && user.plan === plan.id ? 'Current Plan' : 'Subscribe'}
            </button>
        </div>
    );
};

const Plans = () => {
    const handleSubscribe = async (planId) => {
        try {
            const res = await api.post('/billing/create-checkout-session', { planId });
            // Redirect user to PayMongo's checkout page
            window.location.href = res.data.checkout_url;
        } catch (error) {
            console.error("Error creating checkout session:", error);
            alert("Could not initiate subscription. Please try again.");
        }
    };

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold text-center mb-10">Choose Your Plan</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {plans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} onSubscribe={handleSubscribe} />
                ))}
            </div>
        </div>
    );
};

export default Plans;
