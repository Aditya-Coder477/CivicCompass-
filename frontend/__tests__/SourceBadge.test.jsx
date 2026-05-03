/**
 * Frontend Unit Tests: SourceBadge Component
 * Validates that the SourceBadge component renders correctly
 * with provided and default props.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import SourceBadge from '../src/components/SourceBadge';

describe('SourceBadge Component', () => {

  test('renders with default props', () => {
    render(<SourceBadge />);
    expect(screen.getByText('Mock Data')).toBeTruthy();
    expect(screen.getByText('🛡️')).toBeTruthy();
  });

  test('renders custom label', () => {
    render(<SourceBadge label="ECI Guidelines" />);
    expect(screen.getByText('ECI Guidelines')).toBeTruthy();
  });

  test('renders custom icon', () => {
    render(<SourceBadge label="Test" icon="📊" />);
    expect(screen.getByText('📊')).toBeTruthy();
  });

  test('has source-badge CSS class', () => {
    const { container } = render(<SourceBadge />);
    const badge = container.querySelector('.source-badge');
    expect(badge).toBeTruthy();
  });

  test('renders with ECI Verified Data label', () => {
    render(<SourceBadge label="ECI Verified Data" icon="✅" />);
    expect(screen.getByText('ECI Verified Data')).toBeTruthy();
    expect(screen.getByText('✅')).toBeTruthy();
  });
});
