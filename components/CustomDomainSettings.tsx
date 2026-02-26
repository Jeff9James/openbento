import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  ExternalLink,
  HelpCircle,
  Shield,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { setCustomDomain, verifyCustomDomain, removeCustomDomain } from '../lib/database';
import type { DbProject } from '../lib/database-types';

interface CustomDomainSettingsProps {
  project: DbProject | null;
  onProjectUpdate: (project: DbProject) => void;
}

interface DNSRecord {
  type: 'CNAME' | 'A' | 'TXT';
  name: string;
  value: string;
}

export default function CustomDomainSettings({ project, onProjectUpdate }: CustomDomainSettingsProps) {
  const { isPro } = useAuth();
  const [domain, setDomain] = useState(project?.custom_domain || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (project?.custom_domain) {
      setDomain(project.custom_domain);
    }
  }, [project]);

  const handleSetDomain = async () => {
    if (!project) return;
    
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      setError('Please enter a valid domain name (e.g., mysite.com)');
      setIsLoading(false);
      return;
    }

    try {
      const result = await setCustomDomain(project.id, domain);
      
      if (!result.success) {
        setError(result.error || 'Failed to set custom domain');
        return;
      }

      setDnsRecords(result.dnsRecords || []);
      setShowInstructions(true);
      setSuccess('Domain configured! Follow the DNS setup instructions below.');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDomain = async () => {
    if (!project) return;

    setError(null);
    setIsLoading(true);

    try {
      const result = await verifyCustomDomain(project.id);
      
      if (result.verified) {
        setSuccess('🎉 Your domain is verified and ready to use!');
        setShowInstructions(false);
        if (project) {
          onProjectUpdate({ ...project, domain_verified: true });
        }
      } else {
        setError(result.error || 'Domain verification failed. Please check your DNS settings.');
      }
    } catch (err) {
      setError('An unexpected error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDomain = async () => {
    if (!project) return;

    if (!confirm('Are you sure you want to remove this custom domain?')) return;

    setIsLoading(true);
    setError(null);

    try {
      const success = await removeCustomDomain(project.id);
      
      if (success) {
        setDomain('');
        setDnsRecords([]);
        setShowInstructions(false);
        setSuccess('Custom domain removed successfully.');
        if (project) {
          onProjectUpdate({ ...project, custom_domain: null, domain_verified: false });
        }
      } else {
        setError('Failed to remove custom domain.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // If user is not Pro, show upgrade prompt
  if (!isPro) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Feature</h3>
        <p className="text-gray-600 mb-4">
          Custom domains are available on the Pro plan. Upgrade to use your own domain name.
        </p>
        <button className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
          Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Globe className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Custom Domain</h3>
          <p className="text-sm text-gray-500">Use your own domain for your bento page</p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Domain Status */}
      {project?.custom_domain && project?.domain_verified && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div className="flex-1">
            <p className="font-medium text-green-700">{project.custom_domain}</p>
            <p className="text-sm text-green-600">Domain verified and active</p>
          </div>
          <a
            href={`https://${project.custom_domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      )}

      {/* Domain Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Your Domain</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="mysite.com"
            disabled={isLoading || project?.domain_verified}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
          {!project?.domain_verified ? (
            <button
              onClick={handleSetDomain}
              disabled={isLoading || !domain}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Configure'}
            </button>
          ) : (
            <button
              onClick={handleRemoveDomain}
              disabled={isLoading}
              className="px-4 py-2.5 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Enter your domain without https:// or www (e.g., mysite.com)
        </p>
      </div>

      {/* DNS Instructions */}
      <AnimatePresence>
        {showInstructions && dnsRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">DNS Setup Instructions</h4>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Hide
                </button>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">How to set up your domain:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-blue-600">
                    <li>Go to your domain registrar (e.g., GoDaddy, Namecheap)</li>
                    <li>Navigate to DNS settings</li>
                    <li>Add the records shown below</li>
                    <li>Wait for DNS propagation (can take up to 48 hours)</li>
                    <li>Click "Verify Domain" below</li>
                  </ol>
                </div>
              </div>

              {/* DNS Records Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Value</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dnsRecords.map((record, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 font-mono text-gray-600">{record.type}</td>
                        <td className="px-4 py-3 font-mono text-gray-600">{record.name}</td>
                        <td className="px-4 py-3 font-mono text-gray-600">{record.value}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => copyToClipboard(record.value)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title="Copy value"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Verify Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  DNS changes can take up to 48 hours to propagate
                </div>
                <button
                  onClick={handleVerifyDomain}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Verify Domain
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help text */}
      <div className="text-sm text-gray-500">
        <p>
          Need help?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Read our domain setup guide
          </a>
        </p>
      </div>
    </div>
  );
}

// Import Crown icon for Pro upgrade prompt
import { Crown } from 'lucide-react';
