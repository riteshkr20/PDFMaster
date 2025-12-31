
import React from 'react';

const AdPlaceholder: React.FC<{ slot?: string }> = ({ slot = "general" }) => {
  return (
    <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 my-8 text-center text-slate-400 text-xs font-mono uppercase tracking-widest">
      <div className="mb-2">Advertisement</div>
      <div className="w-full h-[90px] md:h-[250px] bg-slate-200 rounded flex items-center justify-center">
        Ad Slot: {slot}
      </div>
    </div>
  );
};

export default AdPlaceholder;
