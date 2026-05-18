import { FormEvent, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LEAD_SOURCES, LEAD_STATUSES, LeadFormData } from '@/types';

interface LeadFormProps {
  initialData?: LeadFormData;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const defaultData: LeadFormData = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website',
};

export const LeadForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Lead',
}: LeadFormProps) => {
  const [formData, setFormData] = useState<LeadFormData>(initialData || defaultData);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        placeholder="John Doe"
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        placeholder="john@example.com"
      />
      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={(e) =>
          setFormData({ ...formData, status: e.target.value as LeadFormData['status'] })
        }
        options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
      />
      <Select
        label="Source"
        name="source"
        value={formData.source}
        onChange={(e) =>
          setFormData({ ...formData, source: e.target.value as LeadFormData['source'] })
        }
        options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
