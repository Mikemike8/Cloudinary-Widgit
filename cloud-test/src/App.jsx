
import dotenv from 'dotenv'
import { useState, useEffect } from 'react';

dotenv.config();

const DebtorForm = () => {
  const [documentUrl, setDocumentUrl] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
  });
  const [uploadStatus, setUploadStatus] = useState('');

  // Load Cloudinary Upload Widget script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = (e) => {
    e.preventDefault(); // Prevent any default behavior
    if (!formData.fullName || !formData.companyName) {
      setUploadStatus('Please fill in all required fields (Full Name and Company Name).');
      return;
    }

  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME; 
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET; 
    
    const metadata = {
      fullName: String(formData.fullName).trim(),
      companyName: String(formData.companyName).trim(),
    };

    // Configure the Cloudinary Upload Widget
    window.cloudinary.openUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local'], // Allow local file uploads
        multiple: false, // Allow only one file
        resourceType: 'auto', // Supports PDF, images, etc.
        clientAllowedFormats: ['pdf', 'jpg', 'jpeg', 'png'], // Match your accept attribute
        metadata: {
          fullName: metadata.fullName,
          companyName: metadata.companyName,
        },
      },
      (error, result) => {
        if (error) {
          console.error('Upload error:', error);
          setUploadStatus(`Failed to upload file: ${error.message || 'Unknown error. Please try again.'}`);
          return;
        }

        if (result && result.event === 'success') {
          const { secure_url, original_filename } = result.info;
          console.log('Upload result:', { url: secure_url, fileName: original_filename });
          setDocumentUrl(secure_url);
          setUploadStatus(`File "${original_filename}" uploaded successfully!`);

          // Automatically submit the form after successful upload
          if (formData.fullName && formData.companyName && secure_url) {
            console.log('Form submitted:', {
              fullName: formData.fullName,
              companyName: formData.companyName,
              documentUrl: secure_url,
            });
            setUploadStatus('Form submitted successfully!');
            setFormData({ fullName: '', companyName: '' });
            setDocumentUrl('');
          } else {
            setUploadStatus('Form submission failed: Missing required fields.');
          }
        } else if (result && result.event === 'error') {
          console.error('Upload failed:', result.info);
          const errorMessage = result.info?.message || 'Unknown error';
          const friendlyMessage =
            errorMessage.includes('File size') ? 'File is too large. Maximum size is 10MB.' :
            errorMessage.includes('Invalid format') ? 'Invalid file format. Please upload PDF, JPG, or PNG.' :
            `Upload failed: ${errorMessage}`;
          setUploadStatus(friendlyMessage);
        }
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto space-y-12">
        <section className="text-center p-0 m-0 bg-gray-100">
          <h1 className="text-[60px] font-oswald mb-6 text-slate-800 tracking-wide">
            Submit a Debtor
          </h1>
          <p className="text-lg font-bold text-gray-600 max-w-2xl mx-auto">
            Help us keep the industry informed. Use the form below to report companies or individuals who owe you money.
            Your contribution strengthens the network and promotes accountability across the board.
          </p>
        </section>

        <div className="bg-white rounded-xl shadow-lg p-8 w-full">
          <h1 className="text-5xl font-oswald text-[#222222] mb-6 border-b-2 border-[#222222] pb-4">
            Freight Claim Recovery Submission
          </h1>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name*
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name*
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documentation*
              </label>
              <button
                type="button"
                onClick={handleUpload}
                className="w-full bg-[#1a1a1a] text-white py-4 px-6 rounded-lg shadow-lg hover:bg-[#333333] transition-all duration-300 font-semibold text-lg flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m-4-4l4-4 4 4"
                  />
                </svg>
                Upload File
              </button>
              <p className="text-xs mt-1 text-gray-600">
                Required: Bill of Lading, Rate Confirmation, Invoice (PDF/JPEG/PNG)
              </p>
            </div>
          </form>

          {uploadStatus && (
            <div className="mt-4">
              <p className={`text-${uploadStatus.includes('successfully') ? 'green' : 'red'}-600`}>
                {uploadStatus}
              </p>
            </div>
          )}

          {documentUrl && (
            <div className="mt-4">
              <p className="text-green-600">Uploaded Document URL:</p>
              <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {documentUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebtorForm;