import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-[#00FF00] rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">need anything get it Quickr</p>
    </div>
  );
};

export default Spinner;
