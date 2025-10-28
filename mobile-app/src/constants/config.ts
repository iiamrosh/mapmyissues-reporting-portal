export const SUPABASE_URL = 'https://xaxhydeqepugpzndgmwb.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheGh5ZGVxZXB1Z3B6bmRnbXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NjM3MjcsImV4cCI6MjA3MzIzOTcyN30.8Gz_3tVGKQLdF6GlfdMa8dWZ9XOPzPfO3b2wkRS7V3Y';

export const SUPABASE_BUCKET = 'issue-photos';

export const ISSUE_TYPES = {
  roads: ["pothole", "sidewalk damage", "traffic management", "abandoned vehicles", "parking hazards"],
  utilities: ["water leak", "streetlight", "traffic signal", "streetlights", "piped water supply", "water quality", "leakages", "supply disruptions", "streetlight outages", "public electrical hazards", "power outages affecting civic services"],
  sanitation: ["garbage", "drainage", "solid waste", "sanitation", "street cleaning", "drains", "sewerage", "sewer rehabilitation", "major sanitation projects", "rural sanitation", "vector control", "sanitation health hazards", "garbage collection lapses", "illegal dumping", "dump site complaints"],
  public_space: ["parks maintenance", "graffiti", "park maintenance in development areas"],
  environment: ["noise complaint", "pollution complaints", "tree/greenbelt issues", "environmental violations", "river embankments", "urban flooding", "storm drainage"],
  others: ["others", "municipal services", "urban planning", "ULB grievances", "licensing", "property tax", "disaster relief", "post-disaster infrastructure repair", "emergency coordination", "rural water supply", "panchayat-level civic works", "public health outbreaks", "illegal construction", "planning violations", "public housing maintenance", "allotment complaints", "slum-upgrade civic issues"]
};

export const DEPARTMENTS = [
  "Housing & Urban Development Department",
  "Directorate of Municipal Administration",
  "Orissa Water Supply & Sewerage Board (OWSSB)",
  "Public Health Engineering Organization (PHEO)",
  "Public Works / Works Department (PWD)",
  "Water Resources Department",
  "Revenue & Disaster Management",
  "Panchayati Raj & Drinking Water",
  "Forest, Environment & Climate Change",
  "Health & Family Welfare",
  "Energy Department / Distribution Utilities",
  "Transport / Commerce & Transport",
  "Home / Police / Traffic Police",
  "Development Authorities (BDA/CDA etc.)",
  "Odisha Urban Housing Mission / State Housing Board",
  "ULB Solid Waste / Sanitation Cells"
];

export const STATUS_ORDER = ['recent', 'queue', 'inprogress', 'completed'];

export const PRIORITY_RANK = { urgent: 3, immediate: 2, medium: 1, low: 0 };

export const PRIORITY_COLORS = {
  low: '#6c757d',
  medium: '#ffc107',
  immediate: '#fd7e14',
  urgent: '#dc3545',
};

export const STATUS_COLORS = {
  recent: '#007bff',
  queue: '#ffc107',
  inprogress: '#fd7e14',
  completed: '#28a745',
};
