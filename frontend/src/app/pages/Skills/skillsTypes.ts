export interface SkillForm {
  name: string;
  description: string;
  content: string;
  command: string;
}

export type Selection =
  | { type: 'registry'; name: string }
  | { type: 'local'; id: string }
  | { type: 'builder-preview' }
  | null;

export const emptyForm: SkillForm = { name: '', description: '', content: '', command: '' };

export const SIDEBAR_W = 260;
