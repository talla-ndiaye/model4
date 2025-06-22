import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { Student } from '@/types';

const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  class: z.string().min(1, 'Please select a class'),
  parentId: z.string().min(1, 'Please select a parent/guardian'),
  status: z.enum(['active', 'inactive']),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: Student | null;
  onSuccess: () => void;
}

const availableClasses = [
  '9A', '9B', '9C',
  '10A', '10B', '10C',
  '11A', '11B', '11C',
  '12A', '12B', '12C',
];

export function StudentForm({ student, onSuccess }: StudentFormProps) {
  const { addStudent, updateStudent, parents } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student ? {
      name: student.name,
      email: student.email || '',
      phone: student.phone || '',
      class: student.class,
      parentId: student.parentId,
      status: student.status,
    } : {
      status: 'active',
    },
  });

  const onSubmit = (data: StudentFormData) => {
    const studentData = {
      ...data,
      email: data.email || undefined,
      phone: data.phone || undefined,
    };

    if (student) {
      updateStudent(student.id, studentData);
    } else {
      addStudent({
        ...studentData,
        enrollmentDate: new Date().toISOString().split('T')[0],
      });
    }
    onSuccess();
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
          <Label htmlFor="email">Email (Optional)</Label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            {...register('phone')}
          />
        </div>

        <div className="space-y-2">
          <Label>Class</Label>
          <Select
            value={watch('class') || ''}
            onValueChange={(value) => setValue('class', value)}
          >
            <SelectTrigger className={errors.class ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {availableClasses.map((className) => (
                <SelectItem key={className} value={className}>
                  {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.class && (
            <p className="text-sm text-red-500">{errors.class.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Parent/Guardian</Label>
          <Select
            value={watch('parentId') || ''}
            onValueChange={(value) => setValue('parentId', value)}
          >
            <SelectTrigger className={errors.parentId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a parent/guardian" />
            </SelectTrigger>
            <SelectContent>
              {parents.map((parent) => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.parentId && (
            <p className="text-sm text-red-500">{errors.parentId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">
          {student ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
}