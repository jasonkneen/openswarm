import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useClaudeTokens } from '@/shared/styles/ThemeContext';
import { BrowseResult } from '@/shared/state/settingsSlice';

interface DirectoryFileListProps {
  browseData: BrowseResult | null;
  selected: { name: string; type: 'file' | 'directory' } | null;
  loading: boolean;
  error: string | null;
  onBrowse: (path: string) => void;
  onNavigate: (dir: string) => void;
  onGoUp: () => void;
  onSelect: (item: { name: string; type: 'file' | 'directory' } | null) => void;
}

const DirectoryFileList: React.FC<DirectoryFileListProps> = ({
  browseData, selected, loading, error, onBrowse, onNavigate, onGoUp, onSelect,
}) => {
  const c = useClaudeTokens();
  const pathSegments = browseData?.current.split('/').filter(Boolean) ?? [];
  const hasEntries = (browseData?.directories.length ?? 0) + (browseData?.files.length ?? 0) > 0;

  return (
    <>
      {browseData && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={onGoUp}
            disabled={!browseData.parent}
            sx={{ color: c.text.tertiary, '&:hover': { color: c.accent.primary } }}
          >
            <ArrowUpwardIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Breadcrumbs
            separator="/"
            sx={{
              '& .MuiBreadcrumbs-separator': { color: c.text.ghost, mx: 0.25 },
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <Link
              component="button"
              underline="hover"
              onClick={() => onBrowse('/')}
              sx={{ color: c.text.tertiary, fontSize: '0.78rem' }}
            >
              /
            </Link>
            {pathSegments.map((seg, i) => {
              const fullPath = '/' + pathSegments.slice(0, i + 1).join('/');
              const isLast = i === pathSegments.length - 1;
              return isLast ? (
                <Typography key={fullPath} sx={{ color: c.text.primary, fontSize: '0.78rem', fontWeight: 500 }}>
                  {seg}
                </Typography>
              ) : (
                <Link
                  key={fullPath}
                  component="button"
                  underline="hover"
                  onClick={() => onBrowse(fullPath)}
                  sx={{ color: c.text.tertiary, fontSize: '0.78rem' }}
                >
                  {seg}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>
      )}

      {error && (
        <Typography sx={{ color: c.status.error, fontSize: '0.82rem', px: 1 }}>
          {error}
        </Typography>
      )}

      <Box sx={{
        flex: 1,
        overflow: 'auto',
        border: `1px solid ${c.border.subtle}`,
        borderRadius: 2,
        bgcolor: c.bg.page,
        '&::-webkit-scrollbar': { width: 5 },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          background: c.border.medium,
          borderRadius: 3,
          '&:hover': { background: c.border.strong },
        },
        scrollbarWidth: 'thin',
        scrollbarColor: `${c.border.medium} transparent`,
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} sx={{ color: c.accent.primary }} />
          </Box>
        ) : !hasEntries ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: c.text.ghost, fontSize: '0.85rem' }}>
              Empty directory
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {browseData?.directories.map((dir) => (
              <ListItemButton
                key={`d-${dir}`}
                selected={selected?.name === dir && selected.type === 'directory'}
                onDoubleClick={() => onNavigate(dir)}
                onClick={() =>
                  onSelect(
                    selected?.name === dir && selected.type === 'directory' ? null : { name: dir, type: 'directory' },
                  )
                }
                sx={{
                  py: 0.75,
                  '&.Mui-selected': { bgcolor: `${c.accent.primary}0c` },
                  '&:hover': { bgcolor: `${c.accent.primary}08` },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: c.accent.primary }}>
                  <FolderIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary={dir}
                  primaryTypographyProps={{ sx: { fontSize: '0.84rem', color: c.text.primary } }}
                />
              </ListItemButton>
            ))}
            {browseData?.files.map((file) => (
              <ListItemButton
                key={`f-${file}`}
                selected={selected?.name === file && selected.type === 'file'}
                onClick={() =>
                  onSelect(
                    selected?.name === file && selected.type === 'file' ? null : { name: file, type: 'file' },
                  )
                }
                sx={{
                  py: 0.75,
                  '&.Mui-selected': { bgcolor: `${c.accent.primary}0c` },
                  '&:hover': { bgcolor: `${c.accent.primary}08` },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: c.text.muted }}>
                  <InsertDriveFileOutlinedIcon sx={{ fontSize: 17 }} />
                </ListItemIcon>
                <ListItemText
                  primary={file}
                  primaryTypographyProps={{ sx: { fontSize: '0.84rem', color: c.text.secondary } }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </>
  );
};

export default DirectoryFileList;
