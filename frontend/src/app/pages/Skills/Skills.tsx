import React from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { useSkillsState } from './hooks/useSkillsState';
import SkillsSidebar from './SkillsSidebar';
import SkillDetailPanel from './SkillDetailPanel';
import SkillFormDialog from './SkillFormDialog';
import SkillBuilderChat from './SkillBuilderChat';

const Skills: React.FC = () => {
  const c = useClaudeTokens();
  const s = useSkillsState();

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden', bgcolor: c.bg.page, position: 'relative' }}>
      <SkillsSidebar
        searchFilter={s.searchFilter}
        onSearchFilterChange={s.setSearchFilter}
        filteredLocal={s.filteredLocal}
        regGrouped={s.regGrouped}
        categoryOrder={s.categoryOrder}
        collapsedCats={s.collapsedCats}
        onToggleCategory={s.toggleCategory}
        showLoadingSpinner={s.showLoadingSpinner}
        isSelected={s.isSelected}
        onSelectLocal={s.selectLocal}
        onSelectRegistry={s.selectRegistry}
        onOpenCreate={s.openCreate}
        onOpenBuilder={() => s.setBuilderOpen(true)}
      />

      <SkillDetailPanel
        selection={s.selection}
        builderPreview={s.builderPreview}
        selectedReg={s.selectedReg}
        regDetailLoading={s.regDetailLoading}
        selectedLocal={s.selectedLocal}
        contentView={s.contentView}
        onContentViewChange={s.setContentView}
        onInstall={s.handleInstall}
        onEditInstall={s.handleEditInstall}
        onEdit={s.openEdit}
        onDelete={s.handleDelete}
      />

      <SkillFormDialog
        open={s.dialogOpen}
        onClose={() => s.setDialogOpen(false)}
        editingId={s.editingId}
        form={s.form}
        onFormChange={s.setForm}
        onSave={s.handleSave}
      />

      <SkillBuilderChat
        onSkillPreview={s.handleBuilderPreview}
        onSkillSaved={s.handleBuilderSaved}
        expanded={s.builderOpen}
        onExpandedChange={s.setBuilderOpen}
      />

      <Snackbar
        open={s.snackbar.open}
        autoHideDuration={3000}
        onClose={() => s.setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => s.setSnackbar({ open: false, message: '' })}
          severity="success"
          sx={{ bgcolor: c.status.successBg, color: c.status.success, border: `1px solid rgba(38,91,25,0.25)` }}
        >
          {s.snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Skills;
