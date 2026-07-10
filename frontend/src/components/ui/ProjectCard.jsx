import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const ProjectCard = ({ project, onDelete }) => {
  return (
    <div className="glass-effect rounded-2xl overflow-hidden card-hover">
      <div className="aspect-video bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center relative">
        <span className="text-5xl">{project.thumbnail}</span>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
          <span className="text-sm text-yellow-400">{"★".repeat(Math.round(project.score/20))}</span>
        </div>
        <p className="text-sm text-gray-400 mb-1">{project.category}</p>
        <p className="text-xs text-gray-500 mb-3">{project.date}</p>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-dark-600/40">
          <span className="text-sm text-green-400 font-semibold">{project.score}% Quality</span>
          <div className="flex space-x-2">
            <Link to="/preview" state={{ project }}>
              <Button variant="ghost" size="sm">View</Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-rose-500 hover:text-rose-400"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
