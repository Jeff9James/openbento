import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../lib/AuthContext';
import {
  getUserProjects,
  createProject as dbCreateProject,
  updateProject as dbUpdateProject,
  deleteProject as dbDeleteProject,
  syncLocalBentosToDatabase,
  dbProjectToSavedBento,
} from '../lib/database';
import type { DbProject } from '../lib/database-types';
import type { SavedBento, SiteData } from '../types';
import {
  getAllBentos,
  saveBento as localSaveBento,
  deleteBento as localDeleteBento,
  createBento as localCreateBento,
  setActiveBentoId,
  getActiveBentoId,
} from '../services/storageService';

interface UseProjectsOptions {
  autoSync?: boolean; // Automatically sync local projects to database on first login
}

interface UseProjectsReturn {
  // Project state
  projects: SavedBento[];
  dbProjects: DbProject[];
  activeProject: SavedBento | null;
  activeDbProject: DbProject | null;
  isLoading: boolean;
  error: string | null;
  
  // Project actions
  loadProjects: () => Promise<void>;
  createProject: (name: string, data?: SiteData) => Promise<SavedBento | null>;
  saveProject: (bento: SavedBento) => Promise<void>;
  deleteProject: (id: string) => Promise<boolean>;
  setActiveProject: (bento: SavedBento) => void;
  renameProject: (id: string, name: string) => Promise<void>;
  
  // Sync actions
  syncLocalToCloud: () => Promise<void>;
  
  // Utility
  isUsingDatabase: boolean;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const { autoSync = true } = options;
  const { user, isAuthenticated } = useAuth();
  
  const [projects, setProjects] = useState<SavedBento[]>([]);
  const [dbProjects, setDbProjects] = useState<DbProject[]>([]);
  const [activeProject, setActiveProject] = useState<SavedBento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSynced, setHasSynced] = useState(false);

  const isUsingDatabase = isAuthenticated && !!user;

  // Load projects from either database or localStorage
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isUsingDatabase) {
        // Load from database
        const dbProjs = await getUserProjects(user.id);
        setDbProjects(dbProjs);
        
        // Convert to SavedBento format for compatibility
        const bentos = dbProjs.map(dbProjectToSavedBento);
        setProjects(bentos);

        // Set active project
        const activeId = getActiveBentoId();
        const active = bentos.find((b) => b.id === activeId) || bentos[0] || null;
        setActiveProject(active);
        
        if (active) {
          setActiveBentoId(active.id);
        }
      } else {
        // Load from localStorage
        const bentos = getAllBentos();
        setProjects(bentos);
        
        const activeId = getActiveBentoId();
        const active = bentos.find((b) => b.id === activeId) || bentos[0] || null;
        setActiveProject(active);
      }
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isUsingDatabase, user]);

  // Sync local projects to database (for first-time login)
  const syncLocalToCloud = useCallback(async () => {
    if (!isUsingDatabase || hasSynced) return;

    const localBentos = getAllBentos();
    if (localBentos.length === 0) return;

    try {
      const syncedProjects = await syncLocalBentosToDatabase(user.id, localBentos);
      
      if (syncedProjects.length > 0) {
        // Update state with synced projects
        setDbProjects((prev) => [...syncedProjects, ...prev]);
        const syncedBentos = syncedProjects.map(dbProjectToSavedBento);
        setProjects((prev) => [...syncedBentos, ...prev]);
        
        // Set the first synced project as active
        if (syncedBentos.length > 0) {
          setActiveBentoId(syncedBentos[0].id);
          setActiveProject(syncedBentos[0]);
        }
      }
      
      setHasSynced(true);
    } catch (err) {
      console.error('Error syncing projects:', err);
    }
  }, [isUsingDatabase, user, hasSynced]);

  // Create a new project
  const createProject = useCallback(async (name: string, data?: SiteData): Promise<SavedBento | null> => {
    try {
      if (isUsingDatabase) {
        const dbProj = await dbCreateProject(user.id, name, data || getDefaultSiteData(name));
        if (!dbProj) return null;
        
        const bento = dbProjectToSavedBento(dbProj);
        setProjects((prev) => [...prev, bento]);
        setDbProjects((prev) => [...prev, dbProj]);
        setActiveBentoId(bento.id);
        setActiveProject(bento);
        
        return bento;
      } else {
        const bento = localCreateBento(name);
        setProjects((prev) => [...prev, bento]);
        setActiveProject(bento);
        return bento;
      }
    } catch (err) {
      setError('Failed to create project');
      console.error('Error creating project:', err);
      return null;
    }
  }, [isUsingDatabase, user]);

  // Save project changes
  const saveProject = useCallback(async (bento: SavedBento): Promise<void> => {
    try {
      if (isUsingDatabase) {
        await dbUpdateProject(bento.id, {
          name: bento.name,
          data: bento.data,
        });
        
        setDbProjects((prev) =>
          prev.map((p) =>
            p.id === bento.id
              ? { ...p, name: bento.name, data: bento.data, updated_at: new Date().toISOString() }
              : p
          )
        );
      }
      
      // Always save to localStorage as backup
      localSaveBento(bento);
      
      setProjects((prev) =>
        prev.map((p) =>
          p.id === bento.id ? { ...bento, updatedAt: Date.now() } : p
        )
      );
    } catch (err) {
      setError('Failed to save project');
      console.error('Error saving project:', err);
    }
  }, [isUsingDatabase]);

  // Delete a project
  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      if (isUsingDatabase) {
        const success = await dbDeleteProject(id);
        if (!success) return false;
        
        setDbProjects((prev) => prev.filter((p) => p.id !== id));
      }
      
      localDeleteBento(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      
      // If deleted project was active, switch to another
      if (activeProject?.id === id) {
        const remaining = projects.filter((p) => p.id !== id);
        const newActive = remaining[0] || null;
        setActiveProject(newActive);
        if (newActive) {
          setActiveBentoId(newActive.id);
        }
      }
      
      return true;
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
      return false;
    }
  }, [isUsingDatabase, activeProject, projects]);

  // Rename a project
  const renameProject = useCallback(async (id: string, name: string): Promise<void> => {
    try {
      if (isUsingDatabase) {
        await dbUpdateProject(id, { name });
        setDbProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, name } : p))
        );
      }
      
      const bento = projects.find((b) => b.id === id);
      if (bento) {
        const updated = { ...bento, name, updatedAt: Date.now() };
        localSaveBento(updated);
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? updated : p))
        );
      }
    } catch (err) {
      setError('Failed to rename project');
      console.error('Error renaming project:', err);
    }
  }, [isUsingDatabase, projects]);

  // Set active project
  const setActiveProjectHandler = useCallback((bento: SavedBento) => {
    setActiveProject(bento);
    setActiveBentoId(bento.id);
  }, []);

  // Initial load and sync
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (autoSync && isUsingDatabase && !hasSynced) {
      syncLocalToCloud();
    }
  }, [autoSync, isUsingDatabase, hasSynced, syncLocalToCloud]);

  return {
    projects,
    dbProjects,
    activeProject,
    activeDbProject: dbProjects.find((p) => p.id === activeProject?.id) || null,
    isLoading,
    error,
    loadProjects,
    createProject,
    saveProject,
    deleteProject,
    setActiveProject: setActiveProjectHandler,
    renameProject,
    syncLocalToCloud,
    isUsingDatabase,
  };
}

// Helper to get default site data
function getDefaultSiteData(name: string): SiteData {
  return {
    gridVersion: 2,
    profile: {
      name,
      bio: 'Welcome to my bento page!',
      avatarUrl: '',
      theme: 'light',
      primaryColor: 'blue',
      showBranding: true,
      socialAccounts: [],
    },
    blocks: [],
  };
}
