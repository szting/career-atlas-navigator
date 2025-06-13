import React, { useState } from 'react';
import { Upload, FileText, Users, BarChart3, Settings, X, Check, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

interface UploadStatus {
  type: 'success' | 'error' | 'loading' | null;
  message: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analytics' | 'settings'>('upload');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ type: null, message: '' });
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
      setUploadStatus({
        type: 'error',
        message: 'Please upload a JSON or CSV file containing career data.'
      });
      return;
    }

    setUploadStatus({ type: 'loading', message: 'Processing file...' });

    try {
      const text = await file.text();
      
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text);
        // Validate JSON structure
        if (!Array.isArray(data) || !data.every(item => item.id && item.title)) {
          throw new Error('Invalid JSON format. Expected array of career objects with id and title.');
        }
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      setUploadStatus({
        type: 'success',
        message: `Successfully uploaded ${file.name}. ${file.name.endsWith('.json') ? JSON.parse(text).length : 'Multiple'} career records processed.`
      });

      // Store in localStorage for demo purposes
      localStorage.setItem('uploadedCareerData', text);
      localStorage.setItem('lastUploadTime', new Date().toISOString());

    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const getStatusIcon = () => {
    switch (uploadStatus.type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  const lastUpload = localStorage.getItem('lastUploadTime');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <p className="text-purple-100">Manage career data and system settings</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'upload', label: 'File Upload', icon: Upload },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Career Data</h3>
                <p className="text-gray-600 mb-4">
                  Upload JSON or CSV files containing career information to update the system database.
                </p>
              </div>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Drop files here or click to upload
                </h4>
                <p className="text-gray-600 mb-4">
                  Supports JSON and CSV files up to 10MB
                </p>
                <input
                  type="file"
                  accept=".json,.csv"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </label>
              </div>

              {/* Upload Status */}
              {uploadStatus.type && (
                <div className={`flex items-center space-x-3 p-4 rounded-lg ${
                  uploadStatus.type === 'success' ? 'bg-green-50 text-green-800' :
                  uploadStatus.type === 'error' ? 'bg-red-50 text-red-800' :
                  'bg-blue-50 text-blue-800'
                }`}>
                  {getStatusIcon()}
                  <span>{uploadStatus.message}</span>
                </div>
              )}

              {/* File Format Guide */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Expected File Format</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>JSON:</strong> Array of career objects with required fields: id, title, description, primaryType</p>
                  <p><strong>CSV:</strong> Headers should include: id, title, description, primaryType, salaryRange, education</p>
                </div>
              </div>

              {/* Last Upload Info */}
              {lastUpload && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-1">Last Upload</h4>
                  <p className="text-sm text-blue-700">
                    {new Date(lastUpload).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">System Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Overview of assessment usage and career recommendation patterns.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Assessments</p>
                      <p className="text-2xl font-bold text-blue-900">1,247</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Career Paths</p>
                      <p className="text-2xl font-bold text-green-900">156</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Completion Rate</p>
                      <p className="text-2xl font-bold text-purple-900">87%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Popular Career Types</h4>
                <div className="space-y-2">
                  {['Investigative (32%)', 'Artistic (24%)', 'Social (18%)', 'Enterprising (15%)', 'Realistic (11%)'].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item}</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${[32, 24, 18, 15, 11][index]}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
                <p className="text-gray-600 mb-4">
                  Configure assessment parameters and system behavior.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Analytics Tracking</h4>
                    <p className="text-sm text-gray-600">Track user interactions for improvement</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-save Progress</h4>
                    <p className="text-sm text-gray-600">Save user progress automatically</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Assessment Timeout</h4>
                  <p className="text-sm text-gray-600 mb-3">Maximum time allowed per assessment section</p>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>No timeout</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
