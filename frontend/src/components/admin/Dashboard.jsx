import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/dashboard/stats`);
        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">טוען סטטיסטיקות...</div>;
  }

  const StatCard = ({ label, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">דוח ניהול</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="לקוחות"
          value={stats?.customers || 0}
          icon="👥"
        />
        <StatCard
          label="קטגוריות"
          value={stats?.categories || 0}
          icon="📁"
        />
        <StatCard
          label="מוצרים"
          value={stats?.products || 0}
          icon="📦"
        />
        <StatCard
          label="הזמנות"
          value={stats?.totalOrders || 0}
          icon="📋"
        />
        <StatCard
          label="הכנסות"
          value={`₪${(stats?.totalRevenue || 0).toFixed(0)}`}
          icon="💰"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">קליל ממש</h3>
        <p className="text-gray-600">
          ברוכים הבאים למערכת הניהול של ח.ס אלפי. 
          משתמשו בטאבים שלמעלה כדי לנהל לקוחות, קטגוריות, מוצרים והזמנות.
        </p>
      </div>
    </div>
  );
}
