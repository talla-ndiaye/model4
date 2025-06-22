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
import { Staff } from '@/types';

const staffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  position: z.string().min(2, 'Position must be at least 2 characters'),
  department: z.string().min(2, 'Department must be at least 2 characters'),
  salary: z.number().min(1000, 'Salary must be at least $1,000'),
  status: z.enum(['active', 'inactive']),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffFormProps {
  staff?: Staff | null;
  onSuccess: () => void;
}

const departments = [
  'Administration',
  'Finance',
  'Human Resources',
  'IT Support',
  'Maintenance',
  'Security',
  'Library',
  'Cafeteria',
  'Transportation',
  'Health Services',
];

const positions = [
  'Principal',
  'Vice Principal',
  'Administrator',
  'Secretary',
  'Accountant',
  'IT Specialist',
  'Librarian',
  'Nurse',
  'Security Guard',
  'Janitor',
  'Bus Driver',
  'Cook',
];

export function StaffForm({ staff, onSuccess }: StaffFormProps) {
  const { addStaff, updateStaff } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: staff ? {
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      position: staff.position,
      department: staff.department,
      salary: staff.salary,
      status: staff.status,
    } : {
      status: 'active',
      salary: 30000,
    },
  });

  const onSubmit = (data: StaffFormData) => {
    if (staff) {
      updateStaff(staff.id, data);
    } else {
      addStaff({
        ...data,
        joinDate: new Date().toISOString().split('T')[0],
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Position</Label>
          <Select
            value={watch('position') || ''}
            onValueChange={(value) => setValue('position', value)}
          >
            <SelectTrigger className={errors.position ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.position && (
            <p className="text-sm text-red-500">{errors.position.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          <Select
            value={watch('department') || ''}
            onValueChange={(value) => setValue('department', value)}
          >
            <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-sm text-red-500">{errors.department.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="salary">Annual Salary ($)</Label>
        <Input
          id="salary"
          type="number"
          min="1000"
          step="1000"
          {...register('salary', { valueAsNumber: true })}
          className={errors.salary ? 'border-red-500' : ''}
        />
        {errors.salary && (
          <p className="text-sm text-red-500">{errors.salary.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">
          {staff ? 'Update Staff Member' : 'Add Staff Member'}
        </Button>
      </div>
    </form>
  );
}