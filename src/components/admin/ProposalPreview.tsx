import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { useProposal } from '../../hooks/useProposals';
import { useSections } from '../../hooks/useSections';
import { LoadingScreen } from '../utility/LoadingScreen';
import { ErrorScreen } from '../utility/ErrorScreen';

interface ProposalPreviewProps {
  proposalId: string;
}

interface EditorElement {
  id: string;
  type: 'text' | 'heading' | 'image' | 'table' | 'chart' | 'video' | 'embed' | 'shape';
  content: any;
  position: { x: number; y: number };
  width: number;
  height: number;
  locked?: boolean;
  zIndex?: number;
}

export const ProposalPreview: React.FC<ProposalPreviewProps> = ({ proposalId }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  const { data: proposal, isLoading: proposalLoading, error: proposalError } = useProposal(proposalId);
  const { data: sections, isLoading: sectionsLoading, error: sectionsError } = useSections(proposalId);

  if (proposalLoading || sectionsLoading) {
    return <LoadingScreen message="Loading proposal preview..." />;
  }

  if (proposalError || sectionsError) {
    return <ErrorScreen message="Failed to load proposal preview" />;
  }

  if (!proposal || !sections || sections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No content to preview</p>
      </div>
    );
  }

  const currentSection = sections[currentSectionIndex];
  const elements = (currentSection?.elements as unknown as EditorElement[]) || [];

  const renderElement = (element: EditorElement) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.position.x,
      top: element.position.y,
      width: element.width,
      height: element.height,
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className="pointer-events-none"
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        );

      case 'heading':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className="pointer-events-none"
          >
            <h2 className="text-2xl font-bold">{element.content}</h2>
          </div>
        );

      case 'image':
        return (
          <div key={element.id} style={baseStyle} className="overflow-hidden rounded">
            {element.content.url ? (
              <img
                src={element.content.url}
                alt={element.content.alt || ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                🖼️ No image
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div key={element.id} style={baseStyle} className="rounded overflow-hidden">
            {element.content.embedCode ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: element.content.embedCode }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                🎥 No video
              </div>
            )}
          </div>
        );

      case 'embed':
        return (
          <div key={element.id} style={baseStyle} className="rounded overflow-hidden">
            {element.content.code ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: element.content.code }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                📦 No embed
              </div>
            )}
          </div>
        );

      case 'table':
        return (
          <div key={element.id} style={baseStyle} className="overflow-auto">
            <table className="w-full border-collapse">
              {element.content.showHeaders && (
                <thead>
                  <tr className="bg-primary/10">
                    {element.content.data[0]?.map((cell: string, idx: number) => (
                      <th key={idx} className="border border-border p-2 text-left">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className={element.content.stripedRows ? 'divide-y' : ''}>
                {element.content.data.slice(element.content.showHeaders ? 1 : 0).map((row: string[], rowIdx: number) => (
                  <tr key={rowIdx} className={element.content.stripedRows && rowIdx % 2 === 1 ? 'bg-muted/30' : ''}>
                    {row.map((cell: string, cellIdx: number) => (
                      <td
                        key={cellIdx}
                        className={`p-2 ${element.content.showBorders ? 'border border-border' : ''}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'chart':
        return (
          <div key={element.id} style={baseStyle} className="bg-white rounded p-2">
            {element.content.data && element.content.data.length > 0 ? (
              <div className="w-full h-full">
                {element.content.chartType === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={element.content.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {element.content.chartType === 'line' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={element.content.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {element.content.chartType === 'pie' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={element.content.data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        label
                      >
                        {element.content.data.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {element.content.chartType === 'area' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={element.content.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#f97316" fill="#fdba74" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                📈 No chart data
              </div>
            )}
          </div>
        );

      case 'shape':
        return (
          <div key={element.id} style={baseStyle}>
            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
              {element.content.shapeType === 'line' && (
                <line
                  x1="0"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                  stroke={element.content.borderColor || '#000000'}
                  strokeWidth={element.content.borderWidth || 2}
                  opacity={element.content.opacity / 100}
                />
              )}
              {element.content.shapeType === 'divider' && (
                <line
                  x1="0"
                  y1="50%"
                  x2="100%"
                  y2="50%"
                  stroke={element.content.borderColor || '#000000'}
                  strokeWidth={element.content.borderWidth || 1}
                  strokeDasharray={element.content.borderStyle === 'dashed' ? '5,5' : undefined}
                  opacity={element.content.opacity / 100}
                />
              )}
              {element.content.shapeType === 'rectangle' && (
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill={element.content.fillColor || 'transparent'}
                  stroke={element.content.borderColor || '#000000'}
                  strokeWidth={element.content.borderWidth || 2}
                  strokeDasharray={element.content.borderStyle === 'dashed' ? '5,5' : undefined}
                  rx={element.content.borderRadius || 0}
                  opacity={element.content.opacity / 100}
                />
              )}
              {element.content.shapeType === 'circle' && (
                <ellipse
                  cx="50%"
                  cy="50%"
                  rx="45%"
                  ry="45%"
                  fill={element.content.fillColor || 'transparent'}
                  stroke={element.content.borderColor || '#000000'}
                  strokeWidth={element.content.borderWidth || 2}
                  opacity={element.content.opacity / 100}
                />
              )}
              {element.content.shapeType === 'arrow' && (
                <>
                  <line
                    x1="10%"
                    y1="50%"
                    x2="90%"
                    y2="50%"
                    stroke={element.content.borderColor || '#000000'}
                    strokeWidth={element.content.borderWidth || 2}
                    opacity={element.content.opacity / 100}
                  />
                  <polygon
                    points="90,40 100,50 90,60"
                    fill={element.content.borderColor || '#000000'}
                    opacity={element.content.opacity / 100}
                  />
                </>
              )}
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <NeumorphCard className="p-8">
        {/* Proposal Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">{proposal.title}</h1>
          {proposal.client && (
            <p className="text-muted-foreground">For: {proposal.client.name}</p>
          )}
        </div>

        {/* Section Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <NeumorphButton
            size="sm"
            onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
            disabled={currentSectionIndex === 0}
          >
            ← Previous
          </NeumorphButton>
          <span className="text-sm text-muted-foreground">
            Page {currentSectionIndex + 1} of {sections.length}
          </span>
          <NeumorphButton
            size="sm"
            onClick={() => setCurrentSectionIndex(Math.min(sections.length - 1, currentSectionIndex + 1))}
            disabled={currentSectionIndex === sections.length - 1}
          >
            Next →
          </NeumorphButton>
        </div>

        {/* Section Title */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">{currentSection?.title}</h2>
        </div>

        {/* Canvas - Read-only */}
        <div className="relative bg-white rounded-lg border border-border" style={{ minHeight: '600px', height: '800px' }}>
          <div className="relative w-full h-full p-8">
            {elements.map(renderElement)}
            
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p>This page is empty</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {sections.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSectionIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSectionIndex
                  ? 'bg-primary w-6'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </NeumorphCard>
    </div>
  );
};
