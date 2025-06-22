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
import { Subject } from '@/types';

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name must be at least 2 characters'),
  code: z.string().min(2, 'Subject code must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  teacherId: z.string().min(1, 'Please select a teacher'),
  classes: z.array(z.string()).min(1, 'Select at least one class'),
  credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10'),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  subject?: Subject | null;
  onSuccess: () => void;
}

const availableClasses = [
  '9A', '9B', '9C',
  '10A', '10B', '10C',
  '11A', '11B', '11C',
  '12A', '12B', '12C',
];

export function SubjectForm({ subject, onSuccess }: SubjectFormProps) {
  const { addSubject, updateSubject, teachers } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: subject ? {
      name: subject.name,
      code: subject.code,
      description: subject.description,
      teacherId: subject.teacherId,
      classes: subject.classes,
      credits: subject.credits,
    } : {
      classes: [],
      credits: 3,
    },
  });

  const watchedClasses = watch('classes') || [];

  const onSubmit = (data: SubjectFormData) => {
    if (subject) {
      updateSubject(subject.id, data);
    } else {
      addSubject(data);
    }
    onSuccess();
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
          <Label htmlFor="name">Subject Name</Label>
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
          <Label htmlFor="code">Subject Code</Label>
          <Input
            id="code"
            {...register('code')}
            className={errors.code ? 'border-red-500' : ''}
          />
          {errors.code && (
            <p className="text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          className={errors.description ? 'border-red-500' : ''}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Assigned Teacher</Label>
          <Select
            value={watch('teacherId') || ''}
            onValueChange={(value) => setValue('teacherId', value)}
          >
            <SelectTrigger className={errors.teacherId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teacherId && (
            <p className="text-sm text-red-500">{errors.teacherId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="credits">Credits</Label>
          <Input
            id="credits"
            type="number"
            min="1"
            max="10"
            {...register('credits', { valueAsNumber: true })}
            className={errors.credits ? 'border-red-500' : ''}
          />
          {errors.credits && (
            <p className="text-sm text-red-500">{errors.credits.message}</p>
          )}
        </div>
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
          {subject ? 'Update Subject' : 'Add Subject'}
        </Button>
      </div>
    </form>
  );
}