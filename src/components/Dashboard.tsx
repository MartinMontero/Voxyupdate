import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, Clock, Mic, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { ProjectWorkspace } from './ProjectWorkspace';

export function Dashboard() {
  const { projects, createProject, setCurrentProject, currentProject } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const project = createProject(newProjectName.trim(), newProjectDescription.trim());
    setNewProjectName('');
    setNewProjectDescription('');
    setShowCreateModal(false);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (currentProject) {
    return <ProjectWorkspace projectId={currentProject.id} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Projects</h1>
          <p className="text-gray-600">Transform your documents into engaging podcasts</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mic className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce((acc, p) => acc + p.generations.filter(g => g.status === 'completed').length, 0)}
                </p>
                <p className="text-sm text-gray-600">Podcasts Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(projects.reduce((acc, p) => 
                    acc + p.generations.filter(g => g.status === 'completed').reduce((sum, g) => 
                      sum + (g.duration || 0), 0
                    ), 0
                  ) / 60)}
                </p>
                <p className="text-sm text-gray-600">Minutes of Audio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                hover 
                onClick={() => setCurrentProject(project)}
                className="h-full"
              >
                <CardHeader>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Documents</span>
                      <span className="font-medium">{project.documents.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Podcasts</span>
                      <span className="font-medium">
                        {project.generations.filter(g => g.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium">
                        {project.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Create your first project to get started with AI-powered podcast generation'
            }
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
      >
        <div className="space-y-4">
          <Input
            label="Project Name"
            placeholder="Enter project name..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              rows={3}
              placeholder="Describe your project..."
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim()}
              className="flex-1"
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}