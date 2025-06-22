import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Grade } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

const gradeSchema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
  subjectId: z.string().min(1, 'Please select a subject'),
  semester: z.string().min(1, 'Semester is required'),
  assignments: z.array(z.number().min(0).max(100)).min(1, 'At least one assignment grade is required'),
  exams: z.array(z.number().min(0).max(100)).min(1, 'At least one exam grade is required'),
  participation: z.number().min(0).max(100),
});

type GradeFormData = z.infer<typeof gradeSchema>;

interface GradeFormProps {
  grade?: Grade | null;
  onSuccess: () => void;
}

export function GradeForm({ grade, onSuccess }: GradeFormProps) {
  const { addGrade, updateGrade, students, subjects } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: grade ? {
      studentId: grade.studentId,
      subjectId: grade.subjectId,
      semester: grade.semester,
      assignments: grade.grades.assignments,
      exams: grade.grades.exams,
      participation: grade.grades.participation,
    } : {
      assignments: [0],
      exams: [0],
      participation: 0,
    },
  });

  const { fields: assignmentFields, append: appendAssignment, remove: removeAssignment } = useFieldArray({
    control,
    name: 'assignments',
  });

  const { fields: examFields, append: appendExam, remove: removeExam } = useFieldArray({
    control,
    name: 'exams',
  });

  const onSubmit = (data: GradeFormData) => {
    const assignmentAvg = data.assignments.reduce((a, b) => a + b, 0) / data.assignments.length;
    const examAvg = data.exams.reduce((a, b) => a + b, 0) / data.exams.length;
    const average = (assignmentAvg * 0.4) + (examAvg * 0.5) + (data.participation * 0.1);

    const gradeData = {
      studentId: data.studentId,
      subjectId: data.subjectId,
      semester: data.semester,
      grades: {
        assignments: data.assignments,
        exams: data.exams,
        participation: data.participation,
      },
      average: Math.round(average * 10) / 10,
    };

    if (grade) {
      updateGrade(grade.id, gradeData);
    } else {
      addGrade(gradeData);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Student</Label>
          <Select
            value={watch('studentId') || ''}
            onValueChange={(value) => setValue('studentId', value)}
          >
            <SelectTrigger className={errors.studentId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.class})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.studentId && (
            <p className="text-sm text-red-500">{errors.studentId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Subject</Label>
          <Select
            value={watch('subjectId') || ''}
            onValueChange={(value) => setValue('subjectId', value)}
          >
            <SelectTrigger className={errors.subjectId ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subjectId && (
            <p className="text-sm text-red-500">{errors.subjectId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <Input
          id="semester"
          placeholder="e.g., Fall 2024, Spring 2024"
          {...register('semester')}
          className={errors.semester ? 'border-red-500' : ''}
        />
        {errors.semester && (
          <p className="text-sm text-red-500">{errors.semester.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Assignment Grades (40%)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendAssignment(0)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Assignment
          </Button>
        </div>
        <div className="space-y-2">
          {assignmentFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Grade (0-100)"
                {...register(`assignments.${index}` as const, { valueAsNumber: true })}
              />
              {assignmentFields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeAssignment(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors.assignments && (
          <p className="text-sm text-red-500">{errors.assignments.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Exam Grades (50%)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendExam(0)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Exam
          </Button>
        </div>
        <div className="space-y-2">
          {examFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Grade (0-100)"
                {...register(`exams.${index}` as const, { valueAsNumber: true })}
              />
              {examFields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeExam(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors.exams && (
          <p className="text-sm text-red-500">{errors.exams.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="participation">Participation Grade (10%)</Label>
        <Input
          id="participation"
          type="number"
          min="0"
          max="100"
          {...register('participation', { valueAsNumber: true })}
          className={errors.participation ? 'border-red-500' : ''}
        />
        {errors.participation && (
          <p className="text-sm text-red-500">{errors.participation.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">
          {grade ? 'Update Grade' : 'Add Grade'}
        </Button>
      </div>
    </form>
  );
}