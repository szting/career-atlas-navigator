import React, { useState } from 'react';
import { Upload, FileText, Users, BarChart3, Settings, X, Check, AlertCircle, Key, Database, Download, Eye } from 'lucide-react';
import { UploadedFile, FileValidationResult, SkillsFramework, CoachingExercise } from '../types/admin';

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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<'skills-framework' | 'coaching-exercises' | 'career-data'>('skills-framework');
  const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const validateFileContent = async (file: File, type: string): Promise<FileValidationResult> => {
    const text = await file.text();
    const errors: string[] = [];
    const warnings: string[] = [];
    let data: any;
    let recordCount = 0;
    let preview: any[] = [];

    try {
      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        // Simple CSV parsing for demo
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0]?.split(',').map(h => h.trim());
        data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers?.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        });
      } else {
        errors.push('Unsupported file format. Please use JSON or CSV.');
        return { isValid: false, errors, warnings, recordCount: 0, preview: [] };
      }

      // Validate based on file type
      switch (type) {
        case 'skills-framework':
          if (Array.isArray(data)) {
            recordCount = data.length;
            preview = data.slice(0, 3);
            
            data.forEach((item: any, index: number) => {
              if (!item.id) errors.push(`Row ${index + 1}: Missing required field 'id'`);
              if (!item.name) errors.push(`Row ${index + 1}: Missing required field 'name'`);
              if (!item.description) warnings.push(`Row ${index + 1}: Missing description`);
            });
          } else if (data.categories) {
            // Single framework object
            recordCount = 1;
            preview = [data];
            if (!data.name) errors.push('Framework missing required field: name');
            if (!data.categories || !Array.isArray(data.categories)) {
              errors.push('Framework missing categories array');
            }
          } else {
            errors.push('Invalid skills framework format');
          }
          break;

        case 'coaching-exercises':
          if (Array.isArray(data)) {
            recordCount = data.length;
            preview = data.slice(0, 3);
            
            data.forEach((item: any, index: number) => {
              if (!item.id) errors.push(`Exercise ${index + 1}: Missing required field 'id'`);
              if (!item.title) errors.push(`Exercise ${index + 1}: Missing required field 'title'`);
              if (!item.category) errors.push(`Exercise ${index + 1}: Missing required field 'category'`);
              if (!item.questions || !Array.isArray(item.questions)) {
                warnings.push(`Exercise ${index + 1}: Missing or invalid questions array`);
              }
            });
          } else {
            errors.push('Expected array of coaching exercises');
          }
          break;

        case 'career-data':
          if (Array.isArray(data)) {
            recordCount = data.length;
            preview = data.slice(0, 3);
            
            data.forEach((item: any, index: number) => {
              if (!item.id) errors.push(`Career ${index + 1}: Missing required field 'id'`);
              if (!item.title) errors.push(`Career ${index + 1}: Missing required field 'title'`);
              if (!item.primaryType) warnings.push(`Career ${index + 1}: Missing RIASEC primary type`);
            });
          } else {
            errors.push('Expected array of career objects');
          }
          break;
      }

    } catch (error) {
      errors.push(`File parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recordCount,
      preview
    };
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
      setUploadStatus({
        type: 'error',
        message: 'Please upload a JSON or CSV file.'
      });
      return;
    }

    setUploadStatus({ type: 'loading', message: 'Validating file...' });

    try {
      // Validate file content
      const validation = await validateFileContent(file, selectedFileType);
      setValidationResult(validation);

      if (!validation.isValid) {
        setUploadStatus({
          type: 'error',
          message: `Validation failed: ${validation.errors.join(', ')}`
        });
        return;
      }

      setUploadStatus({ type: 'loading', message: 'Processing file...' });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create uploaded file record
      const uploadedFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: selectedFileType,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'completed',
        recordCount: validation.recordCount
      };

      setUploadedFiles(prev => [uploadedFile, ...prev]);

      // Store in localStorage for demo purposes
      const storageKey = `uploaded_${selectedFileType}_${uploadedFile.id}`;
      const text = await file.text();
      localStorage.setItem(storageKey, text);
      localStorage.setItem('lastUploadTime', new Date().toISOString());

      setUploadStatus({
        type: 'success',
        message: `Successfully uploaded ${file.name}. ${validation.recordCount} records processed.`
      });

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

  const downloadTemplate = (type: string) => {
    let template: any;
    let filename: string;

    switch (type) {
      case 'skills-framework':
        template = {
          name: "Sample Skills Framework",
          description: "A sample framework for demonstration",
          version: "1.0",
          categories: [
            {
              id: "technical",
              name: "Technical Skills",
              description: "Core technical competencies",
              riasecAlignment: ["investigative", "realistic"],
              skills: [
                {
                  id: "programming",
                  name: "Programming",
                  description: "Software development skills",
                  level: "intermediate",
                  relatedCareers: ["software-engineer", "data-scientist"]
                }
              ]
            }
          ]
        };
        filename = 'skills-framework-template.json';
        break;

      case 'coaching-exercises':
        template = [
          {
            id: "career-values",
            title: "Career Values Assessment",
            description: "Explore what matters most in your career",
            category: "self-reflection",
            riasecFocus: ["social", "enterprising"],
            duration: 15,
            instructions: [
              "Reflect on your core work values",
              "Rank them in order of importance",
              "Consider how they align with your current role"
            ],
            questions: [
              {
                id: "q1",
                question: "What aspects of work energize you most?",
                type: "open-ended",
                purpose: "Identify intrinsic motivators"
              }
            ]
          }
        ];
        filename = 'coaching-exercises-template.json';
        break;

      case 'career-data':
        template = [
          {
            id: "sample-career",
            title: "Sample Career Title",
            description: "Brief description of the career",
            primaryType: "investigative",
            secondaryType: "realistic",
            requiredSkills: ["skill1", "skill2"],
            workEnvironment: ["office", "remote"],
            salaryRange: "$50,000 - $100,000",
            growthOutlook: "Faster than average",
            education: "Bachelor's degree"
          }
        ];
        filename = 'career-data-template.json';
        break;

      default:
        return;
    }

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Admin Panel</h2>
              <p className="text-purple-100">Manage career data, analytics, and system settings</p>
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
              { id: 'upload', label: 'Data Management', icon: Database },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'API Settings', icon: Key }
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
                <p className="text-gray-600 mb-4">
                  Upload and manage skills frameworks, coaching exercises, and career data.
                </p>
              </div>

              {/* File Type Selection */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Select Data Type</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'skills-framework', label: 'Skills Framework', desc: 'Skill categories and competencies' },
                    { id: 'coaching-exercises', label: 'Coaching Exercises', desc: 'Guided reflection activities' },
                    { id: 'career-data', label: 'Career Data', desc: 'Job roles and requirements' }
                  ].map(({ id, label, desc }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedFileType(id as any)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        selectedFileType === id
                          ? 'border-purple-500 bg-purple-50 text-purple-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-gray-600 mt-1">{desc}</div>
                    </button>
                  ))}
                </div>
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
                  Drop {selectedFileType.replace('-', ' ')} files here
                </h4>
                <p className="text-gray-600 mb-4">
                  Supports JSON and CSV files up to 10MB
                </p>
                <div className="flex items-center justify-center space-x-3">
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
                  <button
                    onClick={() => downloadTemplate(selectedFileType)}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </button>
                </div>
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

              {/* Validation Results */}
              {validationResult && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Validation Results</h4>
                    {validationResult.preview.length > 0 && (
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center text-sm text-purple-600 hover:text-purple-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {showPreview ? 'Hide' : 'Show'} Preview
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Records:</span>
                      <span>{validationResult.recordCount}</span>
                    </div>
                    
                    {validationResult.errors.length > 0 && (
                      <div>
                        <span className="font-medium text-red-600">Errors:</span>
                        <ul className="list-disc list-inside text-red-600 ml-2">
                          {validationResult.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {validationResult.warnings.length > 0 && (
                      <div>
                        <span className="font-medium text-yellow-600">Warnings:</span>
                        <ul className="list-disc list-inside text-yellow-600 ml-2">
                          {validationResult.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {showPreview && validationResult.preview.length > 0 && (
                    <div className="mt-4 p-3 bg-white rounded border">
                      <h5 className="font-medium text-gray-900 mb-2">Data Preview</h5>
                      <pre className="text-xs text-gray-600 overflow-x-auto">
                        {JSON.stringify(validationResult.preview, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Uploads</h4>
                  <div className="space-y-2">
                    {uploadedFiles.slice(0, 5).map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-gray-500">
                              {file.type.replace('-', ' ')} • {file.recordCount} records • {new Date(file.uploadDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          file.status === 'completed' ? 'bg-green-100 text-green-800' :
                          file.status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {file.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  Coming in Part 2: Skills confidence vs career interests incongruence analysis
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h4 className="font-medium text-blue-900 mb-2">Analytics Module</h4>
                <p className="text-blue-700 text-sm">
                  This section will include incongruence detection algorithms and visualization tools.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">API Configuration</h3>
                <p className="text-gray-600 mb-4">
                  Coming in Part 3: API key management for LLM services
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <Key className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <h4 className="font-medium text-purple-900 mb-2">API Settings</h4>
                <p className="text-purple-700 text-sm">
                  This section will include secure API key management and configuration options.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
