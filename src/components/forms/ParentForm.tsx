import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { Parent } from '@/types';

const parentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  children: z.array(z.string()).min(1, 'Select at least one child'),
});

type ParentFormData = z.infer<typeof parentSchema>;

interface ParentFormProps {
  parent?: Parent | null;
  onSuccess: () => void;
}

export function ParentForm({ parent, onSuccess }: ParentFormProps) {
  const { addParent, updateParent, students } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: parent ? {
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      address: parent.address,
      children: parent.children,
    } : {
      children: [],
    },
  });

  const watchedChildren = watch('children') || [];

  const onSubmit = (data: ParentFormData) => {
    if (parent) {
      updateParent(parent.id, data);
    } else {
      addParent({
        ...data,
        joinDate: new Date().toISOString().split('T')[0],
      });
    }
    onSuccess();
  };

  const handleChildChange = (studentId: string, checked: boolean) => {
    const current = watchedChildren;
    if (checked) {
      setValue('children', [...current, studentId]);
    } else {
      setValue('children', current.filter(id => id !== studentId));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          {...register('phone')}
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          {...register('address')}
          className={errors.address ? 'border-red-500' : ''}
          rows={3}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Children</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 border rounded-lg max-h-48 overflow-y-auto">
          {students.map((student) => (
            <div key={student.id} className="flex items-center space-x-2">
              <Checkbox
                id={`student-${student.id}`}
                checked={watchedChildren.includes(student.id)}
                onCheckedChange={(checked) => handleChildChange(student.id, checked as boolean)}
              />
              <Label htmlFor={`student-${student.id}`} className="text-sm">
                {student.name} ({student.class})
              </Label>
            </div>
          ))}
        </div>
        {errors.children && (
          <p className="text-sm text-red-500">{errors.children.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">
          {parent ? 'Update Parent' : 'Add Parent'}
        </Button>
      </div>
    </form>
  );
}