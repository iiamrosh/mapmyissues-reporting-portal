import { Issue } from '../types';
import { PRIORITY_RANK } from '../constants/config';

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatCurrency = (num: number): string => {
  if (!isFinite(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR' 
  }).format(num);
};

export const formatCoords = (coords: { lat: number; lng: number }): string => {
  if (!coords) return '';
  return `Lat: ${Number(coords.lat).toFixed(6)}, Lng: ${Number(coords.lng).toFixed(6)}`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

export const sortIssuesByColumn = (issues: Issue[], status: string): Issue[] => {
  return issues
    .filter(i => i.status === status)
    .sort((a, b) => {
      const pr = (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0);
      if (pr !== 0) return pr;
      if ((b.votes || 0) !== (a.votes || 0)) return (b.votes || 0) - (a.votes || 0);
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
};

export const distanceApprox = (
  a: { lat: number; lng: number }, 
  b: { lat: number; lng: number }
): number => {
  if (!a || !b) return Infinity;
  const dLat = a.lat - b.lat;
  const dLng = a.lng - b.lng;
  return Math.sqrt(dLat * dLat + dLng * dLng);
};

export const isDuplicateNearby = (
  issues: Issue[], 
  type: string, 
  coords: { lat: number; lng: number },
  threshold: number = 0.0005
): boolean => {
  if (!coords) return false;
  return issues.some(i => {
    if (i.type !== type) return false;
    const d = distanceApprox(i.coordinates, coords);
    return d <= threshold;
  });
};

export const filterIssues = (
  issues: Issue[],
  filters: {
    status?: string;
    priority?: string;
    department?: string;
  }
): Issue[] => {
  let filtered = [...issues];

  if (filters.status) {
    filtered = filtered.filter(i => i.status === filters.status);
  }
  if (filters.priority) {
    filtered = filtered.filter(i => i.priority === filters.priority);
  }
  if (filters.department) {
    filtered = filtered.filter(i => i.department === filters.department);
  }

  return filtered;
};

export const sortIssues = (
  issues: Issue[],
  sortOrder: string
): Issue[] => {
  const sorted = [...issues];

  switch (sortOrder) {
    case 'createdAt_asc':
      sorted.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      break;
    case 'createdAt_desc':
      sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      break;
    case 'priority_asc':
      sorted.sort((a, b) => (PRIORITY_RANK[a.priority] || 0) - (PRIORITY_RANK[b.priority] || 0));
      break;
    case 'priority_desc':
      sorted.sort((a, b) => (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0));
      break;
    case 'votes_asc':
      sorted.sort((a, b) => (a.votes || 0) - (b.votes || 0));
      break;
    case 'votes_desc':
      sorted.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      break;
    default:
      break;
  }

  return sorted;
};

export const paginateIssues = (
  issues: Issue[],
  page: number,
  pageSize: number = 10
): Issue[] => {
  const start = (page - 1) * pageSize;
  return issues.slice(start, start + pageSize);
};

export const getTotalPages = (
  totalItems: number,
  pageSize: number = 10
): number => {
  return Math.ceil(totalItems / pageSize);
};
