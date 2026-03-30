export interface SchemaNode {
  type?: string;
  properties?: Record<string, SchemaNode>;
  items?: SchemaNode;
  required?: string[];
  enum?: string[];
  description?: string;
  default?: any;
}

export function getDefault(schema: SchemaNode): any {
  if (schema.default !== undefined) return schema.default;
  switch (schema.type) {
    case 'string': return '';
    case 'number': return 0;
    case 'boolean': return false;
    case 'array': return [];
    case 'object': {
      const obj: Record<string, any> = {};
      if (schema.properties) {
        for (const [k, v] of Object.entries(schema.properties)) {
          obj[k] = getDefault(v);
        }
      }
      return obj;
    }
    default: return '';
  }
}

const STRING_STUBS: Record<string, string> = {
  name: 'Jane Smith', first_name: 'Jane', last_name: 'Smith', firstName: 'Jane', lastName: 'Smith',
  email: 'jane@example.com', url: 'https://example.com', website: 'https://example.com',
  phone: '+1 (555) 123-4567', address: '123 Main St, Springfield',
  city: 'Springfield', state: 'CA', country: 'US', zip: '90210',
  title: 'Sample Title', subject: 'Hello World', message: 'This is a sample message.',
  description: 'A brief description of the item.', content: 'Lorem ipsum dolor sit amet.',
  username: 'janesmith', password: 'P@ssw0rd!', token: 'tok_sample_abc123',
  id: 'item_001', uuid: '550e8400-e29b-41d4-a716-446655440000',
  date: '2025-03-15', time: '14:30', datetime: '2025-03-15T14:30:00Z',
  color: '#4a90d9', label: 'Important', tag: 'sample', category: 'general',
  query: 'search term', search: 'example query', text: 'Sample text content',
  path: '/home/user/file.txt', file: 'document.pdf', filename: 'report.pdf',
  company: 'Acme Corp', organization: 'Acme Corp',
};

function stubString(key: string): string {
  const lower = key.toLowerCase().replace(/[-_]/g, '');
  for (const [pattern, val] of Object.entries(STRING_STUBS)) {
    if (lower === pattern.toLowerCase().replace(/[-_]/g, '') || lower.endsWith(pattern.toLowerCase().replace(/[-_]/g, ''))) {
      return val;
    }
  }
  return `sample_${key}`;
}

export function getStubbed(schema: SchemaNode, key?: string): any {
  if (schema.default !== undefined) return schema.default;
  if (schema.enum && schema.enum.length > 0) return schema.enum[0];
  switch (schema.type) {
    case 'string': return stubString(key || 'value');
    case 'number': return 42;
    case 'integer': return 7;
    case 'boolean': return true;
    case 'array': {
      if (!schema.items) return [];
      return [getStubbed(schema.items, key ? `${key}_item` : 'item')];
    }
    case 'object': {
      const obj: Record<string, any> = {};
      if (schema.properties) {
        for (const [k, v] of Object.entries(schema.properties)) {
          obj[k] = getStubbed(v, k);
        }
      }
      return obj;
    }
    default: return stubString(key || 'value');
  }
}
