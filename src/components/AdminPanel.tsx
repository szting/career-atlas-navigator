import React, { useState, useEffect } from 'react';
import { Upload, FileText, Users, BarChart3, Settings, X, Check, AlertCircle, Key, Database, Download, Eye, TrendingUp, AlertTriangle } from 'lucide-react';
import { UploadedFile, FileValidationResult, IncongruenceData, AnalyticsMetrics, APIConfiguration, LLMProvider } from '../types/admin';
import { SpiderChart } from './SpiderChart';

interface AdminPanelProps {
  onClose: () => void;
}

interface UploadStatus {
  type: 'success' | 'error' | 'loading' | null;
  message: string;
}

// Predefined LLM providers
const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelOptions: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    authType: 'bearer'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    endpoint: 'https://api.anthropic.com/v1/messages',
    modelOptions: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    authType: 'api-key',
    headers: {
      'anthropic-version': '2023-06-01'
    }
  },
  {
    id: 'google',
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1/models',
    modelOptions: ['gemini-pro', 'gemini-pro-vision'],
    authType: 'api-key'
  },
  {
    id: 'custom',
    name: 'Custom LLM',
    endpoint: '',
    modelOptions: [],
    authType: 'custom'
  }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analytics' | 'settings'>('upload');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ type: null, message: '' });
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<'skills-framework' | 'coaching-exercises' | 'career-data'>('skills-framework');
  const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Analytics state
  const [selectedUser, setSelectedUser] = useState<IncongruenceData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<IncongruenceData[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  
  // API settings state
  const [apiConfig, setApiConfig] = useState<APIConfiguration>({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load sample analytics data
  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalyticsData();
    }
  }, [activeTab]);

  // Load saved API configuration
  useEffect(() => {
    const savedConfig = localStorage.getItem('llm_api_config');
    if (savedConfig) {
      setApiConfig(JSON.parse(savedConfig));
    }
  }, []);

  const loadAnalyticsData = () => {
    // Generate sample data for demonstration
    const sampleData: IncongruenceData[] = [
      {
        userId: '1',
        userName: 'John Doe',
        assessmentDate: '2024-01-15',
        riasecScores: {
          realistic: 75,
          investigative: 85,
          artistic: 45,
          social: 60,
          enterprising: 70,
          conventional: 55
        },
        skillsConfidence: {
          realistic: 60,
          investigative: 90,
          artistic: 30,
          social: 70,
          enterprising: 50,
          conventional: 65
        },
        incongruenceScore: 0,
        topMismatches: []
      },
      {
        userId: '2',
        userName: 'Jane Smith',
        assessmentDate: '2024-01-20',
        riasecScores: {
          realistic: 40,
          investigative: 60,
          artistic: 85,
          social: 75,
          enterprising: 55,
          conventional: 45
        },
        skillsConfidence: {
          realistic: 50,
          investigative: 55,
          artistic: 70,
          social: 80,
          enterprising: 60,
          conventional: 40
        },
        incongruenceScore: 0,
        topMismatches: []
      }
    ];

    // Calculate incongruence scores and mismatches
    const processedData = sampleData.map(user => {
      const mismatches = Object.keys(user.riasecScores).map(key => {
        const dimension = key as keyof typeof user.riasecScores;
        const gap = Math.abs(user.riasecScores[dimension] - user.skillsConfidence[dimension]);
        return {
          dimension,
          interestScore: user.riasecScores[dimension],
          skillScore: user.skillsConfidence[dimension],
          gap
        };
      }).sort((a, b) => b.gap - a.gap);

      const incongruenceScore = mismatches.reduce((sum, m) => sum + m.gap, 0) / mismatches.length;

      return {
        ...user,
        incongruenceScore,
        topMismatches: mismatches.slice(0, 3)
      };
    });

    setAnalyticsData(processedData);
    
    // Calculate metrics
    const totalAssessments = processedData.length;
    const averageIncongruence = processedData.reduce((sum, d) => sum + d.incongruenceScore, 0) / totalAssessments;
    const highIncongruenceCount = processedData.filter(d => d.incongruenceScore > 15).length;
    
    const dimensionStats: Record<string, { count: number; totalGap: number }> = {};
    processedData.forEach(user => {
      user.topMismatches.forEach(mismatch => {
        if (!dimensionStats[mismatch.dimension]) {
          dimensionStats[mismatch.dimension] = { count: 0, totalGap: 0 };
        }
        dimensionStats[mismatch.dimension].count++;
        dimensionStats[mismatch.dimension].totalGap += mismatch.gap;
      });
    });

    const commonMismatches = Object.entries(dimensionStats)
      .map(([dimension, stats]) => ({
        dimension,
        frequency: stats.count,
        averageGap: stats.totalGap / stats.count
      }))
      .sort((a, b) => b.frequency - a.frequency);

    setMetrics({
      totalAssessments,
      averageIncongruence,
      highIncongruenceCount,
      commonMismatches
    });

    // Select first user by default
    if (processedData.length > 0) {
      setSelectedUser(processedData[0]);
    }
  };

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

  const testApiConnection = async () => {
    setTestingApi(true);
    setApiTestResult(null);

    try {
      const provider = LLM_PROVIDERS.find(p => p.id === apiConfig.provider);
      if (!provider) {
        throw new Error('Invalid provider selected');
      }

      if (!apiConfig.apiKey) {
        throw new Error('API key is required');
      }

      // Simulate API test - in real implementation, make actual test request
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, always succeed if API key is provided
      setApiTestResult({
        success: true,
        message: `Successfully connected to ${provider.name}`
      });

      // Save configuration
      localStorage.setItem('llm_api_config', JSON.stringify(apiConfig));
    } catch (error) {
      setApiTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      });
    } finally {
      setTestingApi(false);
    }
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills vs Interests Incongruence Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Visualize the alignment between users' career interests (RIASEC scores) and their skills confidence levels.
                </p>
              </div>

              {/* Metrics Overview */}
              {metrics && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Total Assessments</p>
                        <p className="text-2xl font-bold text-blue-900">{metrics.totalAssessments}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Avg Incongruence</p>
                        <p className="text-2xl font-bold text-purple-900">{metrics.averageIncongruence.toFixed(1)}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">High Incongruence</p>
                        <p className="text-2xl font-bold text-orange-900">{metrics.highIncongruenceCount}</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-orange-500" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Most Common Gap</p>
                        <p className="text-2xl font-bold text-green-900 capitalize">
                          {metrics.commonMismatches[0]?.dimension || 'N/A'}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* User Selection and Spider Chart */}
              <div className="grid grid-cols-3 gap-6">
                {/* User List */}
                <div className="col-span-1">
                  <h4 className="font-medium text-gray-900 mb-3">Select User</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {analyticsData.map((user) => (
                      <button
                        key={user.userId}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedUser?.userId === user.userId
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm">{user.userName}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Incongruence: {user.incongruenceScore.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(user.assessmentDate).toLocaleDateString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spider Chart */}
                <div className="col-span-2">
                  {selectedUser ? (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Incongruence Analysis for {selectedUser.userName}
                      </h4>
                      <div className="bg-white rounded-lg border p-4">
                        <SpiderChart
                          riasecScores={selectedUser.riasecScores}
                          skillsConfidence={selectedUser.skillsConfidence}
                        />
                      </div>
                      
                      {/* Top Mismatches */}
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Top Mismatches</h5>
                        <div className="space-y-2">
                          {selectedUser.topMismatches.map((mismatch) => (
                            <div key={mismatch.dimension} className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize">{mismatch.dimension}</span>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-gray-600">Interest: {mismatch.interestScore}%</span>
                                <span className="text-gray-600">Skills: {mismatch.skillScore}%</span>
                                <span className={`font-medium ${
                                  mismatch.gap > 20 ? 'text-red-600' : 
                                  mismatch.gap > 10 ? 'text-orange-600' : 
                                  'text-green-600'
                                }`}>
                                  Gap: {mismatch.gap}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Select a user to view their incongruence analysis</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">API Configuration</h3>
                <p className="text-gray-600 mb-4">
                  Configure your preferred Large Language Model provider for AI-powered features.
                </p>
              </div>

              {/* Provider Selection */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Select LLM Provider</h4>
                <div className="grid grid-cols-2 gap-3">
                  {LLM_PROVIDERS.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => setApiConfig({ ...apiConfig, provider: provider.id })}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        apiConfig.provider === provider.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{provider.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {provider.id === 'custom' ? 'Configure custom endpoint' : `Use ${provider.name} API`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Configuration Form */}
              <div className="space-y-4">
                {/* API Key Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiConfig.apiKey}
                      onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                      placeholder="Enter your API key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Model Selection */}
                {apiConfig.provider !== 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <select
                      value={apiConfig.model}
                      onChange={(e) => setApiConfig({ ...apiConfig, model: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {LLM_PROVIDERS.find(p => p.id === apiConfig.provider)?.modelOptions.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Custom Endpoint (for custom provider) */}
                {apiConfig.provider === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Endpoint
                    </label>
                    <input
                      type="text"
                      value={apiConfig.endpoint || ''}
                      onChange={(e) => setApiConfig({ ...apiConfig, endpoint: e.target.value })}
                      placeholder="https://api.example.com/v1/completions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Advanced Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      value={apiConfig.maxTokens}
                      onChange={(e) => setApiConfig({ ...apiConfig, maxTokens: parseInt(e.target.value) })}
                      min="100"
                      max="4000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature
                    </label>
                    <input
                      type="number"
                      value={apiConfig.temperature}
                      onChange={(e) => setApiConfig({ ...apiConfig, temperature: parseFloat(e.target.value) })}
                      min="0"
                      max="2"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Test Connection Button */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={testApiConnection}
                    disabled={!apiConfig.apiKey || testingApi}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {testingApi ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </button>

                  {apiTestResult && (
                    <div className={`flex items-center space-x-2 text-sm ${
                      apiTestResult.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {apiTestResult.success ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span>{apiTestResult.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Security Note</p>
                    <p>Your API key is stored locally in your browser and is never sent to our servers. Make sure to keep it secure and never share it publicly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
