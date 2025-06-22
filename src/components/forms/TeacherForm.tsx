import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { Teacher } from '@/types';

const teacherSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  classes: z.array(z.string()).min(1, 'Select at least one class'),
  status: z.enum(['active', 'inactive']),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  teacher?: Teacher | null;
  onSuccess: () => void;
}

const availableSubjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Literature',
  'History',
  'Geography',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
];

const availableClasses = [
  '9A', '9B', '9C',
  '10A', '10B', '10C',
  '11A', '11B', '11C',
  '12A', '12B', '12C',
];

export function TeacherForm({ teacher, onSuccess }: TeacherFormProps) {
  const { addTeacher, updateTeacher } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: teacher ? {
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subjects: teacher.subjects,
      classes: teacher.classes,
      status: teacher.status,
    } : {
      subjects: [],
      classes: [],
      status: 'active',
    },
  });

  const watchedSubjects = watch('subjects') || [];
  const watchedClasses = watch('classes') || [];

  const onSubmit = (data: TeacherFormData) => {
    if (teacher) {
      updateTeacher(teacher.id, data);
    } else {
      addTeacher({
        ...data,
        joinDate: new Date().toISOString().split('T')[0],
      });
    }
    onSuccess();
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    const current = watchedSubjects;
    if (checked) {
      setValue('subjects', [...current, subject]);
    } else {
      setValue('subjects', current.filter(s => s !== subject));
    }
  };

  const handleClassChange = (className: string, checked: boolean) => {
    const current = watchedClasses;
    if (checked) {
      setValue('classes', [...current, className]);
    } else {
      setValue('classes', current.filter(c => c !== className));
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

      <div className="space-y-2">
        <Label>Subjects</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded-lg">
          {availableSubjects.map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                id={`subject-${subject}`}
                checked={watchedSubjects.includes(subject)}
                onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
              />
              <Label htmlFor={`subject-${subject}`} className="text-sm">
                {subject}
              </Label>
            </div>
          ))}
        </div>
        {errors.subjects && (
          <p className="text-sm text-red-500">{errors.subjects.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Classes</Label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 p-4 border rounded-lg">
          {availableClasses.map((className) => (
            <div key={className} className="flex items-center space-x-2">
              <Checkbox
                id={`class-${className}`}
                checked={watchedClasses.includes(className)}
                onCheckedChange={(checked) => handleClassChange(className, checked as boolean)}
              />
              <Label htmlFor={`class-${className}`} className="text-sm">
                {className}
              </Label>
            </div>
          ))}
        </div>
        {errors.classes && (
          <p className="text-sm text-red-500">{errors.classes.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">
          {teacher ? 'Update Teacher' : 'Add Teacher'}
        </Button>
      </div>
    </form>
  );
}