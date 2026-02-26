import { useAuth, useProFeatures as useAuthProFeatures } from '../lib/AuthContext';

export interface ProFeatureLimits {
  maxProjects: number;
  maxBlocksPerProject: number;
  canUseCustomDomain: boolean;
  canRemoveBranding: boolean;
  canUseAdvancedAnalytics: boolean;
  canUseWebLLM: boolean;
  canUse3DBlocks: boolean;
  canUseCustomCSS: boolean;
  canUseLivePreview: boolean;
  canExportToAllPlatforms: boolean;
  hasPrioritySupport: boolean;
  hasNoAds: boolean;
}

export const FREE_TIER_LIMITS: ProFeatureLimits = {
  maxProjects: 3,
  maxBlocksPerProject: 15,
  canUseCustomDomain: false,
  canRemoveBranding: false,
  canUseAdvancedAnalytics: false,
  canUseWebLLM: false,
  canUse3DBlocks: false,
  canUseCustomCSS: false,
  canUseLivePreview: false,
  canExportToAllPlatforms: false,
  hasPrioritySupport: false,
  hasNoAds: false,
};

export const PRO_TIER_LIMITS: ProFeatureLimits = {
  maxProjects: Infinity,
  maxBlocksPerProject: Infinity,
  canUseCustomDomain: true,
  canRemoveBranding: true,
  canUseAdvancedAnalytics: true,
  canUseWebLLM: true,
  canUse3DBlocks: true,
  canUseCustomCSS: true,
  canUseLivePreview: true,
  canExportToAllPlatforms: true,
  hasPrioritySupport: true,
  hasNoAds: true,
};

export const useProFeatures = () => {
  const { isPro, isAuthenticated, user } = useAuth();
  const authProFeatures = useAuthProFeatures();

  const limits = isPro ? PRO_TIER_LIMITS : FREE_TIER_LIMITS;

  const checkFeature = (feature: keyof ProFeatureLimits): boolean => {
    const value = limits[feature];
    return typeof value === 'boolean' ? value : false;
  };

  const getUpgradeMessage = (featureName: string): string => {
    if (!isAuthenticated) {
      return `Sign in and upgrade to Pro to unlock ${featureName}`;
    }
    return `Upgrade to Pro to unlock ${featureName}`;
  };

  return {
    isPro,
    isAuthenticated,
    limits,
    checkFeature,
    getUpgradeMessage,
    canUseWebLLM: isPro,
    canUse3DBlocks: isPro,
    ...authProFeatures,
  };
};

export const useProjectLimits = (currentProjectCount: number) => {
  const { limits, isPro } = useProFeatures();

  const canCreateProject = currentProjectCount < limits.maxProjects;
  const remainingProjects =
    limits.maxProjects === Infinity
      ? Infinity
      : limits.maxProjects - currentProjectCount;

  return {
    canCreateProject,
    remainingProjects,
    maxProjects: limits.maxProjects,
    currentProjectCount,
    isPro,
  };
};

export const useBlockLimits = (currentBlockCount: number) => {
  const { limits, isPro } = useProFeatures();

  const canAddBlock = currentBlockCount < limits.maxBlocksPerProject;
  const remainingBlocks =
    limits.maxBlocksPerProject === Infinity
      ? Infinity
      : limits.maxBlocksPerProject - currentBlockCount;

  return {
    canAddBlock,
    remainingBlocks,
    maxBlocks: limits.maxBlocksPerProject,
    currentBlockCount,
    isPro,
  };
};

export default useProFeatures;
