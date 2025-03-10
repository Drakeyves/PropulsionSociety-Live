import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OptimizedImage from '../../components/ui/OptimizedImage';

// Mock console.warn to avoid cluttering test output
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});
afterAll(() => {
  console.warn = originalWarn;
});

describe('OptimizedImage Component', () => {
  it('renders with the provided src', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image" 
        width={100} 
        height={100} 
      />
    );
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('shows loading placeholder when specified', () => {
    render(
      <OptimizedImage 
        src="/test-image.jpg" 
        alt="Test image" 
        width={100} 
        height={100}
        showLoadingPlaceholder={true}
      />
    );
    
    // Check for SVG in the loading placeholder
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('uses fallback image when provided and original fails', () => {
    render(
      <OptimizedImage 
        src="/non-existent.jpg" 
        fallbackSrc="/fallback.svg"
        alt="Test image" 
        width={100} 
        height={100}
      />
    );
    
    const image = screen.getByAltText('Test image');
    
    // Simulate image load error
    fireEvent.error(image);
    
    // Check if fallback src is used
    expect(image).toHaveAttribute('src', expect.stringContaining('fallback.svg'));
  });

  it('generates fallback image when original fails and no fallback provided', () => {
    render(
      <OptimizedImage 
        src="/non-existent.jpg" 
        alt="Test image" 
        width={100} 
        height={100}
      />
    );
    
    const image = screen.getByAltText('Test image');
    
    // Simulate image load error
    fireEvent.error(image);
    
    // Check if generated fallback src is used (.jpg -> .svg)
    expect(image).toHaveAttribute('src', expect.stringContaining('.svg'));
  });
}); 