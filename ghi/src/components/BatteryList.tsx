import React, { useEffect, useState } from 'react';

// Define a type for the battery data
interface Battery {
  id: string;
  location: string;
  capacity: number;
}

const BatteryList: React.FC = () => {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatteries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/batteries`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Battery[] = await response.json();
        setBatteries(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchBatteries();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Batteries</h1>
      <ul>
        {batteries.map((battery) => (
          <li key={battery.id}>
            {battery.location} - {battery.capacity} kWh
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BatteryList;
