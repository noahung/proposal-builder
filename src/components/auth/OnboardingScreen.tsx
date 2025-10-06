import React, { useState } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { NeumorphInput } from '../ui/neumorph-input';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphCard } from '../ui/neumorph-card';
import { Label } from '../ui/label';

interface OnboardingScreenProps {
  onComplete: (data: {
    logo?: File;
    brandColor: string;
    pocName: string;
    pocEmail: string;
    pocPhone: string;
    pocPhoto?: File;
  }) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    brandColor: '#6366f1',
    pocName: '',
    pocEmail: '',
    pocPhone: '',
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [pocPhoto, setPocPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      logo: logo || undefined,
      brandColor: formData.brandColor,
      pocName: formData.pocName,
      pocEmail: formData.pocEmail,
      pocPhone: formData.pocPhone,
      pocPhoto: pocPhoto || undefined,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (type: 'logo' | 'photo', file: File | null) => {
    if (type === 'logo') {
      setLogo(file);
    } else {
      setPocPhoto(file);
    }
  };

  return (
    <AuthLayout
      title="Complete Setup"
      subtitle="Let's customise your ProposalCraft experience"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <NeumorphCard variant="inset" className="p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
            </NeumorphCard>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brandColor">Brand Colour</Label>
            <div className="flex gap-2">
              <NeumorphInput
                id="brandColor"
                type="color"
                value={formData.brandColor}
                onChange={(e) => handleChange('brandColor', e.target.value)}
                className="w-16 h-12 p-1"
              />
              <NeumorphInput
                type="text"
                value={formData.brandColor}
                onChange={(e) => handleChange('brandColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3>Point of Contact Details</h3>
          
          <div className="space-y-2">
            <Label>Contact Photo</Label>
            <NeumorphCard variant="inset" className="p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
            </NeumorphCard>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pocName">Full Name</Label>
            <NeumorphInput
              id="pocName"
              placeholder="Enter contact name"
              value={formData.pocName}
              onChange={(e) => handleChange('pocName', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pocEmail">Email Address</Label>
            <NeumorphInput
              id="pocEmail"
              type="email"
              placeholder="Enter contact email"
              value={formData.pocEmail}
              onChange={(e) => handleChange('pocEmail', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pocPhone">Phone Number</Label>
            <NeumorphInput
              id="pocPhone"
              type="tel"
              placeholder="Enter contact phone"
              value={formData.pocPhone}
              onChange={(e) => handleChange('pocPhone', e.target.value)}
              required
            />
          </div>
        </div>
        
        <NeumorphButton type="submit" variant="primary" className="w-full" size="lg">
          Complete Setup
        </NeumorphButton>
      </form>
    </AuthLayout>
  );
};