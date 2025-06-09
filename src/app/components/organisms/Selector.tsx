'use client';

import CreatableSelect from 'react-select/creatable';
import type { MultiValue, ActionMeta } from 'react-select';

type Option = { label: string; value: string };

interface CultivoSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function CultivoSelector({ value, onChange }: CultivoSelectorProps) {
  const selectedOptions: Option[] = value.map((v) => ({ label: v, value: v }));

  const handleChange = (
    newValue: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    onChange(newValue.map(o => o.value));
  };

  return (
    <div className="my-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de cultivo</label>
      <CreatableSelect
        isMulti
        onChange={handleChange}
        value={selectedOptions}
        placeholder="Digite e pressione enter para adicionar..."
        className="text-black"
      />
    </div>
  );
}
