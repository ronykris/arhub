import { useState } from 'react';

const FileList = ({ files, onItemClick }) => {
  return (
    <div className="w-1/4 p-4 bg-gray-100">
      <h2 className="text-lg font-semibold mb-4">File List</h2>
      <ul className="space-y-2">
        {files.map((file, index) => (
          <li
            key={index}
            className="cursor-pointer hover:text-blue-500"
            onClick={() => onItemClick(file)}
          >
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
