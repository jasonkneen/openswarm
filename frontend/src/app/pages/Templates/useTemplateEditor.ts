import { useState } from 'react';
import { useAppDispatch } from '@/shared/hooks';
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  PromptTemplate,
  TemplateField,
} from '@/shared/state/templatesSlice';

export interface EditorState {
  name: string;
  description: string;
  template: string;
  fields: TemplateField[];
  tags: string[];
}

export const emptyEditor: EditorState = {
  name: '',
  description: '',
  template: '',
  fields: [],
  tags: [],
};

export function useTemplateEditor() {
  const dispatch = useAppDispatch();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(emptyEditor);
  const [tagInput, setTagInput] = useState('');

  const openNew = () => {
    setEditingId(null);
    setEditor(emptyEditor);
    setTagInput('');
    setEditorOpen(true);
  };

  const openEdit = (t: PromptTemplate) => {
    setEditingId(t.id);
    setEditor({
      name: t.name,
      description: t.description,
      template: t.template,
      fields: t.fields.map((f) => ({ ...f })),
      tags: [...t.tags],
    });
    setTagInput('');
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (!editor.name.trim() || !editor.template.trim()) return;
    if (editingId) {
      await dispatch(updateTemplate({ id: editingId, ...editor }));
    } else {
      await dispatch(createTemplate(editor));
    }
    setEditorOpen(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteTemplate(id));
  };

  const addField = () => {
    setEditor((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: '', type: 'str', required: true }],
    }));
  };

  const updateField = (idx: number, patch: Partial<TemplateField>) => {
    setEditor((prev) => ({
      ...prev,
      fields: prev.fields.map((f, i) => (i === idx ? { ...f, ...patch } : f)),
    }));
  };

  const removeField = (idx: number) => {
    setEditor((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== idx),
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !editor.tags.includes(tag)) {
      setEditor((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setEditor((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  return {
    editorOpen,
    setEditorOpen,
    editingId,
    editor,
    setEditor,
    tagInput,
    setTagInput,
    openNew,
    openEdit,
    handleSave,
    handleDelete,
    addField,
    updateField,
    removeField,
    addTag,
    removeTag,
  };
}
