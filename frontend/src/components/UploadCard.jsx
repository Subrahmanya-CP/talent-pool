import { Upload, FileText, X } from 'lucide-react';

const UploadCard = ({ files, onRemove, onUpload, uploading, uploadProgress }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
        <Upload className="w-5 h-5" />
        Upload Resumes
      </h2>

      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
        <input
          type="file"
          id="resume-upload"
          multiple
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files);
            onUpload(selectedFiles);
            e.target.value = '';
          }}
        />
        <label
          htmlFor="resume-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          <p className="text-gray-600 dark:text-gray-300">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            PDF or DOCX files (max 10 files, 10MB each)
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">Selected Files:</h3>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-2"
            >
              <span className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1">
                {file.name}
              </span>
              <button
                onClick={() => onRemove(index)}
                className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Uploading...</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCard;
