
import React from 'react';
import type { PackageName } from '../types';

interface PackageCardProps {
  pkg: {
    name: PackageName;
    pieces: string;
    material: string;
    description: string;
    image: string;
  };
  onSelect: (packageName: PackageName) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 w-80 md:w-96 flex-shrink-0">
      <img src={pkg.image} alt={pkg.name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
        <p className="text-gray-600 mb-4">{pkg.description}</p>
        <div className="text-sm text-gray-700 space-y-2 mb-6">
          <p><span className="font-semibold">عدد القطع:</span> {pkg.pieces}</p>
          <p><span className="font-semibold">الخامة:</span> {pkg.material}</p>
        </div>
        <button
          onClick={() => onSelect(pkg.name)}
          className="w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
        >
          اختر هذا البكج
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
