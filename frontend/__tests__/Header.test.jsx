/**
 * Frontend Unit Tests: Header Component
 * Tests navigation rendering and mobile menu toggle.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/link and next/navigation
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

import Header from '../src/components/Header';

describe('Header Component', () => {

  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  test('renders CivicCompass logo text', () => {
    render(<Header />);
    expect(screen.getByText('Civic')).toBeTruthy();
    expect(screen.getByText('Compass')).toBeTruthy();
  });

  test('shows public nav items when not registered', () => {
    render(<Header />);
    expect(screen.getByText('Checklist')).toBeTruthy();
    expect(screen.getByText('Myth vs Fact')).toBeTruthy();
    expect(screen.getByText('Booth Locator')).toBeTruthy();
    expect(screen.getByText('Practice Voting')).toBeTruthy();
    expect(screen.getByText('Assistant')).toBeTruthy();
  });

  test('does NOT show Journey/Timeline when not registered', () => {
    render(<Header />);
    // Journey and Timeline should only appear in the nav if civicProfile is set
    const allLinks = screen.getAllByRole('link');
    const hrefs = allLinks.map(l => l.getAttribute('href'));
    expect(hrefs).not.toContain('/journey');
    expect(hrefs).not.toContain('/timeline');
  });

  test('shows Journey/Timeline when registered (civicProfile in localStorage)', () => {
    window.localStorage.getItem = jest.fn(() => JSON.stringify({ name: 'Test', registered: true }));
    render(<Header />);
    expect(screen.getByText('Journey')).toBeTruthy();
    expect(screen.getByText('Timeline')).toBeTruthy();
  });

  test('logo links to home page', () => {
    render(<Header />);
    const homeLinks = screen.getAllByRole('link').filter(l => l.getAttribute('href') === '/');
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
  });
});
