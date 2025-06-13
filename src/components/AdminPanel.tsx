import React, { useState, useEffect } from 'react';
import { Upload, FileText, Users, BarChart3, Settings, X, Check, AlertCircle, Key, Database, Download, Eye, Save, TestTube, Trash2 } from 'lucide-react';
import { UploadedFile, FileValidationResult, SkillsFramework, CoachingExercise, LLMProvider, APIKeyConfig } from '../types/admin';

interface AdminPanelProps {
  onClose: () => void;
}

interface UploadStatus {
  type: 'success' | 'error' | 'loading' | null;
  message: string;
}

interface APITestResult {
  provider: string;
  success: boolean;
  message: string;
  responseTime?: number;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analytics' | 'settings'>('upload');
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ type: null, message: '' });
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<'skills-framework' | 'coaching-exercises' | 'career-data'>('skills-framework');
  const [validationResult, setValidationResult] = useState<FileValidationResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // API Settings State
  const [apiConfigs, setApiConfigs] = useState<APIKeyConfig[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');
  const [testResults, setTestResults] = useState<APITestResult[]>([]);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const llmProviders: LLMProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5 Turbo models',
      baseUrl: 'https://api.openai.com/v1',
      authType: 'bearer',
      requiredFields: ['apiKey'],
      testEndpoint: '/models',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
      icon: '🤖'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude 3 models',
      baseUrl: 'https://api.anthropic.com/v1',
      authType: 'header',
      requiredFields: ['apiKey', 'version'],
      testEndpoint: '/messages',
      models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
      icon: '🧠'
    },
    {
      id: 'google',
      name: 'Google AI',
      description: 'Gemini models',
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      authType: 'query',
      requiredFields: ['apiKey'],
      testEndpoint: '/models',
      models: ['gemini-pro', 'gemini-pro-vision'],
      icon: '🔍'
    },
    {
      id: 'azure',
      name: 'Azure OpenAI',
      description: 'Azure-hosted OpenAI models',
      baseUrl: '',
      authType: 'bearer',
      requiredFields: ['apiKey', 'endpoint', 'deployment'],
      testEndpoint: '/openai/deployments/{deployment}/chat/completions',
      models: ['gpt-4', 'gpt-35-turbo'],
      icon: '☁️'
    },
    {
      id: 'cohere',
      name: 'Cohere',
      description: 'Command and Generate models',
      baseUrl: 'https://api.cohere.ai/v1',
      authType: 'bearer',
      requiredFields: ['apiKey'],
      testEndpoint: '/models',
      models: ['command', 'command-light', 'command-nightly'],
      icon: '⚡'
    }
  ];

  useEffect(() => {
    loadAPIConfigs();
  }, []);

  const loadAPIConfigs = () => {
    try {
      const saved = localStorage.getItem('llm_api_configs');
      if (saved) {
        setApiConfigs(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading API configs:', error);
    }
  };

  const saveAPIConfigs = () => {
    try {
      localStorage.setItem('llm_api_configs', JSON.stringify(apiConfigs));
      
      // Update environment variables for immediate use
      apiConfigs.forEach(config => {
        if (config.provider === 'openai' && config.fields.apiKey) {
          localStorage.setItem('VITE_OPENAI_API_KEY', config.fields.apiKey);
        }
      });

      setSaveStatus({ type: 'success', message: 'API configurations saved successfully!' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save API configurations.' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
    }
  };

  const updateAPIConfig = (providerId: string, field: string, value: string) => {
    setApiConfigs(prev => {
      const existing = prev.find(config => config.provider === providerId);
      if (existing) {
        return prev.map(config =>
          config.provider === providerId
            ? { ...config, fields: { ...config.fields, [field]: value } }
            : config
        );
      } else {
        return [...prev, {
          provider: providerId,
          fields: { [field]: value },
          isActive: false,
          lastTested: null
        }];
      }
    });
  };

  const toggleProviderActive = (providerId: string) => {
    setApiConfigs(prev =>
      prev.map(config =>
        config.provider === providerId
          ? { ...config, isActive: !config.isActive }
          : config
      )
    );
  };

  const testAPIConnection = async (providerId: string) => {
    const provider = llmProviders.find(p => p.id === providerId);
    const config = apiConfigs.find(c => c.provider === providerId);
    
    if (!provider || !config) return;

    setIsTesting(providerId);
    const startTime = Date.now();

    try {
      // Simulate API test - in real implementation, this would make actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const responseTime = Date.now() - startTime;
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      const result: APITestResult = {
        provider: providerId,
        success,
        message: success ? 'Connection successful' : 'Invalid API key or configuration',
        responseTime
      };

      setTestResults(prev => [
        ...prev.filter(r => r.provider !== providerId),
        result
      ]);

      // Update config with test result
      setApiConfigs(prev =>
        prev.map(config =>
          config.provider === providerId
            ? { ...config, lastTested: new Date().toISOString() }
            : config
        )
      );

    } catch (error) {
      const result: APITestResult = {
        provider: providerId,
        success: false,
        message: 'Connection failed: Network error'
      };

      setTestResults(prev => [
        ...prev.filter(r => r.provider !== providerId),
        result
      ]);
    } finally {
      setIsTesting(null);
    }
  };

  const removeAPIConfig = (providerId: string) => {
    setApiConfigs(prev => prev.filter(config => config.provider !== providerId));
    setTestResults(prev => prev.filter(result => result.provider !== providerId));
  };

  const getProviderConfig = (providerId: string) => {
    return apiConfigs.find(config => config.provider === providerId);
  };

  const getTestResult = (providerId: string) => {
    return testResults.find(result => result.provider === providerId);
  };

  const validateFileContent = async (file: File, type: string): Promise<FileValidationResult> => {
    const text = await file.text();
    const errors: string[] = [];
    const warnings: string[] = [];
    let data: any;
    let recor