

const FileDetails = ({ selectedFile }) => {
  console.log(selectedFile)
  return (
    <div className="flex-grow p-4">
      {selectedFile ? (
        <div>
          <h2 className="text-xl font-medium mb-4">Image Details</h2>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-md font-medium mb-2 p-2">Image Name: {selectedFile.imageName}</h3>
            <p className="text-gray-600 p-2 mb-2">ID: {selectedFile.imageId}</p>            
            <code className="p-2 text-blue-500  ">arhub pull {selectedFile.imageId}</code>            
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Select a file to view details</p>
      )}
    </div>
  );
};

export default FileDetails;
