import React from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';

interface ProposalContentProps {
  currentPage: number;
  onApprove: () => void;
  onReject: () => void;
  onDownloadPDF: () => void;
}

export const ProposalContent: React.FC<ProposalContentProps> = ({
  currentPage,
  onApprove,
  onReject,
  onDownloadPDF,
}) => {
  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="mb-4">Website Redesign Project</h1>
              <p className="text-lg text-muted-foreground">
                A comprehensive digital transformation for TechCorp Ltd
              </p>
            </div>
            
            <NeumorphCard variant="inset" className="p-8">
              <h2 className="mb-4">Executive Summary</h2>
              <p className="text-muted-foreground leading-relaxed">
                This proposal outlines our comprehensive approach to redesigning your company website, 
                focusing on user experience, modern design principles, and enhanced functionality. 
                Our solution will position TechCorp Ltd as an industry leader whilst improving 
                customer engagement and conversion rates.
              </p>
            </NeumorphCard>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-8">
            <h1>Project Overview</h1>
            
            <NeumorphCard>
              <h2 className="mb-4">Objectives</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Modernise the visual design to reflect current brand values
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Improve user experience and navigation structure
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Implement responsive design for all devices
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Enhance SEO performance and page loading speeds
                </li>
              </ul>
            </NeumorphCard>
            
            <NeumorphCard>
              <h2 className="mb-4">Scope of Work</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2">Design Phase</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• User research & analysis</li>
                    <li>• Wireframing & prototyping</li>
                    <li>• Visual design concepts</li>
                    <li>• Brand integration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2">Development Phase</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Frontend development</li>
                    <li>• CMS integration</li>
                    <li>• Performance optimisation</li>
                    <li>• Testing & quality assurance</li>
                  </ul>
                </div>
              </div>
            </NeumorphCard>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-8">
            <h1>Our Methodology</h1>
            
            <NeumorphCard>
              <h2 className="mb-6">Four-Phase Approach</h2>
              <div className="space-y-6">
                {[
                  { 
                    phase: 'Discovery & Research', 
                    duration: '1 week', 
                    description: 'Understanding your users, business goals, and competitive landscape through comprehensive research and stakeholder interviews.',
                    deliverables: ['User research findings', 'Competitive analysis', 'Technical audit', 'Project roadmap']
                  },
                  { 
                    phase: 'Design & Prototyping', 
                    duration: '2-3 weeks', 
                    description: 'Creating user-centered designs and interactive prototypes based on research insights and brand guidelines.',
                    deliverables: ['Wireframes', 'Visual designs', 'Interactive prototype', 'Design system']
                  },
                  { 
                    phase: 'Development & Testing', 
                    duration: '4-5 weeks', 
                    description: 'Building robust, scalable solutions with thorough testing across all devices and browsers.',
                    deliverables: ['Responsive website', 'CMS integration', 'Performance optimization', 'Quality assurance']
                  },
                  { 
                    phase: 'Launch & Optimisation', 
                    duration: '1 week', 
                    description: 'Ensuring smooth deployment with ongoing performance monitoring and team training.',
                    deliverables: ['Live website', 'Analytics setup', 'Team training', 'Documentation']
                  },
                ].map((item, index) => (
                  <div key={index} className="p-6 neumorph-inset rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="neumorph-card w-12 h-12 flex items-center justify-center rounded-full text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3>{item.phase}</h3>
                          <span className="text-sm text-muted-foreground">{item.duration}</span>
                        </div>
                        <p className="text-muted-foreground mb-4">{item.description}</p>
                        <div>
                          <h4 className="text-sm mb-2">Key Deliverables:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {item.deliverables.map((deliverable, idx) => (
                              <div key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1 h-1 bg-primary rounded-full"></div>
                                {deliverable}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </NeumorphCard>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-8">
            <h1>Services & Investment</h1>
            
            <NeumorphCard>
              <h2 className="mb-6">Detailed Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-2">Service</th>
                      <th className="text-left py-4 px-2">Timeline</th>
                      <th className="text-left py-4 px-2">Investment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium">Design & UX</div>
                          <div className="text-sm text-muted-foreground">User research, wireframing, visual design</div>
                        </div>
                      </td>
                      <td className="py-4 px-2">2-3 weeks</td>
                      <td className="py-4 px-2 font-medium">£8,000</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium">Development</div>
                          <div className="text-sm text-muted-foreground">Frontend, backend, CMS integration</div>
                        </div>
                      </td>
                      <td className="py-4 px-2">4-5 weeks</td>
                      <td className="py-4 px-2 font-medium">£12,000</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium">Testing & Launch</div>
                          <div className="text-sm text-muted-foreground">QA, performance optimization, deployment</div>
                        </div>
                      </td>
                      <td className="py-4 px-2">1 week</td>
                      <td className="py-4 px-2 font-medium">£3,000</td>
                    </tr>
                    <tr className="bg-primary/5">
                      <td className="py-4 px-2 font-medium">Total Project</td>
                      <td className="py-4 px-2 font-medium">7-9 weeks</td>
                      <td className="py-4 px-2 font-medium text-primary text-lg">£23,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </NeumorphCard>
            
            <NeumorphCard>
              <h2 className="mb-4">Payment Schedule</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 neumorph-inset rounded-lg">
                  <div>
                    <div className="font-medium">Project Approval</div>
                    <div className="text-sm text-muted-foreground">50% deposit to begin work</div>
                  </div>
                  <div className="font-medium">£11,500</div>
                </div>
                <div className="flex justify-between items-center p-3 neumorph-inset rounded-lg">
                  <div>
                    <div className="font-medium">Design Completion</div>
                    <div className="text-sm text-muted-foreground">25% upon design approval</div>
                  </div>
                  <div className="font-medium">£5,750</div>
                </div>
                <div className="flex justify-between items-center p-3 neumorph-inset rounded-lg">
                  <div>
                    <div className="font-medium">Project Completion</div>
                    <div className="text-sm text-muted-foreground">25% upon successful launch</div>
                  </div>
                  <div className="font-medium">£5,750</div>
                </div>
              </div>
            </NeumorphCard>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-8">
            <h1>What's Included</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeumorphCard>
                <h3 className="mb-4">Design & User Experience</h3>
                <div className="space-y-3">
                  {[
                    'Custom responsive design for all devices',
                    'User experience (UX) research and testing',
                    'Brand integration and style guide',
                    'Interactive prototypes and wireframes',
                    'Accessibility compliance (WCAG 2.1)',
                    'Modern, conversion-focused layouts'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="neumorph-card w-6 h-6 flex items-center justify-center rounded-full text-primary text-sm">
                        ✓
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </NeumorphCard>
              
              <NeumorphCard>
                <h3 className="mb-4">Development & Technology</h3>
                <div className="space-y-3">
                  {[
                    'Clean, semantic HTML5 and CSS3',
                    'Progressive web app features',
                    'Fast loading times (under 3 seconds)',
                    'Cross-browser compatibility',
                    'Mobile-first responsive development',
                    'Search engine optimisation (SEO)'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="neumorph-card w-6 h-6 flex items-center justify-center rounded-full text-primary text-sm">
                        ✓
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </NeumorphCard>
              
              <NeumorphCard>
                <h3 className="mb-4">Content & Management</h3>
                <div className="space-y-3">
                  {[
                    'Content management system setup',
                    'Content migration from existing site',
                    'Image optimization and compression',
                    'Social media integration',
                    'Contact forms and lead capture',
                    'Newsletter signup integration'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="neumorph-card w-6 h-6 flex items-center justify-center rounded-full text-primary text-sm">
                        ✓
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </NeumorphCard>
              
              <NeumorphCard>
                <h3 className="mb-4">Support & Training</h3>
                <div className="space-y-3">
                  {[
                    '6 months of technical support',
                    'Training for your team (2 sessions)',
                    'Comprehensive documentation',
                    'Google Analytics setup',
                    'Security monitoring setup',
                    'Backup system configuration'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="neumorph-card w-6 h-6 flex items-center justify-center rounded-full text-primary text-sm">
                        ✓
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </NeumorphCard>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-8">
            <h1>Why Choose ProposalCraft Agency</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NeumorphCard className="text-center">
                <div className="neumorph-card w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="mb-2">Award-Winning</h3>
                <p className="text-muted-foreground text-sm">
                  Recognised for excellence in digital design and development with multiple industry awards
                </p>
              </NeumorphCard>
              
              <NeumorphCard className="text-center">
                <div className="neumorph-card w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground text-sm">
                  Efficient agile process ensuring on-time delivery without compromising quality
                </p>
              </NeumorphCard>
              
              <NeumorphCard className="text-center">
                <div className="neumorph-card w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="mb-2">Results-Focused</h3>
                <p className="text-muted-foreground text-sm">
                  Every design decision is backed by data and designed for conversion and business growth
                </p>
              </NeumorphCard>
            </div>
            
            <NeumorphCard>
              <h2 className="mb-6">Our Track Record</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
                <div>
                  <div className="text-3xl font-medium text-primary mb-2">150+</div>
                  <div className="text-muted-foreground">Projects Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-medium text-primary mb-2">98%</div>
                  <div className="text-muted-foreground">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-medium text-primary mb-2">45%</div>
                  <div className="text-muted-foreground">Average Conversion Increase</div>
                </div>
              </div>
              
              <h3 className="mb-4">Recent Client Testimonials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 neumorph-inset rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    "ProposalCraft delivered an exceptional website that exceeded our expectations. Our conversion rate increased by 60% within the first month."
                  </p>
                  <div className="text-xs">— James Wilson, CEO, InnovateTech</div>
                </div>
                <div className="p-4 neumorph-inset rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    "Professional, responsive, and results-driven. The new design perfectly captures our brand identity."
                  </p>
                  <div className="text-xs">— Maria Rodriguez, Marketing Director, GrowthCo</div>
                </div>
              </div>
            </NeumorphCard>
          </div>
        );
        
      case 7:
        return (
          <div className="space-y-8">
            <h1>Timeline & Next Steps</h1>
            
            <NeumorphCard>
              <h2 className="mb-6">Detailed Project Timeline</h2>
              <div className="space-y-4">
                {[
                  { week: 'Week 1', task: 'Discovery & Research Phase', deliverable: 'Research findings, user personas, and technical audit', color: 'bg-blue-100' },
                  { week: 'Weeks 2-3', task: 'Design & Prototyping', deliverable: 'Wireframes, visual designs, and interactive prototype', color: 'bg-green-100' },
                  { week: 'Week 4', task: 'Design Review & Approval', deliverable: 'Final approved designs and style guide', color: 'bg-yellow-100' },
                  { week: 'Weeks 5-8', task: 'Development & Testing', deliverable: 'Fully functional, tested website', color: 'bg-purple-100' },
                  { week: 'Week 9', task: 'Launch & Training', deliverable: 'Live website, training, and documentation', color: 'bg-primary/10' },
                ].map((phase, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 neumorph-inset rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${phase.color} mt-2`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4>{phase.task}</h4>
                        <span className="text-sm font-medium text-primary">{phase.week}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{phase.deliverable}</p>
                    </div>
                  </div>
                ))}
              </div>
            </NeumorphCard>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeumorphCard>
                <h3 className="mb-4">Immediate Next Steps</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="neumorph-card w-6 h-6 flex items-center justify-center rounded-full text-primary text-sm mt-1">
                      1
                    </div>
                    <div>
                      <div className="font-medium">Proposal Approval</div>
                      <div className="text-sm text-muted-foreground">Review and approve this proposal</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="neumorph-card w-6 h-6 flex items-center justify-center rounded-full text-primary text-sm mt-1">
                      2
                    </div>
                    <div>
                      <div className="font-medium">Kick-off Meeting</div>
                      <div className="text-sm text-muted-foreground">Schedule within 48 hours of approval</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="neumorph-card w-6 h-6 flex items-center justify-center rounded-full text-primary text-sm mt-1">
                      3
                    </div>
                    <div>
                      <div className="font-medium">Project Setup</div>
                      <div className="text-sm text-muted-foreground">Team introductions and tool access</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="neumorph-card w-6 h-6 flex items-center justify-center rounded-full text-primary text-sm mt-1">
                      4
                    </div>
                    <div>
                      <div className="font-medium">Discovery Phase</div>
                      <div className="text-sm text-muted-foreground">Begin research and planning</div>
                    </div>
                  </div>
                </div>
              </NeumorphCard>
              
              <NeumorphCard>
                <h3 className="mb-4">Project Communication</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2">Weekly Updates</h4>
                    <p className="text-sm text-muted-foreground">Every Friday progress report via email</p>
                  </div>
                  <div>
                    <h4 className="mb-2">Milestone Reviews</h4>
                    <p className="text-sm text-muted-foreground">Video calls at each major milestone</p>
                  </div>
                  <div>
                    <h4 className="mb-2">Project Dashboard</h4>
                    <p className="text-sm text-muted-foreground">24/7 access to project progress and files</p>
                  </div>
                  <div>
                    <h4 className="mb-2">Direct Access</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className="block">Sarah Johnson, Project Manager</span>
                      <span className="block text-xs">sarah@proposalcraft.com</span>
                      <span className="block text-xs">+44 20 7123 4567</span>
                    </p>
                  </div>
                </div>
              </NeumorphCard>
            </div>
          </div>
        );
        
      case 8:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="mb-4">Ready to Transform Your Website?</h1>
              <p className="text-xl text-muted-foreground">
                We're excited to partner with you on this transformative project
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeumorphCard>
                <h3 className="mb-4">Project Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Investment:</span>
                    <span className="font-medium text-primary">£23,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project Timeline:</span>
                    <span>7-9 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Support Included:</span>
                    <span>6 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>Within 48 hours of approval</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Proposal Valid Until:</span>
                    <span>30 days from issue</span>
                  </div>
                </div>
              </NeumorphCard>
              
              <NeumorphCard>
                <h3 className="mb-4">Your Dedicated Team</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="neumorph-card w-10 h-10 rounded-full flex items-center justify-center">
                      👩‍💼
                    </div>
                    <div>
                      <div className="font-medium">Sarah Johnson</div>
                      <div className="text-sm text-muted-foreground">Project Manager & Lead Designer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="neumorph-card w-10 h-10 rounded-full flex items-center justify-center">
                      👨‍💻
                    </div>
                    <div>
                      <div className="font-medium">Mike Chen</div>
                      <div className="text-sm text-muted-foreground">Senior Frontend Developer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="neumorph-card w-10 h-10 rounded-full flex items-center justify-center">
                      👩‍🔬
                    </div>
                    <div>
                      <div className="font-medium">Emma Taylor</div>
                      <div className="text-sm text-muted-foreground">UX Researcher & Analyst</div>
                    </div>
                  </div>
                </div>
              </NeumorphCard>
            </div>
            
            <NeumorphCard>
              <h3 className="mb-4">Questions or Need Clarification?</h3>
              <p className="text-muted-foreground mb-4">
                We're here to answer any questions you might have about this proposal. 
                Don't hesitate to reach out for clarification on any aspect of the project.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="neumorph-card w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full">
                    📧
                  </div>
                  <div className="font-medium">Email Us</div>
                  <div className="text-muted-foreground">sarah@proposalcraft.com</div>
                </div>
                <div className="text-center">
                  <div className="neumorph-card w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full">
                    📞
                  </div>
                  <div className="font-medium">Call Us</div>
                  <div className="text-muted-foreground">+44 20 7123 4567</div>
                </div>
                <div className="text-center">
                  <div className="neumorph-card w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full">
                    🗓️
                  </div>
                  <div className="font-medium">Schedule Call</div>
                  <div className="text-muted-foreground">Mon-Fri, 9am-6pm GMT</div>
                </div>
              </div>
            </NeumorphCard>
            
            <div className="text-center space-y-6">
              <p className="text-muted-foreground">
                This proposal is valid for 30 days from the date of issue. 
                We look forward to working with you!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NeumorphButton 
                  variant="primary" 
                  onClick={onApprove}
                  className="px-8 py-4"
                >
                  ✅ Approve Proposal
                </NeumorphButton>
                <NeumorphButton 
                  onClick={onReject}
                  className="px-8 py-4"
                >
                  💬 Request Changes
                </NeumorphButton>
                <NeumorphButton 
                  onClick={onDownloadPDF}
                  className="px-8 py-4"
                >
                  📄 Download PDF
                </NeumorphButton>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center space-y-8">
            <h1>Page {currentPage}</h1>
            <NeumorphCard>
              <p className="text-muted-foreground">
                Additional proposal content would appear here. This is a placeholder for page {currentPage}.
              </p>
            </NeumorphCard>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {renderPageContent()}
      
      {/* Action Buttons - Only visible on pages 1-7 */}
      {currentPage < 8 && (
        <div className="flex items-center justify-between pt-8 border-t border-border">
          <NeumorphButton onClick={onDownloadPDF}>
            📥 Download PDF
          </NeumorphButton>
          
          <div className="flex gap-4">
            <NeumorphButton onClick={onReject}>
              💬 Request Changes
            </NeumorphButton>
            <NeumorphButton onClick={onApprove} variant="primary" size="lg">
              ✅ Approve Proposal
            </NeumorphButton>
          </div>
        </div>
      )}
    </div>
  );
};