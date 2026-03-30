import React from 'react';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import TuneIcon from '@mui/icons-material/Tune';

export const ICON_MAP: Record<string, React.ReactNode> = {
  smart_toy: React.createElement(SmartToyOutlinedIcon, { sx: { fontSize: 20 } }),
  question_answer: React.createElement(QuestionAnswerOutlinedIcon, { sx: { fontSize: 20 } }),
  map: React.createElement(MapOutlinedIcon, { sx: { fontSize: 20 } }),
  category: React.createElement(CategoryOutlinedIcon, { sx: { fontSize: 20 } }),
  tune: React.createElement(TuneIcon, { sx: { fontSize: 20 } }),
};

export const ICON_OPTIONS = [
  { value: 'smart_toy', label: 'Robot' },
  { value: 'question_answer', label: 'Q&A' },
  { value: 'map', label: 'Map' },
  { value: 'category', label: 'Category' },
  { value: 'tune', label: 'Tune' },
];

export const COLOR_OPTIONS = [
  { value: '#ae5630', label: 'Terra Cotta' },
  { value: '#4ade80', label: 'Green' },
  { value: '#fbbf24', label: 'Amber' },
  { value: '#f87171', label: 'Red' },
  { value: '#38bdf8', label: 'Sky' },
  { value: '#c084fc', label: 'Purple' },
  { value: '#fb923c', label: 'Orange' },
  { value: '#2dd4bf', label: 'Teal' },
];

export interface ModeForm {
  name: string;
  description: string;
  system_prompt: string;
  tools: string[];
  toolsEnabled: boolean;
  default_next_mode: string;
  icon: string;
  color: string;
  default_folder: string;
}

export const emptyForm: ModeForm = {
  name: '',
  description: '',
  system_prompt: '',
  tools: [],
  toolsEnabled: false,
  default_next_mode: '',
  icon: 'smart_toy',
  color: '#ae5630',
  default_folder: '',
};

export const ALL_BUILTIN_TOOL_NAMES = [
  'Read', 'Edit', 'Write', 'Bash', 'Glob', 'Grep', 'AskUserQuestion',
];
