import { useState } from 'react';

const FileList = ({ files, onItemClick }) => {
  return (
    <div className="w-full md:w-1/4 p-4 bg-gray-100">
      <h2 className="text-xl font-medium mb-4">Container Image List</h2>
        <ul className="space-y-2">
          { Array.isArray(files) ? files.map((file, index) => (
          <li key={index} className="cursor-pointer hover:text-blue-500" onClick={() => onItemClick(index)}>
            {file.imageName}
          </li>
          )) : null}
        </ul>
    </div>
  );
};

export default FileList;
