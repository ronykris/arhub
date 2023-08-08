

const FileDetails = ({ selectedFile }) => {
  return (
    <div className="flex-grow p-4">
      {selectedFile ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">File Details</h2>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-md font-medium mb-2">{selectedFile.name}</h3>
            <p className="text-gray-600">{selectedFile.details}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Select a file to view details</p>
      )}
    </div>
  );
};

export default FileDetails;
