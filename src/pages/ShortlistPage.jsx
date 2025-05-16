import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShortlistPage = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/messages');
        // Flatten all messages and filter by user email
        const userMsgs = res.data.flatMap(group =>
          group.messages.map(msg => ({
            ...msg,
            propertyTitle: group.propertyTitle,
            propertyId: group.propertyId
          }))
        ).filter(msg => msg.userEmail === user.email);
        setRequests(userMsgs);
      } catch (err) {
        setRequests([]);
      }
      setLoading(false);
    };
    if (user?.email) fetchRequests();
  }, [user]);

  if (!user?.email) return <div className="p-8 text-center text-red-500">Please log in to view your shortlist.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-400">My Shortlist</h2>
      {loading ? (
        <div>Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-gray-400">You have not requested any properties yet.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((req, idx) => (
            <div key={req._id || idx} className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-lg text-purple-300">{req.propertyTitle} (ID: {req.propertyId})</div>
                <div className="text-gray-300">Message: {req.message}</div>
                <div className="text-xs text-gray-400">{new Date(req.timestamp).toLocaleString()}</div>
              </div>
              <div className="mt-2 md:mt-0 md:ml-4">
                {req.status === 'approved' ? (
                  <span className="text-green-400 font-semibold">Approved</span>
                ) : (
                  <span className="text-yellow-400 font-semibold">Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShortlistPage; 