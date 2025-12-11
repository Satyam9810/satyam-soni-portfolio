import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, ChevronRight, Code, Briefcase, Award, User } from 'lucide-react';

// Custom cursor component
// Find this in your code and REPLACE the entire CustomCursor component:
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);  // ADD THIS LINE

  useEffect(() => {
    // ADD THIS ENTIRE BLOCK
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursor = (e) => {
      const target = e.target;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      );
    };

    // CHANGE THIS - add if condition
    if (!isMobile) {
      window.addEventListener('mousemove', updatePosition);
      window.addEventListener('mouseover', updateCursor);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);  // ADD THIS
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateCursor);
    };
  }, [isMobile]);  // CHANGE: add isMobile dependency

  // ADD THIS - Don't render on mobile
  if (isMobile) return null;

  // ... rest stays the same

  return (
    <>
      <div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`bg-white rounded-full transition-all duration-150 ${
            isPointer ? 'w-12 h-12' : 'w-6 h-6'
          }`}
        />
      </div>
      <div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-1 h-1 bg-white rounded-full" />
      </div>
    </>
  );
};

// 3D Background Component
const ThreeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = Math.random() * 2 + 1;
      }

      update() {
        this.z -= this.vz;
        if (this.z <= 0) {
          this.z = 1000;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        const scale = 1000 / (1000 + this.z);
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
        const size = (1 - this.z / 1000) * 3;

        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${1 - this.z / 1000})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}
    />
  );
};

// Navigation Component
const Navigation = ({ currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: User },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            SS
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-indigo-500 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

// Home Page Component
const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
  <div className="h-screen flex items-center justify-center px-6 overflow-hidden">
    <div className="max-w-4xl mx-auto text-center">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="mb-6 inline-block">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 animate-pulse">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl md:text-5xl font-bold text-white">
                SS
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight" style={{ paddingBottom: '0.1em' }}>
            Satyam Soni
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-4 leading-relaxed">
            B.Tech in Biochemical Engineering & Biotechnology
          </p>

          <p className="text-base md:text-lg text-indigo-400 mb-8 leading-relaxed">
            Indian Institute of Technology Delhi | CGPA: 6.02
          </p>

          <p className="text-base md:text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed" style={{ paddingBottom: '0.2em' }}>
            Full-Stack Developer | ML Engineer | Cloud & DevOps Enthusiast
            <br />
            Specializing in scalable systems, microservices architecture, and AI-powered solutions
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Python', 'TensorFlow', 'Kubernetes'].map((tech, i) => (
              <span
                key={tech}
                className="px-4 py-2 bg-slate-800/50 rounded-full text-sm text-indigo-300 border border-indigo-500/30 hover:border-indigo-500 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {tech}
              </span>
            ))}
          </div>
                  </div>
                </div>
              </div>
            );
          };

          // Projects Page Component
          const ProjectsPage = () => {
            const projects = [
              {
                title: 'Real-Time System Metrics Monitoring Pipeline',
                period: 'July - Aug 2025',
                description: 'End-to-end data pipeline with Python, Amazon Kinesis, SQL Server, and Power BI for real-time system monitoring',
                tech: ['Python', 'AWS Kinesis', 'SQL Server', 'Power BI'],
                achievement: '95% faster monitoring, near-instant insights',
              },
              {
                title: 'Spring Boot Microservices E-Commerce Platform',
                period: 'May - Jun 2025',
                description: 'Scalable e-commerce platform with microservices architecture, service discovery, and event-driven workflows',
                tech: ['Spring Boot', 'Kafka', 'Docker', 'MongoDB', 'Kubernetes'],
                achievement: 'Secure authentication, real-time dashboards, fault-tolerant deployment',
              },
              {
                title: 'Full-Stack Employee Management Web App',
                period: 'Feb - Apr 2025',
                description: 'Complete CI/CD pipeline with TypeScript and ReactJS for automated testing and deployment',
                tech: ['TypeScript', 'ReactJS', 'AWS', 'CircleCI', 'Ansible', 'Prometheus'],
                achievement: 'Automated deployments, enhanced observability',
              },
              {
                title: 'High-Throughput Inference Systems for Video Analytics',
                period: 'Jan - Feb 2025',
                description: 'RF-DETR system in C++ with TensorRT for real-time 1080p object detection',
                tech: ['C++', 'NVIDIA TensorRT', 'CUDA', 'ONNX'],
                achievement: '40 FPS throughput, 3× efficiency improvement, 60% latency reduction',
              },
            ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-all duration-300 hover:transform hover:scale-105"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>
                <ExternalLink
                  size={20}
                  className="text-slate-400 group-hover:text-indigo-400 transition-colors"
                />
              </div>

              <p className="text-sm text-indigo-400 mb-3">{project.period}</p>
              <p className="text-slate-300 mb-4 leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-indigo-500/20 rounded-full text-xs text-indigo-300 border border-indigo-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400">
                  <Award size={16} className="inline mr-2 text-indigo-400" />
                  {project.achievement}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Experience Page Component
const ExperiencePage = () => {
  const experience = {
    internship: {
      title: 'High-Performance Droplet Microfluidics and Bioanalysis Internship',
      period: 'Jun - Jul 2025',
      points: [
        'Developed quantitative models for high-throughput single-cell cancer drug screening using LabVIEW-controlled TFADS',
        'Engineered hybrid ML pipeline with autoencoder embeddings and ensemble meta-classifiers achieving ~95% accuracy',
        'Revealed morphological biomarkers for metastasis prediction using SHAP interpretability',
      ],
    },
    achievements: [
      {
        title: 'Forage DS',
        desc: 'Certified in British Airways Data Science for optimizing lounge eligibility',
        year: '2025',
      },
      {
        title: 'NVIDIA Program',
        desc: 'Demonstrated competence in SOTA Transformer architectures for NLP',
        year: '2025',
      },
      {
        title: 'TATA GenAI Analytics',
        desc: 'Certified in GenAI, time-series forecasting, and data-driven decision-making',
        year: '2025',
      },
      {
        title: 'Stanford ML Certification',
        desc: 'Earned Machine Learning certification under Dr. Andrew Ng, scoring 99.6%',
        year: '2024',
      },
    ],
    leadership: [
      {
        role: 'Marketing Executive',
        org: 'Physics & Astronomy Club, IIT Delhi',
        period: 'Jul 2023 - May 2024',
        highlights: [
          'Secured $100K cosponsorship from 10+ sponsors for Tryst',
          'Designed pan-India media plan with The Hindu, 9xM, IshqFM & 15+ magazines',
          'Opened new sponsorship streams contributing 5% of overall budget',
        ],
      },
      {
        role: 'Activity Head',
        org: 'Co-curricular & Academic Interaction Council, IIT Delhi',
        period: 'Dec 2023 - May 2024',
        highlights: [
          'Managed 2L fund and supervised end-to-end execution of diverse campus events',
          'Organized UPSC panel talks, Blockchain Hackathons with full event supervision',
          'Curated logistics, publicity, and itineraries for smooth operations',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Experience & Achievements
        </h2>

        {/* Internship */}
        <div className="mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-2">
              {experience.internship.title}
            </h3>
            <p className="text-indigo-400 mb-6">{experience.internship.period}</p>
            <ul className="space-y-3">
              {experience.internship.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <ChevronRight size={20} className="text-indigo-400 mt-1 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold mb-6 text-white">Certifications & Achievements</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {experience.achievements.map((achievement, idx) => (
              <div
                key={idx}
                className="bg-slate-800/30 rounded-lg p-6 border border-slate-700 hover:border-indigo-500 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <Award size={24} className="text-indigo-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-slate-400 mb-2">{achievement.year}</p>
                    <p className="text-sm text-slate-300">{achievement.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div>
          <h3 className="text-3xl font-bold mb-6 text-white">Leadership & Responsibilities</h3>
          <div className="space-y-6">
            {experience.leadership.map((role, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{role.role}</h4>
                    <p className="text-indigo-400">{role.org}</p>
                  </div>
                  <span className="text-sm text-slate-400">{role.period}</span>
                </div>
                <ul className="space-y-2">
                  {role.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <ChevronRight size={18} className="text-indigo-400 mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function PortfolioApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`relative min-h-screen text-white overflow-x-hidden ${!isMobile ? 'cursor-none' : ''}`}>
      <style>{`
        /* Hide scrollbar for projects and experience pages only */
        .scrollable-content::-webkit-scrollbar {
          width: 6px;
        }
        .scrollable-content::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .scrollable-content::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 3px;
        }
        .scrollable-content::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
      <CustomCursor />
      <ThreeBackground />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <div className="relative z-10">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'projects' && (
          <div className="h-screen overflow-y-auto scrollable-content pb-32">
            <ProjectsPage />
          </div>
        )}
        {currentPage === 'experience' && (
          <div className="h-screen overflow-y-auto scrollable-content pb-32">
            <ExperiencePage />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 Satyam Soni. Built with React & Tailwind CSS.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}