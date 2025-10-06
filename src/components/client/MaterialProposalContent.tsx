import React from 'react';
import { Button } from '../ui/button';

interface MaterialProposalContentProps {
  currentPage: number;
  onApprove: () => void;
  onReject: () => void;
  onDownloadPDF: () => void;
}

export const MaterialProposalContent: React.FC<MaterialProposalContentProps> = ({
  currentPage,
  onApprove,
  onReject,
  onDownloadPDF,
}) => {
  const getPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-3xl font-medium text-material-on-surface mb-4">Executive Summary</h1>
              <p className="text-lg text-material-on-surface-variant max-w-2xl mx-auto">
                Transform your digital presence with our comprehensive website redesign solution
              </p>
            </div>
            
            <div className="material-card p-6">
              <h2 className="text-xl font-medium text-material-on-surface mb-4">Project Overview</h2>
              <p className="text-material-on-surface-variant mb-4">
                We propose a complete redesign of your website to enhance user experience, improve conversion rates, 
                and align with your brand's evolving identity. Our approach combines strategic thinking with creative 
                execution to deliver a website that not only looks exceptional but drives tangible business results.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="material-card-elevated p-4 text-center">
                  <div className="text-2xl font-medium text-material-primary mb-2">150%</div>
                  <div className="text-sm text-material-on-surface-variant">Expected increase in conversions</div>
                </div>
                <div className="material-card-elevated p-4 text-center">
                  <div className="text-2xl font-medium text-material-primary mb-2">8 weeks</div>
                  <div className="text-sm text-material-on-surface-variant">Project timeline</div>
                </div>
                <div className="material-card-elevated p-4 text-center">
                  <div className="text-2xl font-medium text-material-primary mb-2">24/7</div>
                  <div className="text-sm text-material-on-surface-variant">Ongoing support</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-material-on-surface">Project Overview</h1>
            
            <div className="material-card p-6">
              <h2 className="text-xl font-medium text-material-on-surface mb-4">Current Challenges</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs">✕</span>
                  </div>
                  <div>
                    <div className="font-medium text-material-on-surface">Outdated Design</div>
                    <div className="text-sm text-material-on-surface-variant">Current website doesn't reflect your brand's evolution</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs">✕</span>
                  </div>
                  <div>
                    <div className="font-medium text-material-on-surface">Poor Mobile Experience</div>
                    <div className="text-sm text-material-on-surface-variant">65% of visitors use mobile devices</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs">✕</span>
                  </div>
                  <div>
                    <div className="font-medium text-material-on-surface">Low Conversion Rate</div>
                    <div className="text-sm text-material-on-surface-variant">Current conversion rate is below industry standards</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="material-card p-6">
              <h2 className="text-xl font-medium text-material-on-surface mb-4">Our Solution</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <div>
                    <div className="font-medium text-material-on-surface">Modern, Brand-Aligned Design</div>
                    <div className="text-sm text-material-on-surface-variant">Fresh visual identity that represents your current brand</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <div>
                    <div className="font-medium text-material-on-surface">Mobile-First Approach</div>
                    <div className="text-sm text-material-on-surface-variant">Responsive design optimised for all devices</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <div>
                    <div className="font-medium text-material-on-surface">Conversion Optimisation</div>
                    <div className="text-sm text-material-on-surface-variant">Strategic placement of CTAs and user journey optimisation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-material-on-surface">Scope of Work</h1>
            
            <div className="material-card p-6">
              <h2 className="text-xl font-medium text-material-on-surface mb-4">Phase 1: Discovery & Strategy</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">Stakeholder interviews and requirements gathering</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">Competitive analysis and market research</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">User persona development</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">Information architecture planning</span>
                </div>
              </div>
            </div>

            <div className="material-card p-6">
              <h2 className="text-xl font-medium text-material-on-surface mb-4">Phase 2: Design & Prototyping</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">Wireframing and user flow mapping</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">Visual design concepts and style guide</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">Interactive prototypes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">User testing and feedback incorporation</span>
                </div>
              </div>
            </div>

            <div className="material-card p-6">
              <h2 className="text-xl font-medium text-material-on-surface mb-4">Phase 3: Development & Launch</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">Frontend development with modern frameworks</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">Content management system integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">Quality assurance and testing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-material-primary rounded-full"></div>
                  <span className="text-material-on-surface">Deployment and launch support</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-material-on-surface">Timeline & Milestones</h1>
            
            <div className="material-card p-6">
              <div className="space-y-6">
                {[
                  { week: 'Weeks 1-2', phase: 'Discovery & Strategy', tasks: ['Stakeholder interviews', 'Research & analysis', 'Strategy presentation'] },
                  { week: 'Weeks 3-4', phase: 'Wireframing & UX', tasks: ['Information architecture', 'User flows', 'Wireframe reviews'] },
                  { week: 'Weeks 5-6', phase: 'Visual Design', tasks: ['Style guide creation', 'Visual concepts', 'Design refinements'] },
                  { week: 'Weeks 7-8', phase: 'Development & Launch', tasks: ['Frontend development', 'Testing & QA', 'Launch & handover'] },
                ].map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-material-primary rounded-full flex items-center justify-center">
                        <span className="text-material-on-primary font-medium">{index + 1}</span>
                      </div>
                      {index < 3 && <div className="w-0.5 h-12 bg-material-outline-variant mt-2"></div>}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="font-medium text-material-on-surface">{milestone.week}</div>
                      <div className="text-lg font-medium text-material-primary mb-2">{milestone.phase}</div>
                      <div className="space-y-1">
                        {milestone.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="text-sm text-material-on-surface-variant">• {task}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-material-on-surface">Team & Expertise</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Sarah Johnson', role: 'Project Director', expertise: 'Strategy & Leadership', experience: '8+ years' },
                { name: 'Michael Chen', role: 'UX Designer', expertise: 'User Experience Design', experience: '6+ years' },
                { name: 'Emma Thompson', role: 'Visual Designer', expertise: 'Brand & Interface Design', experience: '5+ years' },
                { name: 'David Rodriguez', role: 'Frontend Developer', expertise: 'React & Modern Web', experience: '7+ years' },
              ].map((member, index) => (
                <div key={index} className="material-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-material-surface-variant rounded-full flex items-center justify-center">
                      <span className="text-xl font-medium text-material-on-surface-variant">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-material-on-surface">{member.name}</div>
                      <div className="text-material-primary">{member.role}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-material-on-surface-variant">Expertise:</span>
                      <span className="text-sm text-material-on-surface">{member.expertise}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-material-on-surface-variant">Experience:</span>
                      <span className="text-sm text-material-on-surface">{member.experience}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-material-on-surface">Investment & Pricing</h1>
            
            <div className="material-card p-6">
              <h2 className="text-xl font-medium text-material-on-surface mb-6">Project Investment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="material-card-elevated p-6 text-center">
                  <div className="text-3xl font-medium text-material-primary mb-2">£25,000</div>
                  <div className="text-material-on-surface-variant">Total Project Cost</div>
                </div>
                <div className="material-card-elevated p-6 text-center">
                  <div className="text-3xl font-medium text-material-primary mb-2">8 weeks</div>
                  <div className="text-material-on-surface-variant">Delivery Timeline</div>
                </div>
                <div className="material-card-elevated p-6 text-center">
                  <div className="text-3xl font-medium text-material-primary mb-2">12 months</div>
                  <div className="text-material-on-surface-variant">Support Included</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-material-on-surface">What's Included:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Complete website redesign',
                    'Mobile-responsive development',
                    'Content management system',
                    'SEO optimisation',
                    'Performance optimisation',
                    'Cross-browser compatibility',
                    '12 months technical support',
                    'Training and documentation',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="text-material-on-surface">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="material-card p-6">
              <h3 className="font-medium text-material-on-surface mb-4">Payment Schedule</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-material-surface-variant rounded-lg">
                  <span className="text-material-on-surface">Project Initiation (50%)</span>
                  <span className="font-medium text-material-on-surface">£12,500</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-material-surface-variant rounded-lg">
                  <span className="text-material-on-surface">Project Completion (50%)</span>
                  <span className="font-medium text-material-on-surface">£12,500</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-material-on-surface">Terms & Conditions</h1>
            
            <div className="material-card p-6">
              <h2 className="text-xl font-medium text-material-on-surface mb-4">Project Terms</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-material-on-surface mb-2">Payment Terms</h3>
                  <p className="text-material-on-surface-variant">
                    50% deposit required to commence work. Final 50% due upon project completion. 
                    Payment terms are Net 14 days from invoice date.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-material-on-surface mb-2">Scope Changes</h3>
                  <p className="text-material-on-surface-variant">
                    Any changes to the agreed scope will be documented and quoted separately. 
                    Additional work will be charged at our standard hourly rate of £150/hour.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-material-on-surface mb-2">Deliverables</h3>
                  <p className="text-material-on-surface-variant">
                    All agreed deliverables will be provided as outlined in the project scope. 
                    Source files and assets will be delivered upon final payment.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-material-on-surface mb-2">Support Period</h3>
                  <p className="text-material-on-surface-variant">
                    12 months of technical support included covering bug fixes and minor updates. 
                    Major feature additions will be quoted separately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-medium text-material-on-surface">Next Steps</h1>
            
            <div className="material-card p-6">
              <h2 className="text-xl font-medium text-material-on-surface mb-6">Ready to Get Started?</h2>
              
              <div className="space-y-6">
                <div className="material-card-elevated p-4">
                  <h3 className="font-medium text-material-on-surface mb-2">Step 1: Approve this Proposal</h3>
                  <p className="text-material-on-surface-variant">
                    Review the proposal and click "Approve" below to move forward with the project.
                  </p>
                </div>
                
                <div className="material-card-elevated p-4">
                  <h3 className="font-medium text-material-on-surface mb-2">Step 2: Project Kick-off</h3>
                  <p className="text-material-on-surface-variant">
                    We'll schedule a kick-off meeting within 48 hours of approval to discuss project details and next steps.
                  </p>
                </div>
                
                <div className="material-card-elevated p-4">
                  <h3 className="font-medium text-material-on-surface mb-2">Step 3: Begin Discovery</h3>
                  <p className="text-material-on-surface-variant">
                    Our team will begin the discovery phase immediately after receiving the initial payment.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-material-outline-variant">
                <Button
                  onClick={onApprove}
                  className="material-button-filled flex-1"
                  size="lg"
                >
                  Approve Proposal
                </Button>
                <Button
                  onClick={onReject}
                  variant="outline"
                  className="material-button flex-1"
                  size="lg"
                >
                  Request Changes
                </Button>
                <Button
                  onClick={onDownloadPDF}
                  variant="outline"
                  className="material-button"
                  size="lg"
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h1 className="text-2xl font-medium text-material-on-surface">Page Not Found</h1>
            <p className="text-material-on-surface-variant mt-2">The requested page could not be found.</p>
          </div>
        );
    }
  };

  return (
    <div className="material-surface min-h-screen">
      {getPageContent()}
    </div>
  );
};