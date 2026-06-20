import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('smoke', () => {
  it('vitest + jest-dom matchers work', () => {
    render(<h1>Hello, data-alchemy</h1>);
    expect(screen.getByRole('heading', { name: /Hello, data-alchemy/i })).toBeInTheDocument();
  });

  it('arithmetic still works', () => {
    expect(2 + 2).toBe(4);
  });
});
