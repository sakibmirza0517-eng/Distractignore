import React from 'react';
import { 
  FolderGit2, 
  Plus, 
  Edit2, 
  Trash2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ProjectItem } from '../types';
import { Card3D } from './Card3D';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onOpenAddProject: () => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenAddProject,
  onEditProject,
  onDeleteProject,
}) => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0f1426] border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Active Projects & Modules</h1>
          </div>
          <p className="text-xs text-slate-400">
            Track your semester projects, development builds, and exam preparation portfolios.
          </p>
        </div>

        <button
          onClick={onOpenAddProject}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f1426] border border-white/5 space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Projects Yet</h3>
          <p className="text-xs text-slate-400">
            Keep track of your coursework, repositories, and learning milestones in one place.
          </p>
          <button
            onClick={onOpenAddProject}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition cursor-pointer shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <Card3D key={proj.id} intensity={5}>
              <div className="p-5 rounded-2xl bg-[#0f1426] border border-white/10 hover:border-white/20 transition-all shadow-xl space-y-4 flex flex-col justify-between h-full group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {proj.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditProject(proj)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                        title="Edit project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                    {proj.title}
                  </h3>
                </div>

                {/* Progress */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Completion</span>
                    <span className="font-mono font-bold text-white">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      )}
    </div>
  );
};
