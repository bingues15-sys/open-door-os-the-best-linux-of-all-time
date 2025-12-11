import React, { useState } from 'react';
import { AppWindowProps } from '../../types';

export const Notepad: React.FC<AppWindowProps> = () => {
  const [text, setText] = useState('Welcome to Open Door OS.\n\nThis is a simple text editor.');

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      <div className="flex gap-2 p-1 bg-slate-800 border-b border-slate-700 text-xs">
        <button className="px-2 py-1 hover:bg-slate-700 rounded transition-colors">File</button>
        <button className="px-2 py-1 hover:bg-slate-700 rounded transition-colors">Edit</button>
        <button className="px-2 py-1 hover:bg-slate-700 rounded transition-colors">View</button>
      </div>
      <textarea
        className="flex-1 w-full bg-transparent p-4 outline-none resize-none font-mono text-sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="bg-slate-800 p-1 text-xs text-slate-500 flex justify-end px-2">
        {text.length} characters
      </div>
    </div>
  );
};