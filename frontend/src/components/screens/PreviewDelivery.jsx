import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import MetricCard from '../ui/MetricCard';
import Footer from '../common/Footer';

const PreviewDelivery = () => {
  const location = useLocation();
  const projectData = location.state?.project || { name: 'Showroom', category: 'E-Commerce' };
  
  const canvasRef = useRef(null);
  const [rotationX, setRotationX] = useState(-0.3);
  const [rotationY, setRotationY] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Render a 3D isometric website container with cards and rotating floating geometry on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let floatOffset = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Project 3D points
      const project = (x, y, z) => {
        // Rotate Y
        let x1 = x * Math.cos(rotationY) - z * Math.sin(rotationY);
        let z1 = x * Math.sin(rotationY) + z * Math.cos(rotationY);
        // Rotate X
        let y2 = y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        let z2 = y * Math.sin(rotationX) + z1 * Math.cos(rotationX);

        // Perspective
        const dist = 500;
        const scale = dist / (dist + z2);
        return [
          cx + x1 * scale,
          cy + y2 * scale,
          z2
        ];
      };

      // Draw Website Base Plane (Isometric Card)
      const planeWidth = 220;
      const planeHeight = 130;
      const basePoints = [
        project(-planeWidth, -planeHeight, 0),
        project(planeWidth, -planeHeight, 0),
        project(planeWidth, planeHeight, 0),
        project(-planeWidth, planeHeight, 0),
      ];

      // Website Shadow
      ctx.beginPath();
      ctx.moveTo(basePoints[0][0], basePoints[0][1] + 30);
      ctx.lineTo(basePoints[1][0], basePoints[1][1] + 30);
      ctx.lineTo(basePoints[2][0], basePoints[2][1] + 30);
      ctx.lineTo(basePoints[3][0], basePoints[3][1] + 30);
      ctx.closePath();
      ctx.fillStyle = 'rgba(2, 6, 23, 0.6)';
      ctx.filter = 'blur(15px)';
      ctx.fill();
      ctx.filter = 'none';

      // Website Body Face
      ctx.beginPath();
      ctx.moveTo(basePoints[0][0], basePoints[0][1]);
      ctx.lineTo(basePoints[1][0], basePoints[1][1]);
      ctx.lineTo(basePoints[2][0], basePoints[2][1]);
      ctx.lineTo(basePoints[3][0], basePoints[3][1]);
      ctx.closePath();
      ctx.fillStyle = '#0f172a'; // dark-800
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'; // primary-500
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Website Header (top segment)
      const headerPoints = [
        project(-planeWidth, -planeHeight, 0),
        project(planeWidth, -planeHeight, 0),
        project(planeWidth, -planeHeight + 35, 0),
        project(-planeWidth, -planeHeight + 35, 0),
      ];
      ctx.beginPath();
      ctx.moveTo(headerPoints[0][0], headerPoints[0][1]);
      ctx.lineTo(headerPoints[1][0], headerPoints[1][1]);
      ctx.lineTo(headerPoints[2][0], headerPoints[2][1]);
      ctx.lineTo(headerPoints[3][0], headerPoints[3][1]);
      ctx.closePath();
      ctx.fillStyle = '#1e2937'; // dark-600
      ctx.fill();

      // Header Brand text mock
      const brandPoint = project(-planeWidth + 15, -planeHeight + 22, 0);
      ctx.fillStyle = '#60a5fa'; // blue-400
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('3D WEBSITE', brandPoint[0], brandPoint[1]);

      // Draw Grid cards on Mock Site
      const cardCoords = [
        [-planeWidth + 20, -planeHeight + 50],
        [-planeWidth + 120, -planeHeight + 50],
        [-planeWidth + 20, -planeHeight + 90],
        [-planeWidth + 120, -planeHeight + 90],
      ];

      cardCoords.forEach(([cxOffset, cyOffset]) => {
        const cw = 85;
        const ch = 30;
        const cPoints = [
          project(cxOffset, cyOffset, 0),
          project(cxOffset + cw, cyOffset, 0),
          project(cxOffset + cw, cyOffset + ch, 0),
          project(cxOffset, cyOffset + ch, 0),
        ];
        ctx.beginPath();
        ctx.moveTo(cPoints[0][0], cPoints[0][1]);
        ctx.lineTo(cPoints[1][0], cPoints[1][1]);
        ctx.lineTo(cPoints[2][0], cPoints[2][1]);
        ctx.lineTo(cPoints[3][0], cPoints[3][1]);
        ctx.closePath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.fill();
        ctx.stroke();
      });

      // Draw Floating 3D Object (Gem shape) above base plane
      floatOffset += 0.035;
      const floatY = -30 + Math.sin(floatOffset) * 10;
      
      const gemPoints = [];
      const gemRadius = 40;
      const heightOffset = 25;

      // Polyhedron vertices
      gemPoints.push(
        project(120, floatY - heightOffset, -30), // top vertex
        project(80, floatY, -10),
        project(160, floatY, -10),
        project(120, floatY, -50),
        project(120, floatY + heightOffset, -30) // bottom vertex
      );

      // Render 3D gem wireframe
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      const connections = [
        [0, 1], [0, 2], [0, 3],
        [4, 1], [4, 2], [4, 3],
        [1, 2], [2, 3], [3, 1]
      ];

      connections.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(gemPoints[i][0], gemPoints[i][1]);
        ctx.lineTo(gemPoints[j][0], gemPoints[j][1]);
        ctx.stroke();
      });

      // Highlight vertices
      gemPoints.forEach(p => {
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [rotationX, rotationY]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotationY(prev => prev + dx * 0.007);
    setRotationX(prev => Math.max(-1.2, Math.min(1.2, prev + dy * 0.007)));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const data = `// Generated 3D Website Project Bundle\n// Name: ${projectData.name}\n// Category: ${projectData.category}`;
    const file = new Blob([data], { type: 'application/zip' });
    const url = URL.createObjectURL(file);
    const element = document.createElement('a');
    element.href = url;
    element.download = `${projectData.name.toLowerCase().replace(/\s+/g, '_')}_3d_website.zip`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col justify-between">
      <Navbar showAuth={false} />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="glass-effect rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-green-400">✅ Your Website is Ready!</h1>
                <p className="text-xs text-gray-400 mt-1">Project: <span className="text-white font-bold">{projectData.name}</span> · Created just now</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm">Share</Button>
                <Button variant="secondary" size="sm" onClick={handleDownload}>Download ZIP</Button>
                <Button variant="primary" size="sm">Get Embed</Button>
              </div>
            </div>
          </div>
          
          {/* Interactive Preview Canvas frame */}
          <div className="glass-effect rounded-3xl overflow-hidden mb-8 shadow-2xl relative">
            <div 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="aspect-video w-full bg-gradient-to-br from-dark-850 to-dark-950 flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <canvas ref={canvasRef} className="w-full h-full" />
              
              <div className="absolute top-4 left-4 bg-slate-950/80 border border-dark-700 px-3 py-1 rounded-lg text-[9px] font-bold text-gray-400 tracking-wider">
                DRAG MOUSE TO ORBIT WEBSITE LAYOUT
              </div>
            </div>
            
            <div className="flex justify-between p-4 border-t border-dark-800/40 bg-dark-950/40">
              <div className="flex space-x-4">
                <button 
                  onClick={() => { setRotationX(-0.3); setRotationY(0.5); }} 
                  className="text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  ↻ Reset Camera
                </button>
              </div>
              <Link to="/prompt" state={{ template: { name: projectData.name } }}>
                <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider">✏️ Edit & Regenerate</Button>
              </Link>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <MetricCard label="Responsive FPS" value="38" status="⚡ 60Hz" color="text-green-400" />
            <MetricCard label="WebGL Load Time" value="1.4s" status="🚀 Fast" color="text-green-400" />
            <MetricCard label="Mobile Score" value="98%" status="🎯 Clean" color="text-green-400" />
            <MetricCard label="Asset Memory" value="120MB" status="📦 Light" color="text-green-400" />
          </div>
          
          {/* Delivery Options */}
          <div className="glass-effect rounded-3xl p-6 md:p-8 shadow-lg">
            <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wider">📋 Delivery Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button variant="secondary" className="w-full text-xs font-bold uppercase">📋 Copy Preview URL</Button>
              <Button variant="secondary" className="w-full text-xs font-bold uppercase" onClick={handleDownload}>📦 Download ZIP</Button>
              <Button variant="secondary" className="w-full text-xs font-bold uppercase">🔗 Get Embed Code</Button>
            </div>
            <p className="text-[10px] text-gray-500 mt-4 text-center leading-relaxed">
              * ZIP bundle contains fully compiled HTML, Tailwind CSS, Javascript, responsive WebGL shaders, and optimized 3D assets.
            </p>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="secondary">💾 Save to Dashboard</Button>
            </Link>
            <Link to="/templates">
              <Button variant="primary">✨ Start New Project</Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PreviewDelivery;
